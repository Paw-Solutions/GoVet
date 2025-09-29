import React from 'react';
import { IonText, IonButton, IonIcon } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import '../../styles/ver.css';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  type: 'tutores' | 'pacientes';
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, type }) => {
  if (!error) return null;

  return (
    <div className="error-container">
      <IonText color="danger">
        <p>{error}</p>
      </IonText>
      <IonButton
        fill="outline"
        onClick={onRetry}
        className="retry-button"
      >
        <IonIcon icon={refreshOutline} slot="start" />
        Reintentar
      </IonButton>
    </div>
  );
};

export default ErrorState;