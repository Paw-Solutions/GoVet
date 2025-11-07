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
} from "ionicons/icons";
import { obtenerCitasPorRango, type Cita } from "../../api/citas";

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
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitas();
  }, [fecha]);

  const cargarCitas = async () => {
    setLoading(true);
    try {
      // Obtener primer y último día del mes
      const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

      const inicioStr = primerDia.toISOString().split("T")[0];
      const finStr = ultimoDia.toISOString().split("T")[0];
      const response = await obtenerCitasPorRango(inicioStr, finStr);
      setCitas(response.citas);
    } catch (error) {
      console.error("Error al cargar citas:", error);
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

  const obtenerCitasDelDia = (dia: Date) => {
    const diaStr = dia.toISOString().split("T")[0];
    return citas.filter((cita) => {
      const citaFecha = cita.fecha_hora.split("T")[0];
      return citaFecha === diaStr;
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
            {citas.length} {citas.length === 1 ? "cita" : "citas"}
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
          <div className="mes-calendario">
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
                const citasDelDia = obtenerCitasDelDia(diaInfo.fecha);
                const isHoy = esHoy(diaInfo.fecha);

                return (
                  <div
                    key={index}
                    className={`mes-dia ${
                      diaInfo.mesActual ? "" : "mes-dia-otro"
                    } ${isHoy ? "mes-dia-hoy" : ""} ${
                      citasDelDia.length > 0 ? "mes-dia-con-citas" : ""
                    }`}
                    onClick={() => onSeleccionarDia(diaInfo.fecha)}
                  >
                    <div className="mes-dia-numero">
                      {diaInfo.fecha.getDate()}
                    </div>

                    {citasDelDia.length > 0 && (
                      <div className="mes-dia-indicadores">
                        {citasDelDia.slice(0, 3).map((cita, idx) => (
                          <div
                            key={idx}
                            className={`mes-indicador ${cita.estado}`}
                            title={`${cita.tutor_nombre} - ${cita.motivo}`}
                          />
                        ))}
                        {citasDelDia.length > 3 && (
                          <div className="mes-indicador-mas">
                            +{citasDelDia.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de citas del mes */}
          <div className="citas-lista-container">
            <h3 className="lista-titulo">Citas del mes</h3>
            {citas.length === 0 ? (
              <div className="mes-vacio">
                <IonIcon icon={pawOutline} className="icono-vacio" />
                <p>No hay citas programadas para este mes</p>
              </div>
            ) : (
              <div className="citas-lista">
                {citas.map((cita) => (
                  <IonCard
                    key={cita.id_cita}
                    className="cita-card"
                    button
                    onClick={() => {
                      // Navegar al día de la cita
                      onSeleccionarDia(new Date(cita.fecha_hora));
                    }}
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
                            {new Date(cita.fecha_hora).toLocaleTimeString(
                              "es-CL",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
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

          {/* Leyenda de estados */}
          <div className="mes-leyenda">
            <div className="leyenda-item">
              <div className="leyenda-color programada"></div>
              <span>Programada</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color confirmada"></div>
              <span>Confirmada</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color completada"></div>
              <span>Completada</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color cancelada"></div>
              <span>Cancelada</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VistaMes;
