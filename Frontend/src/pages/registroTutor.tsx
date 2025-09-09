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

const RegistroTutor: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle slot="start">Registrar tutor</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
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
                  label="RUT"
                  type="text"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Ej: 99999999-9"
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
                Registrar tutor
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonList>
    </IonContent>
  </IonPage>
);
export default RegistroTutor;
