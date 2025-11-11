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
} from "ionicons/icons";
import { CalendarEvent, getEventsDay } from "../../api/calendario";
import ModalDetalleCita from "./ModalDetalleCita";

interface VistaDiaProps {
  fecha: Date;
  onCambiarFecha: (fecha: Date) => void;
}

const VistaDia: React.FC<VistaDiaProps> = ({ fecha, onCambiarFecha }) => {
  const [eventos, setEventos] = useState<CalendarEvent[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] =
    useState<CalendarEvent | null>(null);

  const [loading, setLoading] = useState(true);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fecha]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const fechaISO = new Date(fecha).toISOString();
      console.log(fechaISO);
      const eventosDelDia = await getEventsDay(fechaISO);
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
                  <div className="cita-hora">
                    <IonIcon icon={timeOutline} />
                    <span className="hora-texto">
                      {formatearHora(evento.start.dateTime)}
                    </span>
                  </div>

                  <div className="cita-info">
                    <div className="cita-tutor">
                      <IonIcon icon={personOutline} />
                      <span>{evento.summary}</span>
                    </div>

                    <div className="cita-pacientes">
                      <IonIcon icon={pawOutline} />
                      <span>
                        Ubicación:{" "}
                        {evento.location || "No hay ubicación especificada"}
                      </span>
                    </div>

                    <div className="cita-motivo">
                      <strong>Descripción:</strong> {evento.description}
                    </div>
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
