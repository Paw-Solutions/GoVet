import { useState, useEffect } from "react";
import {
  IonButton,
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel,
} from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  pawOutline,
  timeOutline,
  personOutline,
  locationOutline,
  documentTextOutline,
} from "ionicons/icons";
import { CalendarEvent, getEventsDay } from "../../api/calendario";
import ModalDetalleCita from "./ModalDetalleCita";
import { useAuth } from "../../hooks/useAuth";
// Componente: Vista diaria de calendario
interface VistaDiaProps {
  fecha: Date;
  onCambiarFecha: (fecha: Date) => void;
}

const VistaDia: React.FC<VistaDiaProps> = ({ fecha, onCambiarFecha }) => {
  const { sessionToken } = useAuth();
  const [eventos, setEventos] = useState<CalendarEvent[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] =
    useState<CalendarEvent | null>(null);

  const [loading, setLoading] = useState(true);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fecha, sessionToken]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const fechaISO = new Date(fecha).toISOString();
      console.log(fechaISO);
      const eventosDelDia = await getEventsDay(fechaISO, sessionToken);
      setEventos(eventosDelDia);
      console.log("Eventos del día obtenidos:", eventosDelDia);
    } catch (error) {
      console.error("Error al obtener eventos del día:", error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarDia = (dias: number) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    onCambiarFecha(nuevaFecha);
  };

  const formatearFecha = () => {
    return fecha.toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearHora = (fechaHora: string) => {
    return new Date(fechaHora).toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearRangoHorario = (inicio: string, fin: string) => {
    const horaInicio = formatearHora(inicio);
    const horaFin = formatearHora(fin);
    return `${horaInicio} - ${horaFin}`;
  };

  const handleCitaClick = (evento: CalendarEvent) => {
    setEventoSeleccionado(evento);
    setMostrarDetalle(true);
  };

  return (
    <div className="vista-dia">
      {/* Navegación de fecha */}
      <div className="dia-navegacion">
        <IonButton fill="clear" onClick={() => cambiarDia(-1)}>
          <IonIcon icon={chevronBackOutline} />
        </IonButton>

        <div className="dia-titulo">
          <h2>{formatearFecha()}</h2>
          <p className="dia-contador">
            {eventos.length} {eventos.length === 1 ? "cita" : "citas"}
          </p>
        </div>

        <IonButton fill="clear" onClick={() => cambiarDia(1)}>
          <IonIcon icon={chevronForwardOutline} />
        </IonButton>
      </div>

      {/* Indicador visual del día actual */}
      <div className="dia-indicador">
        <div className="dia-fecha-grande">
          <span className="dia-numero">{fecha.getDate()}</span>
          <span className="dia-mes">
            {fecha.toLocaleDateString("es-CL", { month: "short" })}
          </span>
        </div>
      </div>

      {/* Lista de citas del día */}
      <div className="citas-lista-container">
        <h3 className="lista-titulo">Citas del día</h3>
        {loading ? (
          <div className="dia-loading">
            <IonSpinner />
            <p>Cargando citas...</p>
          </div>
        ) : eventos.length === 0 ? (
          <div className="dia-vacio">
            <IonIcon icon={pawOutline} className="icono-vacio" />
            <p>No hay citas programadas para este día</p>
          </div>
        ) : (
          <div className="citas-lista">
            {eventos.map((evento) => (
              <IonCard
                key={evento.summary}
                className="cita-card"
                button
                onClick={() => handleCitaClick(evento)}
              >
                <IonCardContent>
                  {/* Hora de inicio y fin - PRIORIDAD 1 */}
                  <div className="cita-hora">
                    <IonIcon icon={timeOutline} />
                    <span className="hora-texto">
                      {formatearRangoHorario(
                        evento.start.dateTime,
                        evento.end.dateTime
                      )}
                    </span>
                  </div>

                  <div className="cita-info">
                    {/* Ubicación - PRIORIDAD 2 */}
                    {evento.location && (
                      <div>
                        <h2>
                          <p>
                            <IonIcon
                              icon={locationOutline}
                              className="pacientes-icon"
                            />
                            <span style={{ marginLeft: "8px" }}>
                              : {evento.location}
                            </span>
                          </p>
                        </h2>
                      </div>
                    )}

                    {/* Nombre del tutor - PRIORIDAD 3 */}
                    <div>
                      <h2>
                        <p>
                          <IonIcon
                            icon={personOutline}
                            className="pacientes-icon"
                          />
                          <span style={{ marginLeft: "8px" }}>
                            : {evento.summary}
                          </span>
                        </p>
                      </h2>
                    </div>

                    {/* Descripción/Motivo (puede contener info del paciente) */}
                    {evento.description && (
                      <div>
                        <h2>
                          <p>
                            <IonIcon
                              icon={documentTextOutline}
                              className="pacientes-icon"
                            />
                            <span style={{ marginLeft: "8px" }}>
                              : {evento.description}
                            </span>
                          </p>
                        </h2>
                      </div>
                    )}
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {eventoSeleccionado && (
        <ModalDetalleCita
          isOpen={mostrarDetalle}
          onClose={() => {
            setMostrarDetalle(false);
            // Esperar a que el modal se cierre antes de limpiar
            setTimeout(() => {
              setEventoSeleccionado(null);
            }, 300);
          }}
          evento={eventoSeleccionado}
          onEventoActualizado={fetchEvents}
        />
      )}
    </div>
  );
};

export default VistaDia;
