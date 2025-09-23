import { useState, useEffect } from "react";
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
  personOutline,
  refreshOutline,
} from "ionicons/icons";
import { TutorData } from "../api/tutores";
import { obtenerTutoresPaginados } from "../components/listaTutores";
import "../styles/verTutores.css";

interface PaginatedResponse {
  tutores: TutorData[];
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

const VerTutores: React.FC = () => {
  const [tutores, setTutores] = useState<TutorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Función para cargar tutores (inicial o búsqueda)
  const handleGetTutores = async (resetList: boolean = true, search?: string) => {
    setLoading(true);
    setError("");

    try {
      const page = resetList ? 1 : currentPage + 1;
      const data: PaginatedResponse = await obtenerTutoresPaginados(page, 50, search);
      
      if (resetList) {
        setTutores(data.tutores);
        setCurrentPage(1);
      } else {
        setTutores(prev => [...prev, ...data.tutores]);
        setCurrentPage(page);
      }
      
      setHasMoreData(data.pagination.has_next);
    } catch (error) {
      setError("Error de conexión al cargar tutores");
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
      handleGetTutores(true, texto.trim() || undefined);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Función para cargar más datos (scroll infinito)
  const loadMoreData = async (event: CustomEvent) => {
    if (hasMoreData && !loading) {
      await handleGetTutores(false, busqueda.trim() || undefined);
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  };

  // Función para manejar el refresh
  const handleRefresh = async (event: CustomEvent) => {
    await handleGetTutores(true, busqueda.trim() || undefined);
    event.detail.complete();
  };

  // Cargar tutores al montar el componente
  useEffect(() => {
    handleGetTutores();
    
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, []);

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ver Tutores</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => handleGetTutores(true, busqueda.trim() || undefined)} disabled={loading}>
              <IonIcon icon={refreshOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Ver Tutores</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="tutores-container">
          {/* Barra de búsqueda */}
          <div className="search-container">
            <IonSearchbar
              value={busqueda}
              onIonInput={(e) => handleSearch(e.detail.value!)}
              placeholder="Buscar por nombre, apellido, RUT o email..."
              showClearButton="focus"
              className="tutores-searchbar"
            />
          </div>

          {/* Estado de carga inicial */}
          {loading && tutores.length === 0 && (
            <div className="loading-container">
              <IonSpinner />
              <IonText>
                <p>Cargando tutores...</p>
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
                onClick={() => handleGetTutores(true, busqueda.trim() || undefined)}
                className="retry-button"
              >
                <IonIcon icon={refreshOutline} slot="start" />
                Reintentar
              </IonButton>
            </div>
          )}

          {/* Lista infinita de tutores */}
          {!loading && !error && tutores.length === 0 ? (
            <div className="no-results">
              <IonText>
                <h3>No se encontraron tutores</h3>
                <p>
                  {busqueda
                    ? `No hay tutores que coincidan con "${busqueda}"`
                    : "No hay tutores registrados aún"}
                </p>
              </IonText>
            </div>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="results-counter">
                <IonText>
                  <p>
                    {tutores.length} tutor{tutores.length !== 1 ? "es" : ""} cargado{tutores.length !== 1 ? "s" : ""}
                    {busqueda && ` para "${busqueda}"`}
                    {hasMoreData && " (desliza hacia abajo para cargar más)"}
                  </p>
                </IonText>
              </div>

              {/* Lista simple de tutores */}
              <IonList className="tutores-list">
                {tutores.map((tutor, index) => (
                  <IonItem key={`${tutor.rut}-${index}`} button lines="full">
                    <IonIcon icon={personOutline} slot="start" />
                    <IonLabel>
                      <h2>{tutor.nombre} {tutor.apellido_paterno} {tutor.apellido_materno}</h2>
                      <p><strong>RUT:</strong> {tutor.rut}</p>
                      {tutor.email && <p><strong>Email:</strong> {tutor.email}</p>}
                      {tutor.comuna && tutor.region && (
                        <p><strong>Ubicación:</strong> {tutor.comuna}, {tutor.region}</p>
                      )}
                    </IonLabel>
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
                  loadingText="Cargando más tutores..."
                />
              </IonInfiniteScroll>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VerTutores;
