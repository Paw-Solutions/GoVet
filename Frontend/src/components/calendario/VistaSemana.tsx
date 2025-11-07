import { useState, useEffect } from "react";
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
} from "ionicons/icons";
import { obtenerCitasPorRango, type Cita } from "../../api/citas";
import ModalDetalleCita from "./ModalDetalleCita";

interface VistaSemanaProps {
  fecha: Date;
  onCambiarFecha: (fecha: Date) => void;
}

const VistaSemana: React.FC<VistaSemanaProps> = ({ fecha, onCambiarFecha }) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
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

  const inicioSemana = obtenerInicioSemana(fecha);
  const finSemana = obtenerFinSemana(inicioSemana);

  useEffect(() => {
    cargarCitas();
  }, [fecha]);

  const cargarCitas = async () => {
    setLoading(true);
    try {
      const inicioStr = inicioSemana.toISOString().split("T")[0];
      const finStr = finSemana.toISOString().split("T")[0];
      const response = await obtenerCitasPorRango(inicioStr, finStr);
      setCitas(
        response.citas.sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora))
      );
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setLoading(false);
    }
  };

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

  // Obtener citas de un día específico
  const obtenerCitasDelDia = (dia: Date) => {
    const diaStr = dia.toISOString().split("T")[0];
    return citas.filter((cita) => {
      const citaFecha = cita.fecha_hora.split("T")[0];
      return citaFecha === diaStr;
    });
  };

  const formatearHora = (fechaHora: string) => {
    return new Date(fechaHora).toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const handleCitaClick = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setMostrarDetalle(true);
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "programada":
        return "primary";
      case "confirmada":
        return "success";
      case "cancelada":
        return "danger";
      case "completada":
        return "medium";
      default:
        return "medium";
    }
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
            {citas.length} {citas.length === 1 ? "cita" : "citas"}
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
            {citas.length === 0 ? (
              <div className="semana-vacio">
                <IonIcon icon={pawOutline} className="icono-vacio" />
                <p>No hay citas programadas para esta semana</p>
              </div>
            ) : (
              <div className="citas-lista">
                {citas.map((cita) => (
                  <IonCard
                    key={cita.id_cita}
                    className="cita-card"
                    button
                    onClick={() => handleCitaClick(cita)}
                  >
                    <IonCardContent>
                      <div className="cita-fecha-hora">
                        <div className="cita-fecha">
                          <IonIcon icon={calendarOutline} />
                          <span>
                            {new Date(cita.fecha_hora).toLocaleDateString(
                              "es-CL",
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </span>
                        </div>
                        <div className="cita-hora">
                          <IonIcon icon={timeOutline} />
                          <span className="hora-texto">
                            {formatearHora(cita.fecha_hora)}
                          </span>
                        </div>
                      </div>

                      <div className="cita-info">
                        <div className="cita-tutor">
                          <IonIcon icon={personOutline} />
                          <span>
                            {cita.tutor_nombre} {cita.tutor_apellido_paterno}
                          </span>
                        </div>

                        <div className="cita-pacientes">
                          <IonIcon icon={pawOutline} />
                          <span>
                            {cita.pacientes.map((p) => p.nombre).join(", ")}
                          </span>
                        </div>

                        <div className="cita-motivo">
                          <strong>Motivo:</strong> {cita.motivo}
                        </div>
                      </div>

                      <IonChip color={getColorEstado(cita.estado)}>
                        <IonLabel className="capitalize">
                          {cita.estado}
                        </IonLabel>
                      </IonChip>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de detalle */}
      {citaSeleccionada && (
        <ModalDetalleCita
          isOpen={mostrarDetalle}
          onClose={() => {
            setMostrarDetalle(false);
            // Esperar a que el modal se cierre antes de limpiar
            setTimeout(() => {
              setCitaSeleccionada(null);
            }, 300);
          }}
          cita={citaSeleccionada}
          onCitaActualizada={cargarCitas}
        />
      )}
    </div>
  );
};

export default VistaSemana;
