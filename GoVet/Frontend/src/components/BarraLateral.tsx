import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
} from "@ionic/react";
import { home, eye, search, calendar, menu } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "../styles/BarraLateral.css";

const BarraLateral: React.FC = () => {
  const history = useHistory(); /* Hook para navegación programática */

  const navegarARegistroTutor = () => {
    history.push("/registro-tutor");
    cerrarMenu();
  };

  const navegarARegistroPaciente = () => {
    history.push("/registro-paciente");
    cerrarMenu();
  };

  const navegarAHome = () => {
    history.push("/");
    cerrarMenu();
  };

  const navegarAVer = () => {
    history.push("/ver");
    cerrarMenu();
  };

  const navegarACalendario = () => {
    history.push("/calendario");
    cerrarMenu();
  };

  const cerrarMenu = () => {
    const menu = document.querySelector("ion-menu");
    if (menu) {
      menu.close();
    }
  };

  return (
    <IonMenu
      contentId="main-content"
      side="start"
      menuId="main-menu"
      type="overlay"
    >
      <IonContent>
        <IonList>
          {/* Íconos de navegación centrados */}
          <IonItem button lines="none" onClick={cerrarMenu}>
            <IonIcon icon={menu} />
          </IonItem>
          <IonItem button lines="none" onClick={navegarAHome}>
            <IonIcon icon={home} />
          </IonItem>
          <IonItem button lines="none" onClick={navegarAVer}>
            <IonIcon icon={search} />
          </IonItem>
          <IonItem button lines="none" onClick={navegarACalendario}>
            <IonIcon icon={calendar} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default BarraLateral;
