import React from "react";
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonButtons,
} from "@ionic/react";
import {
  personOutline,
  pencilOutline,
  personSharp,
  idCardOutline,
} from "ionicons/icons";
import { TutorData } from "../../api/tutores";

interface TutorItemProps {
  tutor: TutorData;
  onView: () => void;
  onEdit: () => void;
  disabled: boolean;
}
import "../../styles/ver.css";

const TutorItem: React.FC<TutorItemProps> = ({
  tutor,
  onView,
  onEdit,
  disabled,
}) => {
  return (
    <IonItem
      lines="none"
      className="tutor-item"
      button
      onClick={onView}
      disabled={disabled}
    >
      <IonIcon icon={personSharp} slot="start" className="item-icon" />
      <IonLabel>
        <h2 className="tutor-nombre">
          {tutor.nombre} {tutor.apellido_paterno} {tutor.apellido_materno}
        </h2>
        <p>
          <IonIcon src="/id.svg" className="pacientes-icon" />
          <span style={{ marginLeft: "8px" }}>: {tutor.rut}</span>
        </p>
      </IonLabel>
      <IonButtons slot="end">
        <IonButton
          fill="clear"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          disabled={disabled}
        >
          <IonIcon
            className="icon"
            icon={pencilOutline}
            slot="icon-only"
            size="small"
          />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};

export default TutorItem;
