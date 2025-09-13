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
import "./registroTutor.css";

const RegistroTutor: React.FC = () => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    direccion: '',
    telefono: '',
    email: ''
  });
  
  // Estado para mostrar mensaje de éxito/error
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

  // Función para registrar tutor
  const registra_tutor = async () => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT/tutores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setToastMessage('Tutor registrado exitosamente');
        // Limpiar formulario
        setFormData({
          nombre: '',
          rut: '',
          direccion: '',
          telefono: '',
          email: ''
        });
      } else {
        setToastMessage('Error al registrar tutor');
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
          <IonTitle>Registrar Tutor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Registrar Tutor</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
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
                    name="rut"
                    value={formData.rut}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

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
                    name="direccion"
                    value={formData.direccion}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

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
                    name="telefono"
                    value={formData.telefono}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

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
                    name="email"
                    value={formData.email}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton 
                  className="custom-button" 
                  expand="block"
                  onClick={registra_tutor}
                >
                  Registrar tutor
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

export default RegistroTutor;
