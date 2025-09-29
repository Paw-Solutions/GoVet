import React from "react";
import { IonItem, IonLabel, IonIcon, IonButton, IonButtons } from "@ionic/react";
import { personOutline, pencilOutline, eyeOutline, personSharp } from "ionicons/icons";
import { TutorData } from "../../api/tutores";

interface TutorItemProps {
  tutor: TutorData;
  onView: () => void;
  onEdit: () => void;
  disabled: boolean;
}

const TutorItem: React.FC<TutorItemProps> = ({ tutor, onView, onEdit, disabled }) => {
  return (
    <IonItem lines="full">
      <IonIcon icon={personSharp} slot="start" />
      <IonLabel>
        <h2>{tutor.nombre} {tutor.apellido_paterno} {tutor.apellido_materno}</h2>
        <p><strong>RUT:</strong> {tutor.rut}</p>
      </IonLabel>
      <IonButtons>
        <IonButton fill="clear" onClick={onEdit} disabled={disabled}>
          <IonIcon className="icon" icon={pencilOutline} slot="icon-only" size="small" />
        </IonButton>
        <IonButton fill="clear" onClick={onView} disabled={disabled}>
          <IonIcon className="icon" icon={eyeOutline} slot="icon-only" size="small"/>
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};

export default TutorItem;