import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import "./registroTutor.css";

const RegistroPaciente: React.FC = () => (
  <IonPage>
    <IonHeader translucent={true}>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>Registrar Paciente</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen={true}>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Registrar Paciente</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonList>
        {/* Input Nombre*/}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  label="Nombre"
                  type="text"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Ej: Dani Huenuman"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* Input Rut*/}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  label="Fecha de nacimiento"
                  type="date"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Ej: dd-mm-aaaa"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* Input Direccion*/}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  label="Dirección"
                  type="text"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Ej: Calle Falsa 123"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* Input Teléfono*/}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  label="Teléfono"
                  type="tel"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Ej: 9XXXXXXXX"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* Input Email*/}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  label="Email"
                  type="email"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Ej: govet@paw-solutions.com"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* Botón Registrar */}
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton className="custom-button" expand="block">
                Registrar paciente
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonList>
    </IonContent>
  </IonPage>
);
export default RegistroPaciente;
