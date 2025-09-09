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
import "./RegistroPacienteTutor.css";
import { useState } from "react";

const RegistroPacienteTutor: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle slot="start">Registrar paciente</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      {/* Sección paciente */}
      <IonList>
        {/* Input Nombre*/}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonLabel position="stacked" className="input-custom-font">
                  Nombre
                </IonLabel>
                <IonInput
                  type="text"
                  placeholder="Ej: Copito, Luna, etc."
                  className="input-box"
                />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* Especie*/}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonLabel position="stacked" className="input-custom-font">
                  Especie
                </IonLabel>
                <IonSelect
                  interface="popover"
                  placeholder="Seleccione la especie"
                  className="input-box"
                >
                  <IonSelectOption value="perro">Perro</IonSelectOption>
                  <IonSelectOption value="gato">Gato</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem lines="none">
                <IonRadioGroup>
                  <IonLabel position="stacked" className="input-custom-font">
                    Sexo
                  </IonLabel>
                  <IonRow>
                    <IonCol size="auto">
                      <IonRadio value="M" labelPlacement="end">
                        M
                      </IonRadio>
                    </IonCol>
                    <IonCol size="auto">
                      <IonRadio value="F" labelPlacement="end">
                        F
                      </IonRadio>
                    </IonCol>
                  </IonRow>
                </IonRadioGroup>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* Input Fecha de nacimiento y sexo */}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none" className="fecha-nacimiento-inline">
                <IonLabel position="stacked" className="input-custom-font">
                  Fecha de nacimiento
                </IonLabel>
                <IonInput type="date" className="input-box" />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* Input Raza y Color*/}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonLabel position="stacked" className="input-custom-font">
                  Raza
                </IonLabel>
                <IonInput type="text" placeholder="Ej: Mestizo, Poodle, etc." />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem lines="none">
                <IonLabel position="stacked" className="input-custom-font">
                  Color
                </IonLabel>
                <IonInput type="text" placeholder="Ej: Naranjo, etc." />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonList>
      {/* Sección tutor */}
      <IonList>
        <IonGrid>
          <IonCol>
            <IonLabel>Registrar tutor</IonLabel>
            <IonItem>
              <IonLabel position="stacked">Nombre del tutor</IonLabel>
              <IonInput type="text" placeholder="Ej: Juan Pérez" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">RUT</IonLabel>
              <IonInput type="text" placeholder="XX.XXX.XXX-X" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Correo electrónico</IonLabel>
              <IonInput type="email" placeholder="paciente@email.com" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Número telefónico</IonLabel>
              <IonInput type="tel" placeholder="569 123456789" />
            </IonItem>

            <IonButton expand="full" color="primary">
              Registrar
            </IonButton>
          </IonCol>
        </IonGrid>
      </IonList>
    </IonContent>
  </IonPage>
);

export default RegistroPacienteTutor;
