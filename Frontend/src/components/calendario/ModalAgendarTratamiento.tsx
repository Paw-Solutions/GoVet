import React, { useState, useEffect } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonNote,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonList,
  useIonToast,
} from "@ionic/react";
import { closeOutline, calendarOutline, timeOutline } from "ionicons/icons";
import { PacienteData } from "../../api/pacientes";
import { TutorData } from "../../api/tutores";
import { createEvent, CalendarEventCreate } from "../../api/calendario";
import { enviarNotificacion } from "../../api/notificacion";
import {
  isValidEmail,
  calcularFechaNotificacion,
  buildVacunaNotificationEmail,
  formatearFechaHoraCompleta,
  TratamientoInfo,
} from "../../utils/notificationHelpers";
import { useAuth } from "../../hooks/useAuth";

interface ModalAgendarTratamientoProps {
  isOpen: boolean;
  onClose: () => void;
  tratamientos: TratamientoInfo[];
  paciente: PacienteData;
  tutor: TutorData;
  fechaProxima: string;
  tipoTratamiento: "vacuna" | "desparasitacion";
  onCitaCreada: () => void;
  totalAlertas: number;
  alertaActual: number;
  onAgendarDespues: () => void;
  onCancelar: () => void;
}

const ModalAgendarTratamiento: React.FC<ModalAgendarTratamientoProps> = ({
  isOpen,
  onClose,
  tratamientos,
  paciente,
  tutor,
  fechaProxima,
  tipoTratamiento,
  onCitaCreada,
  totalAlertas,
  alertaActual,
  onAgendarDespues,
  onCancelar,
}) => {
  const { idToken } = useAuth();
  const [present] = useIonToast();
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedNotification, setSelectedNotification] =
    useState("diaAnterior");
  const [duracionMinutos, setDuracionMinutos] = useState(30);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Validar email del tutor y ajustar notificación
  useEffect(() => {
    if (!isValidEmail(tutor.email)) {
      setSelectedNotification("noNotificar");
    }
  }, [tutor.email]);

  const handleConfirmarAgendamiento = async () => {
    if (!selectedTime) {
      present({
        message: "Por favor selecciona una hora para la cita",
        duration: 2000,
        color: "warning",
        cssClass: "toast-warning",
      });
      return;
    }

    setLoading(true);

    try {
      // Construir summary y description
      const tipoTexto =
        tipoTratamiento === "vacuna" ? "Vacuna" : "Desparasitación";
      const summary = `${tipoTexto} - ${tratamientos
        .map((t) => t.nombre)
        .join(", ")}`;

      const descripcionTratamientos = tratamientos
        .map((t) => {
          let desc = `• ${t.nombre}`;
          if (t.marca) desc += ` (${t.marca})`;
          if (t.numero_de_serie) desc += ` - N° ${t.numero_de_serie}`;
          return desc;
        })
        .join("\n");

      const description = `${tipoTexto} programada para ${paciente.nombre}\n\n${descripcionTratamientos}\n\nTutor: ${tutor.nombre} ${tutor.apellido_paterno}`;

      // Calcular start y end
      const [hours, minutes] = selectedTime.split(":");
      const startDate = new Date(fechaProxima);
      startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + duracionMinutos);

      const eventData: CalendarEventCreate = {
        summary,
        description,
        location: tutor.direccion || "",
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        attendees: undefined, // Service Account no puede invitar sin Domain-Wide Delegation
      };

      // Crear el evento en el calendario
      await createEvent(eventData, idToken);

      // Enviar notificación si corresponde
      if (selectedNotification !== "noNotificar" && isValidEmail(tutor.email)) {
        try {
          const fechaNotificacion = calcularFechaNotificacion(
            selectedNotification,
            startDate.toISOString()
          );
          const emailBody = buildVacunaNotificationEmail(
            tratamientos,
            paciente,
            tutor,
            startDate.toISOString(),
            tutor.direccion || "",
            tipoTratamiento
          );

          await enviarNotificacion(
            {
              email: tutor.email,
              asunto: `Recordatorio de ${tipoTexto} - GoVet`,
              cuerpo: emailBody,
            },
            fechaNotificacion.toISOString()
          );
        } catch (notifError) {
          console.error("Error al enviar notificación:", notifError);
          present({
            message:
              "Cita agendada pero no se pudo enviar la notificación por correo",
            duration: 3000,
            color: "warning",
            cssClass: "toast-warning",
          });
        }
      }

      present({
        message: "Cita agendada correctamente",
        duration: 2000,
        color: "success",
        cssClass: "toast-success",
      });

      onCitaCreada();
    } catch (error) {
      console.error("Error al agendar cita:", error);
      present({
        message: "No se pudo agendar la cita. Intenta nuevamente",
        duration: 3000,
        color: "danger",
        cssClass: "toast-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAgendarDespuesClick = () => {
    onAgendarDespues();
  };

  const handleCancelarClick = () => {
    onCancelar();
    onClose();
  };

  const tipoTexto =
    tipoTratamiento === "vacuna" ? "Vacunación" : "Desparasitación";
  const emailValido = isValidEmail(tutor.email);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agendar {tipoTexto}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCancelarClick} disabled={loading}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {totalAlertas > 1 && (
          <IonNote color="medium" className="ion-margin-bottom">
            <p>
              <strong>
                Tratamiento {alertaActual} de {totalAlertas}
              </strong>
            </p>
          </IonNote>
        )}

        <IonCard>
          <IonCardContent>
            <h3>
              <strong>Paciente:</strong> {paciente.nombre}
            </h3>
            <p>
              <strong>Tutor:</strong> {tutor.nombre} {tutor.apellido_paterno}
            </p>
            <p>
              <strong>Fecha programada:</strong>{" "}
              {new Date(fechaProxima).toLocaleDateString("es-CL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h3>
              <strong>{tipoTexto} a aplicar:</strong>
            </h3>
            <IonList>
              {tratamientos.map((t, idx) => (
                <IonItem key={idx} lines="none">
                  <IonLabel>
                    <h4>{t.nombre}</h4>
                    {t.marca && <p>Marca: {t.marca}</p>}
                    {t.numero_de_serie && <p>N° Serie: {t.numero_de_serie}</p>}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h3>
              <strong>Configuración de la cita</strong>
            </h3>

            <IonItem>
              <IonIcon icon={timeOutline} slot="start" color="primary" />
              <IonInput
                type="time"
                label="Hora de la cita"
                labelPlacement="stacked"
                value={selectedTime}
                onIonInput={(e) => setSelectedTime(e.detail.value!)}
                disabled={loading}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Duración (minutos)</IonLabel>
              <IonInput
                type="number"
                value={duracionMinutos}
                onIonInput={(e) =>
                  setDuracionMinutos(parseInt(e.detail.value!) || 30)
                }
                min="15"
                max="120"
                disabled={loading}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Notificación</IonLabel>
              <IonSelect
                value={selectedNotification}
                onIonChange={(e) => setSelectedNotification(e.detail.value)}
                disabled={loading || !emailValido}
              >
                <IonSelectOption value="noNotificar">
                  No notificar
                </IonSelectOption>
                <IonSelectOption value="diaAnterior">
                  1 día antes
                </IonSelectOption>
                <IonSelectOption value="semanaAntes">
                  1 semana antes
                </IonSelectOption>
                <IonSelectOption value="ahora">Inmediatamente</IonSelectOption>
              </IonSelect>
            </IonItem>

            {!emailValido && (
              <IonNote color="warning" className="ion-margin-top">
                <p>
                  ⚠️ El tutor no tiene un correo electrónico válido registrado.
                  No se podrán enviar notificaciones por correo.
                </p>
              </IonNote>
            )}
          </IonCardContent>
        </IonCard>

        {showPreview && selectedTime && (
          <IonCard color="light">
            <IonCardContent>
              <IonIcon
                icon={calendarOutline}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
                color="primary"
              />
              <strong>Vista previa:</strong>
              <p style={{ marginTop: "8px" }}>
                {formatearFechaHoraCompleta(fechaProxima, selectedTime)}
              </p>
              <p
                style={{ fontSize: "0.9em", color: "var(--ion-color-medium)" }}
              >
                Duración: {duracionMinutos} minutos
              </p>
            </IonCardContent>
          </IonCard>
        )}

        <div className="ion-margin-top">
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <IonSpinner />
              <p>Agendando cita...</p>
            </div>
          ) : (
            <>
              <IonButton
                expand="block"
                color="primary"
                onClick={handleConfirmarAgendamiento}
                className="ion-margin-bottom"
              >
                Confirmar y Agendar
              </IonButton>

              <IonButton
                expand="block"
                fill="outline"
                color="medium"
                onClick={handleAgendarDespuesClick}
                className="ion-margin-bottom"
              >
                Agendar Después
              </IonButton>

              <IonButton
                expand="block"
                fill="clear"
                color="danger"
                onClick={handleCancelarClick}
              >
                Cancelar Todo
              </IonButton>
            </>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalAgendarTratamiento;
