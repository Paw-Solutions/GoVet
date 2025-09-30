import React from "react";
import { IonItem, IonLabel, IonIcon, IonButton, IonButtons } from "@ionic/react";
import { personOutline, pencilOutline, eyeOutline, personSharp, idCardOutline } from "ionicons/icons";
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
        <h2 className="tutor-nombre">{tutor.nombre} {tutor.apellido_paterno} {tutor.apellido_materno}</h2>
        <p>
          <IonIcon icon={idCardOutline} className="pacientes-icon"/>
            <span style={{marginLeft: '8px'}}>: {tutor.rut}</span>
        </p>
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