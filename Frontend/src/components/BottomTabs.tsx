import React from "react";
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import {
  home,
  homeOutline,
  search,
  searchOutline,
  calendar,
  calendarOutline,
  personAddOutline,
  pawOutline,
  clipboardOutline,
  addCircleOutline,
} from "ionicons/icons";
import { useLocation, useHistory } from "react-router-dom";
import "../styles/BottomTabs.css";

const BottomTabs: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleAgendarClick = (e: CustomEvent) => {
    e.preventDefault();
    history.push("/calendario?abrirModal=true");
  };

  return (
    <IonTabBar slot="bottom" className="bottom-tabs">
      {/* Home */}
      <IonTabButton tab="home" href="/" className="tab-button">
        <IonIcon
          icon={isActive("/") && location.pathname === "/" ? home : homeOutline}
        />
        <IonLabel>Inicio</IonLabel>
      </IonTabButton>

      {/* Ver/Buscar */}
      <IonTabButton tab="ver" href="/ver" className="tab-button">
        <IonIcon icon={isActive("/ver") ? search : searchOutline} />
        <IonLabel>Buscar</IonLabel>
      </IonTabButton>

      {/* Calendario */}
      <IonTabButton tab="calendario" href="/calendario" className="tab-button">
        <IonIcon icon={isActive("/calendario") ? calendar : calendarOutline} />
        <IonLabel>Citas</IonLabel>
      </IonTabButton>

      {/* Registrar Tutor */}
      <IonTabButton
        tab="registro-tutor"
        href="/registro-tutor"
        className="tab-button"
      >
        <IonIcon icon={personAddOutline} />
        <IonLabel>Tutor</IonLabel>
      </IonTabButton>

      {/* Registrar Mascota */}
      <IonTabButton
        tab="registro-paciente"
        href="/registro-paciente"
        className="tab-button"
      >
        <IonIcon icon={pawOutline} />
        <IonLabel>Mascota</IonLabel>
      </IonTabButton>

      {/* Generar Ficha */}
      <IonTabButton
        tab="rellenar-ficha"
        href="/rellenar-ficha"
        className="tab-button"
      >
        <IonIcon icon={clipboardOutline} />
        <IonLabel>Ficha</IonLabel>
      </IonTabButton>

      {/* Generar Cita */}
      <IonTabButton
        tab="agendar-cita"
        className="tab-button"
        onClick={handleAgendarClick}
      >
        <IonIcon icon={addCircleOutline} />
        <IonLabel>Agendar</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default BottomTabs;
