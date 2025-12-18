import React from "react";
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from "@ionic/react";
import { swapVerticalOutline } from "ionicons/icons";
import "../../styles/ver.css";

interface SortDropdownProps {
  value: "desc" | "asc";
  onChange: (value: "desc" | "asc") => void;
  label?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  label = "Ordenar por fecha",
}) => {
  return (
    <IonItem lines="none" className="sort-dropdown-container">
      <IonIcon icon={swapVerticalOutline} slot="start" color="medium" />
      <IonLabel>{label}</IonLabel>
      <IonSelect
        value={value}
        onIonChange={(e) => onChange(e.detail.value)}
        interface="popover"
        className="sort-select"
      >
        <IonSelectOption value="desc">Más reciente primero</IonSelectOption>
        <IonSelectOption value="asc">Más antiguo primero</IonSelectOption>
      </IonSelect>
    </IonItem>
  );
};

export default SortDropdown;
