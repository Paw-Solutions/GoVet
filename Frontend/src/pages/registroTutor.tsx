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

  // Función para formatear RUT chileno
  const formatRut = (value: string): string => {
    // Remover caracteres no numéricos excepto K/k
    const cleaned = value.replace(/[^0-9Kk]/g, "");

    // Si está vacío, retornar vacío
    if (cleaned.length === 0) return "";

    // Limitar a máximo 9 caracteres (8 números + 1 DV)
    const limited = cleaned.slice(0, 9);

    // Si solo hay un caracter y es K, permitirlo
    if (limited.length === 1 && limited.toUpperCase() === "K") return "K";

    // Separar número y dígito verificador
    const numbers = limited.slice(0, -1);
    const dv = limited.slice(-1).toUpperCase();

    // Si no hay números, solo retornar lo que hay
    if (numbers.length === 0) return dv;

    // Formatear números con puntos (cada 3 dígitos desde la derecha)
    const reversedNumbers = numbers.split("").reverse();
    let formattedNumbers = "";

    for (let i = 0; i < reversedNumbers.length; i++) {
      if (i > 0 && i % 3 === 0) {
        formattedNumbers = "." + formattedNumbers;
      }
      formattedNumbers = reversedNumbers[i] + formattedNumbers;
    }

    // Solo agregar guión si hay al menos 7 números (RUT mínimo válido)
    if (numbers.length >= 7) {
      return `${formattedNumbers}-${dv}`;
    } else {
      return formattedNumbers + dv;
    }
  };

  // Función para limpiar RUT (solo números y DV para enviar al backend)
  const cleanRut = (formattedRut: string): string => {
    return formattedRut.replace(/[^0-9Kk]/g, "");
  };

  // Función para validar RUT chileno
  const validarRut = (rut: string): boolean => {
    const cleaned = cleanRut(rut);
    if (cleaned.length < 8 || cleaned.length > 9) return false;

    const numbers = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();

    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;

    for (let i = numbers.length - 1; i >= 0; i--) {
      suma += parseInt(numbers[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const dvCalculado =
      resto === 0 ? "0" : resto === 1 ? "K" : (11 - resto).toString();

    return dv === dvCalculado;
  };

  // Manejador específico para el RUT
  const handleRutChange = (e: any) => {
    const inputValue = e.target.value;
    const formattedRut = formatRut(inputValue);

    // Validar RUT si tiene al menos 8 caracteres (sin formato)
    const cleaned = cleanRut(formattedRut);
    if (cleaned.length >= 8) {
      setRutValido(validarRut(formattedRut));
    } else {
      setRutValido(null);
    }

    // Actualizar el estado con el RUT formateado para mostrar
    setFormData((prevState) => ({
      ...prevState,
      rut: formattedRut,
    }));
  };
  // Estado para mostrar mensaje de éxito/error
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Estado para validación de RUT
  const [rutValido, setRutValido] = useState<boolean | null>(null);

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
      // Preparar datos para enviar, limpiando el RUT
      const dataToSend = {
        ...formData,
        rut: cleanRut(formData.rut), // Enviar RUT sin formato (solo números y DV)
      };

      const response = await fetch("http://localhost:8000/tutores/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
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
                    placeholder="12.345.678-9"
                    name="rut"
                    value={formData.rut}
                    onIonChange={handleRutChange}
                    maxlength={12}
                    className={
                      rutValido === true
                        ? "rut-valido"
                        : rutValido === false
                        ? "rut-invalido"
                        : ""
                    }
                  >
                    <div slot="label">
                      RUT <IonText color="danger">(*)</IonText>
                      {rutValido === true && (
                        <IonText color="success"> ✓</IonText>
                      )}
                      {rutValido === false && (
                        <IonText color="danger"> ✗</IonText>
                      )}
                    </div>
                  </IonInput>
                </IonItem>
                {rutValido === false && (
                  <IonText color="danger" className="rut-error-message">
                    <small>
                      RUT inválido. Verifica el formato y dígito verificador.
                    </small>
                  </IonText>
                )}
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
