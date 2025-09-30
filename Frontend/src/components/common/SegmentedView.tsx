import React from "react";
import { IonSegment, IonSegmentButton, IonLabel, IonIcon } from "@ionic/react";
import { personOutline, pawOutline, documentTextOutline } from "ionicons/icons";
import "../../styles/SegmentedView.css";

interface SegmentedViewProps {
  selectedSegment: string;
  onSegmentChange: (segment: string) => void;
  children: React.ReactNode;
}

const SegmentedView: React.FC<SegmentedViewProps> = ({
  selectedSegment,
  onSegmentChange,
  children
}) => {
  return (
    <>
      <div className="segment-container-sticky">
        <IonSegment
          value={selectedSegment}
          onIonChange={(e) => onSegmentChange(e.detail.value as string)}
        >
          <IonSegmentButton value="tutores">
            <IonIcon icon={personOutline} />
            <IonLabel>Tutores</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="pacientes">
            <IonIcon icon={pawOutline} />
            <IonLabel>Pacientes</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="fichas">
            <IonIcon icon={documentTextOutline} />
            <IonLabel>Fichas</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </div>
      {children}
    </>
  );
};

export default SegmentedView;