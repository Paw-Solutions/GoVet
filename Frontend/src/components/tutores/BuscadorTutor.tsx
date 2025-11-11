import React, { useEffect } from "react";
import {
  IonList,
  IonNote,
  IonSpinner,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import { personOutline } from "ionicons/icons";
import { TutorData } from "../../api/tutores";
import { useTutorSearch } from "../../hooks/useTutorSearch";
import SearchBar from "../common/SearchBar";
import TutorItemSimple from "./TutorItemSimple";
import "../../styles/ver.css";
import "../../styles/buscadorTutor.css";

interface BuscadorTutorProps {
  onSelectTutor: (tutor: TutorData) => void;
  tutorSeleccionado?: TutorData | null;
  autoLoad?: boolean;
  placeholder?: string;
  maxHeight?: string;
}

const BuscadorTutor: React.FC<BuscadorTutorProps> = ({
  onSelectTutor,
  tutorSeleccionado = null,
  autoLoad = false,
  placeholder = "Buscar por nombre, apellido, RUT o email...",
  maxHeight = "400px",
}) => {
  const {
    tutores,
    loading,
    error,
    busqueda,
    hasMoreData,
    handleSearch,
    loadMore,
    loadTutores,
  } = useTutorSearch();

  // Cargar tutores automáticamente si autoLoad es true
  useEffect(() => {
    if (autoLoad) {
      loadTutores(true);
    }
  }, [autoLoad, loadTutores]);

  return (
    <div
      className="tutor-search-container"
      style={{ maxHeight, overflowY: "auto" }}
    >
      <SearchBar
        value={busqueda}
        onSearch={handleSearch}
        placeholder={placeholder}
        fixed={false}
      />

      {/* Estado de carga inicial */}
      {loading && tutores.length === 0 && (
        <div
          className="loading-container"
          style={{ padding: "2rem", textAlign: "center" }}
        >
          <IonSpinner name="crescent" />
          <p style={{ marginTop: "1rem", color: "var(--ion-color-medium)" }}>
            Buscando tutores...
          </p>
        </div>
      )}

      {/* Estado de error */}
      {error && (
        <div
          className="error-container"
          style={{ padding: "2rem", textAlign: "center" }}
        >
          <IonNote color="danger">{error}</IonNote>
        </div>
      )}

      {/* Estado vacío */}
      {!loading && !error && tutores.length === 0 && (
        <div
          className="empty-container"
          style={{
            padding: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <IonIcon
            icon={personOutline}
            style={{ fontSize: "48px", color: "var(--ion-color-medium)" }}
          />
          <p style={{ color: "var(--ion-color-medium)" }}>
            {busqueda
              ? "No se encontraron tutores"
              : "Busca un tutor para continuar"}
          </p>
        </div>
      )}

      {/* Lista de resultados */}
      {tutores.length > 0 && (
        <>
          <IonNote
            className="results-note"
            style={{
              display: "block",
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
            }}
          >
            {tutores.length}{" "}
            {tutores.length === 1 ? "tutor encontrado" : "tutores encontrados"}
            {hasMoreData && " (cargando más...)"}
          </IonNote>

          <IonList>
            {tutores.map((tutor) => (
              <TutorItemSimple
                key={tutor.rut}
                tutor={tutor}
                onSelect={() => onSelectTutor(tutor)}
                isSelected={tutorSeleccionado?.rut === tutor.rut}
              />
            ))}
          </IonList>

          {/* Scroll infinito */}
          <IonInfiniteScroll
            onIonInfinite={(e) => {
              loadMore().finally(() => e.target.complete());
            }}
            disabled={!hasMoreData}
          >
            <IonInfiniteScrollContent loadingText="Cargando más tutores..." />
          </IonInfiniteScroll>
        </>
      )}
    </div>
  );
};

export default BuscadorTutor;
