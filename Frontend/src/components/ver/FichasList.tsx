import React from "react";
import { IonList, IonRefresher, IonRefresherContent } from "@ionic/react";
import { ConsultaData } from "../../api/fichas";
import SearchBar from "../common/SearchBar";
import SortDropdown from "../common/SortDropdown";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import ResultsCounter from "../ver/ResultsCounter";
import InfiniteScroll from "../common/InfiniteScroll";
import FichaItem from "../items_ver/FichaItem";
import "../../styles/ver.css";

interface FichasListProps {
  consultas: ConsultaData[];
  loading: boolean;
  error: string;
  busqueda: string;
  hasMoreData: boolean;
  sortOrder: "desc" | "asc";
  onSearch: (texto: string) => void;
  onSortOrderChange: (order: "desc" | "asc") => void;
  onRefresh: (event: CustomEvent) => Promise<void>;
  onLoadMore: (event: CustomEvent) => Promise<void>;
  onViewConsulta: (paciente: ConsultaData) => void;
  onEditConsulta: (paciente: ConsultaData) => void;
  onExportConsulta: (paciente: ConsultaData) => void;
  onRetry: () => void;
}

const FichasList: React.FC<FichasListProps> = ({
  consultas = [],
  loading,
  error,
  busqueda,
  hasMoreData,
  sortOrder,
  onSearch,
  onSortOrderChange,
  onRefresh,
  onLoadMore,
  onViewConsulta,
  onEditConsulta,
  onExportConsulta,
  onRetry,
}) => {
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

        <SortDropdown value={sortOrder} onChange={onSortOrderChange} />

        <LoadingState
          loading={loading}
          itemCount={consultas.length ? consultas.length : 0}
          type="consultas"
        />

        <ErrorState error={error} onRetry={onRetry} type="consultas" />

        <EmptyState
          isEmpty={!loading && !error && consultas.length === 0}
          busqueda={busqueda}
          type="consultas"
        />

        {consultas.length > 0 && (
          <>
            <ResultsCounter
              count={consultas.length}
              busqueda={busqueda}
              hasMoreData={hasMoreData}
              type="consultas"
            />

            <IonList className="info-list">
              {consultas.map((consulta, index) => (
                <FichaItem
                  key={`${consulta.id_consulta}-${index}`}
                  consulta={consulta}
                  onView={() => onViewConsulta(consulta)}
                  onEdit={() => onEditConsulta(consulta)}
                  onExport={() => onExportConsulta(consulta)}
                  disabled={loading}
                />
              ))}
            </IonList>

            <InfiniteScroll
              onLoadMore={onLoadMore}
              disabled={!hasMoreData}
              loadingText="Cargando más consultas..."
            />
          </>
        )}
      </div>
    </>
  );
};

export default FichasList;
