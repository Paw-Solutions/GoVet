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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import {
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  refreshOutline,
} from "ionicons/icons";
import { obtenerTutores } from "../api/tutores";
import "../styles/verTutores.css";

interface Tutor {
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  direccion?: string;
  telefono?: number;
  celular?: number;
  comuna?: string;
  region?: string;
  email?: string;
}

const VerTutores: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL; // usa tu variable de entorno
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [tutoresFiltrados, setTutoresFiltrados] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const handleGetTutores = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await obtenerTutores();
      console.log("Iniciando petición para obtener tutores...");
      setTutores(data);
      setTutoresFiltrados(data);
    } catch (error) {
        setError("Error de conexión al cargar tutores");
        console.error("Error:", error);
    } finally {
        setLoading(false);
    }
  };

  // Función para filtrar tutores
  const filtrarTutores = (texto: string) => {
    setBusqueda(texto);
    if (!texto.trim()) {
      setTutoresFiltrados(tutores);
      return;
    }

    const textoLower = texto.toLowerCase();
    const filtrados = tutores.filter((tutor) => {
      const nombreCompleto = `${tutor.nombre} ${tutor.apellido_paterno} ${
        tutor.apellido_materno || ""
      }`.toLowerCase();
      const rut = tutor.rut.toLowerCase();
      const email = tutor.email?.toLowerCase() || "";
      const comuna = tutor.comuna?.toLowerCase() || "";

      return (
        nombreCompleto.includes(textoLower) ||
        rut.includes(textoLower) ||
        email.includes(textoLower) ||
        comuna.includes(textoLower)
      );
    });

    setTutoresFiltrados(filtrados);
  };

  // Función para manejar el refresh
  const handleRefresh = async (event: CustomEvent) => {
    await handleGetTutores();
    event.detail.complete();
  };

  // Cargar tutores al montar el componente
  useEffect(() => {
    handleGetTutores();
  }, []);

  // Función para formatear el teléfono
  const formatearTelefono = (telefono?: number) => {
    if (!telefono) return "No disponible";
    return telefono.toString();
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ver Tutores</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleGetTutores} disabled={loading}>
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
              onIonInput={(e) => filtrarTutores(e.detail.value!)}
              placeholder="Buscar por nombre, RUT o comuna..."
              showClearButton="focus"
              className="tutores-searchbar"
            />
          </div>

          {/* Estado de carga */}
          {loading && (
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
                onClick={handleGetTutores}
                className="retry-button"
              >
                <IonIcon icon={refreshOutline} slot="start" />
                Reintentar
              </IonButton>
            </div>
          )}

          {/* Lista de tutores */}
          {!loading && !error && (
            <>
              {/* Contador de resultados */}
              <div className="results-counter">
                <IonText>
                  <p>
                    {tutoresFiltrados.length} tutor
                    {tutoresFiltrados.length !== 1 ? "es" : ""}
                    {busqueda &&
                      ` encontrado${
                        tutoresFiltrados.length !== 1 ? "s" : ""
                      } para "${busqueda}"`}
                  </p>
                </IonText>
              </div>

              {/* Tarjetas de tutores */}
              {tutoresFiltrados.length > 0 ? (
                <IonList className="tutores-list">
                  {tutoresFiltrados.map((tutor) => (
                    <IonCard key={tutor.rut} className="tutor-card">
                      <IonCardHeader className="tutor-card-header">
                        <IonCardTitle className="tutor-name">
                          <IonIcon
                            icon={personOutline}
                            className="tutor-icon"
                          />
                          {tutor.nombre} {tutor.apellido_paterno}{" "}
                          {tutor.apellido_materno}
                        </IonCardTitle>
                      </IonCardHeader>

                      <IonCardContent className="tutor-card-content">
                        <IonGrid>
                          <IonRow>
                            <IonCol size="12" size-md="6">
                              <div className="tutor-info-item">
                                <strong>RUT:</strong> {tutor.rut}
                              </div>
                              {tutor.email && (
                                <div className="tutor-info-item">
                                  <IonIcon
                                    icon={mailOutline}
                                    className="info-icon"
                                  />
                                  <strong>Email:</strong> {tutor.email}
                                </div>
                              )}
                              {tutor.telefono && (
                                <div className="tutor-info-item">
                                  <IonIcon
                                    icon={callOutline}
                                    className="info-icon"
                                  />
                                  <strong>Teléfono:</strong>{" "}
                                  {formatearTelefono(tutor.telefono)}
                                </div>
                              )}
                            </IonCol>
                            <IonCol size="12" size-md="6">
                              {tutor.celular && (
                                <div className="tutor-info-item">
                                  <IonIcon
                                    icon={callOutline}
                                    className="info-icon"
                                  />
                                  <strong>Celular:</strong>{" "}
                                  {formatearTelefono(tutor.celular)}
                                </div>
                              )}
                              {tutor.direccion && (
                                <div className="tutor-info-item">
                                  <IonIcon
                                    icon={locationOutline}
                                    className="info-icon"
                                  />
                                  <strong>Dirección:</strong> {tutor.direccion}
                                </div>
                              )}
                              {tutor.comuna && tutor.region && (
                                <div className="tutor-info-item">
                                  <IonIcon
                                    icon={locationOutline}
                                    className="info-icon"
                                  />
                                  <strong>Ubicación:</strong> {tutor.comuna},{" "}
                                  {tutor.region}
                                </div>
                              )}
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </IonList>
              ) : (
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
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VerTutores;
