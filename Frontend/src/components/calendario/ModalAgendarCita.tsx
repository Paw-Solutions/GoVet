import { useState, useEffect, useCallback } from "react";
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
  IonInput,
  IonTextarea,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonChip,
  IonNote,
  IonSpinner,
  useIonToast,
  IonList,
} from "@ionic/react";
import {
  closeOutline,
  checkmarkOutline,
  personOutline,
  pawOutline,
} from "ionicons/icons";
import { crearCita, type CitaCreate } from "../../api/citas";
import { enviarNotificacion } from "../../api/notificacion";

interface ModalAgendarCitaProps {
  isOpen: boolean;
  onClose: () => void;
  fechaInicial?: Date;
  onCitaCreada: () => void;
}

const ModalAgendarCita: React.FC<ModalAgendarCitaProps> = ({
  isOpen,
  onClose,
  fechaInicial = new Date(),
  onCitaCreada,
}) => {
  const [present] = useIonToast();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [rutTutor, setRutTutor] = useState("");
  const [tutorEncontrado, setTutorEncontrado] = useState(false);
  const [nombreTutor, setNombreTutor] = useState("");
  const [emailTutor, setEmailTutor] = useState("");

  const [pacientesSeleccionados, setPacientesSeleccionados] = useState<
    number[]
  >([]);
  const [pacientesDisponibles] = useState([
    { id_paciente: 1, nombre: "Firulais", especie: "Perro" },
    { id_paciente: 2, nombre: "Michi", especie: "Gato" },
    { id_paciente: 3, nombre: "Luna", especie: "Gato" },
    { id_paciente: 4, nombre: "Max", especie: "Perro" },
  ]); // Mock data

  const [fechaHora, setFechaHora] = useState(fechaInicial.toISOString());
  const [motivo, setMotivo] = useState("");
  const [notas, setNotas] = useState("");
  const [notificacion, setNotificacion] = useState<string>("diaAnterior");
  const [fechaNotificacion, setFechaNotificacion] = useState<Date | null>(null);

  const resetForm = () => {
    setPaso(1);
    setRutTutor("");
    setTutorEncontrado(false);
    setNombreTutor("");
    setEmailTutor("");
    setPacientesSeleccionados([]);
    setFechaHora(new Date().toISOString());
    setMotivo("");
    setNotas("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const buscarTutor = () => {
    // Mock: Simular búsqueda de tutor
    if (rutTutor.trim()) {
      setTutorEncontrado(true);
      setNombreTutor("Juan Pérez González");
      // Mock: asignar email del tutor encontrado
      setEmailTutor("daniela.huenuman@alumnos.uach.cl"); // Para probar el recibo de correos
      present({
        message: "Tutor encontrado",
        duration: 2000,
        color: "success",
      });
    } else {
      present({
        message: "Ingresa un RUT válido",
        duration: 2000,
        color: "warning",
      });
    }
  };

  const togglePaciente = (id: number) => {
    if (pacientesSeleccionados.includes(id)) {
      setPacientesSeleccionados(pacientesSeleccionados.filter((p) => p !== id));
    } else {
      setPacientesSeleccionados([...pacientesSeleccionados, id]);
    }
  };

  // Pure helper: devuelve la fecha de envío según tipo y la fecha de la cita
  const calcularFechaNotificacion = (tipo: string, fechaHoraIso: string) => {
    if (!fechaHoraIso) return new Date();
    const fecha = new Date(fechaHoraIso);
    if (tipo === "diaAnterior") {
      fecha.setDate(fecha.getDate() - 1);
      return fecha;
    }
    if (tipo === "semanaAntes") {
      fecha.setDate(fecha.getDate() - 7);
      return fecha;
    }
    if (tipo === "minutos") {
      // prueba
      fecha.setMinutes(fecha.getMinutes() - 145);
      // si la fecha resultante ya pasó, devolver ahora para envío inmediato
      if (fecha < new Date()) return new Date();
      return fecha;
    }
    // 'ahora' o cualquier otro caso
    return new Date();
  };

  // Si cambia la fecha o la notificación, se actualiza el estado fechaNotificacion
  const handleNotificacion = useCallback(() => {
    if (!fechaHora) return;
    const fecha = calcularFechaNotificacion(notificacion, fechaHora);
    setFechaNotificacion(fecha);
  }, [notificacion, fechaHora]);

  // Ejecutar la función cuando cambie la selección de notificación o la fecha/hora
  useEffect(() => {
    handleNotificacion();
  }, [handleNotificacion]);


  
  const handleSiguiente = () => {
    if (paso === 1 && !tutorEncontrado) {
      present({
        message: "Debes buscar un tutor primero",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    if (paso === 2 && pacientesSeleccionados.length === 0) {
      present({
        message: "Selecciona al menos un paciente",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    if (paso === 3 && !motivo.trim()) {
      present({
        message: "Ingresa el motivo de la cita",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    setPaso(paso + 1);
  };

  const handleAnterior = () => {
    setPaso(paso - 1);
  };

  const handleCrearCita = async () => {
    setLoading(true);
    try {
      const nuevaCita: CitaCreate = {
        rut_tutor: rutTutor,
        fecha_hora: fechaHora,
        motivo: motivo,
        notas: notas || undefined,
        pacientes_ids: pacientesSeleccionados,
      };

      await crearCita(nuevaCita);

      present({
        message: "Cita agendada exitosamente",
        duration: 3000,
        color: "success",
        icon: checkmarkOutline,
      });

      try {
        if (emailTutor) {
          console.log("Enviando notificación al email:", emailTutor);

          const cuerpo = `
            <p>Hola ${nombreTutor || ""},</p>
            <p>Tu cita ha sido agendada.</p>
            <p>Motivo: ${motivo || "(Sin especificar)"}</p>
          `;

          // calcular fecha de envío localmente (no confiar en setState que es asíncrono)
          const fechaEnvioDate = calcularFechaNotificacion(notificacion, fechaHora);
          const fechaEnvioIso = fechaEnvioDate.toISOString();

          // actualizar el estado para mostrar en el resumen si se necesita
          setFechaNotificacion(fechaEnvioDate);

          await enviarNotificacion(
            {
              email: emailTutor,
              asunto: "Confirmación de cita - GoVet",
              cuerpo,
            },
            fechaEnvioIso
          );

          present({
            message: "Correo de confirmación enviado",
            duration: 2200,
            color: "success",
          });
        } else {
          console.log("No hay email de tutor; se omite el envío de notificación.");
        }
      } catch (emailError) {
        console.error("Error enviando notificación:", emailError);
        present({
          message: "Cita creada, pero falló el envío del correo",
          duration: 4000,
          color: "warning",
        });
      }

      onCitaCreada();
      handleClose();
    } catch (error) {
      console.error("Error al crear cita:", error);
      present({
        message: "Error al agendar la cita",
        duration: 3000,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPaso1 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <IonIcon icon={personOutline} className="paso-icon" />
        <h3>Buscar Tutor</h3>
        <p>Ingresa el RUT del tutor responsable</p>
      </div>

      <IonItem>
        <IonLabel position="stacked">RUT del Tutor</IonLabel>
        <IonInput
          value={rutTutor}
          onIonInput={(e) => setRutTutor(e.detail.value || "")}
          placeholder="12345678-9"
          disabled={tutorEncontrado}
        />
      </IonItem>

      {!tutorEncontrado ? (
        <IonButton expand="block" onClick={buscarTutor} className="mt-4">
          Buscar Tutor
        </IonButton>
      ) : (
        <div className="tutor-encontrado">
          <IonChip color="success">
            <IonIcon icon={checkmarkOutline} />
            <IonLabel>Tutor: {nombreTutor}</IonLabel>
          </IonChip>
          {emailTutor && (
            <div className="tutor-email" style={{ marginTop: 8 }}>
              <IonNote>{emailTutor}</IonNote>
            </div>
          )}
          <IonButton
            fill="clear"
            size="small"
            onClick={() => {
              setTutorEncontrado(false);
              setNombreTutor("");
              setEmailTutor("");
            }}
          >
            Cambiar tutor
          </IonButton>
        </div>
      )}
    </div>
  );

  const renderPaso2 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <IonIcon icon={pawOutline} className="paso-icon" />
        <h3>Seleccionar Pacientes</h3>
        <p>Elige los pacientes para la cita</p>
      </div>

      <div className="pacientes-lista">
        {pacientesDisponibles.map((paciente) => (
          <IonItem
            key={paciente.id_paciente}
            button
            onClick={() => togglePaciente(paciente.id_paciente)}
            className={
              pacientesSeleccionados.includes(paciente.id_paciente)
                ? "paciente-seleccionado"
                : ""
            }
          >
            <IonIcon icon={pawOutline} slot="start" />
            <IonLabel>
              <h3>{paciente.nombre}</h3>
              <p>{paciente.especie}</p>
            </IonLabel>
            {pacientesSeleccionados.includes(paciente.id_paciente) && (
              <IonIcon icon={checkmarkOutline} slot="end" color="success" />
            )}
          </IonItem>
        ))}
      </div>

      {pacientesSeleccionados.length > 0 && (
        <IonNote className="mt-3">
          {pacientesSeleccionados.length}{" "}
          {pacientesSeleccionados.length === 1
            ? "paciente seleccionado"
            : "pacientes seleccionados"}
        </IonNote>
      )}
    </div>
  );

  const renderPaso3 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <h3>Fecha, Hora y Motivo</h3>
        <p>Selecciona cuándo será la cita y su motivo</p>
      </div>

      <IonDatetime
        value={fechaHora}
        onIonChange={(e) => setFechaHora(e.detail.value as string)}
        presentation="date-time"
        locale="es-CL"
        min={new Date().toISOString()}
      />

      <IonItem className="mt-3">
        <IonLabel position="stacked">
          Motivo de la cita <span className="required">*</span>
        </IonLabel>
        <IonInput
          value={motivo}
          onIonInput={(e) => setMotivo(e.detail.value || "")}
          placeholder="Ej: Vacunación, Control, Revisión..."
        />
      </IonItem>

      <IonList>
        <IonItem>
          <IonLabel position="stacked">Seleccionar cuando notificar al tutor</IonLabel>
          <IonSelect
            aria-label="notificacion"
            placeholder="El tutor será notificado en.."
            value={notificacion}
            onIonChange={(e) => setNotificacion(e.detail.value as string)}
          >
            <IonSelectOption value="diaAnterior">Día anterior</IonSelectOption>
            <IonSelectOption value="semanaAntes">Una semana antes</IonSelectOption>
            <IonSelectOption value="ahora">Ahora (test)</IonSelectOption>
            <IonSelectOption value="minutos">2h 40min antes (test)</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
    </div>
  );

  const renderPaso4 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <h3>Notas y Resumen</h3>
        <p>Información adicional y confirmación</p>
      </div>

      <IonItem>
        <IonLabel position="stacked">Notas adicionales (opcional)</IonLabel>
        <IonTextarea
          value={notas}
          onIonInput={(e) => setNotas(e.detail.value || "")}
          placeholder="Información adicional sobre la cita..."
          rows={4}
        />
      </IonItem>

      {/* Resumen */}
      <div className="resumen-cita">
        <h4>Resumen</h4>
        <div className="resumen-item">
          <strong>Tutor:</strong> {nombreTutor}
          {emailTutor ? ` (${emailTutor})` : ""}
        </div>
        <div className="resumen-item">
          <strong>Pacientes:</strong>{" "}
          {pacientesDisponibles
            .filter((p) => pacientesSeleccionados.includes(p.id_paciente))
            .map((p) => p.nombre)
            .join(", ")}
        </div>
        <div className="resumen-item">
          <strong>Fecha:</strong> {new Date(fechaHora).toLocaleString("es-CL")}
        </div>
        <div className="resumen-item">
          <strong>Motivo:</strong> {motivo || "(Sin especificar)"}
        </div>
        <div className="resumen-item">
          <strong>Notificación:</strong>{" "}
          {notificacion === "diaAnterior"
            ? "Día anterior"
            : notificacion === "semanaAntes"
            ? "Una semana antes"
            : notificacion === "minutos"
            ? "2h 45min antes (test)"
            : notificacion === "ahora"
            ? "Ahora (test)"
            : "-"}
        </div>
      </div>
    </div>
  );

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agendar Cita - Paso {paso} de 4</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Indicador de pasos */}
        <div className="pasos-indicador">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`paso-punto ${paso >= num ? "activo" : ""} ${
                paso === num ? "actual" : ""
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Contenido del paso actual */}
        {paso === 1 && renderPaso1()}
        {paso === 2 && renderPaso2()}
        {paso === 3 && renderPaso3()}
        {paso === 4 && renderPaso4()}

        {/* Botones de navegación */}
        <div className="modal-botones">
          {paso > 1 && (
            <IonButton
              expand="block"
              fill="outline"
              onClick={handleAnterior}
              disabled={loading}
            >
              Anterior
            </IonButton>
          )}

          {paso < 4 ? (
            <IonButton expand="block" onClick={handleSiguiente}>
              Siguiente
            </IonButton>
          ) : (
            <IonButton
              expand="block"
              onClick={handleCrearCita}
              disabled={loading}
            >
              {loading ? (
                <>
                  <IonSpinner name="crescent" />
                  Agendando...
                </>
              ) : (
                "Confirmar Cita"
              )}
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalAgendarCita;
