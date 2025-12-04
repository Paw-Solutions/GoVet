import React, { useEffect, useState } from "react";
import { IonToast, IonBadge, IonIcon } from "@ionic/react";
import {
  cloudOfflineOutline,
  cloudDoneOutline,
  refreshOutline,
} from "ionicons/icons";
import { useServiceWorker } from "../utils/serviceWorker";
import "../styles/PWAStatus.css";

const PWAStatus: React.FC = () => {
  const { updateAvailable, isOnline, skipWaiting } = useServiceWorker();
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Detectar cambios en updateAvailable
  useEffect(() => {
    if (updateAvailable) {
      setShowUpdateToast(true);
    }
  }, [updateAvailable]);

  // Detectar cambios en conexión
  useEffect(() => {
    if (!isOnline && !wasOffline) {
      setShowOfflineToast(true);
      setWasOffline(true);
    } else if (isOnline && wasOffline) {
      setShowOnlineToast(true);
      setWasOffline(false);
      setShowOfflineToast(false);
    }
  }, [isOnline, wasOffline]);

  const handleUpdate = () => {
    skipWaiting();
    window.location.reload();
  };

  return (
    <>
      {/* Badge indicador de estado offline */}
      {!isOnline && (
        <div className="pwa-status-badge">
          <IonBadge color="warning" className="offline-badge">
            <IonIcon icon={cloudOfflineOutline} />
            <span>Sin conexión</span>
          </IonBadge>
        </div>
      )}

      {/* Toast: Nueva actualización disponible */}
      <IonToast
        isOpen={showUpdateToast}
        onDidDismiss={() => setShowUpdateToast(false)}
        message="Nueva versión disponible"
        duration={0}
        position="top"
        color="primary"
        icon={refreshOutline}
        buttons={[
          {
            text: "Actualizar",
            role: "confirm",
            handler: handleUpdate,
          },
          {
            text: "Después",
            role: "cancel",
          },
        ]}
        cssClass="update-toast"
      />

      {/* Toast: Modo offline activado */}
      <IonToast
        isOpen={showOfflineToast}
        onDidDismiss={() => setShowOfflineToast(false)}
        message="Sin conexión. Algunas funciones están limitadas."
        duration={4000}
        position="bottom"
        color="warning"
        icon={cloudOfflineOutline}
        cssClass="offline-toast"
      />

      {/* Toast: Conexión restaurada */}
      <IonToast
        isOpen={showOnlineToast}
        onDidDismiss={() => setShowOnlineToast(false)}
        message="Conexión restaurada"
        duration={3000}
        position="bottom"
        color="success"
        icon={cloudDoneOutline}
        cssClass="online-toast"
      />
    </>
  );
};

export default PWAStatus;
