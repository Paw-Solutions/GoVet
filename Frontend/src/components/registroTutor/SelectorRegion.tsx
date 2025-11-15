import React from "react";
import {
  IonItem,
  IonInput,
  IonList,
  IonLabel,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { formatRegionName } from "../../utils/formatters";
// Componente: Gestor de tutores
interface SelectorRegionProps {
  regionQuery: string;
  setRegionQuery: (query: string) => void;
  showRegionList: boolean;
  setShowRegionList: (show: boolean) => void;
  filteredRegiones: any[];
  loadingRegiones: boolean;
  selectRegion: (id: string, nombre: string, fullRegion: any) => void;
}

export const SelectorRegion: React.FC<SelectorRegionProps> = ({
  regionQuery,
  setRegionQuery,
  showRegionList,
  setShowRegionList,
  filteredRegiones,
  loadingRegiones,
  selectRegion,
}) => {
  return (
    <>
      <IonItem lines="none" className="searchbar-container">
        <IonInput
          labelPlacement="stacked"
          fill="outline"
          placeholder="Buscar región..."
          value={regionQuery}
          onIonInput={(e) => {
            setRegionQuery(e.detail.value!);
            setShowRegionList(true);
          }}
          onIonFocus={() => setShowRegionList(true)}
          onIonBlur={() => {
            // Pequeño delay para permitir que el click en la lista se registre
            setTimeout(() => {
              setShowRegionList(false);
            }, 150);
          }}
        >
          <div slot="label">
            Región <IonText color="danger">(*)</IonText>
          </div>
        </IonInput>
      </IonItem>
      {showRegionList && filteredRegiones.length > 0 && (
        <IonList className="filter-list">
          {loadingRegiones ? (
            <IonItem>
              <IonSpinner />
              <IonLabel>Cargando regiones...</IonLabel>
            </IonItem>
          ) : (
            filteredRegiones.map((region) => {
              const formattedName = formatRegionName(region);
              return (
                <IonItem
                  key={region.id}
                  button
                  onClick={() => selectRegion(region.id, formattedName, region)}
                >
                  <IonLabel>{formattedName}</IonLabel>
                </IonItem>
              );
            })
          )}
        </IonList>
      )}
    </>
  );
};
