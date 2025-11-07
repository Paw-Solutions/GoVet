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
  IonChip,
  IonIcon,
  IonAlert,
  useIonToast,
} from "@ionic/react";
import {
  closeOutline,
  createOutline,
  trashOutline,
  personOutline,
  pawOutline,
  timeOutline,
  calendarOutline,
  callOutline,
  mailOutline,
  documentTextOutline,
} from "ionicons/icons";
import { eliminarCita, type Cita } from "../../api/citas";
import ModalEditarCita from "./ModalEditarCita";

interface ModalDetalleCitaProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita;
  onCitaActualizada: () => void;
}

const ModalDetalleCita: React.FC<ModalDetalleCitaProps> = ({
  isOpen,
  onClose,
  cita,
  onCitaActualizada,
}) => {
  const [present] = useIonToast();
  const [mostrarAlertaEliminar, setMostrarAlertaEliminar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  const formatearFechaHora = () => {
    if (!cita || !cita.fecha_hora) {
      return { fecha: "", hora: "" };
    }
    const fecha = new Date(cita.fecha_hora);
    return {
      fecha: fecha.toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      hora: fecha.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "programada":
        return "primary";
      case "confirmada":
        return "success";
      case "cancelada":
        return "danger";
      case "completada":
        return "medium";
      default:
        return "medium";
    }
  };

  const handleEliminar = async () => {
    if (!cita || !cita.id_cita) return;

    try {
      await eliminarCita(cita.id_cita);

      present({
        message: "Cita eliminada exitosamente",
        duration: 3000,
        color: "success",
      });

      onCitaActualizada();
      onClose();
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      present({
        message: "Error al eliminar la cita",
        duration: 3000,
        color: "danger",
      });
    }
  };

  const { fecha, hora } = formatearFechaHora();

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Detalle de Cita</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onClose}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          {/* Estado */}
          <div className="detalle-estado">
            <IonChip
              color={getColorEstado(cita.estado)}
              className="estado-chip"
            >
              <IonLabel className="capitalize">{cita.estado}</IonLabel>
            </IonChip>
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
                  <span>{hora}</span>
                </div>
              </IonLabel>
            </IonItem>
          </div>

          {/* Información del tutor */}
          <div className="detalle-section">
            <h3>
              <IonIcon icon={personOutline} /> Tutor Responsable
            </h3>
            <IonItem lines="none">
              <IonLabel>
                <h2>
                  {cita.tutor_nombre} {cita.tutor_apellido_paterno}{" "}
                  {cita.tutor_apellido_materno}
                </h2>
                <p>
                  <strong>RUT:</strong> {cita.rut_tutor}
                </p>
                {cita.tutor_telefono && (
                  <p className="detalle-contacto">
                    <IonIcon icon={callOutline} />
                    <a href={`tel:${cita.tutor_telefono}`}>
                      {cita.tutor_telefono}
                    </a>
                  </p>
                )}
                {cita.tutor_email && (
                  <p className="detalle-contacto">
                    <IonIcon icon={mailOutline} />
                    <a href={`mailto:${cita.tutor_email}`}>
                      {cita.tutor_email}
                    </a>
                  </p>
                )}
              </IonLabel>
            </IonItem>
          </div>

          {/* Pacientes */}
          <div className="detalle-section">
            <h3>
              <IonIcon icon={pawOutline} /> Pacientes
            </h3>
            {cita.pacientes.map((paciente) => (
              <IonItem key={paciente.id_paciente} lines="none">
                <IonIcon icon={pawOutline} slot="start" />
                <IonLabel>
                  <h2>{paciente.nombre}</h2>
                  <p>ID: {paciente.id_paciente}</p>
                </IonLabel>
              </IonItem>
            ))}
          </div>

          {/* Motivo */}
          <div className="detalle-section">
            <h3>
              <IonIcon icon={documentTextOutline} /> Motivo de la Cita
            </h3>
            <IonItem lines="none">
              <IonLabel className="ion-text-wrap">
                <p>{cita.motivo}</p>
              </IonLabel>
            </IonItem>
          </div>

          {/* Notas */}
          {cita.notas && (
            <div className="detalle-section">
              <h3>Notas Adicionales</h3>
              <IonItem lines="none">
                <IonLabel className="ion-text-wrap">
                  <p>{cita.notas}</p>
                </IonLabel>
              </IonItem>
            </div>
          )}

          {/* Fecha de creación */}
          <div className="detalle-footer">
            <p className="texto-small">
              Creada el{" "}
              {new Date(cita.created_at).toLocaleDateString("es-CL", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="detalle-acciones">
            <IonButton
              expand="block"
              fill="outline"
              onClick={() => setMostrarModalEditar(true)}
            >
              <IonIcon icon={createOutline} slot="start" />
              Editar Cita
            </IonButton>

            <IonButton
              expand="block"
              color="danger"
              fill="outline"
              onClick={() => setMostrarAlertaEliminar(true)}
            >
              <IonIcon icon={trashOutline} slot="start" />
              Eliminar Cita
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Alerta de confirmación para eliminar */}
      <IonAlert
        isOpen={mostrarAlertaEliminar}
        onDidDismiss={() => setMostrarAlertaEliminar(false)}
        header="Eliminar Cita"
        message="¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer."
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

      {/* Modal de edición */}
      {mostrarModalEditar && (
        <ModalEditarCita
          isOpen={mostrarModalEditar}
          onClose={() => setMostrarModalEditar(false)}
          cita={cita}
          onCitaActualizada={() => {
            onCitaActualizada();
            setMostrarModalEditar(false);
          }}
        />
      )}
    </>
  );
};

export default ModalDetalleCita;
