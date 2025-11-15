import React from "react";
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
  IonList,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import {
  closeOutline,
  personOutline,
  callOutline,
  mailOutline,
  locationOutline,
  pencilOutline,
} from "ionicons/icons";
import { TutorData } from "../../api/tutores";
// Componente: Visualizador del detalle de un tutor
interface ModalInfoTutorProps {
  isOpen: boolean;
  onDismiss: () => void;
  tutor: TutorData | null;
  onEdit?: () => void; // Nueva prop opcional para manejar la edición
}

const ModalInfoTutor: React.FC<ModalInfoTutorProps> = ({
  isOpen,
  onDismiss,
  tutor,
  onEdit,
}) => {
  // Función segura para cerrar el modal
  const handleDismiss = () => {
    try {
      onDismiss();
    } catch (error) {
      console.error("Error closing modal:", error);
    }
  };

  // Función para manejar la edición
  const handleEdit = () => {
    try {
      if (onEdit) {
        onEdit();
      }
    } catch (error) {
      console.error("Error opening edit:", error);
    }
  };

  // Función para hacer llamada
  const handleCall = (telefono: number) => {
    try {
      window.open(`tel:${telefono}`, "_system");
    } catch (error) {
      console.error("Error making call:", error);
    }
  };

  // Función para enviar email
  const handleEmail = (email: string) => {
    try {
      window.open(`mailto:${email}`, "_system");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Función para abrir ubicación en Google Maps
  const handleLocation = (direccion: string) => {
    try {
      const encodedAddress = encodeURIComponent(direccion);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        "_blank"
      );
    } catch (error) {
      console.error("Error opening maps:", error);
    }
  };

  // Si no hay tutor, no renderizar nada
  if (!tutor) {
    return null;
  }

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleDismiss}
      backdropDismiss={true}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Información del Tutor</IonTitle>
          <IonButtons slot="end">
            {onEdit && (
              <IonButton onClick={handleEdit} fill="clear" color="primary">
                <IonIcon icon={pencilOutline} slot="icon-only" />
              </IonButton>
            )}
            <IonButton onClick={handleDismiss} fill="clear">
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Información Personal */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={personOutline} style={{ marginRight: "8px" }} />
              Información Personal
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h2>Nombre Completo</h2>
                  <p>
                    {tutor.nombre} {tutor.apellido_paterno}{" "}
                    {tutor.apellido_materno || ""}
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>RUT</h2>
                  <p>{tutor.rut}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>Comuna</h2>
                  <p>
                    {tutor.comuna}, {tutor.region}
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>Dirección</h2>
                  <p>{tutor.direccion}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>Observación</h2>
                  <p>
                    {tutor.observacion != "NaN"
                      ? tutor.observacion
                      : "Sin observación"}
                  </p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Información de Contacto */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Información de Contacto</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {/* Verificar si hay información de contacto */}
            {!tutor.telefono &&
            (tutor.email === "NaN" || !tutor.email) &&
            !tutor.direccion ? (
              <IonText color="medium">
                <p>No hay información de contacto registrada.</p>
              </IonText>
            ) : (
              <IonList>
                {/* Teléfono */}
                {tutor.telefono && (
                  <IonItem>
                    <IonLabel>
                      <h2>Teléfono</h2>
                      <p>{tutor.telefono}</p>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      size="small"
                      color="secondary"
                      onClick={() => handleCall(tutor.telefono!)}
                    >
                      <IonIcon icon={callOutline} slot="start" />
                      Llamar
                    </IonButton>
                  </IonItem>
                )}

                {/* Teléfono 2 */}
                {tutor.telefono2 && (
                  <IonItem>
                    <IonLabel>
                      <h2>Teléfono 2</h2>
                      <p>{tutor.telefono2}</p>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      size="small"
                      color="secondary"
                      onClick={() => handleCall(tutor.telefono2!)}
                    >
                      <IonIcon icon={callOutline} slot="start" />
                      Llamar
                    </IonButton>
                  </IonItem>
                )}

                {/* Celular */}
                {tutor.celular && (
                  <IonItem>
                    <IonLabel>
                      <h2>Celular</h2>
                      <p>{tutor.celular}</p>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      size="small"
                      color="secondary"
                      onClick={() => handleCall(tutor.celular!)}
                    >
                      <IonIcon icon={callOutline} slot="start" />
                      Llamar
                    </IonButton>
                  </IonItem>
                )}

                {/* Celular 2 */}
                {tutor.celular2 && (
                  <IonItem>
                    <IonLabel>
                      <h2>Celular 2</h2>
                      <p>{tutor.celular2}</p>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      size="small"
                      color="secondary"
                      onClick={() => handleCall(tutor.celular2!)}
                    >
                      <IonIcon icon={callOutline} slot="start" />
                      Llamar
                    </IonButton>
                  </IonItem>
                )}

                {/* Email */}
                {tutor.email &&
                  tutor.email !== "NaN" &&
                  tutor.email.trim() !== "" && (
                    <IonItem>
                      <IonLabel>
                        <h2>Email</h2>
                        <p>{tutor.email}</p>
                      </IonLabel>
                      <IonButton
                        fill="clear"
                        size="small"
                        color="secondary"
                        onClick={() => handleEmail(tutor.email!)}
                      >
                        <IonIcon icon={mailOutline} slot="start" />
                        Enviar
                      </IonButton>
                    </IonItem>
                  )}

                {/* Dirección */}
                {tutor.direccion && tutor.direccion.trim() !== "" && (
                  <IonItem>
                    <IonLabel>
                      <h2>Dirección</h2>
                      <p>{tutor.direccion}</p>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      size="small"
                      color="secondary"
                      onClick={() => handleLocation(tutor.direccion!)}
                    >
                      <IonIcon icon={locationOutline} slot="start" />
                      Ver en Maps
                    </IonButton>
                  </IonItem>
                )}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>

        {/* Botón de cierre adicional */}
        <div style={{ padding: "20px", textAlign: "center" }}>
          <IonButton expand="block" fill="outline" onClick={handleDismiss}>
            Cerrar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalInfoTutor;
