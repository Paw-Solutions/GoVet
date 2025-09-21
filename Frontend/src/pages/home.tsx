import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/react";
import { add, logoApple, pawOutline, personAddOutline, settingsSharp } from "ionicons/icons";
import { useHistory } from "react-router-dom";

const Home: React.FC = () => {
  const history = useHistory();

  const navegarARegistroTutor = () => {
    history.push("/registro-tutor");
  };

  const navegarARegistroPaciente = () => {
    history.push("/registro-paciente");
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inicio</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow>
            <IonButton
              className="custom-button"
              expand="block"
              onClick={navegarARegistroTutor}
              style={{ margin: "10px 0" }}
            >
              <IonIcon className="button-icon" slot="icon-only" ios={personAddOutline} md={personAddOutline}></IonIcon>
              Registro Tutor
            </IonButton>
          </IonRow>
          <IonRow>
            <IonButton
              className="custom-button"
              expand="block"
              onClick={navegarARegistroPaciente}
              style={{ margin: "10px 0" }}
            >
              <IonIcon className="button-icon" slot="icon-only" ios={pawOutline} md={pawOutline}></IonIcon>
              Registro Paciente
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
