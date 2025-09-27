import React from "react";
import { IonItem, IonInput, IonList, IonLabel, IonSpinner } from "@ionic/react";

interface SelectorEspecieProps {
  especieQuery: string;
  setEspecieQuery: (query: string) => void;
  showEspecieList: boolean;
  setShowEspecieList: (show: boolean) => void;
  filteredEspecies: any[];
  loadingEspecies: boolean;
  selectEspecie: (id: number, nombre: string) => void;
}

export const SelectorEspecie: React.FC<SelectorEspecieProps> = ({
  especieQuery,
  setEspecieQuery,
  showEspecieList,
  setShowEspecieList,
  filteredEspecies,
  loadingEspecies,
  selectEspecie,
}) => {
  return (
    <>
      <IonItem lines="none" className="searchbar-container">
        <IonInput
          label="Especie"
          labelPlacement="stacked"
          fill="outline"
          placeholder="Buscar especie..."
          value={especieQuery}
          onIonInput={(e) => {
            setEspecieQuery(e.detail.value!);
            setShowEspecieList(true);
          }}
          onIonFocus={() => setShowEspecieList(true)}
          onIonBlur={() => {
            // Pequeño delay para permitir que el click en la lista se registre
            setTimeout(() => {
              setShowEspecieList(false);
            }, 150);
          }}
        />
      </IonItem>
      {showEspecieList && filteredEspecies.length > 0 && (
        <IonList className="filter-list">
          {loadingEspecies ? (
            <IonItem>
              <IonSpinner />
              <IonLabel>Cargando especies...</IonLabel>
            </IonItem>
          ) : (
            filteredEspecies.map((especie) => (
              <IonItem
                key={especie.id_especie}
                button
                onClick={() =>
                  selectEspecie(especie.id_especie, especie.nombre_comun)
                }
              >
                <IonLabel>{especie.nombre_comun}</IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
      )}
    </>
  );
};
