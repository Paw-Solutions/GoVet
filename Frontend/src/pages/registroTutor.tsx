import { useState, useRef } from "react";
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
import InputTelefono, { InputTelefonoHandle } from "../components/registroTutor/inputTelefono";
import InputRut, { InputRutHandle } from "../components/registroTutor/inputRut";
import { Input } from "postcss";
import { crearTutor } from "../api/tutores";


// Estado para mostrar mensaje de éxito/error (temporal)

const RegistroTutor: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  
  {/* Interfaz para los props del InputRut */}
  const inputRutRef = useRef<InputRutHandle>(null);
  const resetRut = () => {
    inputRutRef.current?.reset(); // llama al método del hijo
  };

  {/* Interfaz para los props del InputTelefono */}
  const inputTelefonoRef = useRef<InputTelefonoHandle>(null);
  const resetTelefono = () => {
    inputTelefonoRef.current?.reset(); // llama al método del hijo
  };

  const handlePhoneChange = (phone: string) => {
    // Formateon del número para extraer solo los dígitos después del primer '9'
    const cleaned = phone.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
    const startIndex = cleaned.indexOf('9');  // Encuentra la primera aparición del '9'
    const phoneDigits = cleaned.slice(startIndex);

    // Convertimos a número entero
    const phoneAsNumber = parseInt(phoneDigits, 10);
    
    setFormData(prevState => ({
      ...prevState,
      telefono: isNaN(phoneAsNumber) ? 0 : phoneAsNumber
    }));
  };


  const handleRutChange = (rut: string) => {
    setFormData(prevState => ({
      ...prevState,
      rut: rut
    }));
  }

  // Manejador de cambios en los inputs
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  // Función para registrar tutor
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Formulario enviado:", formData);
    e.preventDefault();
    setIsLoading(true);
    try {
      const respuesta = await crearTutor(formData);
      console.log("Tutor creado:", respuesta);
      setToastMessage("Tutor registrado exitosamente");
      // Limpiar formulario
      setFormData({
        nombre: "",
        apellido_materno: "",
        apellido_paterno: "",
        rut: "",
        direccion: "",
        telefono: 0,
        telefono2: 0,
        comuna: "",
        region: "",
        celular: 0,
        celular2: 0,
        email: "",
      });
      resetRut();
      resetTelefono();
    } catch (error) {
      console.error("Fallo al crear tutor:", error);
      setToastMessage("Error de conexión");
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }
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
            {/* Input Apellidos */}
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
            {/* Input RUT */}
            <IonRow>
              <IonCol>
                <InputRut onRutChange={handleRutChange} ref={inputRutRef} />
              </IonCol>
            </IonRow>
            {/* Input dirección */}
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
          {/* Input Telefono */}
          <IonRow>
            <IonCol>
              <InputTelefono onPhoneChange={handlePhoneChange} ref={inputTelefonoRef} />
            </IonCol>
          </IonRow>
          {/** Input Región */}
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
                  <div slot="label">
                    Región
                  </div>
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          {/** Input Comuna */}
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
                  <div slot="label">
                    Comuna
                  </div>
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          {/** Input Email */}
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
          {/* Botón Registrar Tutor */}
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton
                type="submit"
                className="custom-button"
                expand="block"
                onClick={handleSubmit}
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
