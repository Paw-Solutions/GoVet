import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { home, eye, add, calendar, menu } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "./BarraLateral.css";

const BarraLateral: React.FC = () => {
  const history = useHistory();

  const navegarARegistroTutor = () => {
    history.push("/registro-tutor");
  };

  const navegarARegistroPaciente = () => {
    history.push("/registro-paciente");
  };

  const navegarAHome = () => {
    history.push("/");
  };

  return (
    <IonMenu contentId="main-content" side="start" menuId="main-menu">
      <IonContent>
        <IonList>
          {/* Íconos de navegación centrados */}
          <IonItem button lines="none">
            <IonIcon icon={menu} />
          </IonItem>
          <IonItem button lines="none" onClick={navegarAHome}>
            <IonIcon icon={home} />
          </IonItem>
          <IonItem button lines="none">
            <IonIcon icon={eye} />
          </IonItem>
          <IonItem button lines="none" onClick={navegarARegistroTutor}>
            <IonIcon icon={add} />
          </IonItem>
          <IonItem button lines="none">
            <IonIcon icon={calendar} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default BarraLateral;
