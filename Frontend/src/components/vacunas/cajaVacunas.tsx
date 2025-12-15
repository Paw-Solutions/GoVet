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
  refreshOutline,
  radioButtonOnOutline,
} from "ionicons/icons";
import { obtenerTratamientosProximos, ConsultaTratamiento } from "../../api/tratamientos";
import { useAuth } from "../../hooks/useAuth";
// Componente: Visualizador de próximas vacunas
interface CajaVacunasProps {
  limite?: number; // Número máximo de tratamientos a mostrar
}

const CajaVacunas: React.FC<CajaVacunasProps> = ({ limite = 5 }) => {
  const {idToken} = useAuth();
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

  const getCuentaRegresiva = (fechaTratamiento: string) => {
    const hoy = new Date();
    const fecha = new Date(fechaTratamiento);
    const diffTime = fecha.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getColorCuentaRegresiva = (dias: number) => {
    if (dias < 3) return "danger";
    if (dias < 7) return "warning";
    return "primary";
  };

  // Función para cargar los tratamientos
  const cargarTratamientos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await obtenerTratamientosProximos(idToken);
      
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
                  <p>
                  <IonIcon src="/vaccine.svg" style={{ marginRight: "4px", fontSize: "12px" }} />
                  {tratamiento.nombre_tratamiento}: {tratamiento.dosis}
                  </p>
                </IonLabel>
                <IonIcon icon={radioButtonOnOutline} color={getColorCuentaRegresiva(getCuentaRegresiva(tratamiento.fecha_tratamiento))} style={{marginRight: "8px", marginTop: "4px"}}/>
                <p style={{ marginTop: "6px" }}>
                  {getCuentaRegresiva(tratamiento.fecha_tratamiento) === 0
                    ? "Hoy"
                    : `${getCuentaRegresiva(tratamiento.fecha_tratamiento)} días`} 
                </p>
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