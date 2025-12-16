import React from "react";
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonBadge,
} from "@ionic/react";
import {
  airplaneOutline,
  documentTextOutline,
  flaskOutline,
  medkitOutline,
  clipboardOutline,
  checkmarkCircle,
} from "ionicons/icons";
import "../../styles/certificados.css";

interface CertificadoCardProps {
  tipo: "transporte" | "consentimiento" | "examenes" | "receta" | "consulta";
  titulo: string;
  descripcion: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const CertificadoCard: React.FC<CertificadoCardProps> = ({
  tipo,
  titulo,
  descripcion,
  selected,
  onClick,
  disabled = false,
}) => {
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "transporte":
        return airplaneOutline;
      case "consentimiento":
        return documentTextOutline;
      case "examenes":
        return flaskOutline;
      case "receta":
        return medkitOutline;
      case "consulta":
        return clipboardOutline;
      default:
        return documentTextOutline;
    }
  };

  return (
    <IonCard
      button
      onClick={onClick}
      disabled={disabled}
      className={`certificado-card ${selected ? "selected" : ""}`}
      style={{
        position: "relative",
        border: selected
          ? "3px solid var(--ion-color-success)"
          : "1px solid var(--border-color)",
        transition: "all 0.2s ease",
      }}
    >
      <IonCardContent style={{ textAlign: "center", padding: "20px" }}>
        {selected && (
          <IonBadge
            color="success"
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
            }}
          >
            <IonIcon icon={checkmarkCircle} style={{ fontSize: "20px" }} />
          </IonBadge>
        )}

        <IonIcon
          icon={getIcon(tipo)}
          style={{
            fontSize: "48px",
            color: selected
              ? "var(--ion-color-success)"
              : "var(--ion-color-primary)",
            marginBottom: "12px",
          }}
        />

        <IonText>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: selected
                ? "var(--ion-color-success)"
                : "var(--text-color)",
              marginBottom: "8px",
            }}
          >
            {titulo}
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-color-secondary)",
              margin: 0,
            }}
          >
            {descripcion}
          </p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default CertificadoCard;
