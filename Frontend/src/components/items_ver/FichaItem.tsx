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
  shareOutline,
} from "ionicons/icons";
import { ConsultaData } from "../../api/fichas";

interface COnsultaItemProps {
  consulta: ConsultaData;
  onView: () => void;
  onEdit: () => void;
  onExport: () => void;
  disabled: boolean;
}
import "../../styles/ver.css";

const FichaItem: React.FC<COnsultaItemProps> = ({
  consulta,
  onView,
  onEdit,
  onExport,
  disabled,
}) => {
  return (
    <IonItem
      lines="none"
      className="info-card"
      button
      onClick={onView}
      disabled={disabled}
    >
      <IonIcon icon={personSharp} slot="start" className="item-icon" />
      <IonLabel>
        <h2 className="tutor-nombre">{consulta?.paciente?.nombre}</h2>
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
        <IonButton
          fill="clear"
          onClick={(e) => {
            e.stopPropagation();
            onExport();
          }}
          disabled={disabled}
        >
          <IonIcon
            className="icon"
            icon={shareOutline}
            slot="icon-only"
            size="small"
          />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};

export default FichaItem;
