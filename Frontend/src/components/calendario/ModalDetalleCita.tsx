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
} from "ionicons/icons";
import { deteleEvent } from "../../api/calendario";
import { CalendarEvent } from "../../api/calendario";

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
      await deteleEvent(evento.id);

      present({
        message: "Evento eliminado exitosamente",
        duration: 3000,
        color: "success",
      });

      onEventoActualizado();
      onClose();
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      present({
        message: "Error al eliminar el evento",
        duration: 3000,
        color: "danger",
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
          {/* Título del evento */}
          <div className="detalle-section">
            <h2>{evento.summary}</h2>
          </div>

          {/* Fecha y hora */}
          <div className="detalle-section">
            <h3>
              <IonIcon icon={calendarOutline} /> Fecha y Hora
            </h3>
            <IonItem lines="none">
              <IonLabel>
                <div className="detalle-fecha">
                  <IonIcon icon={calendarOutline} />
                  <span className="capitalize">{fecha}</span>
                </div>
                <div className="detalle-hora">
                  <IonIcon icon={timeOutline} />
                  <span>
                    {horaInicio} - {horaFin}
                  </span>
                </div>
              </IonLabel>
            </IonItem>
          </div>

          {/* Ubicación */}
          {evento.location && (
            <div className="detalle-section">
              <h3>Ubicación</h3>
              <IonItem lines="none">
                <IonLabel className="ion-text-wrap">
                  <p>{evento.location}</p>
                </IonLabel>
              </IonItem>
            </div>
          )}

          {/* Descripción */}
          {evento.description && (
            <div className="detalle-section">
              <h3>
                <IonIcon icon={documentTextOutline} /> Descripción
              </h3>
              <IonItem lines="none">
                <IonLabel className="ion-text-wrap">
                  <p>{evento.description}</p>
                </IonLabel>
              </IonItem>
            </div>
          )}

          {/* Asistentes */}
          {evento.attendees && evento.attendees.length > 0 && (
            <div className="detalle-section">
              <h3>Asistentes</h3>
              {evento.attendees.map((asistente, index) => (
                <IonItem key={index} lines="none">
                  <IonLabel>
                    <p>{asistente.email}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </div>
          )}

          {/* Zona horaria */}
          <div className="detalle-footer">
            <p className="texto-small">Zona horaria: {evento.start.timeZone}</p>
          </div>

          {/* Botones de acción */}
          <div className="detalle-acciones">
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
