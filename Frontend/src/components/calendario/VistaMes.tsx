import { useState, useEffect } from "react";
import {
  IonButton,
  IonIcon,
  IonSpinner,
  IonChip,
  IonCard,
  IonCardContent,
  IonLabel,
} from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  pawOutline,
  personOutline,
  timeOutline,
  calendarOutline,
  chevronUpOutline,
  chevronDownOutline,
  locationOutline,
  documentTextOutline,
} from "ionicons/icons";
import { getEventsMonth, type CalendarEvent } from "../../api/calendario";
import { useAuth } from "../../hooks/useAuth";
// Componente: Vista mensual de calendario
interface VistaMesProps {
  fecha: Date;
  onCambiarFecha: (fecha: Date) => void;
  onSeleccionarDia: (fecha: Date) => void;
}

const VistaMes: React.FC<VistaMesProps> = ({
  fecha,
  onCambiarFecha,
  onSeleccionarDia,
}) => {
  const {idToken} = useAuth();
  const [eventos, setEventos] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarioColapsado, setCalendarioColapsado] = useState(false);

  useEffect(() => {
    cargarEventos();
  }, [fecha]);

  const cargarEventos = async () => {
    setLoading(true);
    try {
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1; // getMonth() devuelve 0-11
      console.log("Cargando eventos del mes:", year, month);
      const response = await getEventsMonth(year, month, idToken);
      console.log("Eventos recibidos:", response);
      setEventos(response || []);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const cambiarMes = (meses: number) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + meses);
    onCambiarFecha(nuevaFecha);
  };

  const generarDiasDelMes = () => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();

    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    // Días del mes anterior para llenar
    const diaInicioSemana = primerDia.getDay();
    const diasAnteriores = diaInicioSemana === 0 ? 6 : diaInicioSemana - 1;

    // Días del mes siguiente para llenar
    const diaFinSemana = ultimoDia.getDay();
    const diasSiguientes = diaFinSemana === 0 ? 0 : 7 - diaFinSemana;

    const dias = [];

    // Días del mes anterior
    for (let i = diasAnteriores; i > 0; i--) {
      const dia = new Date(año, mes, -i + 1);
      dias.push({ fecha: dia, mesActual: false });
    }

    // Días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const dia = new Date(año, mes, i);
      dias.push({ fecha: dia, mesActual: true });
    }

    // Días del mes siguiente
    for (let i = 1; i <= diasSiguientes; i++) {
      const dia = new Date(año, mes + 1, i);
      dias.push({ fecha: dia, mesActual: false });
    }

    return dias;
  };

  const obtenerEventosDelDia = (dia: Date) => {
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

  const esHoy = (dia: Date) => {
    const hoy = new Date();
    return (
      dia.getDate() === hoy.getDate() &&
      dia.getMonth() === hoy.getMonth() &&
      dia.getFullYear() === hoy.getFullYear()
    );
  };

  const formatearMesAño = () => {
    return fecha.toLocaleDateString("es-CL", {
      month: "long",
      year: "numeric",
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

  const diasDelMes = generarDiasDelMes();
  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="vista-mes">
      {/* Navegación de mes */}
      <div className="mes-navegacion">
        <IonButton fill="clear" onClick={() => cambiarMes(-1)}>
          <IonIcon icon={chevronBackOutline} />
        </IonButton>

        <div className="mes-titulo">
          <h2 className="capitalize">{formatearMesAño()}</h2>
          <p className="mes-contador">
            {eventos.length} {eventos.length === 1 ? "evento" : "eventos"}
          </p>
        </div>

        <IonButton fill="clear" onClick={() => cambiarMes(1)}>
          <IonIcon icon={chevronForwardOutline} />
        </IonButton>
      </div>

      {loading ? (
        <div className="mes-loading">
          <IonSpinner />
          <p>Cargando citas...</p>
        </div>
      ) : (
        <>
          <div
            className={`mes-calendario ${
              calendarioColapsado ? "colapsado" : "expandido"
            }`}
          >
            {/* Encabezados de días de la semana */}
            <div className="mes-encabezados">
              {diasSemana.map((dia) => (
                <div key={dia} className="mes-encabezado-dia">
                  {dia}
                </div>
              ))}
            </div>

            {/* Grid de días del mes */}
            <div className="mes-grid">
              {diasDelMes.map((diaInfo, index) => {
                const eventosDelDia = obtenerEventosDelDia(diaInfo.fecha);
                const isHoy = esHoy(diaInfo.fecha);

                return (
                  <div
                    key={index}
                    className={`mes-dia ${
                      diaInfo.mesActual ? "" : "mes-dia-otro"
                    } ${isHoy ? "mes-dia-hoy" : ""} ${
                      eventosDelDia.length > 0 ? "mes-dia-con-citas" : ""
                    }`}
                    onClick={() => onSeleccionarDia(diaInfo.fecha)}
                  >
                    <div className="mes-dia-numero">
                      {diaInfo.fecha.getDate()}
                    </div>

                    {eventosDelDia.length > 0 && (
                      <div className="mes-dia-indicadores">
                        {eventosDelDia.slice(0, 3).map((evento, idx) => (
                          <div
                            key={idx}
                            className={`mes-indicador programada`}
                            title={evento.summary}
                          />
                        ))}
                        {eventosDelDia.length > 3 && (
                          <div className="mes-indicador-mas">
                            +{eventosDelDia.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botón de colapsar como pestañita */}
          <div className="mes-pestaña-colapsar">
            <button
              onClick={() => setCalendarioColapsado(!calendarioColapsado)}
              className="btn-pestaña"
            >
              <IonIcon
                icon={
                  calendarioColapsado ? chevronDownOutline : chevronUpOutline
                }
              />
            </button>
          </div>

          {/* Lista de citas del mes */}
          <div className="citas-lista-container">
            <h3 className="lista-titulo">Eventos del mes</h3>
            {eventos.length === 0 ? (
              <div className="mes-vacio">
                <IonIcon icon={pawOutline} className="icono-vacio" />
                <p>No hay eventos programados para este mes</p>
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
                      onClick={() => {
                        // Navegar al día del evento
                        onSeleccionarDia(new Date(evento.start.dateTime));
                      }}
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

                        <IonChip color="primary">
                          <IonLabel>Evento</IonLabel>
                        </IonChip>
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </div>
            )}
          </div>

          {/* Leyenda */}
          <div className="mes-leyenda">
            <div className="leyenda-item">
              <div className="leyenda-color programada"></div>
              <span>Evento programado</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VistaMes;
