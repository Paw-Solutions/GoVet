import React from "react";
import {
  IonList,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { FichaData } from "../../api/fichas";
import SearchBar from "../common/SearchBar";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import ResultsCounter from "../ver/ResultsCounter";
import InfiniteScroll from "../common/InfiniteScroll";
import FichaItem from "../items_ver/FichaItem";
import '../../styles/ver.css';

interface FichasListProps {
  fichas: FichaData[];
  loading: boolean;
  error: string;
  busqueda: string;
  hasMoreData: boolean;
  onSearch: (texto: string) => void;
  onRefresh: (event: CustomEvent) => Promise<void>;
  onLoadMore: (event: CustomEvent) => Promise<void>;
  onViewFicha: (paciente: FichaData) => void;
  onEditFicha: (paciente: FichaData) => void;
  onExportFicha: (paciente: FichaData) => void;
  onRetry: () => void;
}

const FichasList: React.FC<FichasListProps> = ({
  fichas = [],
  loading,
  error,
  busqueda,
  hasMoreData,
  onSearch,
  onRefresh,
  onLoadMore,
  onViewFicha,
  onEditFicha,
  onExportFicha,
  onRetry
}) => {
  const safeFichas = fichas;
  console.log("Fichas: ", fichas);
  console.log("Hola")

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <div className="info-container">
        <SearchBar
          value={busqueda}
          onSearch={onSearch}
          placeholder="Buscar por nombre de paciente o tutor..."
          className="searchbar"
        />

        <LoadingState loading={loading} itemCount={safeFichas.length} type="fichas" />

        <ErrorState
          error={error}
          onRetry={onRetry}
          type="fichas"
        />
        
        <EmptyState
          isEmpty={!loading && !error && fichas.length === 0}
          busqueda={busqueda}
          type="fichas"
        />

        {fichas.length > 0 && (
          <>
            <ResultsCounter
              count={fichas.length}
              busqueda={busqueda}
              hasMoreData={hasMoreData}
              type="fichas"
            />

            <IonList className="info-list">
              {fichas.map((ficha, index) => (
                <FichaItem
                  key={`${ficha.id_consulta}-${index}`}
                  ficha={ficha}
                  onView={() => onViewFicha(ficha)}
                  onEdit={() => onEditFicha(ficha)}
                  onExport={() => onExportFicha(ficha)}
                  disabled={loading}
                />
              ))}
            </IonList>

            <InfiniteScroll
              onLoadMore={onLoadMore}
              disabled={!hasMoreData}
              loadingText="Cargando más fichas..."
            />
          </>
        )}
      </div>
    </>
  );
};

export default FichasList;  