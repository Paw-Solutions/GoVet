import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { home, eye, document, add, calendar } from "ionicons/icons";
import RegistroPacienteTutor from "../pages/RegistroPacienteTutor";
import "./BarraLateral.css";

const BarraLateral: React.FC = () => (
  <IonMenu contentId="main-content" side="start" menuId="main-menu">
    <IonContent>
      <IonList>
        {/* Agrega tus íconos y rutas según el wireframe */}
        <IonItem routerLink="/">
          <IonIcon icon={add} slot="start" />
        </IonItem>
        {/* Más íconos y rutas aquí */}
      </IonList>
    </IonContent>
  </IonMenu>
);

export default BarraLateral;
