import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import VinculacionWhatsApp from "../components/whatsapp/VinculacionWhatsApp";
import "../styles/Ajustes.css";

/**
 * Página de Ajustes
 * Contenedor limpio que renderiza componentes de configuración
 */
const Ajustes: React.FC = () => {
  /**
   * Maneja el refresco manual de la página
   */
  const handleRefresh = (event: CustomEvent) => {
    // El componente VinculacionWhatsApp maneja su propio estado
    // Aquí simplemente recargamos la página
    window.location.reload();
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ajustes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ajustes-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Ajustes</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ajustes-container">
          {/* Componente de vinculación de WhatsApp */}
          <VinculacionWhatsApp />

          {/* Información adicional */}
          <IonCard className="info-card">
            <IonCardHeader>
              <IonCardTitle>Sobre las notificaciones</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText color="medium">
                <p>
                  Las notificaciones de WhatsApp se envían automáticamente a los
                  tutores para recordarles las citas programadas de sus
                  mascotas.
                </p>
                <p>
                  <strong>Importante:</strong> La conexión debe mantenerse
                  activa para que las notificaciones funcionen correctamente.
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Ajustes;
