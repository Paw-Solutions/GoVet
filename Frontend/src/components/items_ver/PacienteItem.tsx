import React from "react";
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonButtons,
  IonText,
  IonBadge,
  IonAvatar,
} from "@ionic/react";
import {
  pawOutline,
  pencilOutline,
  maleOutline,
  femaleOutline,
  calendarOutline,
  personOutline,
  personSharp,
} from "ionicons/icons";
import { PacienteData } from "../../api/pacientes";
import "../../styles/ver.css";
// Componente: Visualizador del detalle de un paciente
interface PacienteItemProps {
  paciente: PacienteData;
  onView: () => void;
  onEdit: () => void;
  disabled?: boolean;
  showTutor?: boolean;
  editButtonText?: string;
}

const PacienteItem: React.FC<PacienteItemProps> = ({
  paciente,
  onView,
  onEdit,
  disabled = false,
  showTutor = true,
  editButtonText,
}) => {
  // Función para obtener el color del badge según el sexo
  const getSexColor = (sexo?: string) => {
    switch (sexo?.toLowerCase()) {
      case "m":
        return "primary";
      case "h":
        return "secondary";
      default:
        return "medium";
    }
  };

  // Función para obtener el ícono del sexo
  const getSexIcon = (sexo?: string) => {
    //console.log("Sexo del paciente:", sexo);
    switch (sexo?.toLowerCase()) {
      case "m":
        return maleOutline;
      case "h":
        return femaleOutline;
      default:
        return pawOutline;
    }
  };

  // Función para calcular la edad aproximada
  const calculateAge = (fechaNacimiento?: string) => {
    if (!fechaNacimiento) return null;

    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} días`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} meses`;
    } else {
      return `${Math.floor(diffDays / 365)} años`;
    }
  };

  const getIcon = () => {
    if (!paciente.especie) return pawOutline;

    const especies: { [key: string]: string } = {
      perro: "dog.svg",
      gato: "cat.svg",
      conejo: "bunny.svg",
      hamster: "hamster.svg",
      erizo: "hedgehog.svg",
      tortuga: "turtle.svg",
      cuy: "cuy.svg",
    };

    return especies[paciente.especie.toLowerCase()] || pawOutline;
  };

  return (
    <IonItem
      lines="none"
      className="info-card"
      button
      onClick={onView}
      disabled={disabled}
    >
      <IonAvatar slot="start" className="item-icon">
        <IonIcon icon={getIcon()} />
      </IonAvatar>

      <IonLabel style={{ padding: "5px" }}>
        {/* Nombre del paciente */}
        <h2 className="paciente-nombre">
          {paciente.nombre}
          {paciente.sexo && (
            <span style={{ marginLeft: "8px" }}>
              (
              <IonIcon
                icon={getSexIcon(paciente.sexo)}
                className="pacientes-icon"
              />
              )
            </span>
          )}
        </h2>

        {/* Información básica */}
        {paciente.raza && (
          <div>
            <h2>
              <p>
                <IonIcon src="/raza.svg" className="pacientes-icon" />
                <span style={{ marginLeft: "8px" }}>
                  :{" "}
                  {paciente.raza === "DPC (Doméstico de pelo corto o DSH)"
                    ? "DPC"
                    : paciente.raza === "DPL (Doméstico de pelo Largo o DLH)"
                    ? "DPL"
                    : paciente.raza === "DPG (Doméstico de pelo largo o DFL)"
                    ? "DPG"
                    : paciente.raza}{" "}
                  {paciente.fecha_nacimiento && (
                    <IonText style={{ marginLeft: "3px" }}>
                      ({calculateAge(paciente.fecha_nacimiento)})
                    </IonText>
                  )}
                </span>
              </p>
            </h2>
          </div>
        )}
        {paciente.color && (
          <div>
            <h2>
              <p>
                <IonIcon src="/color.svg" className="pacientes-icon" />
                <span style={{ marginLeft: "8px" }}>: {paciente.color}</span>
              </p>
            </h2>
          </div>
        )}

        {/* Información del tutor */}
        {showTutor && (
          <div>
            <h2>
              <p>
                <IonIcon className="pacientes-icon" icon={personOutline} />
                {paciente.tutor?.nombre ? (
                  <span style={{ marginLeft: "8px" }}>
                    : {paciente.tutor.nombre} {paciente.tutor.apellido_paterno}
                  </span>
                ) : (
                  <span style={{ marginLeft: "8px" }}>
                    : Sin tutor asignado
                  </span>
                )}
              </p>
            </h2>
          </div>
        )}
      </IonLabel>

      {/* Botones de acción */}
      <IonButtons slot="end">
        <IonButton
          fill="clear"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          disabled={disabled}
          title={editButtonText}
        >
          {editButtonText ? (
            <span style={{ fontSize: "0.85rem" }}>{editButtonText}</span>
          ) : (
            <IonIcon icon={pencilOutline} slot="icon-only" size="small" />
          )}
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};

export default PacienteItem;
