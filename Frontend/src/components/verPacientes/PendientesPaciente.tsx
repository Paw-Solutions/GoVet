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
import { ConsultaTratamiento, obtenerTratamientosPorPaciente } from "../../api/tratamientos";
import { useAuth } from "../../hooks/useAuth";
// Componente: Visualizador de próximas vacunas
interface PendientesPacienteProps {
  idPaciente: number;
  onVerDetalleVacuna?: (vacuna: ConsultaTratamiento) => void;
}

const PendientesPaciente: React.FC<PendientesPacienteProps> = ({
  idPaciente,
  onVerDetalleVacuna,
}) => {
  const {idToken} = useAuth();
  const [vacunas, setVacunas] = useState<ConsultaTratamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPendientes();
  }, [idPaciente]);

  const cargarPendientes = async () => {
    setLoading(true);
    setError(null);

    try {
      const vacunasResponse = await obtenerTratamientosPorPaciente(
        idPaciente,
        idToken
      );
      setVacunas(vacunasResponse);
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

  const totalPendientes = vacunas.length;

  if (totalPendientes === 0) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle style={{ fontSize: "1.1rem" }}>
            <IonIcon
              icon={checkmarkCircleOutline}
              style={{ marginRight: "8px" }}
            />
            Vacunas Pendientes
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <IonIcon
              icon={checkmarkCircleOutline}
              style={{ fontSize: "48px", color: "var(--ion-color-success)" }}
            />
            <p style={{ marginTop: "16px", color: "var(--ion-color-medium)" }}>
              No hay vacunas pendientes
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
          <IonIcon icon={medkitOutline} />
          Vacunas Pendientes
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

        {/* Vacunas Pendientes */}
        {vacunas.length > 0 && (
          <div>
            <IonList lines="none" style={{ background: "transparent" }}>
              {vacunas.slice(0, 3).map((vacuna) => (
                <IonItem
                  key={vacuna.id_tratamiento}
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
                      {vacuna.nombre_tratamiento}
                    </h3>
                    <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                      {formatearFecha(vacuna.fecha_tratamiento)} a las {formatearHora(vacuna.fecha_tratamiento)}
                    </p>
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
