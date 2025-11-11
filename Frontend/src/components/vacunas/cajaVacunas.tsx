import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonButton,
  IonIcon,
} from "@ionic/react";
import {
  medicalOutline,
  calendarOutline,
  pawOutline,
  refreshOutline,
} from "ionicons/icons";
import { obtenerTratamientosProximos, ConsultaTratamiento } from "../../api/tratamientos";

interface CajaVacunasProps {
  limite?: number; // Número máximo de tratamientos a mostrar
}

const CajaVacunas: React.FC<CajaVacunasProps> = ({ limite = 5 }) => {
  const [tratamientos, setTratamientos] = useState<ConsultaTratamiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Función para filtrar tratamientos próximos desde la fecha actual
  const filtrarTratamientosProximos = (tratamientos: ConsultaTratamiento[]) => {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Resetear hora para comparar solo fechas

    return tratamientos
      .filter(tratamiento => {
        const fechaTratamiento = new Date(tratamiento.fecha_tratamiento);
        fechaTratamiento.setHours(0, 0, 0, 0);
        return fechaTratamiento >= fechaActual;
      })
      .sort((a, b) => 
        new Date(a.fecha_tratamiento).getTime() - new Date(b.fecha_tratamiento).getTime()
      )
      .slice(0, limite);
  };

  // Función para cargar los tratamientos
  const cargarTratamientos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await obtenerTratamientosProximos();
      
      // Filtrar y ordenar tratamientos próximos
      const tratamientosProximos = filtrarTratamientosProximos(data);
      setTratamientos(tratamientosProximos);
    } catch (error) {
      console.error("Error al cargar tratamientos:", error);
      setError("No se pudieron cargar los tratamientos");
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Verificar si el tratamiento es para hoy
  const esHoy = (fecha: string) => {
    const hoy = new Date();
    const fechaTratamiento = new Date(fecha);
    return (
      hoy.getDate() === fechaTratamiento.getDate() &&
      hoy.getMonth() === fechaTratamiento.getMonth() &&
      hoy.getFullYear() === fechaTratamiento.getFullYear()
    );
  };

  // Cargar tratamientos al montar el componente
  useEffect(() => {
    cargarTratamientos();
  }, []);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon
            icon={medicalOutline}
            style={{ marginRight: "8px" }}
          />
          Próximas vacunas
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <IonSpinner />
            <IonText>
              <p>Cargando tratamientos...</p>
            </IonText>
          </div>
        ) : error ? (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        ) : tratamientos.length === 0 ? (
          <IonText color="medium">
            <p>No hay tratamientos próximos programados</p>
          </IonText>
        ) : (
          <IonList>
            {tratamientos.map((tratamiento, index) => (
              <IonItem 
                key={`${tratamiento.id_consulta}-${tratamiento.id_tratamiento}-${index}`} 
                lines="inset"
                className={esHoy(tratamiento.fecha_tratamiento) ? "tratamiento-hoy" : ""}
              >
                <IonIcon 
                  icon={pawOutline} 
                  slot="start" 
                  color={esHoy(tratamiento.fecha_tratamiento) ? "warning" : "medium"}
                />
                <IonLabel>
                  <strong>
                    {tratamiento.nombre_paciente}
                    {esHoy(tratamiento.fecha_tratamiento) && (
                      <IonText color="warning" style={{ marginLeft: "8px" }}>
                        • HOY
                      </IonText>
                    )}
                  </strong>
                  <p>
                    <IonIcon 
                      icon={calendarOutline} 
                      style={{ marginRight: "4px", fontSize: "12px" }}
                    />
                    Fecha: {formatearFecha(tratamiento.fecha_tratamiento)}
                  </p>
                  <p>{tratamiento.nombre_tratamiento}</p>
                  <p>Dosis: {tratamiento.dosis}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        {/* Botón para actualizar la lista */}
        <IonButton
          fill="clear"
          size="small"
          onClick={cargarTratamientos}
          style={{ marginTop: "0.625rem" }}
          disabled={loading}
        >
          <IonIcon icon={refreshOutline} slot="start" />
          Actualizar
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default CajaVacunas;