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
} from "@ionic/react";
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
            <IonCol className="ion-text-center">
              <IonButton
                expand="block"
                onClick={navegarARegistroTutor}
                style={{ margin: "10px 0" }}
              >
                Registro Tutor
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton
                expand="block"
                onClick={navegarARegistroPaciente}
                style={{ margin: "10px 0" }}
              >
                Registro Paciente KJSLKDJads
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
