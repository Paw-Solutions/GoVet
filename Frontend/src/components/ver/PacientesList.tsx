import React from "react";
import {
  IonList,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { PacienteData } from "../../api/pacientes";
import SearchBar from "../common/SearchBar";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import ResultsCounter from "../ver/ResultsCounter";
import InfiniteScroll from "../common/InfiniteScroll";
import PacienteItem from "../items_ver/PacienteItem";
import '../../styles/ver.css';

interface PacientesListProps {
  pacientes: PacienteData[];
  loading: boolean;
  error: string;
  busqueda: string;
  hasMoreData: boolean;
  onSearch: (texto: string) => void;
  onRefresh: (event: CustomEvent) => Promise<void>;
  onLoadMore: (event: CustomEvent) => Promise<void>;
  onViewPaciente: (paciente: PacienteData) => void;
  onEditPaciente: (paciente: PacienteData) => void;
  onRetry: () => void;
}

const PacientesList: React.FC<PacientesListProps> = ({
  pacientes,
  loading,
  error,
  busqueda,
  hasMoreData,
  onSearch,
  onRefresh,
  onLoadMore,
  onViewPaciente,
  onEditPaciente,
  onRetry
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
          placeholder="Buscar por nombre, raza o especie..."
          className="searchbar"
        />
        
        <LoadingState loading={loading} itemCount={pacientes.length} type="pacientes" />
        
        <ErrorState 
          error={error} 
          onRetry={onRetry} 
          type="pacientes" 
        />

        <EmptyState
          isEmpty={!loading && !error && pacientes.length === 0}
          busqueda={busqueda}
          type="pacientes"
        />

        {pacientes.length > 0 && (
          <>
            <ResultsCounter
              count={pacientes.length}
              busqueda={busqueda}
              hasMoreData={hasMoreData}
              type="pacientes"
            />

            <IonList className="info-list">
              {pacientes.map((paciente, index) => (
                <PacienteItem
                  key={`${paciente.id_paciente}-${index}`}
                  paciente={paciente}
                  onView={() => onViewPaciente(paciente)}
                  onEdit={() => onEditPaciente(paciente)}
                  disabled={loading}
                />
              ))}
            </IonList>

            <InfiniteScroll
              onLoadMore={onLoadMore}
              disabled={!hasMoreData}
              loadingText="Cargando más pacientes..."
            />
          </>
        )}
      </div>
    </>
  );
};

export default PacientesList;