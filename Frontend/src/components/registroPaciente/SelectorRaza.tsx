import React from "react";
import { IonItem, IonInput, IonList, IonLabel, IonSpinner } from "@ionic/react";

interface SelectorRazaProps {
  razaQuery: string;
  setRazaQuery: (query: string) => void;
  showRazaList: boolean;
  setShowRazaList: (show: boolean) => void;
  filteredRazas: any[];
  loadingRazas: boolean;
  selectRaza: (id: number, nombre: string) => void;
  especieSeleccionada: boolean;
}

export const SelectorRaza: React.FC<SelectorRazaProps> = ({
  razaQuery,
  setRazaQuery,
  showRazaList,
  setShowRazaList,
  filteredRazas,
  loadingRazas,
  selectRaza,
  especieSeleccionada,
}) => {
  return (
    <>
      <IonItem lines="none" className="searchbar-container">
        <IonInput
          label="Raza"
          labelPlacement="stacked"
          fill="outline"
          placeholder={
            especieSeleccionada
              ? "Buscar raza..."
              : "Primero selecciona una especie"
          }
          value={razaQuery}
          disabled={!especieSeleccionada}
          onIonInput={(e) => {
            if (especieSeleccionada) {
              setRazaQuery(e.detail.value!);
              setShowRazaList(true);
            }
          }}
          onIonFocus={() => {
            if (especieSeleccionada) {
              setShowRazaList(true);
            }
          }}
          onIonBlur={() => {
            // Pequeño delay para permitir que el click en la lista se registre
            setTimeout(() => {
              setShowRazaList(false);
            }, 150);
          }}
        />
      </IonItem>
      {showRazaList && especieSeleccionada && filteredRazas.length > 0 && (
        <IonList className="filter-list">
          {loadingRazas ? (
            <IonItem>
              <IonSpinner />
              <IonLabel>Cargando razas...</IonLabel>
            </IonItem>
          ) : (
            filteredRazas.map((raza: any) => (
              <IonItem
                key={raza.id_raza}
                button
                onClick={() => selectRaza(raza.id_raza, raza.nombre)}
              >
                <IonLabel>{raza.nombre}</IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
      )}
    </>
  );
};
