import { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonAlert,
  useIonToast,
  IonList,
} from "@ionic/react";
import {
  closeOutline,
  trashOutline,
  timeOutline,
  calendarOutline,
  documentTextOutline,
  locationOutline,
  personOutline,
  pawOutline,
  clipboardOutline,
} from "ionicons/icons";
import { deleteEvent } from "../../api/calendario";
import { CalendarEvent } from "../../api/calendario";
import { useAuth } from "../../hooks/useAuth";
import { useHistory } from "react-router-dom";
import { obtenerPacientesPaginados, PacienteData } from "../../api/pacientes";
// Componente: Interfaz para gestionar horas y vista calendario
interface ModalDetalleCitaProps {
  isOpen: boolean;
  onClose: () => void;
  evento: CalendarEvent;
  onEventoActualizado: () => void;
}

const ModalDetalleCita: React.FC<ModalDetalleCitaProps> = ({
  isOpen,
  onClose,
  evento,
  onEventoActualizado,
}) => {
  const { sessionToken } = useAuth();
  const [present] = useIonToast();
  const history = useHistory();
  const [mostrarAlertaEliminar, setMostrarAlertaEliminar] = useState(false);
  const [cargandoPaciente, setCargandoPaciente] = useState(false);
  const [showModalSeleccionPaciente, setShowModalSeleccionPaciente] =
    useState(false);
  const [pacientesDisponibles, setPacientesDisponibles] = useState<
    PacienteData[]
  >([]);

  const formatearFechaHora = () => {
    if (!evento || !evento.start.dateTime) {
      return { fecha: "", hora: "" };
    }
    const fechaInicio = new Date(evento.start.dateTime);
    const fechaFin = new Date(evento.end.dateTime);

    return {
      fecha: fechaInicio.toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      horaInicio: fechaInicio.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      horaFin: fechaFin.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleEliminar = async () => {
    if (!evento || !evento.id) return;

    try {
      await deleteEvent(evento.id, sessionToken);

      present({
        message: "Evento eliminado exitosamente",
        duration: 3000,
        color: "success",
        cssClass: "toast-success",
      });

      onEventoActualizado();
      onClose();
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      present({
        message: "Error al eliminar el evento",
        duration: 3000,
        color: "danger",
        cssClass: "toast-error",
      });
    }
  };

  const handleIrARellenarFicha = async () => {
    console.log("🔍 Iniciando handleIrARellenarFicha");
    setCargandoPaciente(true);
    try {
      const descripcion = evento.description || "";
      console.log("📝 Descripción del evento:", descripcion);

      // Extraer IDs ocultos en formato <!-- IDS:1,2,3 -->
      const matchIds = descripcion.match(/<!--\s*IDS:([0-9,]+)\s*-->/);
      console.log("🔢 Match IDs ocultos:", matchIds);

      if (matchIds) {
        const idsString = matchIds[1];
        const ids = idsString.split(",").map((id) => parseInt(id.trim()));
        console.log("✅ IDs encontrados:", ids);

        // Extraer nombres de pacientes de la descripción para buscar
        const matchNombres = descripcion.match(/Pacientes?:\s*([^\n]+)/);
        const nombresPacientesStr = matchNombres ? matchNombres[1].trim() : "";
        const nombresPacientes = nombresPacientesStr
          .split(",")
          .map((n) => n.trim());
        console.log("📛 Nombres extraídos:", nombresPacientes);

        // Buscar cada paciente por nombre
        console.log("🔍 Buscando pacientes por nombres...");
        const pacientesEncontrados: PacienteData[] = [];

        for (const nombre of nombresPacientes) {
          try {
            const response = await obtenerPacientesPaginados(
              1,
              10,
              nombre,
              sessionToken
            );
            if (response.pacientes && response.pacientes.length > 0) {
              // Buscar el paciente que coincida con el ID esperado o tomar el primero
              const pacienteMatch =
                response.pacientes.find((p) => ids.includes(p.id_paciente)) ||
                response.pacientes[0];
              pacientesEncontrados.push(pacienteMatch);
            }
          } catch (error) {
            console.error(`Error buscando paciente ${nombre}:`, error);
          }
        }

        console.log("🐾 Pacientes encontrados:", pacientesEncontrados);

        if (pacientesEncontrados.length === 0) {
          present({
            message: "No se encontraron los pacientes de la cita",
            duration: 3000,
            color: "warning",
            cssClass: "toast-warning",
          });
          return;
        }

        if (pacientesEncontrados.length === 1) {
          // Un solo paciente, ir directo
          console.log("✅ Un solo paciente, navegando directo");
          sessionStorage.setItem(
            "pacienteParaFicha",
            JSON.stringify(pacientesEncontrados[0])
          );
          onClose();
          history.push("/rellenar-ficha");
          return;
        }

        // Múltiples pacientes, mostrar modal de selección
        console.log("👥 Múltiples pacientes, mostrando selector");
        setPacientesDisponibles(pacientesEncontrados);
        setShowModalSeleccionPaciente(true);
        return;
      }

      // Fallback: buscar por nombre (para eventos antiguos sin IDs ocultos)
      console.log("🔄 Fallback: buscando por nombre...");
      const matchPaciente = descripcion.match(/Pacientes?:\s*([^\n,]+)/);
      console.log("📛 Match nombre:", matchPaciente);

      if (!matchPaciente) {
        present({
          message: "No se pudo identificar el paciente en la cita",
          duration: 3000,
          color: "warning",
          cssClass: "toast-warning",
        });
        return;
      }

      const nombrePaciente = matchPaciente[1].trim();
      console.log("🔍 Buscando por nombre:", nombrePaciente);

      const response = await obtenerPacientesPaginados(
        1,
        10,
        nombrePaciente,
        sessionToken
      );
      console.log("📦 Respuesta búsqueda por nombre:", response);

      if (response.pacientes && response.pacientes.length > 0) {
        const paciente = response.pacientes[0];
        console.log("✅ Paciente encontrado por nombre:", paciente);
        sessionStorage.setItem("pacienteParaFicha", JSON.stringify(paciente));
        onClose();
        history.push("/rellenar-ficha");
      } else {
        console.warn(
          "⚠️ No se encontraron pacientes con nombre:",
          nombrePaciente
        );
        present({
          message: `No se encontró el paciente "${nombrePaciente}"`,
          duration: 3000,
          color: "warning",
          cssClass: "toast-warning",
        });
      }
    } catch (error) {
      console.error("❌ Error al buscar paciente:", error);
      present({
        message: "Error al cargar los datos del paciente",
        duration: 3000,
        color: "danger",
        cssClass: "toast-error",
      });
    } finally {
      console.log("🏁 Finalizando handleIrARellenarFicha");
      setCargandoPaciente(false);
    }
  };

  const handleSeleccionarPaciente = (paciente: PacienteData) => {
    console.log("✅ Paciente seleccionado:", paciente);
    sessionStorage.setItem("pacienteParaFicha", JSON.stringify(paciente));
    setShowModalSeleccionPaciente(false);
    onClose();
    history.push("/rellenar-ficha");
  };

  const { fecha, horaInicio, horaFin } = formatearFechaHora();

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Detalle del Evento</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onClose}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          {/* Título principal del evento */}
          <div className="detalle-section">
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {evento.summary || "Evento sin título"}
            </h2>
          </div>

          {/* Fecha y Hora con rango horario */}
          <div className="detalle-section">
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "0.5rem",
              }}
            >
              <IonIcon icon={calendarOutline} /> Fecha y Hora
            </h3>
            <div style={{ padding: "0.5rem 0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.5rem",
                }}
              >
                <IonIcon icon={calendarOutline} className="pacientes-icon" />
                <span className="capitalize">{fecha}</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <IonIcon icon={timeOutline} className="pacientes-icon" />
                <span>
                  {horaInicio} - {horaFin}
                </span>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          {evento.location && (
            <div className="detalle-section">
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.5rem",
                }}
              >
                <IonIcon icon={locationOutline} /> Ubicación
              </h3>
              <div style={{ padding: "0.5rem 0" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <IonIcon icon={locationOutline} className="pacientes-icon" />
                  <span>{evento.location}</span>
                </div>
              </div>
            </div>
          )}
          {/* 
          Información del Tutor 
          <div className="detalle-section">
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "0.5rem",
              }}
            >
              <IonIcon icon={personOutline} /> Información del Tutor
            </h3>
            <div style={{ padding: "0.5rem 0" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <IonIcon icon={personOutline} className="pacientes-icon" />
                <span>{evento.summary || "No especificado"}</span>
              </div>
            </div>
          </div>
            */}
          {/* Descripción completa (incluye paciente, especie, raza, motivo) */}
          {evento.description && (
            <div className="detalle-section">
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.5rem",
                }}
              >
                <IonIcon icon={documentTextOutline} /> Información del Paciente
                y Motivo
              </h3>
              <div style={{ padding: "0.5rem 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <IonIcon
                    icon={pawOutline}
                    className="pacientes-icon"
                    style={{ marginTop: "4px" }}
                  />
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                    {evento.description}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "var(--ion-color-light)",
                  borderRadius: "8px",
                  marginTop: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--ion-color-medium)",
                    margin: 0,
                  }}
                >
                  💡 <strong>Nota:</strong> La información del paciente (nombre,
                  especie, raza) y el motivo de la consulta se encuentran en
                  este campo de descripción.
                </p>
              </div>
            </div>
          )}

          {/* Asistentes */}
          {evento.attendees && evento.attendees.length > 0 && (
            <div className="detalle-section">
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.5rem",
                }}
              >
                <IonIcon icon={personOutline} /> Asistentes
              </h3>
              {evento.attendees.map((asistente, index) => (
                <div key={index} style={{ padding: "0.5rem 0" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <IonIcon icon={personOutline} className="pacientes-icon" />
                    <span>{asistente.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Zona horaria */}
          <div
            className="detalle-footer"
            style={{
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--ion-color-light)",
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--ion-color-medium)",
                margin: 0,
              }}
            >
              Zona horaria: {evento.start.timeZone}
            </p>
          </div>

          {/* Botones de acción */}
          <div
            className="detalle-acciones"
            style={{
              marginTop: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <IonButton
              expand="block"
              color="primary"
              onClick={handleIrARellenarFicha}
              disabled={cargandoPaciente}
            >
              <IonIcon icon={clipboardOutline} slot="start" />
              {cargandoPaciente ? "Cargando..." : "Rellenar Ficha"}
            </IonButton>
            <IonButton
              expand="block"
              color="danger"
              fill="outline"
              onClick={() => setMostrarAlertaEliminar(true)}
            >
              <IonIcon icon={trashOutline} slot="start" />
              Eliminar Evento
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Alerta de confirmación para eliminar */}
      <IonAlert
        isOpen={mostrarAlertaEliminar}
        onDidDismiss={() => setMostrarAlertaEliminar(false)}
        cssClass="alert-danger"
        header="Eliminar Evento"
        message="¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "alert-button-cancel",
          },
          {
            text: "Eliminar",
            role: "destructive",
            cssClass: "alert-button-destructive",
            handler: handleEliminar,
          },
        ]}
      />

      {/* Modal de selección de paciente */}
      <IonModal
        isOpen={showModalSeleccionPaciente}
        onDidDismiss={() => setShowModalSeleccionPaciente(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Seleccionar Paciente</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModalSeleccionPaciente(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p style={{ marginBottom: "1rem", color: "var(--ion-color-medium)" }}>
            Esta cita tiene {pacientesDisponibles.length} pacientes. Selecciona
            uno para rellenar su ficha:
          </p>
          <IonList>
            {pacientesDisponibles.map((paciente) => (
              <IonItem
                key={paciente.id_paciente}
                button
                onClick={() => handleSeleccionarPaciente(paciente)}
                style={{
                  marginBottom: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid var(--ion-color-light)",
                }}
              >
                <IonIcon
                  icon={pawOutline}
                  slot="start"
                  style={{ fontSize: "1.5rem" }}
                />
                <IonLabel>
                  <h2 style={{ fontWeight: "bold" }}>{paciente.nombre}</h2>
                  <p>
                    {paciente.especie} - {paciente.raza}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--ion-color-medium)",
                    }}
                  >
                    Tutor: {paciente.tutor?.nombre}{" "}
                    {paciente.tutor?.apellido_paterno}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default ModalDetalleCita;
