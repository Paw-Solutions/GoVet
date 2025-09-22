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
  IonText,
} from "@ionic/react";
import "../styles/registroTutor.css";
import Example from "../components/ejemploTel";

const RegistroTutor: React.FC = () => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    rut: "",
    direccion: "",
    celular: 0,
    celular2: 0,
    telefono: 0,
    telefono2: 0,
    comuna: "",
    region: "",
    email: "",
  });

  const handlePhoneChange = (phone: string) => {
    console.log("Número recibido del hijo:", phone);
    // Aquí lo puedes guardar en un state global, enviar al backend, etc.
  };
  // Estado para mostrar mensaje de éxito/error
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Manejador de cambios en los inputs
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para registrar tutor
  const registra_tutor = async () => {
    try {
      const response = await fetch("http://localhost:8000/tutores/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToastMessage("Tutor registrado exitosamente");
        // Limpiar formulario
        setFormData({
          nombre: "",
          apellido_materno: "",
          apellido_paterno: "",
          rut: "",
          direccion: "",
          telefono: 9,
          telefono2: 0,
          comuna: "",
          region: "",
          celular: 9,
          celular2: 9,
          email: "",
        });
      } else {
        setToastMessage("Error al registrar tutor");
      }
    } catch (error) {
      setToastMessage("Error de conexión");
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
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Daniela"
                    name="nombre"
                    value={formData.nombre}
                    onIonChange={handleInputChange}
                  >
                    <div slot="label">
                      Nombre <IonText color="danger">(*)</IonText>
                    </div>
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow className="apellidos">
              <IonCol>
                <IonItem lines="none" className="apellido-paterno">
                  <IonInput
                    required
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Huenuman"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onIonChange={handleInputChange}
                  >
                    <div slot="label">
                      Apellido Paterno <IonText color="danger">(*)</IonText>
                    </div>
                  </IonInput>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem lines="none" className="apellido-materno">
                  <IonInput
                    className="apellido-materno"
                    label="Apellido Materno"
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Oliva"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="12345678-9"
                    name="rut"
                    value={formData.rut}
                    onIonChange={handleInputChange}
                  >
                    <div slot="label">
                      RUT <IonText color="danger">(*)</IonText>
                    </div>
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Calle Falsa 123"
                    name="direccion"
                    value={formData.direccion}
                    onIonChange={handleInputChange}
                  >
                    <div slot="label">
                      Dirección <IonText color="danger">(*)</IonText>
                    </div>
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    type="tel"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="9XXXXXXXX"
                    name="telefono"
                    value={formData.telefono}
                    onIonChange={handleInputChange}
                  >
                    <div slot="label">Teléfono</div>
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <Example onPhoneChange={handlePhoneChange} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="XIV Los Ríos"
                    name="region"
                    value={formData.region}
                    onIonChange={handleInputChange}
                  >
                    <div slot="label">Región</div>
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Valdivia"
                    name="comuna"
                    value={formData.comuna}
                    onIonChange={handleInputChange}
                  >
                    <div slot="label">Comuna</div>
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    required
                    type="email"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="govet@paw-solutions.com"
                    name="email"
                    value={formData.email}
                    onIonChange={handleInputChange}
                  >
                    <div slot="label">
                      Email <IonText color="danger">(*)</IonText>
                    </div>
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
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
