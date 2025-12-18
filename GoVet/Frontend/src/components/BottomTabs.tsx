import React, { useState } from "react";
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPopover,
  IonButton,
} from "@ionic/react";
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
  add,
  settings,
  settingsOutline,
  close,
  addCircleOutline,
  documentTextOutline,
} from "ionicons/icons";
import { useLocation, useHistory } from "react-router-dom";
import "../styles/BottomTabs.css";

const BottomTabs: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<Event | undefined>(
    undefined
  );

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handlePopoverDismiss = () => {
    setIsPopoverOpen(false);
    setPopoverEvent(undefined);
  };

  const handleNavigate = (path: string) => {
    history.push(path);
    handlePopoverDismiss();
  };

  return (
    <>
      <IonTabBar slot="bottom" className="bottom-tabs">
        {/* Home */}
        <IonTabButton tab="home" href="/" className="tab-button">
          <IonIcon
            icon={
              isActive("/") && location.pathname === "/" ? home : homeOutline
            }
          />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>

        {/* Ver/Buscar */}
        <IonTabButton tab="ver" href="/ver" className="tab-button">
          <IonIcon icon={isActive("/ver") ? search : searchOutline} />
          <IonLabel>Buscar</IonLabel>
        </IonTabButton>

        {/* Añadir */}
        <IonTabButton
          tab="add"
          className="tab-button tab-button-add"
          onPointerDown={(event: React.PointerEvent) => {
            setPopoverEvent(event.nativeEvent);
          }}
          onClick={(event: CustomEvent) => {
            event.preventDefault();
            setIsPopoverOpen(true);
          }}
        >
          <IonIcon icon={add} />
          <IonLabel>Añadir</IonLabel>
        </IonTabButton>

        {/* Calendario */}
        <IonTabButton
          tab="calendario"
          href="/calendario"
          className="tab-button"
        >
          <IonIcon
            icon={isActive("/calendario") ? calendar : calendarOutline}
          />
          <IonLabel>Citas</IonLabel>
        </IonTabButton>

        {/* Ajustes */}
        <IonTabButton tab="ajustes" href="/ajustes" className="tab-button">
          <IonIcon icon={isActive("/ajustes") ? settings : settingsOutline} />
          <IonLabel>Ajustes</IonLabel>
        </IonTabButton>
      </IonTabBar>

      <IonPopover
        isOpen={isPopoverOpen}
        event={popoverEvent}
        onDidDismiss={handlePopoverDismiss}
        showBackdrop={true}
        side="top"
        alignment="center"
        className="add-popover"
      >
        <div className="popover-content">
          <IonButton
            fill="solid"
            expand="block"
            onClick={() => handleNavigate("/registro-tutor")}
            className="opcion-menu"
          >
            <IonIcon icon={personAddOutline} slot="start" />
            <span>Registrar Tutor</span>
          </IonButton>
          <IonButton
            fill="solid"
            expand="block"
            onClick={() => handleNavigate("/registro-paciente")}
            className="opcion-menu"
          >
            <IonIcon icon={pawOutline} slot="start" />
            <span>Registrar Mascota</span>
          </IonButton>
          <IonButton
            fill="solid"
            expand="block"
            onClick={() => handleNavigate("/rellenar-ficha")}
            className="opcion-menu"
          >
            <IonIcon icon={clipboardOutline} slot="start" />
            <span>Generar Ficha</span>
          </IonButton>
          <IonButton
            fill="solid"
            expand="block"
            onClick={() => handleNavigate("/certificados")}
            className="opcion-menu"
          >
            <IonIcon icon={documentTextOutline} slot="start" />
            <span>Generar Certificado</span>
          </IonButton>
          <IonButton
            fill="solid"
            expand="block"
            onClick={() => handleNavigate("/calendario?abrirModal=true")}
            className="opcion-menu"
          >
            <IonIcon icon={addCircleOutline} slot="start" />
            <span>Agendar Cita</span>
          </IonButton>
          <IonButton
            fill="solid"
            expand="block"
            onClick={handlePopoverDismiss}
            className="opcion-menu opcion-menu-cancel"
          >
            <IonIcon icon={close} slot="start" />
            <span>Cancelar</span>
          </IonButton>
        </div>
      </IonPopover>
    </>
  );
};

export default BottomTabs;
