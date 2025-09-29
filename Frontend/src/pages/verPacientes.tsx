import { useState, useEffect, useCallback } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import {
  eyeOutline,
  pencilOutline,
  personOutline,
  refreshOutline,
} from "ionicons/icons";
import { PacienteData } from "../api/pacientes";
import { obtenerPacientesPaginados } from "../components/verPacientes/listaPacientes";
import ModalInfoPaciente from "../components/verPacientes/infoPaciente";
import "../styles/verPacientes.css";

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

const VerPacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<PacienteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Estados para el modal de información del paciente
  const [showPacienteInfo, setshowPacienteInfo] = useState(false);
  const [selectedPaciente, setselectedPaciente] = useState<PacienteData | null>(null);

  // Función para cargar pacientes (inicial o búsqueda)
  const handleGetPacientes = useCallback(async (resetList: boolean = true, search?: string) => {
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
  }, [currentPage]);

  // Función para manejar búsqueda con debounce
  const handleSearch = useCallback((texto: string) => {
    setBusqueda(texto);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      handleGetPacientes(true, texto.trim() || undefined);
    }, 500);
    
    setSearchTimeout(timeout);
  }, [searchTimeout, handleGetPacientes]);

  // Función para ver detalles del paciente
  const handleViewPaciente = useCallback((paciente: PacienteData) => {
    setselectedPaciente(paciente);
    setshowPacienteInfo(true);
  }, []);

  // Función para cerrar el modal - MEJORADA
  const handleClosePacienteInfo = useCallback(() => {
    setshowPacienteInfo(false);
    // Pequeño delay para evitar conflictos de estado
    setTimeout(() => {
      setselectedPaciente(null);
    }, 150);
  }, []);

  // Función para editar el paciente
  const handleEditPaciente = useCallback((paciente: PacienteData) => {
    console.log("Editar paciente:", paciente);
  }, []);

  // Función para cargar más datos (scroll infinito)
  const loadMoreData = useCallback(async (event: CustomEvent) => {
    if (hasMoreData && !loading) {
      await handleGetPacientes(false, busqueda.trim() || undefined);
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  }, [hasMoreData, loading, handleGetPacientes, busqueda]);

  // Función para manejar el refresh
  const handleRefresh = useCallback(async (event: CustomEvent) => {
    await handleGetPacientes(true, busqueda.trim() || undefined);
    event.detail.complete();
  }, [handleGetPacientes, busqueda]);

  // Cargar pacientes al montar el componente
  useEffect(() => {
    handleGetPacientes();
  }, []);

  // Limpiar timeouts al desmontar el componente
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ver pacientes</IonTitle>
          <IonButtons slot="end">
            <IonButton 
              onClick={() => handleGetPacientes(true, busqueda.trim() || undefined)} 
              disabled={loading}
            >
              <IonIcon icon={refreshOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Ver pacientes</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="pacientes-container">
          {/* Barra de búsqueda */}
          <div className="search-container">
            <IonSearchbar
              value={busqueda}
              onIonInput={(e) => handleSearch(e.detail.value!)}
              placeholder="Buscar por nombre"
              showClearButton="focus"
              className="pacientes-searchbar"
            />
          </div>
          <div>
            <div style={{ height: "25px" }}></div>
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
                    {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""} cargado{pacientes.length !== 1 ? "s" : ""}
                    {busqueda && ` para "${busqueda}"`}
                    {hasMoreData && " (desliza hacia abajo para cargar más)"}
                  </p>
                </IonText>
              </div>

              {/* Lista simple de pacientes */}
              <IonList className="pacientes-list">
                {pacientes.map((paciente, index) => (
                  <IonItem key={`${paciente.nombre}-${index}`} lines="full">
                    <IonIcon icon={personOutline} slot="start" />
                    <IonLabel>
                      <h2>{paciente.nombre}</h2>
                      <p><strong>Raza: </strong> {paciente.raza}</p>
                    </IonLabel>
                    <IonButtons>
                      <IonButton 
                        fill="clear" 
                        onClick={() => handleEditPaciente(paciente)}
                        disabled={loading}
                      >
                        <IonIcon className="icon" icon={pencilOutline} />
                      </IonButton>
                      <IonButton 
                        fill="clear" 
                        onClick={() => handleViewPaciente(paciente)}
                        disabled={loading}
                      >
                        <IonIcon className="icon" icon={eyeOutline} />
                      </IonButton>
                    </IonButtons>
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

      {/* Modal con información del paciente */}
      <ModalInfoPaciente
        isOpen={showPacienteInfo}
        onDismiss={handleClosePacienteInfo}
        paciente={selectedPaciente}
      />
    </IonPage>
  );
};

export default VerPacientes;
