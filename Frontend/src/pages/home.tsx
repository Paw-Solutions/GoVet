import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonSpinner,
  IonText,
  IonFooter,
  IonNote,
} from "@ionic/react";
import {
  add,
  addOutline,
  logoApple,
  pawOutline,
  personAddOutline,
  settingsSharp,
  timeOutline,
  calendarOutline,
  locationOutline,
  personOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import BotonAnadir from "../components/BotonAnadir";
import CajaVacunas from "../components/vacunas/cajaVacunas";
import ModalDetalleCita from "../components/calendario/ModalDetalleCita";
import { getEventsDay, CalendarEvent } from "../api/calendario";

import "../styles/home.css";

const Home: React.FC = () => {
  const history = useHistory();
  const API_URL = import.meta.env.VITE_API_URL || "/api";

  // Estados para citas del día
  const [citasHoy, setCitasHoy] = useState<CalendarEvent[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);
  const [errorCitas, setErrorCitas] = useState("");

  // Estado para el modal de detalles
  const [citaSeleccionada, setCitaSeleccionada] =
    useState<CalendarEvent | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);

  // Función para cargar las citas del día
  const cargarCitasDelDia = async () => {
    try {
      setLoadingCitas(true);
      setErrorCitas("");

      // Obtener la fecha de hoy en formato YYYY-MM-DD
      const hoy = new Date();
      const fechaHoy = hoy.toISOString().split("T")[0];

      const eventos = await getEventsDay(fechaHoy);

      // Ordenar por hora de inicio
      const eventosOrdenados = eventos.sort(
        (a, b) =>
          new Date(a.start.dateTime).getTime() -
          new Date(b.start.dateTime).getTime()
      );

      setCitasHoy(eventosOrdenados);
    } catch (error) {
      console.error("Error cargando citas del día:", error);
      setErrorCitas("Error al cargar las citas");
    } finally {
      setLoadingCitas(false);
    }
  };

  // Cargar citas al montar el componente
  useEffect(() => {
    cargarCitasDelDia();
  }, []);

  // Manejador al hacer click en una cita
  const handleVerDetalleCita = (cita: CalendarEvent) => {
    setCitaSeleccionada(cita);
    setMostrarModalDetalle(true);
  };

  // Manejador para cerrar modal
  const handleCerrarModal = () => {
    setMostrarModalDetalle(false);
    setCitaSeleccionada(null);
    // Recargar citas por si hubo cambios
    cargarCitasDelDia();
  };

  // Función para formatear la hora
  const formatearHora = (dateTimeString: string) => {
    const fecha = new Date(dateTimeString);
    return fecha.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para extraer el nombre del paciente de la descripción o summary
  const obtenerNombrePaciente = (evento: CalendarEvent) => {
    // Intentar extraer del campo description
    if (evento.description) {
      const match = evento.description.match(/Paciente:\s*([^\n]+)/i);
      if (match) return match[1].trim();
    }
    // Si no, usar el summary
    return evento.summary || "Paciente no especificado";
  };

  // Función para extraer el nombre del tutor
  const obtenerNombreTutor = (evento: CalendarEvent) => {
    if (evento.description) {
      const match = evento.description.match(/Tutor:\s*([^\n]+)/i);
      if (match) return match[1].trim();
    }
    return "Tutor no especificado";
  };

  // Función para extraer el motivo
  const obtenerMotivo = (evento: CalendarEvent) => {
    if (evento.description) {
      const match = evento.description.match(/Motivo:\s*([^\n]+)/i);
      if (match) return match[1].trim();
    }
    return "Sin motivo especificado";
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inicio</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          {/* Recuadro de citas del día */}
          <IonRow>
            <IonCol>
              <IonCard className="card-citas-dia">
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon
                      icon={calendarOutline}
                      style={{ marginRight: "8px" }}
                    />
                    Citas de Hoy
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  {loadingCitas ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <IonSpinner />
                      <IonText>
                        <p>Cargando citas...</p>
                      </IonText>
                    </div>
                  ) : errorCitas ? (
                    <IonText color="danger">
                      <p>{errorCitas}</p>
                    </IonText>
                  ) : citasHoy.length === 0 ? (
                    <IonText color="medium">
                      <p>No hay citas programadas para hoy</p>
                    </IonText>
                  ) : (
                    <IonList>
                      {citasHoy.map((cita) => (
                        <IonItem
                          key={cita.id}
                          button
                          detail={true}
                          onClick={() => handleVerDetalleCita(cita)}
                          lines="inset"
                        >
                          <IonLabel>
                            <h2>
                              {formatearHora(cita.start.dateTime)} -{" "}
                              {obtenerNombrePaciente(cita)}
                            </h2>
                            <h3>
                              <IonIcon
                                icon={personOutline}
                                style={{
                                  fontSize: "0.9em",
                                  marginRight: "4px",
                                }}
                              />
                              Tutor: {obtenerNombreTutor(cita)}
                            </h3>
                            {cita.location && (
                              <p
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  marginTop: "4px",
                                }}
                              >
                                <IonIcon
                                  icon={locationOutline}
                                  style={{ fontSize: "0.9em" }}
                                />
                                {cita.location}
                              </p>
                            )}
                            <IonNote
                              color="medium"
                              style={{ display: "block", marginTop: "4px" }}
                            >
                              Motivo: {obtenerMotivo(cita)}
                            </IonNote>
                          </IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  )}

                  {/* Botón para actualizar la lista */}
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={cargarCitasDelDia}
                    style={{ marginTop: "0.625rem" }}
                  >
                    <IonIcon icon={calendarOutline} slot="start" />
                    Actualizar
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <CajaVacunas limite={5} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      {/* Modal de Detalle de Cita */}
      {citaSeleccionada && (
        <ModalDetalleCita
          isOpen={mostrarModalDetalle}
          onClose={handleCerrarModal}
          evento={citaSeleccionada}
          onEventoActualizado={cargarCitasDelDia}
        />
      )}

      {/*
      <IonFooter className="ion-no-border footer-right">
        <div className="boton-anadir-container">
          {/* Botón con opciones automáticas por defecto 
          <BotonAnadir tipo="opcionesDefault" />
        </div>
      </IonFooter>
      */}
    </IonPage>
  );
};

export default Home;
