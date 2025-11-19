import React from "react";
import { IonList, IonRefresher, IonRefresherContent } from "@ionic/react";
import { TutorData } from "../../api/tutores";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import ResultsCounter from "../ver/ResultsCounter";
import TutorItem from "../items_ver/TutorItem";
import InfiniteScroll from "../common/InfiniteScroll";
// Componente: Visualizador del detalle de un tutor
interface TutoresListProps {
  tutores: TutorData[];
  loading: boolean;
  error: string;
  busqueda: string;
  hasMoreData: boolean;
  onSearch: (texto: string) => void;
  onRefresh: (event: CustomEvent) => Promise<void>;
  onLoadMore: (event: CustomEvent) => Promise<void>;
  onViewTutor: (tutor: TutorData) => void;
  onEditTutor: (tutor: TutorData) => void;
  onRetry: () => void;
}

const TutoresList: React.FC<TutoresListProps> = ({
  tutores,
  loading,
  error,
  busqueda,
  hasMoreData,
  onSearch,
  onRefresh,
  onLoadMore,
  onViewTutor,
  onEditTutor,
  onRetry,
}) => {
  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <div className="info-container">
        <LoadingState
          loading={loading}
          itemCount={tutores.length}
          type="tutores"
        />

        <ErrorState error={error} onRetry={onRetry} type="tutores" />

        <EmptyState
          isEmpty={!loading && !error && tutores.length === 0}
          busqueda={busqueda}
          type="tutores"
        />

        {tutores.length > 0 && (
          <>
            <ResultsCounter
              count={tutores.length}
              busqueda={busqueda}
              hasMoreData={hasMoreData}
              type="tutores"
            />

            <IonList className="info-list">
              {tutores.map((tutor, index) => (
                <TutorItem
                  key={`${tutor.rut}-${index}`}
                  tutor={tutor}
                  onView={() => onViewTutor(tutor)}
                  onEdit={() => onEditTutor(tutor)}
                  disabled={loading}
                />
              ))}
            </IonList>

            <InfiniteScroll
              onLoadMore={onLoadMore}
              disabled={!hasMoreData}
              loadingText="Cargando más tutores..."
            />
          </>
        )}
      </div>
    </>
  );
};

export default TutoresList;
