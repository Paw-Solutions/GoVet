import { useState, useEffect } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import {
  pawOutline,
  refreshOutline,
  closeOutline,
  checkmarkOutline,
} from "ionicons/icons";
import { PacienteData, PaginatedResponse } from "../api/pacientes";
import { obtenerPacientesPaginados } from '../api/pacientes';
import "../styles/escogerPaciente.css";
import "../styles/main.css"

interface ModalEscogerPacienteProps {
  isOpen: boolean;
  onDismiss: () => void;
  onPacienteSelected: (paciente: PacienteData) => void;
}

const ModalEscogerPaciente: React.FC<ModalEscogerPacienteProps> = ({
  isOpen,
  onDismiss,
  onPacienteSelected,
}) => {
  const [pacientes, setPacientes] = useState<PacienteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteData | null>(null);

  // Función para cargar pacientes (inicial o búsqueda)
  const handleGetPacientes = async (resetList: boolean = true, search?: string) => {
    setLoading(true);
    setError("");

    try {
      const page = resetList ? 1 : currentPage + 1;
      const data: PaginatedResponse = await obtenerPacientesPaginados(page, 50, search);

      if (resetList) {
        setPacientes(data.pacientes);
        setCurrentPage(1);
      } else {
        setPacientes(prev => [...prev, ...data.pacientes]);
        setCurrentPage(page);
      }
      
      setHasMoreData(data.pagination.has_next);
    } catch (error) {
      setError("Error de conexión al cargar pacientes");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar búsqueda con debounce
  const handleSearch = (texto: string) => {
    setBusqueda(texto);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      handleGetPacientes(true, texto.trim() || undefined);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Función para cargar más datos (scroll infinito)
  const loadMoreData = async (event: CustomEvent) => {
    if (hasMoreData && !loading) {
      await handleGetPacientes(false, busqueda.trim() || undefined);
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  };

  // Función para manejar el refresh
  const handleRefresh = async (event: CustomEvent) => {
    await handleGetPacientes(true, busqueda.trim() || undefined);
    event.detail.complete();
  };

  // Función para seleccionar paciente
  const handleSelectPaciente = (paciente: PacienteData) => {
    setSelectedPaciente(paciente);
  };

  // Función para confirmar selección
  const handleConfirmSelection = () => {
    if (selectedPaciente) {
      onPacienteSelected(selectedPaciente);
      handleCloseModal();
    }
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setSelectedPaciente(null);
    setBusqueda("");
    setPacientes([]);
    setCurrentPage(1);
    setHasMoreData(true);
    onDismiss();
  };

  // Cargar pacientes cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      handleGetPacientes();
    }
    
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [isOpen]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCloseModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Seleccionar Paciente</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={handleCloseModal}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="pacientes-container">
          {/* Barra de búsqueda */}
          <div className="search-container">
            <IonSearchbar
              value={busqueda}
              onIonInput={(e) => handleSearch(e.detail.value!)}
              placeholder="Buscar por nombre, especie, raza..."
              showClearButton="focus"
              className="pacientes-searchbar"
              style={{
                position: "fixed",
                top: "55px",
                zIndex: 1000,
              }}
            />
          </div>
          {/* Espacio para la barra de búsqueda fija */}
          <div>
            <div style={{ height: "35px" }}></div>
          </div>
          {/* Estado de carga inicial */}
          {loading && pacientes.length === 0 && (
            <div className="loading-container">
              <IonSpinner />
              <IonText>
                <p>Cargando pacientes...</p>
              </IonText>
            </div>
          )}

          {/* Estado de error */}
          {error && (
            <div className="error-container">
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
              <IonButton
                fill="outline"
                onClick={() => handleGetPacientes(true, busqueda.trim() || undefined)}
                className="retry-button"
              >
                <IonIcon icon={refreshOutline} slot="start" />
                Reintentar
              </IonButton>
            </div>
          )}

          {/* Lista infinita de pacientes */}
          {!loading && !error && pacientes.length === 0 ? (
            <div className="no-results">
              <IonText>
                <h3>No se encontraron pacientes</h3>
                <p>
                  {busqueda
                    ? `No hay pacientes que coincidan con "${busqueda}"`
                    : "No hay pacientes registrados aún"}
                </p>
              </IonText>
            </div>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="results-counter">
                <IonText>
                  <p>
                    {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""} encontrado{pacientes.length !== 1 ? "s" : ""}
                    {busqueda && ` para "${busqueda}"`}
                    {hasMoreData && " (desliza hacia abajo para cargar más)"}
                  </p>
                </IonText>
              </div>
              <IonButton 
                onClick={handleConfirmSelection} 
                disabled={!selectedPaciente}
                color="tertiary"
                style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 1001}}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Seleccionar
              </IonButton>
              {/* Lista simple de pacientes */}
              <IonList className="pacientes-list">
                {pacientes.map((paciente, index) => (
                  <IonItem 
                    key={`${paciente.id_paciente}-${index}`} 
                    button 
                    lines="full"
                    onClick={() => handleSelectPaciente(paciente)}
                    color={selectedPaciente?.id_paciente === paciente.id_paciente ? 'primary' : undefined}
                  >
                    <IonIcon 
                      icon={pawOutline} 
                      slot="start" 
                      color={selectedPaciente?.id_paciente === paciente.id_paciente ? 'light' : undefined}
                    />
                    <IonLabel>
                      <h2>{paciente.nombre}</h2>
                      {paciente.especie && <p><strong>Especie:</strong> {paciente.especie}</p>}
                      {paciente.raza && <p><strong>Raza:</strong> {paciente.raza}</p>}
                      {paciente.color && <p><strong>Color:</strong> {paciente.color}</p>}
                      {paciente.tutor?.nombre ? (
                        <p><strong>Tutor:</strong> {paciente.tutor.nombre} {paciente.tutor.apellido_paterno}</p>
                      ) : (
                        <p><strong>Tutor:</strong> Sin tutor asignado</p>
                      )}
                    </IonLabel>
                    {selectedPaciente?.id_paciente === paciente.id_paciente && (
                      <IonIcon icon={checkmarkOutline} slot="end" color="light" />
                    )}
                  </IonItem>
                ))}
              </IonList>

              {/* Scroll infinito */}
              <IonInfiniteScroll
                onIonInfinite={loadMoreData}
                threshold="100px"
                disabled={!hasMoreData}
              >
                <IonInfiniteScrollContent
                  loadingSpinner="bubbles"
                  loadingText="Cargando más pacientes..."
                />
              </IonInfiniteScroll>
            </>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalEscogerPaciente;
