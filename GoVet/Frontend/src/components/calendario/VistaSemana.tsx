import { useState, useEffect, useMemo } from "react";
import {
  IonButton,
  IonIcon,
  IonSpinner,
  IonChip,
  IonLabel,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  pawOutline,
  personOutline,
  timeOutline,
  calendarOutline,
  locationOutline,
  documentTextOutline,
} from "ionicons/icons";
import ModalDetalleCita from "./ModalDetalleCita";
import { CalendarEvent, getEventsWeek } from "../../api/calendario";
import { useAuth } from "../../hooks/useAuth";
// Componente: Vista semanal de calendario
interface VistaSemanaProps {
  fecha: Date;
  onCambiarFecha: (fecha: Date) => void;
  onSeleccionarDia: (fecha: Date) => void;
}

const VistaSemana: React.FC<VistaSemanaProps> = ({
  fecha,
  onCambiarFecha,
  onSeleccionarDia,
}) => {
  const {idToken} = useAuth();
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] =
    useState<CalendarEvent | null>(null);
  const [eventos, setEventos] = useState<CalendarEvent[]>([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  // Obtener inicio y fin de la semana
  const obtenerInicioSemana = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
    return new Date(d.setDate(diff));
  };

  const obtenerFinSemana = (inicio: Date) => {
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    return fin;
  };
  // Usar useMemo para evitar recalcular las fechas en cada render
  const { inicioSemana, finSemana } = useMemo(() => {
    const inicio = obtenerInicioSemana(fecha);
    const fin = obtenerFinSemana(inicio);
    return { inicioSemana: inicio, finSemana: fin };
  }, [fecha]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const startDate = inicioSemana.toISOString().split("T")[0];
      const endDate = finSemana.toISOString().split("T")[0];
      console.log("Cargando eventos de la semana:", startDate, "a", endDate);
      const data = await getEventsWeek(startDate, endDate, idToken);
      console.log("Eventos de la semana recibidos:", data);

      // Filtrar eventos que tengan la estructura correcta antes de ordenar
      const eventosValidos = data.filter((evento) => evento?.start?.dateTime);

      console.log("Eventos válidos:", eventosValidos);

      setEventos(
        eventosValidos.sort((a, b) =>
          a.start.dateTime.localeCompare(b.start.dateTime)
        )
      );
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fecha, inicioSemana, finSemana]);

  const cambiarSemana = (semanas: number) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + semanas * 7);
    onCambiarFecha(nuevaFecha);
  };

  // Generar array de 7 días de la semana
  const generarDiasSemana = () => {
    const dias = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const diasSemana = generarDiasSemana();

  const obtenerCitasDelDia = (dia: Date) => {
    const diaStr = dia.toISOString().split("T")[0];
    return eventos.filter((evento) => {
      // Validar que el evento tenga la estructura correcta
      if (!evento || !evento.start || !evento.start.dateTime) {
        return false;
      }
      const eventoFecha = evento.start.dateTime.split("T")[0];
      return eventoFecha === diaStr;
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

  const formatearRangoSemana = () => {
    const inicio = inicioSemana.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
    });
    const fin = finSemana.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${inicio} - ${fin}`;
  };

  const esHoy = (dia: Date) => {
    const hoy = new Date();
    return (
      dia.getDate() === hoy.getDate() &&
      dia.getMonth() === hoy.getMonth() &&
      dia.getFullYear() === hoy.getFullYear()
    );
  };

  const handleEventoClick = (evento: CalendarEvent) => {
    setEventoSeleccionado(evento);
    setMostrarDetalle(true);
  };

  return (
    <div className="vista-semana">
      {/* Navegación de semana */}
      <div className="semana-navegacion">
        <IonButton fill="clear" onClick={() => cambiarSemana(-1)}>
          <IonIcon icon={chevronBackOutline} />
        </IonButton>

        <div className="semana-titulo">
          <h2>{formatearRangoSemana()}</h2>
          <p className="semana-contador">
            {eventos.length} {eventos.length === 1 ? "evento" : "eventos"}
          </p>
        </div>

        <IonButton fill="clear" onClick={() => cambiarSemana(1)}>
          <IonIcon icon={chevronForwardOutline} />
        </IonButton>
      </div>

      {loading ? (
        <div className="semana-loading">
          <IonSpinner />
          <p>Cargando citas...</p>
        </div>
      ) : (
        <>
          {/* Vista horizontal de días de la semana */}
          <div className="semana-dias-horizontal">
            {diasSemana.map((dia, index) => {
              const citasDelDia = obtenerCitasDelDia(dia);
              const isHoy = esHoy(dia);

              return (
                <div
                  key={index}
                  className={`semana-dia-horizontal ${isHoy ? "dia-hoy" : ""}`}
                  onClick={() => onSeleccionarDia(dia)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="dia-header-horizontal">
                    <span className="dia-nombre">
                      {dia.toLocaleDateString("es-CL", { weekday: "short" })}
                    </span>
                    <span className="dia-numero">{dia.getDate()}</span>
                  </div>
                  {citasDelDia.length > 0 && (
                    <div className="dia-indicador-citas">
                      <IonChip color="primary" className="dia-badge-horizontal">
                        {citasDelDia.length}
                      </IonChip>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lista de citas de la semana */}
          <div className="citas-lista-container">
            <h3 className="lista-titulo">Citas de la semana</h3>
            {eventos.length === 0 ? (
              <div className="semana-vacio">
                <IonIcon icon={pawOutline} className="icono-vacio" />
                <p>No hay citas programadas para esta semana</p>
              </div>
            ) : (
              <div className="citas-lista">
                {eventos.map((evento) => {
                  // Validar que el evento tenga los datos mínimos necesarios
                  if (!evento?.start?.dateTime || !evento?.id) {
                    return null;
                  }

                  return (
                    <IonCard
                      key={evento.id}
                      className="cita-card"
                      button
                      onClick={() => handleEventoClick(evento)}
                    >
                      <IonCardContent>
                        <div className="cita-fecha-hora">
                          <div className="cita-fecha">
                            <IonIcon icon={calendarOutline} />
                            <span>
                              {new Date(
                                evento.start.dateTime
                              ).toLocaleDateString("es-CL", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
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
                                  : {evento.summary || "Sin título"}
                                </span>
                              </p>
                            </h2>
                          </div>

                          {/* Descripción/Motivo */}
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
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

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

export default VistaSemana;
