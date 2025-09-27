import { useState, useRef, useEffect, useMemo } from "react";
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
import InputTelefono, {
  InputTelefonoHandle,
} from "../components/registroTutor/inputTelefono";
import InputRut, { InputRutHandle } from "../components/registroTutor/inputRut";
import { SelectorRegion } from "../components/registroTutor/SelectorRegion";
import { SelectorComuna } from "../components/registroTutor/SelectorComuna";
import { crearTutor } from "../api/tutores";
import { obtenerRegiones } from "../api/regiones";
import { formatRegionName, formatComunaName } from "../utils/formatters";

const RegistroTutor: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados para regiones y comunas (similar a especies y razas)
  const [regiones, setRegiones] = useState<any[]>([]);
  const [loadingRegiones, setLoadingRegiones] = useState(false);
  const [regionQuery, setRegionQuery] = useState("");
  const [showRegionList, setShowRegionList] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [comunaQuery, setComunaQuery] = useState("");
  const [showComunaList, setShowComunaList] = useState(false);
  const [selectedComuna, setSelectedComuna] = useState<{
    id: string;
    name: string;
  } | null>(null);

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

  // Cargar regiones al inicializar
  useEffect(() => {
    const fetchRegiones = async () => {
      try {
        setLoadingRegiones(true);
        const data = await obtenerRegiones();
        setRegiones(data);
      } catch (error) {
        console.error("Error cargando regiones:", error);
      } finally {
        setLoadingRegiones(false);
      }
    };

    fetchRegiones();
  }, []);

  // Filtrar regiones basado en la búsqueda (ahora busca en el formato legible)
  const filteredRegiones = useMemo(() => {
    if (!regionQuery.trim()) return [];
    return regiones.filter((region) => {
      const formattedName = formatRegionName(region);
      return (
        formattedName.toLowerCase().includes(regionQuery.toLowerCase()) ||
        region.name.toLowerCase().includes(regionQuery.toLowerCase())
      );
    });
  }, [regiones, regionQuery]);

  // Filtrar comunas basado en la región seleccionada y la búsqueda
  const filteredComunas = useMemo(() => {
    if (!selectedRegion || !comunaQuery.trim()) return [];
    const region = regiones.find((r) => r.id === selectedRegion.id);
    if (!region || !region.communes) return [];

    return region.communes.filter((comuna: any) => {
      const formattedName = formatComunaName(comuna.name);
      return (
        formattedName.toLowerCase().includes(comunaQuery.toLowerCase()) ||
        comuna.name.toLowerCase().includes(comunaQuery.toLowerCase())
      );
    });
  }, [regiones, selectedRegion, comunaQuery]);

  // Función para seleccionar región (actualizada)
  const selectRegion = (id: string, name: string, fullRegion: any) => {
    setSelectedRegion(fullRegion);
    setRegionQuery(name);
    setShowRegionList(false);

    // Limpiar comuna cuando se cambia la región
    setSelectedComuna(null);
    setComunaQuery("");
    setShowComunaList(false);
  };

  // Función para seleccionar comuna (actualizada)
  const selectComuna = (id: string, name: string) => {
    setSelectedComuna({ id, name });
    setComunaQuery(name);
    setShowComunaList(false);
  };

  // Referencias para resetear componentes
  const inputRutRef = useRef<InputRutHandle>(null);
  const resetRut = () => {
    inputRutRef.current?.reset();
  };

  const inputTelefonoRef = useRef<InputTelefonoHandle>(null);
  const resetTelefono = () => {
    inputTelefonoRef.current?.reset();
  };

  const handlePhoneChange = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const startIndex = cleaned.indexOf("9");
    const phoneDigits = cleaned.slice(startIndex);
    const phoneAsNumber = parseInt(phoneDigits, 10);

    setFormData((prevState) => ({
      ...prevState,
      telefono: isNaN(phoneAsNumber) ? 0 : phoneAsNumber,
    }));
  };

  const handleRutChange = (rut: string) => {
    setFormData((prevState) => ({
      ...prevState,
      rut: rut,
    }));
  };

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
      // Actualizar formData con región y comuna seleccionadas (nombres formateados)
      const dataToSubmit = {
        ...formData,
        region: selectedRegion ? formatRegionName(selectedRegion) : "",
        comuna: selectedComuna ? selectedComuna.name : "",
      };

      const respuesta = await crearTutor(dataToSubmit);
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

      // Resetear selectores
      setRegionQuery("");
      setComunaQuery("");
      setSelectedRegion(null);
      setSelectedComuna(null);
      setShowRegionList(false);
      setShowComunaList(false);

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
                <InputTelefono
                  onPhoneChange={handlePhoneChange}
                  ref={inputTelefonoRef}
                />
              </IonCol>
            </IonRow>
            {/* Selector Región */}
            <IonRow>
              <IonCol>
                <SelectorRegion
                  regionQuery={regionQuery}
                  setRegionQuery={setRegionQuery}
                  showRegionList={showRegionList}
                  setShowRegionList={setShowRegionList}
                  filteredRegiones={filteredRegiones}
                  loadingRegiones={loadingRegiones}
                  selectRegion={selectRegion}
                />
              </IonCol>
            </IonRow>
            {/* Selector Comuna */}
            <IonRow>
              <IonCol>
                <SelectorComuna
                  comunaQuery={comunaQuery}
                  setComunaQuery={setComunaQuery}
                  showComunaList={showComunaList}
                  setShowComunaList={setShowComunaList}
                  filteredComunas={filteredComunas}
                  loadingComunas={false}
                  selectComuna={selectComuna}
                  regionSeleccionada={!!selectedRegion}
                />
              </IonCol>
            </IonRow>
            {/* Input Email */}
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
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrar tutor"}
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
