import { useState } from "react";
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
  IonToast,
} from "@ionic/react";
import "./registroPaciente.css";
import "./main.css";

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
  const [toastMessage, setToastMessage] = useState('');

  // Manejador de cambios en los inputs
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const registraPaciente = async () => {
    try {
      const response = await fetch('DaniAPI/tutores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setToastMessage('Paciente registrado exitosamente');
        // Limpiar formulario
        setFormData({
          nombre: '',
          especie: '',
          raza: '',
          sexo: '',
          color: '',
          fechaNacimiento: ''
        });
      } else {
        setToastMessage('Error al registrar paciente');
      }
    } catch (error) {
      setToastMessage('Error de conexión');
    }
    setShowToast(true);
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
                    placeholder="Ej: copito"
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
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem lines="none">
                  <IonRadioGroup className="radio-group-spaced">
                    <IonRadio slot="start" value="macho">
                      M
                    </IonRadio>

                    <IonRadio slot="start" value="hembra">
                      H
                    </IonRadio>
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
                    type="tel"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="Ej: Naranja demoniaco"
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
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Botón Registrar */}
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton className="custom-button" expand="block" onClick={registraPaciente}>
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
          className="custom-toast"
        />
      </IonContent>
    </IonPage>
  );
};
export default RegistroPaciente;
