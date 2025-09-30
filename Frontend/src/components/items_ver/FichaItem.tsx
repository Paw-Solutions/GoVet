import React from "react";
import { IonItem, IonLabel, IonIcon, IonButton, IonButtons } from "@ionic/react";
import { personOutline, pencilOutline, eyeOutline, personSharp, idCardOutline, shareOutline } from "ionicons/icons";
import { FichaData } from "../../api/fichas";

interface FichaItemProps {
  ficha: FichaData;
  onView: () => void;
  onEdit: () => void;
  onExport: () => void;
  disabled: boolean;
}
import "../../styles/ver.css"

const FichaItem: React.FC<FichaItemProps> = ({
    ficha,
    onView,
    onEdit,
    onExport,
    disabled 
  }) => {
  return (
    <IonItem lines="full">
      <IonIcon icon={personSharp} slot="start" style={{ width: '20px', height: '20px' }} />
      <IonLabel>
        <h2 className="tutor-nombre">{ficha.motivo}</h2>
      </IonLabel>
      <IonButtons>
        <IonButton fill="clear" onClick={onEdit} disabled={disabled}>
          <IonIcon className="icon" icon={pencilOutline} slot="icon-only" size="small" />
        </IonButton>
        <IonButton fill="clear" onClick={onView} disabled={disabled}>
          <IonIcon className="icon" icon={eyeOutline} slot="icon-only" size="small"/>
        </IonButton>
        <IonButton fill="clear" onClick={onExport} disabled={disabled}>
          <IonIcon className="icon" icon={shareOutline} slot="icon-only" size="small"/>
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};

export default FichaItem;