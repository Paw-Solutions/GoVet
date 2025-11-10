import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
  IonSpinner,
  IonText,
  IonList,
  IonChip,
} from "@ionic/react";
import {
  calendarOutline,
  medkitOutline,
  timeOutline,
  chevronForwardOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import { obtenerCitasPendientesPorPaciente, Cita } from "../../api/citas";
import { obtenerVacunasPendientesPorPaciente, Vacuna } from "../../api/vacunas";

interface PendientesPacienteProps {
  idPaciente: number;
  onVerDetalleCita?: (cita: Cita) => void;
  onVerDetalleVacuna?: (vacuna: Vacuna) => void;
}

const PendientesPaciente: React.FC<PendientesPacienteProps> = ({
  idPaciente,
  onVerDetalleCita,
  onVerDetalleVacuna,
}) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPendientes();
  }, [idPaciente]);

  const cargarPendientes = async () => {
    setLoading(true);
    setError(null);

    try {
      const [citasResponse, vacunasResponse] = await Promise.all([
        obtenerCitasPendientesPorPaciente(idPaciente),
        obtenerVacunasPendientesPorPaciente(idPaciente),
      ]);

      setCitas(citasResponse.citas);
      setVacunas(vacunasResponse.vacunas);
    } catch (err) {
      console.error("Error al cargar pendientes:", err);
      setError("No se pudieron cargar los pendientes");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatearHora = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "programada":
        return "primary";
      case "confirmada":
        return "success";
      default:
        return "medium";
    }
  };

  if (loading) {
    return (
      <IonCard>
        <IonCardContent style={{ textAlign: "center", padding: "20px" }}>
          <IonSpinner />
          <p>Cargando pendientes...</p>
        </IonCardContent>
      </IonCard>
    );
  }

  const totalPendientes = citas.length + vacunas.length;

  if (totalPendientes === 0) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle style={{ fontSize: "1.1rem" }}>
            <IonIcon
              icon={checkmarkCircleOutline}
              style={{ marginRight: "8px" }}
            />
            Citas y Vacunas
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <IonIcon
              icon={checkmarkCircleOutline}
              style={{ fontSize: "48px", color: "var(--ion-color-success)" }}
            />
            <p style={{ marginTop: "16px", color: "var(--ion-color-medium)" }}>
              No hay citas ni vacunas pendientes
            </p>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle
          style={{
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IonIcon icon={calendarOutline} />
          Pendientes
          <IonBadge color="primary" style={{ marginLeft: "8px" }}>
            {totalPendientes}
          </IonBadge>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {/* Citas Pendientes */}
        {citas.length > 0 && (
          <div
            style={{
              marginBottom:
                citas.length > 0 && vacunas.length > 0 ? "16px" : "0",
            }}
          >
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <IonIcon icon={calendarOutline} style={{ fontSize: "1rem" }} />
              Citas Programadas
              <IonChip
                color="primary"
                style={{ height: "20px", fontSize: "0.75rem" }}
              >
                {citas.length}
              </IonChip>
            </h3>
            <IonList lines="none" style={{ background: "transparent" }}>
              {citas.slice(0, 3).map((cita) => (
                <IonItem
                  key={cita.id_cita}
                  button={!!onVerDetalleCita}
                  detail={!!onVerDetalleCita}
                  onClick={() => onVerDetalleCita && onVerDetalleCita(cita)}
                  style={{
                    "--background": "var(--ion-color-light)",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <IonLabel>
                    <h3 style={{ fontWeight: "500", fontSize: "0.95rem" }}>
                      {cita.motivo}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "4px",
                      }}
                    >
                      <IonIcon
                        icon={timeOutline}
                        style={{ fontSize: "0.9rem" }}
                      />
                      {formatearFecha(cita.fecha_hora)} •{" "}
                      {formatearHora(cita.fecha_hora)}
                    </p>
                  </IonLabel>
                  <IonChip
                    slot="end"
                    color={getColorEstado(cita.estado)}
                    style={{ height: "24px" }}
                  >
                    <IonLabel
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {cita.estado}
                    </IonLabel>
                  </IonChip>
                </IonItem>
              ))}
              {citas.length > 3 && (
                <IonText color="medium">
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "0.85rem",
                      marginTop: "8px",
                    }}
                  >
                    + {citas.length - 3} citas más
                  </p>
                </IonText>
              )}
            </IonList>
          </div>
        )}

        {/* Vacunas Pendientes */}
        {vacunas.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <IonIcon icon={medkitOutline} style={{ fontSize: "1rem" }} />
              Vacunas Pendientes
              <IonChip
                color="warning"
                style={{ height: "20px", fontSize: "0.75rem" }}
              >
                {vacunas.length}
              </IonChip>
            </h3>
            <IonList lines="none" style={{ background: "transparent" }}>
              {vacunas.slice(0, 3).map((vacuna) => (
                <IonItem
                  key={vacuna.id_vacuna}
                  button={!!onVerDetalleVacuna}
                  detail={!!onVerDetalleVacuna}
                  onClick={() =>
                    onVerDetalleVacuna && onVerDetalleVacuna(vacuna)
                  }
                  style={{
                    "--background": "var(--ion-color-light)",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <IonIcon
                    icon={medkitOutline}
                    slot="start"
                    color="warning"
                    style={{ fontSize: "1.2rem" }}
                  />
                  <IonLabel>
                    <h3 style={{ fontWeight: "500", fontSize: "0.95rem" }}>
                      {vacuna.nombre}
                    </h3>
                    <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                      {formatearFecha(vacuna.fecha_programada)}
                    </p>
                    {vacuna.observaciones && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--ion-color-medium)",
                          marginTop: "2px",
                        }}
                      >
                        {vacuna.observaciones}
                      </p>
                    )}
                  </IonLabel>
                  {onVerDetalleVacuna && (
                    <IonIcon
                      icon={chevronForwardOutline}
                      slot="end"
                      color="medium"
                    />
                  )}
                </IonItem>
              ))}
              {vacunas.length > 3 && (
                <IonText color="medium">
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "0.85rem",
                      marginTop: "8px",
                    }}
                  >
                    + {vacunas.length - 3} vacunas más
                  </p>
                </IonText>
              )}
            </IonList>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default PendientesPaciente;
