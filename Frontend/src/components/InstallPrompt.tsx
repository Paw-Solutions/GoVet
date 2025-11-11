import React from "react";
import { IonButton, IonIcon, IonCard, IonCardContent } from "@ionic/react";
import { downloadOutline, closeOutline } from "ionicons/icons";
import { usePWAInstall, getDeviceType } from "../utils/pwaInstall";
import "./InstallPrompt.css";

interface InstallPromptProps {
  onDismiss?: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const { isInstallable, promptInstall } = usePWAInstall();
  const deviceType = getDeviceType();

  if (!isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    await promptInstall();
    onDismiss?.();
  };

  const getInstallMessage = () => {
    switch (deviceType) {
      case "ios":
        return 'Toca el ícono de compartir y luego "Añadir a pantalla de inicio"';
      case "android":
        return "Instala GoVet para acceder rápidamente desde tu pantalla de inicio";
      default:
        return "Instala GoVet en tu dispositivo para una mejor experiencia";
    }
  };

  return (
    <IonCard className="install-prompt-card">
      <IonCardContent>
        <div className="install-prompt-content">
          <div className="install-prompt-header">
            <div className="install-prompt-icon">
              <IonIcon icon={downloadOutline} />
            </div>
            {onDismiss && (
              <IonButton
                fill="clear"
                size="small"
                onClick={onDismiss}
                className="install-prompt-close"
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            )}
          </div>

          <div className="install-prompt-text">
            <h3>Instalar GoVet</h3>
            <p>{getInstallMessage()}</p>
          </div>

          {deviceType !== "ios" && (
            <IonButton
              expand="block"
              onClick={handleInstall}
              className="install-prompt-button"
            >
              Instalar Ahora
            </IonButton>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default InstallPrompt;
