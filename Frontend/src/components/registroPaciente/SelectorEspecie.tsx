import React from "react";
import { IonItem, IonInput, IonList, IonLabel, IonSpinner } from "@ionic/react";
// Componente: Gestor de razas y especies
interface SelectorEspecieProps {
  especieQuery: string;
  setEspecieQuery: (query: string) => void;
  showEspecieList: boolean;
  setShowEspecieList: (show: boolean) => void;
  filteredEspecies: any[];
  loadingEspecies: boolean;
  selectEspecie: (id: number, nombre: string) => void;
  onClearEspecie?: () => void;
  hasSelectedEspecie?: boolean; // Nueva prop para saber si hay especie seleccionada
}

export const SelectorEspecie: React.FC<SelectorEspecieProps> = ({
  especieQuery,
  setEspecieQuery,
  showEspecieList,
  setShowEspecieList,
  filteredEspecies,
  loadingEspecies,
  selectEspecie,
  onClearEspecie,
  hasSelectedEspecie,
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
            const value = e.detail.value!;
            setEspecieQuery(value);
            setShowEspecieList(true);

            // Si se borra todo el contenido y había una especie seleccionada
            if (value.trim() === "" && hasSelectedEspecie && onClearEspecie) {
              onClearEspecie();
            }
          }}
          onIonFocus={() => setShowEspecieList(true)}
          onIonBlur={() => {
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
