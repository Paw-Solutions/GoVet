import React from "react";
import {
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";
import {
  pawOutline,
  personOutline,
  calendarOutline,
  informationCircleOutline,
  swapHorizontalOutline,
} from "ionicons/icons";
import { PacienteData } from "../../api/pacientes";

interface PatientHeaderProps {
  paciente: PacienteData;
  motivo?: string;
  onChangePaciente?: () => void;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({
  paciente,
  motivo,
  onChangePaciente,
}) => {
  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <IonCard
      style={{
        margin: "16px 16px 8px 16px",
        borderLeft: "4px solid var(--ion-color-primary)",
      }}
    >
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <IonIcon icon={pawOutline} color="primary" />
                <IonText>
                  <strong style={{ fontSize: "18px" }}>
                    {paciente.nombre}
                  </strong>
                </IonText>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}
              >
                <IonIcon icon={informationCircleOutline} />
                <span>
                  {paciente.especie} · {paciente.raza} ·{" "}
                  {paciente.sexo === "M" ? "Macho" : "Hembra"}
                </span>
              </div>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {paciente.fecha_nacimiento && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <IonIcon icon={calendarOutline} />
                    <span>
                      Edad: {calcularEdad(paciente.fecha_nacimiento)} años
                    </span>
                  </div>
                )}
                {paciente.tutor && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <IonIcon icon={personOutline} />
                    <span>
                      {paciente.tutor.nombre} {paciente.tutor.apellido_paterno}
                    </span>
                  </div>
                )}
                {onChangePaciente && (
                  <IonButton
                    fill="outline"
                    size="small"
                    onClick={onChangePaciente}
                    style={{ marginTop: "4px" }}
                  >
                    <IonIcon icon={swapHorizontalOutline} slot="start" />
                    Cambiar Paciente
                  </IonButton>
                )}
              </div>
            </IonCol>
          </IonRow>
          {motivo && (
            <IonRow style={{ marginTop: "12px" }}>
              <IonCol size="12">
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "var(--ion-color-light)",
                    borderRadius: "8px",
                    borderLeft: "3px solid var(--ion-color-primary)",
                  }}
                >
                  <IonText color="medium">
                    <strong>Motivo de Consulta:</strong>
                  </IonText>
                  <IonText style={{ display: "block", marginTop: "4px" }}>
                    {motivo}
                  </IonText>
                </div>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default PatientHeader;
