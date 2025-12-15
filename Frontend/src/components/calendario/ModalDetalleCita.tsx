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
} from "ionicons/icons";
import { deleteEvent } from "../../api/calendario";
import { CalendarEvent } from "../../api/calendario";
import { useAuth } from "../../hooks/useAuth";
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
  const { idToken } = useAuth();
  const [present] = useIonToast();
  const [mostrarAlertaEliminar, setMostrarAlertaEliminar] = useState(false);

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
      await deleteEvent(evento.id, idToken);

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
          <div className="detalle-acciones" style={{ marginTop: "1.5rem" }}>
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
        header="Eliminar Evento"
        message="¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
          },
          {
            text: "Eliminar",
            role: "destructive",
            handler: handleEliminar,
          },
        ]}
      />
    </>
  );
};

export default ModalDetalleCita;
