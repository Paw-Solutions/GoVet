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
} from "@ionic/react";
import { close, checkmark, personOutline, eyeOutline } from "ionicons/icons";
import { TutorData } from "../../api/tutores";
import { obtenerTutoresPaginados } from "../verTutores/listaTutores";
import ModalInfoTutor from "../verTutores/infoTutor";

interface Tutor {
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
  comuna: string;
  region: string;
}

interface ModalBuscarTutorProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  onTutorSelected: (tutor: Tutor) => void;
  tutorSeleccionado?: Tutor | null;
}

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

const ModalBuscarTutor: React.FC<ModalBuscarTutorProps> = ({
  isOpen,
  onDidDismiss,
  onTutorSelected,
  tutorSeleccionado,
}) => {
  // Estados exactamente iguales a verTutores
  const [tutores, setTutores] = useState<TutorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Estados específicos del modal
  const [tutorSeleccionadoTemp, setTutorSeleccionadoTemp] =
    useState<Tutor | null>(tutorSeleccionado || null);

  // Estados para el modal de información del tutor
  const [showTutorInfo, setShowTutorInfo] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<TutorData | null>(null);

  // Función para cargar tutores - EXACTAMENTE IGUAL a verTutores
  const handleGetTutores = useCallback(
    async (resetList: boolean = true, search?: string) => {
      setLoading(true);
      setError("");

      try {
        const page = resetList ? 1 : currentPage + 1;
        const data: PaginatedResponse = await obtenerTutoresPaginados(
          page,
          50,
          search
        );

        if (resetList) {
          setTutores(data.tutores);
          setCurrentPage(1);
        } else {
          setTutores((prev) => [...prev, ...data.tutores]);
          setCurrentPage(page);
        }

        setHasMoreData(data.pagination.has_next);
      } catch (error) {
        setError("Error de conexión al cargar tutores");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  // Función para manejar búsqueda - EXACTAMENTE IGUAL a verTutores
  const handleSearch = useCallback(
    (texto: string) => {
      setBusqueda(texto);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        handleGetTutores(true, texto.trim() || undefined);
      }, 500);

      setSearchTimeout(timeout);
    },
    [searchTimeout, handleGetTutores]
  );

  // Función para ver detalles del tutor - EXACTAMENTE IGUAL a verTutores
  const handleViewTutor = useCallback((tutor: TutorData) => {
    setSelectedTutor(tutor);
    setShowTutorInfo(true);
  }, []);

  // Función para cerrar el modal de información - EXACTAMENTE IGUAL a verTutores
  const handleCloseTutorInfo = useCallback(() => {
    setShowTutorInfo(false);
    setTimeout(() => {
      setSelectedTutor(null);
    }, 150);
  }, []);

  // Función para cargar más datos - EXACTAMENTE IGUAL a verTutores
  const loadMoreData = useCallback(
    async (event: CustomEvent) => {
      if (hasMoreData && !loading) {
        await handleGetTutores(false, busqueda.trim() || undefined);
      }
      (event.target as HTMLIonInfiniteScrollElement).complete();
    },
    [hasMoreData, loading, handleGetTutores, busqueda]
  );

  // Función para manejar el refresh - EXACTAMENTE IGUAL a verTutores
  const handleRefresh = useCallback(
    async (event: CustomEvent) => {
      await handleGetTutores(true, busqueda.trim() || undefined);
      event.detail.complete();
    },
    [handleGetTutores, busqueda]
  );

  // Función específica del modal para seleccionar tutor
  const handleSeleccionarTutor = (tutorData: TutorData) => {
    const tutorNormalizado: Tutor = {
      rut: tutorData.rut,
      nombre: tutorData.nombre,
      apellido:
        `${tutorData.apellido_paterno} ${tutorData.apellido_materno}`.trim(),
      telefono: tutorData.telefono || "",
      email: tutorData.email || "",
      direccion: tutorData.direccion || "",
      comuna: tutorData.comuna || "",
      region: tutorData.region || "",
    };

    setTutorSeleccionadoTemp(tutorNormalizado);
  };

  const handleConfirmarSeleccion = () => {
    if (tutorSeleccionadoTemp) {
      onTutorSelected(tutorSeleccionadoTemp);
    }
    onDidDismiss();
  };

  const handleCancelar = () => {
    setTutorSeleccionadoTemp(tutorSeleccionado || null);
    setBusqueda("");
    onDidDismiss();
  };

  // Cargar tutores al abrir el modal - IGUAL a verTutores
  useEffect(() => {
    if (isOpen) {
      handleGetTutores();
      setTutorSeleccionadoTemp(tutorSeleccionado || null);
      setBusqueda("");
    }
  }, [isOpen, tutorSeleccionado]);

  // Limpiar timeouts - IGUAL a verTutores
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCancelar}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Buscar Tutor</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={handleCancelar}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Barra de búsqueda - EXACTAMENTE IGUAL a verTutores */}
        <div style={{ padding: "16px" }}>
          <IonSearchbar
            value={busqueda}
            onIonInput={(e) => handleSearch(e.detail.value!)}
            placeholder="Buscar por nombre, apellido, RUT o email..."
            showClearButton="focus"
          />
        </div>

        {/* Mostrar tutor seleccionado temporalmente */}
        {tutorSeleccionadoTemp && (
          <div style={{ padding: "0 16px", marginBottom: "16px" }}>
            <IonText color="primary">
              <h3>Tutor seleccionado:</h3>
            </IonText>
            <IonItem lines="none" color="light">
              <IonIcon icon={personOutline} slot="start" />
              <IonLabel>
                <h2>{`${tutorSeleccionadoTemp.nombre} ${tutorSeleccionadoTemp.apellido}`}</h2>
                <p>RUT: {tutorSeleccionadoTemp.rut}</p>
                <p>Email: {tutorSeleccionadoTemp.email || "N/A"}</p>
              </IonLabel>
              <IonIcon
                icon={checkmark}
                color="success"
                size="large"
                slot="end"
              />
            </IonItem>
          </div>
        )}

        {/* Estado de carga inicial - EXACTAMENTE IGUAL a verTutores */}
        {loading && tutores.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <IonSpinner />
            <IonText>
              <p>Cargando tutores...</p>
            </IonText>
          </div>
        )}

        {/* Estado de error - EXACTAMENTE IGUAL a verTutores */}
        {error && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
            <IonButton
              fill="outline"
              onClick={() =>
                handleGetTutores(true, busqueda.trim() || undefined)
              }
            >
              Reintentar
            </IonButton>
          </div>
        )}

        {/* Lista de tutores - EXACTAMENTE IGUAL a verTutores */}
        {!loading && !error && tutores.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
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
            {/* Contador de resultados - EXACTAMENTE IGUAL a verTutores */}
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <IonText>
                <p>
                  {tutores.length} tutor{tutores.length !== 1 ? "es" : ""}{" "}
                  cargado{tutores.length !== 1 ? "s" : ""}
                  {busqueda && ` para "${busqueda}"`}
                  {hasMoreData && " (desliza hacia abajo para cargar más)"}
                </p>
              </IonText>
            </div>

            {/* Lista simple de tutores - EXACTAMENTE IGUAL a verTutores */}
            <IonList>
              {tutores.map((tutor, index) => (
                <IonItem
                  key={`${tutor.rut}-${index}`}
                  lines="full"
                  button
                  onClick={() => handleSeleccionarTutor(tutor)}
                  color={
                    tutorSeleccionadoTemp?.rut === tutor.rut
                      ? "light"
                      : undefined
                  }
                >
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel>
                    <h2>
                      {tutor.nombre} {tutor.apellido_paterno}{" "}
                      {tutor.apellido_materno}
                    </h2>
                    <p>
                      <strong>RUT:</strong> {tutor.rut}
                    </p>
                  </IonLabel>
                  <IonButtons>
                    <IonButton
                      fill="clear"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewTutor(tutor);
                      }}
                      disabled={loading}
                    >
                      <IonIcon icon={eyeOutline} />
                    </IonButton>
                    {tutorSeleccionadoTemp?.rut === tutor.rut && (
                      <IonIcon icon={checkmark} color="primary" size="large" />
                    )}
                  </IonButtons>
                </IonItem>
              ))}
            </IonList>

            {/* Scroll infinito - EXACTAMENTE IGUAL a verTutores */}
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
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={handleCancelar}>
              Cancelar
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              fill="solid"
              onClick={handleConfirmarSeleccion}
              disabled={!tutorSeleccionadoTemp}
            >
              Confirmar Selección
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>

      {/* Modal con información del tutor - EXACTAMENTE IGUAL a verTutores */}
      <ModalInfoTutor
        isOpen={showTutorInfo}
        onDismiss={handleCloseTutorInfo}
        tutor={selectedTutor}
      />
    </IonModal>
  );
};

export default ModalBuscarTutor;
