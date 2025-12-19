import React, { useState, useEffect } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonIcon,
  IonRadioGroup,
  IonRadio,
} from "@ionic/react";
import { closeOutline, checkmarkOutline } from "ionicons/icons";
import type { ConsultaData } from "../../api/fichas";
import { useAuth } from "../../hooks/useAuth";
import { fetchWithAuth } from "../../api/http";

interface ModalSeleccionarConsultaProps {
  isOpen: boolean;
  onClose: () => void;
  onConsultaSeleccionada: (idConsulta: number) => void;
  idPaciente: number;
}

const ModalSeleccionarConsulta: React.FC<ModalSeleccionarConsultaProps> = ({
  isOpen,
  onClose,
  onConsultaSeleccionada,
  idPaciente,
}) => {
  const { sessionToken } = useAuth();
  const [consultas, setConsultas] = useState<ConsultaData[]>([]);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  useEffect(() => {
    if (isOpen && idPaciente) {
      cargarConsultas();
    }
  }, [isOpen, idPaciente]);

  const cargarConsultas = async () => {
    setLoading(true);
    setError(null);
    try {
      //console.log("Cargando consultas para paciente ID:", idPaciente);

      const response = await fetchWithAuth(
        `${API_URL}/consultas/paciente/id/${idPaciente}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        sessionToken
      );

      //console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Error al cargar consultas");
      }

      const data = await response.json();
      //console.log("Consultas recibidas:", data);

      // Ordenar consultas por fecha (más recientes primero)
      const consultasOrdenadas = data.sort(
        (a: ConsultaData, b: ConsultaData) => {
          const fechaA = new Date(a.fecha_consulta);
          const fechaB = new Date(b.fecha_consulta);
          return fechaB.getTime() - fechaA.getTime();
        }
      );

      setConsultas(consultasOrdenadas);

      if (consultasOrdenadas.length === 0) {
        setError("Este paciente no tiene consultas registradas.");
      }
    } catch (err) {
      console.error("Error al cargar consultas:", err);
      setError("Error al cargar las consultas del paciente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = () => {
    if (consultaSeleccionada !== null) {
      onConsultaSeleccionada(consultaSeleccionada);
      handleCerrar();
    }
  };

  const handleCerrar = () => {
    setConsultaSeleccionada(null);
    setError(null);
    onClose();
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCerrar}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Seleccionar Consulta</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCerrar}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <IonSpinner name="crescent" />
            <IonText>
              <p>Cargando consultas...</p>
            </IonText>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          </div>
        )}

        {!loading && !error && consultas.length > 0 && (
          <>
            <IonText>
              <p>Selecciona la consulta para generar el certificado:</p>
            </IonText>
            <IonRadioGroup
              value={consultaSeleccionada}
              onIonChange={(e) => setConsultaSeleccionada(e.detail.value)}
            >
              <IonList>
                {consultas.map((consulta) => (
                  <IonItem key={consulta.id_consulta}>
                    <IonRadio slot="start" value={consulta.id_consulta} />
                    <IonLabel>
                      <h2>{formatearFecha(consulta.fecha_consulta)}</h2>
                      <p>
                        <strong>Motivo:</strong> {consulta.motivo}
                      </p>
                      {consulta.prediagnostico && (
                        <p>
                          <strong>Diagnóstico:</strong>{" "}
                          {consulta.prediagnostico}
                        </p>
                      )}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonRadioGroup>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <IonButton
                expand="block"
                onClick={handleConfirmar}
                disabled={consultaSeleccionada === null}
              >
                <IonIcon slot="start" icon={checkmarkOutline} />
                Confirmar Selección
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonModal>
  );
};

export default ModalSeleccionarConsulta;
