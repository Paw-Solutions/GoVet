import React from "react";
import { IonCard, IonCardContent, IonIcon, IonText } from "@ionic/react";
import "../../styles/ModuleCard.css";

interface ModuleCardProps {
  title: string;
  icon: string;
  iconType?: "ionicon" | "svg";
  status: "empty" | "complete" | "incomplete" | "visited";
  onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  icon,
  iconType = "ionicon",
  status,
  onClick,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "complete":
        return "#2dd36f"; // Verde para completo
      case "incomplete":
        return "#ffc409"; // Amarillo para incompleto
      case "visited":
        return "#eb445a"; // Rojo para visitado sin datos
      default:
        return "#92949c"; // Gris para vacío
    }
  };

  const getSvgFilter = () => {
    switch (status) {
      case "complete":
        // Verde #2dd36f
        return "invert(64%) sepia(57%) saturate(506%) hue-rotate(92deg) brightness(93%) contrast(86%)";
      case "incomplete":
        // Amarillo #ffc409
        return "invert(79%) sepia(72%) saturate(1203%) hue-rotate(359deg) brightness(102%) contrast(101%)";
      case "visited":
        // Rojo #eb445a
        return "invert(35%) sepia(91%) saturate(2096%) hue-rotate(338deg) brightness(94%) contrast(89%)";
      default:
        // Gris #92949c
        return "invert(62%) sepi a(6%) saturate(235%) hue-rotate(185deg) brightness(92%) contrast(88%)";
    }
  };

  return (
    <IonCard
      button
      onClick={onClick}
      className="module-card"
      style={{
        border: `3px solid ${getStatusColor()}`,
        margin: "0",
        cursor: "pointer",
        height: "140px",
      }}
    >
      <IonCardContent className="module-card-content">
        {iconType === "svg" ? (
          <img
            src={icon}
            alt={title}
            style={{
              width: "56px",
              height: "56px",
              marginBottom: "12px",
              filter: getSvgFilter(),
            }}
          />
        ) : (
          <IonIcon
            icon={icon}
            style={{
              fontSize: "56px",
              color: getStatusColor(),
              marginBottom: "12px",
            }}
          />
        )}
        <IonText>
          <h3
            style={{
              margin: 0,
              fontSize: "13px",
              textAlign: "center",
              fontWeight: "600",
              lineHeight: "1.2",
            }}
          >
            {title}
          </h3>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default ModuleCard;
