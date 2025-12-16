import React from "react";
import { IonList, IonRefresher, IonRefresherContent } from "@ionic/react";
import { PacienteData } from "../../api/pacientes";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import ResultsCounter from "../ver/ResultsCounter";
import InfiniteScroll from "../common/InfiniteScroll";
import PacienteItem from "../items_ver/PacienteItem";
import "../../styles/ver.css";

interface CertificadosPacientesListProps {
  pacientes: PacienteData[];
  loading: boolean;
  error: string;
  busqueda: string;
  hasMoreData: boolean;
  tipoCertificado: string;
  onSearch: (texto: string) => void;
  onRefresh: (event: CustomEvent) => Promise<void>;
  onLoadMore: (event: CustomEvent) => Promise<void>;
  onViewPaciente: (paciente: PacienteData) => void;
  onGenerarCertificado: (paciente: PacienteData) => void;
  onRetry: () => void;
}

const CertificadosPacientesList: React.FC<CertificadosPacientesListProps> = ({
  pacientes,
  loading,
  error,
  busqueda,
  hasMoreData,
  tipoCertificado,
  onSearch,
  onRefresh,
  onLoadMore,
  onViewPaciente,
  onGenerarCertificado,
  onRetry,
}) => {
  const getTipoCertificadoText = (tipo: string) => {
    switch (tipo) {
      case "transporte":
        return "Certificado de Transporte";
      case "consentimiento":
        return "Consentimiento Informado";
      case "examenes":
        return "Orden de Exámenes";
      case "receta":
        return "Receta Médica";
      default:
        return "Certificado";
    }
  };

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <div className="info-container">
        <LoadingState
          loading={loading}
          itemCount={pacientes.length}
          type="pacientes"
        />

        <ErrorState error={error} onRetry={onRetry} type="pacientes" />

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
                  onEdit={() => onGenerarCertificado(paciente)}
                  disabled={loading}
                  editButtonText={`Generar ${getTipoCertificadoText(
                    tipoCertificado
                  )}`}
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

export default CertificadosPacientesList;
