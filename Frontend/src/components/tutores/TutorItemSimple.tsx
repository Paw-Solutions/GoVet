import React from "react";
import { IonItem, IonLabel, IonIcon } from "@ionic/react";
import { personSharp, checkmarkCircle } from "ionicons/icons";
import { TutorData } from "../../api/tutores";
import "../../styles/ver.css";

interface TutorItemSimpleProps {
  tutor: TutorData;
  onSelect: () => void;
  isSelected?: boolean;
}

const TutorItemSimple: React.FC<TutorItemSimpleProps> = ({
  tutor,
  onSelect,
  isSelected = false,
}) => {
  return (
    <IonItem
      button
      onClick={onSelect}
      lines="full"
      className={isSelected ? "tutor-seleccionado" : ""}
    >
      <IonIcon
        icon={personSharp}
        slot="start"
        style={{ width: "20px", height: "20px" }}
      />
      <IonLabel>
        <h2 className="tutor-nombre">
          {tutor.nombre} {tutor.apellido_paterno} {tutor.apellido_materno}
        </h2>
        <p>
          <IonIcon src="/id.svg" className="pacientes-icon" />
          <span style={{ marginLeft: "8px" }}>: {tutor.rut}</span>
        </p>
        {tutor.email && (
          <p style={{ fontSize: "0.85rem", color: "var(--ion-color-medium)" }}>
            {tutor.email}
          </p>
        )}
      </IonLabel>
      {isSelected && (
        <IonIcon
          icon={checkmarkCircle}
          slot="end"
          color="success"
          style={{ fontSize: "24px" }}
        />
      )}
    </IonItem>
  );
};

export default TutorItemSimple;
