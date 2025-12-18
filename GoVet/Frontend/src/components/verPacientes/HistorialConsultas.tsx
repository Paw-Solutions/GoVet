import React, { useState, useEffect } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonList,
  IonSpinner,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import {
  closeOutline,
  calendarOutline,
  documentTextOutline,
} from "ionicons/icons";
import { PacienteData } from "../../api/pacientes";
import { ConsultaData } from "../../api/fichas";
import FichaItem from "../items_ver/FichaItem";
import { useAuth } from "../../hooks/useAuth";
import { fetchWithAuth } from "../../api/http";

interface HistorialConsultasProps {
  isOpen: boolean;
  onDismiss: () => void;
  paciente: PacienteData | null;
  onViewConsulta: (consulta: ConsultaData) => void;
}

const HistorialConsultas: React.FC<HistorialConsultasProps> = ({
  isOpen,
  onDismiss,
  paciente,
  onViewConsulta,
}) => {
  const {idToken} = useAuth();
  const [consultas, setConsultas] = useState<ConsultaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  // Cargar consultas cuando se abre el modal
  useEffect(() => {
    console.log(
      "HistorialConsultas useEffect - isOpen:",
      isOpen,
      "paciente:",
      paciente
    );
    if (isOpen && paciente) {
      loadConsultas();
    }
  }, [isOpen, paciente]);

  const loadConsultas = async () => {
    if (!paciente) return;

    console.log(
      "Cargando consultas para paciente ID:",
      paciente.id_paciente
    );
    setLoading(true);
    setError("");

    try {
      const response = await fetchWithAuth(
        `${API_URL}/consultas/paciente/id/${paciente.id_paciente}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        idToken
      );

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error("Error al cargar consultas");
      }

      const data = await response.json();
      console.log("Consultas recibidas:", data);

      // Ordenar consultas por fecha (más recientes primero)
      const consultasOrdenadas = data.sort(
        (a: ConsultaData, b: ConsultaData) => {
          const fechaA = new Date(a.fecha_consulta);
          const fechaB = new Date(b.fecha_consulta);
          return fechaB.getTime() - fechaA.getTime();
        }
      );

      setConsultas(consultasOrdenadas);
    } catch (err) {
      console.error("Error cargando consultas:", err);
      setError("No se pudieron cargar las consultas del paciente");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setConsultas([]);
    setError("");
    onDismiss();
  };

  const handleViewConsulta = (consulta: ConsultaData) => {
    onViewConsulta(consulta);
    handleDismiss(); // Cerrar el historial y abrir el detalle de la consulta
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Historial de {paciente?.nombre || "Paciente"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleDismiss}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon
                icon={documentTextOutline}
                style={{ marginRight: "8px" }}
              />
              Consultas Registradas
            </IonCardTitle>
          </IonCardHeader>
        </IonCard>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <IonSpinner name="crescent" />
            <p>Cargando historial...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
            <IonButton fill="outline" onClick={loadConsultas}>
              Reintentar
            </IonButton>
          </div>
        )}

        {!loading && !error && consultas.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <IonIcon
              icon={calendarOutline}
              style={{ fontSize: "64px", color: "var(--ion-color-medium)" }}
            />
            <IonText color="medium">
              <p>Este paciente no tiene consultas registradas</p>
            </IonText>
          </div>
        )}

        {!loading && !error && consultas.length > 0 && (
          <>
            <div style={{ padding: "0 16px", marginBottom: "8px" }}>
              <IonText color="medium">
                <p>Total de consultas: {consultas.length}</p>
              </IonText>
            </div>

            <IonList>
              {consultas.map((consulta, index) => (
                <FichaItem
                  key={`${consulta.id_consulta}-${index}`}
                  consulta={consulta}
                  onView={() => handleViewConsulta(consulta)}
                  onEdit={() => {}} // No permitir editar desde el historial
                  onExport={() => {}} // No permitir exportar desde el historial
                  disabled={false}
                />
              ))}
            </IonList>
          </>
        )}

        <div style={{ padding: "20px", textAlign: "center" }}>
          <IonButton expand="block" fill="outline" onClick={handleDismiss}>
            Cerrar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default HistorialConsultas;
