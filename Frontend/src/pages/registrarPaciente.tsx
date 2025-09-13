import React, { useState } from "react";
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
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
} from "@ionic/react";
import "./registroPaciente.css";

const RegistroPaciente: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    sexo: "",
    color: "",
    fechaNacimiento: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sexo: value,
    }));
  };

  const registrarPaciente = async () => {
    // Aquí podrías enviar los datos a tu API
    setToastMessage("Paciente registrado (simulado)");
    setShowToast(true);
    // Limpiar formulario si lo deseas
    // setFormData({ nombre: "", especie: "", raza: "", sexo: "", color: "", fechaNacimiento: "" });
  };

  return (
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
                    name="nombre"
                    value={formData.nombre}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* Input Especie*/}
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    label="Especie"
                    type="text"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="Ej: Perro"
                    name="especie"
                    value={formData.especie}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* Input Raza y Sexo*/}
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    label="Raza"
                    type="text"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="Ej: Golden Retriever"
                    name="raza"
                    value={formData.raza}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem lines="none">
                  <IonRadioGroup
                    value={formData.sexo}
                    onIonChange={(e) => handleRadioChange(e.detail.value)}
                  >
                    <IonRadio slot="start" value="macho" />
                    <IonRadio slot="start" value="hembra" />
                  </IonRadioGroup>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* Input Color*/}
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    label="Color"
                    type="text"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="Ej: Naranja demoniaco"
                    name="color"
                    value={formData.color}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* Input Fecha de nacimiento*/}
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
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Botón Registrar */}
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton className="custom-button" expand="block" onClick={registrarPaciente}>
                  Registrar paciente
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonList>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};
export default RegistroPaciente;
