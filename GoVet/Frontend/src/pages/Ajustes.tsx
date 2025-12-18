import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonButton,
  IonButtons,
} from "@ionic/react";
import {
  logoWhatsapp,
  logOutOutline,
  chevronForwardOutline,
  arrowBackOutline,
} from "ionicons/icons";
import VinculacionWhatsApp from "../components/whatsapp/VinculacionWhatsApp";
import { useAuth } from "../hooks/useAuth";
import "../styles/Ajustes.css";

type SettingsSection = "list" | "whatsapp" | "session";

/**
 * Página de Ajustes
 * Lista de opciones de configuración con navegación detallada
 */
const Ajustes: React.FC = () => {
  const { logout } = useAuth();
  const [currentSection, setCurrentSection] = useState<SettingsSection>("list");

  const renderContent = () => {
    switch (currentSection) {
      case "whatsapp":
        return (
          <>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setCurrentSection("list")}>
                    <IonIcon icon={arrowBackOutline} />
                  </IonButton>
                </IonButtons>
                <IonTitle>Notificaciones WhatsApp</IonTitle>
              </IonToolbar>
            </IonHeader>

            <IonContent className="ajustes-content">
              <div className="ajustes-container">
                <VinculacionWhatsApp />

                <IonCard className="info-card">
                  <IonCardHeader>
                    <IonCardTitle>Sobre las notificaciones</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText color="medium">
                      <p>
                        Las notificaciones de WhatsApp se envían automáticamente
                        a los tutores para recordarles las citas programadas de
                        sus mascotas.
                      </p>
                      <p>
                        <strong>Importante:</strong> La conexión debe mantenerse
                        activa para que las notificaciones funcionen
                        correctamente.
                      </p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              </div>
            </IonContent>
          </>
        );

      case "session":
        return (
          <>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setCurrentSection("list")}>
                    <IonIcon icon={arrowBackOutline} />
                  </IonButton>
                </IonButtons>
                <IonTitle>Sesión</IonTitle>
              </IonToolbar>
            </IonHeader>

            <IonContent className="ajustes-content">
              <div className="ajustes-container">
                <IonCard className="session-card">
                  <IonCardHeader>
                    <IonCardTitle>Cerrar Sesión</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonButton expand="block" color="danger" onClick={logout}>
                      <IonIcon icon={logOutOutline} slot="start" />
                      Cerrar Sesión
                    </IonButton>
                    <IonText color="medium">
                      <p
                        style={{
                          fontSize: "14px",
                          marginTop: "12px",
                          textAlign: "center",
                        }}
                      >
                        Al cerrar sesión, deberás volver a autenticarte para
                        acceder al sistema.
                      </p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              </div>
            </IonContent>
          </>
        );

      default:
        return (
          <>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Ajustes</IonTitle>
              </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ajustes-content">
              <IonHeader collapse="condense">
                <IonToolbar>
                  <IonTitle size="large">Ajustes</IonTitle>
                </IonToolbar>
              </IonHeader>

              <IonList>
                <IonItem
                  button
                  detail={true}
                  detailIcon={chevronForwardOutline}
                  onClick={() => setCurrentSection("whatsapp")}
                >
                  <IonIcon icon={logoWhatsapp} slot="start" color="success" />
                  <IonLabel>
                    <h2>Notificaciones WhatsApp</h2>
                    <p>Gestionar vinculación y estado de conexión</p>
                  </IonLabel>
                </IonItem>

                <IonItem
                  button
                  detail={true}
                  detailIcon={chevronForwardOutline}
                  onClick={() => setCurrentSection("session")}
                >
                  <IonIcon icon={logOutOutline} slot="start" color="danger" />
                  <IonLabel>
                    <h2>Sesión</h2>
                    <p>Cerrar sesión y salir del sistema</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </>
        );
    }
  };

  return <IonPage>{renderContent()}</IonPage>;
};

export default Ajustes;
