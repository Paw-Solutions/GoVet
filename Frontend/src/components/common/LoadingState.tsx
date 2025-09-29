import React from "react";
import { IonSpinner, IonText } from "@ionic/react";
import '../../styles/ver.css';

interface LoadingStateProps {
  loading: boolean;
  itemCount: number;
  type: 'tutores' | 'pacientes';
}

const LoadingState: React.FC<LoadingStateProps> = ({ loading, itemCount, type }) => {
  if (!loading || itemCount > 0) return null;

  return (
    <div className="loading-container">
      <IonSpinner />
      <IonText>
        <p>Cargando {type}...</p>
      </IonText>
    </div>
  );
};

export default LoadingState;