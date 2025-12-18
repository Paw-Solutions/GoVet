import React, { useState, useEffect, useCallback } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonFooter,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTextarea,
} from "@ionic/react";
import { close, checkmark, paw, eye } from "ionicons/icons";
import { PacienteData } from "../../api/pacientes";
import { obtenerPacientesPaginados } from "../../api/pacientes";
import ModalInfoPaciente from "../verPacientes/infoPaciente";
import "../../styles/modalEscogerPaciente.css";
import { useAuth } from "../../hooks/useAuth";

interface Paciente {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  edad: number;
  peso: number;
  tutor_rut: string;
  tutor_nombre?: string;
}

interface ModalEscogerPacienteProps {
  isOpen: boolean;
  onDidDismiss?: () => void;
  onPacienteSelected?: (paciente: PacienteData) => void; // <-- Cambia aquí
  pacienteSeleccionado?: PacienteData | null; // <-- Cambia aquí
  motivoConsulta?: string;
  onMotivoChange?: (motivo: string) => void;
  hideMotivo?: boolean; // Ocultar campo de motivo de consulta
}

interface PaginatedResponse {
  pacientes: PacienteData[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
}

const ModalEscogerPaciente: React.FC<ModalEscogerPacienteProps> = ({
  isOpen,
  onDidDismiss,
  onPacienteSelected,
  pacienteSeleccionado,
  motivoConsulta = "",
  onMotivoChange,
  hideMotivo = false,
}) => {
  const { idToken } = useAuth();
  // Estados exactamente iguales a verPacientes
  const [pacientes, setPacientes] = useState<PacienteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Estados específicos del modal
  const [pacienteSeleccionadoTemp, setPacienteSeleccionadoTemp] =
    useState<PacienteData | null>(pacienteSeleccionado || null);
  const [motivoTemp, setMotivoTemp] = useState<string>(motivoConsulta);

  // Estados para el modal de información del paciente
  const [showPacienteInfo, setShowPacienteInfo] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteData | null>(
    null
  );

  // Función para cargar pacientes
  const handleGetPacientes = useCallback(
    async (resetList: boolean = true, search?: string) => {
      setLoading(true);
      setError("");

      try {
        const page = resetList ? 1 : currentPage + 1;
        const data: PaginatedResponse = await obtenerPacientesPaginados(
          page,
          50,
          search,
          idToken
        );

        if (resetList) {
          setPacientes(data.pacientes);
          setCurrentPage(1);
        } else {
          setPacientes((prev) => [...prev, ...data.pacientes]);
          setCurrentPage(page);
        }

        setHasMoreData(data.pagination.has_next);
      } catch (error) {
        setError("Error de conexión al cargar pacientes");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  // Función para manejar búsqueda
  const handleSearch = useCallback(
    (texto: string) => {
      setBusqueda(texto);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        handleGetPacientes(true, texto.trim() || undefined);
      }, 500);

      setSearchTimeout(timeout);
    },
    [searchTimeout, handleGetPacientes]
  );

  // Función para ver detalles del paciente
  const handleViewPaciente = useCallback((paciente: PacienteData) => {
    setSelectedPaciente(paciente);
    setShowPacienteInfo(true);
  }, []);

  // Función para cerrar el modal de información
  const handleClosePacienteInfo = useCallback(() => {
    setShowPacienteInfo(false);
    setTimeout(() => {
      setSelectedPaciente(null);
    }, 150);
  }, []);

  // Función para cargar más datos
  const loadMoreData = useCallback(
    async (event: CustomEvent) => {
      if (hasMoreData && !loading) {
        await handleGetPacientes(false, busqueda.trim() || undefined);
      }
      (event.target as HTMLIonInfiniteScrollElement).complete();
    },
    [hasMoreData, loading, handleGetPacientes, busqueda]
  );

  // Función para manejar el refresh
  const handleRefresh = useCallback(
    async (event: CustomEvent) => {
      await handleGetPacientes(true, busqueda.trim() || undefined);
      event.detail.complete();
    },
    [handleGetPacientes, busqueda]
  );

  // Función específica del modal para seleccionar paciente
  const handleSeleccionarPaciente = (pacienteData: PacienteData) => {
    setPacienteSeleccionadoTemp(pacienteData);
  };

  const handleCancelar = () => {
    setPacienteSeleccionadoTemp(pacienteSeleccionado || null);
    setMotivoTemp(motivoConsulta);
    setBusqueda("");
    if (onDidDismiss && typeof onDidDismiss === "function") {
      onDidDismiss();
    }
  };

  const handleConfirmarSeleccion = () => {
    const motivoValido = hideMotivo || motivoTemp.trim();
    if (pacienteSeleccionadoTemp && motivoValido) {
      if (onPacienteSelected && typeof onPacienteSelected === "function") {
        onPacienteSelected(pacienteSeleccionadoTemp); // <-- Retorna el objeto completo
      }
      if (onMotivoChange && typeof onMotivoChange === "function") {
        onMotivoChange(motivoTemp.trim());
      }
      if (onDidDismiss && typeof onDidDismiss === "function") {
        onDidDismiss();
      }
    }
  };

  const handleCerrarModal = () => {
    setPacienteSeleccionadoTemp(pacienteSeleccionado || null);
    setMotivoTemp(motivoConsulta);
    setBusqueda("");

    if (onDidDismiss && typeof onDidDismiss === "function") {
      onDidDismiss();
    }

    const modal = document.querySelector(
      "ion-modal.modal-escoger-paciente"
    ) as any;
    if (modal && modal.dismiss) {
      modal.dismiss();
    }
  };

  // Cargar pacientes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      handleGetPacientes();
      setPacienteSeleccionadoTemp(pacienteSeleccionado || null);
      setMotivoTemp(motivoConsulta);
      setBusqueda("");
    }
  }, [isOpen, pacienteSeleccionado, motivoConsulta]);

  // Limpiar timeouts
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleCancelar}
      className="modal-escoger-paciente"
    >
      <IonHeader className="modal-header">
        <IonToolbar>
          <IonTitle>Escoger Paciente</IonTitle>
          <IonButtons slot="end">
            <IonButton
              fill="clear"
              onClick={handleCerrarModal}
              aria-label="Cerrar modal"
            >
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Barra de búsqueda sticky */}
        <div className="modal-search-container">
          <IonSearchbar
            value={busqueda}
            onIonInput={(e) => handleSearch(e.detail.value!)}
            placeholder="Buscar por nombre, especie, raza o tutor..."
            showClearButton="focus"
          />
        </div>

        {/* Mostrar paciente seleccionado temporalmente - STICKY */}
        {pacienteSeleccionadoTemp && (
          <div className="modal-selected-paciente">
            <IonText color="primary">
              <h3>Paciente seleccionado:</h3>
            </IonText>
            <IonItem className="modal-selected-item" lines="none">
              <IonIcon icon={paw} slot="start" color="primary" />
              <IonLabel>
                <h2>{pacienteSeleccionadoTemp.nombre}</h2>
                <p>Especie: {pacienteSeleccionadoTemp.especie}</p>
                <p>
                  Tutor:{" "}
                  {pacienteSeleccionadoTemp.tutor
                    ? pacienteSeleccionadoTemp.tutor.nombre ||
                      pacienteSeleccionadoTemp.tutor.rut
                    : "N/A"}
                </p>
              </IonLabel>
              <IonIcon
                icon={checkmark}
                color="success"
                size="large"
                slot="end"
              />
            </IonItem>

            {/* Campo de motivo de consulta */}
            {!hideMotivo && (
              <IonItem lines="none" style={{ marginTop: "12px" }}>
                <IonTextarea
                  label="Motivo de la Consulta"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Describa el motivo de la consulta"
                  rows={4}
                  value={motivoTemp}
                  onIonChange={(e) => setMotivoTemp(e.detail.value || "")}
                />
              </IonItem>
            )}
          </div>
        )}

        {/* Estado de carga inicial */}
        {loading && pacientes.length === 0 && (
          <div className="modal-loading-state">
            <IonSpinner name="crescent" color="primary" />
            <p>Cargando pacientes...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="modal-error-state">
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
            <IonButton
              className="modal-retry-button"
              fill="outline"
              onClick={() =>
                handleGetPacientes(true, busqueda.trim() || undefined)
              }
            >
              Reintentar
            </IonButton>
          </div>
        )}

        {/* Lista de pacientes */}
        {!loading && !error && pacientes.length === 0 ? (
          <div className="modal-empty-state">
            <h3>No se encontraron pacientes</h3>
            <p>
              {busqueda
                ? `No hay pacientes que coincidan con "${busqueda}"`
                : "No hay pacientes registrados aún"}
            </p>
          </div>
        ) : (
          <>
            {/* Contador de resultados */}
            <div className="modal-results-counter">
              <p>
                {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""}{" "}
                cargado
                {pacientes.length !== 1 ? "s" : ""}
                {busqueda && ` para "${busqueda}"`}
                {hasMoreData && " (desliza hacia abajo para cargar más)"}
              </p>
            </div>

            {/* Lista simple de pacientes */}
            <IonList
              className={`modal-pacientes-list ${
                pacienteSeleccionadoTemp ? "with-selected-paciente" : ""
              }`}
            >
              {pacientes.map((paciente, index) => {
                const isSelected =
                  pacienteSeleccionadoTemp?.id_paciente ===
                  paciente.id_paciente;

                return (
                  <IonItem
                    key={`${paciente.id_paciente}-${index}`}
                    className={`modal-paciente-item ${
                      isSelected ? "selected" : ""
                    }`}
                    lines="none"
                    button
                    onClick={() => handleSeleccionarPaciente(paciente)}
                  >
                    <IonIcon
                      icon={paw}
                      slot="start"
                      color={isSelected ? "primary" : "medium"}
                    />
                    <IonLabel>
                      <h2>{paciente.nombre}</h2>
                      <p>
                        <strong>Especie:</strong> {paciente.especie || "N/A"} |{" "}
                        <strong>Raza:</strong> {paciente.raza || "N/A"}
                      </p>
                      <p>
                        <strong>Tutor:</strong>{" "}
                        {paciente.tutor
                          ? `${paciente.tutor.nombre || ""} ${
                              paciente.tutor.apellido_paterno || ""
                            }`.trim() || paciente.tutor.rut
                          : "N/A"}
                      </p>
                    </IonLabel>
                    <IonButtons>
                      <IonButton
                        fill="clear"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPaciente(paciente);
                        }}
                        disabled={loading}
                      >
                        <IonIcon icon={eye} />
                      </IonButton>
                      {isSelected && (
                        <IonIcon
                          icon={checkmark}
                          color="primary"
                          size="large"
                        />
                      )}
                    </IonButtons>
                  </IonItem>
                );
              })}
            </IonList>

            {/* Scroll infinito */}
            <IonInfiniteScroll
              onIonInfinite={loadMoreData}
              threshold="100px"
              disabled={!hasMoreData}
              className="modal-infinite-scroll"
            >
              <IonInfiniteScrollContent
                loadingSpinner="bubbles"
                loadingText="Cargando más pacientes..."
              />
            </IonInfiniteScroll>
          </>
        )}
      </IonContent>

      <IonFooter className="modal-footer">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={handleCerrarModal}>
              Cancelar
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              fill="solid"
              onClick={handleConfirmarSeleccion}
              disabled={
                !pacienteSeleccionadoTemp || (!hideMotivo && !motivoTemp.trim())
              }
            >
              Confirmar Selección
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>

      {/* Modal con información del paciente */}
      <ModalInfoPaciente
        isOpen={showPacienteInfo}
        onDismiss={handleClosePacienteInfo}
        paciente={selectedPaciente}
      />
    </IonModal>
  );
};

export default ModalEscogerPaciente;
