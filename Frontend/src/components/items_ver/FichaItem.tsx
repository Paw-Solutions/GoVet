import React from "react";
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonButtons,
  IonAvatar,
} from "@ionic/react";
import {
  personOutline,
  pencilOutline,
  pawOutline,
  shareOutline,
  calendarOutline,
  documentTextOutline,
} from "ionicons/icons";
import { ConsultaData } from "../../api/fichas";
// Componente: Visualizador del detalle de una ficha clínica
interface ConsultaItemProps {
  consulta: ConsultaData;
  onView: () => void;
  onEdit: () => void;
  onExport: () => void;
  disabled: boolean;
}
import "../../styles/ver.css";

const FichaItem: React.FC<ConsultaItemProps> = ({
  consulta,
  onView,
  onEdit,
  onExport,
  disabled,
}) => {
  // Función para obtener el icono según la especie del paciente
  const getIcon = () => {
    if (!consulta?.paciente?.especie) return pawOutline;

    const especies: { [key: string]: string } = {
      perro: "dog.svg",
      gato: "cat.svg",
      conejo: "rabbit.svg",
      hamster: "hamster.svg",
      erizo: "hedgehog.svg",
      tortuga: "turtle.svg",
      cuy: "cuy.svg",
    };

    return especies[consulta.paciente.especie.toLowerCase()] || pawOutline;
  };

  // Función para formatear la fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sin fecha";

    const date = new Date(dateString);
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
          {consulta?.paciente?.nombre || "Sin nombre"}
        </h2>

        {/* Fecha de consulta */}
        {consulta.fecha_consulta && (
          <div>
            <h2>
              <p>
                <IonIcon icon={calendarOutline} className="pacientes-icon" />
                <span style={{ marginLeft: "8px" }}>
                  : {formatDate(consulta.fecha_consulta)}
                </span>
              </p>
            </h2>
          </div>
        )}

        {/* Motivo de consulta */}
        {(consulta.motivo || consulta.motivo_consulta) && (
          <div>
            <h2>
              <p>
                <IonIcon
                  icon={documentTextOutline}
                  className="pacientes-icon"
                />
                <span style={{ marginLeft: "8px" }}>
                  : {consulta.motivo || consulta.motivo_consulta}
                </span>
              </p>
            </h2>
          </div>
        )}

        {/* Información del tutor */}
        {consulta.tutor && (
          <div>
            <h2>
              <p>
                <IonIcon className="pacientes-icon" icon={personOutline} />
                <span style={{ marginLeft: "8px" }}>
                  : {consulta.tutor.nombre}{" "}
                  {consulta.tutor.apellido_paterno || ""}
                </span>
              </p>
            </h2>
          </div>
        )}
      </IonLabel>

      <IonButtons slot="end">
        <IonButton
          fill="clear"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          disabled={disabled}
        >
          <IonIcon
            className="icon"
            icon={pencilOutline}
            slot="icon-only"
            size="small"
          />
        </IonButton>
        <IonButton
          fill="clear"
          onClick={(e) => {
            e.stopPropagation();
            onExport();
          }}
          disabled={disabled}
        >
          <IonIcon
            className="icon"
            icon={shareOutline}
            slot="icon-only"
            size="small"
          />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};

export default FichaItem;
