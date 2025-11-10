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
import { obtenerCitasPorFecha, type Cita } from "../../api/citas";
import { CalendarEvent, getEventsDay } from "../../api/calendario";
import ModalDetalleCita from "./ModalDetalleCita";

interface VistaDiaProps {
  fecha: Date;
  onCambiarFecha: (fecha: Date) => void;
}

const VistaDia: React.FC<VistaDiaProps> = ({ fecha, onCambiarFecha }) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [evento, setEvento] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fechaStr = fecha.toISOString().split("T")[0];
        const data = await getEventsDay(fechaStr);
        setEvento(data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const cargarCitas = async () => {
    setLoading(true);
    try {
      const fechaStr = fecha.toISOString().split("T")[0];
      const response = await obtenerCitasPorFecha(fechaStr);
      setCitas(
        response.citas.sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora))
      );
    } catch (error) {
      console.error("Error al cargar citas:", error);
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
    <div className="vista-dia">
      {/* Navegación de fecha */}
      <div className="dia-navegacion">
        <IonButton fill="clear" onClick={() => cambiarDia(-1)}>
          <IonIcon icon={chevronBackOutline} />
        </IonButton>

        <div className="dia-titulo">
          <h2>{formatearFecha()}</h2>
          <p className="dia-contador">
            {citas.length} {citas.length === 1 ? "cita" : "citas"}
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
        ) : citas.length === 0 ? (
          <div className="dia-vacio">
            <IonIcon icon={pawOutline} className="icono-vacio" />
            <p>No hay citas programadas para este día</p>
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
                  <div className="cita-hora">
                    <IonIcon icon={timeOutline} />
                    <span className="hora-texto">
                      {formatearHora(cita.fecha_hora)}
                    </span>
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

                    {cita.notas && (
                      <div className="cita-notas">
                        <strong>Notas:</strong> {cita.notas}
                      </div>
                    )}
                  </div>

                  <IonChip color={getColorEstado(cita.estado)}>
                    <IonLabel className="capitalize">{cita.estado}</IonLabel>
                  </IonChip>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </div>

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

export default VistaDia;
