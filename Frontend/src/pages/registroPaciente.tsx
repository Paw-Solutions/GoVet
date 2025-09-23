import { useState, useEffect } from "react";
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
  IonSearchbar,
  IonToast,
  IonSpinner,
} from "@ionic/react";
import "../styles/registroPaciente.css";
import "../styles/main.css";
import { obtenerEspecies, obtenerRazas } from "../api/especies";

const RegistroPaciente: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    sexo: "",
    color: "",
    fechaNacimiento: "",
    codigo_chip: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Estados para datos de la API
  const [especiesData, setEspeciesData] = useState<any[]>([]);
  const [razasData, setRazasData] = useState<any[]>([]);
  const [loadingEspecies, setLoadingEspecies] = useState(false);
  const [loadingRazas, setLoadingRazas] = useState(false);

  // Estados para el filtrado
  const [especieQuery, setEspecieQuery] = useState("");
  const [razaQuery, setRazaQuery] = useState("");
  const [showEspecieList, setShowEspecieList] = useState(false);
  const [showRazaList, setShowRazaList] = useState(false);

  // Función para cargar especies desde la API
  const handleCargarEspecies = async () => {
    setLoadingEspecies(true);
    try {
      const especies = await obtenerEspecies();
      console.log("Iniciando petición para obtener especies...");
      setEspeciesData(especies);
    } catch (error) {
      setToastMessage("Error de conexión al cargar especies");
      setShowToast(true);
    } finally {
      setLoadingEspecies(false);
    }
  };

  const handleCargarRazas = async (nombreEspecie: string) => {
    console.log("Cargando razas...");
    setLoadingRazas(true);
    try {
      const razas = await obtenerRazas(nombreEspecie);
      if (razas) {
        setRazasData(razas);
      } else {
        setRazasData([]);
      }
      console.log("Razas cargadas:", razas);
    } catch (error) {
      console.log("Error cargando razas:", error);
      setRazasData([]);
      setToastMessage("Error de conexión al cargar razas");
      setShowToast(true);
    } finally {
      setLoadingRazas(false);
    }
  };

  // Cargar especies al montar el componente
  useEffect(() => {
    handleCargarEspecies();
  }, []);

  // Cargar razas cuando cambia la especie seleccionada
  useEffect(() => {
    if (formData.especie) {
      const especieSeleccionada = especiesData.find(
        (esp) => esp.id_especie === parseInt(formData.especie)
      );
      if (especieSeleccionada) {
        console.log("Especie encontrada:", especieSeleccionada, ".Cargando razas...");
        handleCargarRazas(especieSeleccionada.nombre_comun);
      }
    } else {
      setRazasData([]);
    }
  }, [formData.especie, especiesData]);

  // Filtrar especies
  const filteredEspecies = especiesData
    .filter((especie) =>
      especie.nombre_comun.toLowerCase().includes(especieQuery.toLowerCase())
    )
    .slice(0, 4); // Limitar a 4 resultados

  // Filtrar razas según la especie seleccionada
  const filteredRazas = razasData
    .filter((raza: any) =>
      raza.nombre.toLowerCase().includes(razaQuery.toLowerCase())
    )
    .slice(0, 4); // Limitar a 4 resultados

  // Manejador de cambios en los inputs
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Seleccionar especie
  const selectEspecie = (especieId: number, especieNombre: string) => {
    setFormData((prev) => ({
      ...prev,
      especie: especieId.toString(),
      raza: "", // Limpiar raza cuando cambia la especie
    }));
    setEspecieQuery(especieNombre);
    setShowEspecieList(false);
    setRazaQuery(""); // Limpiar búsqueda de raza
  };

  // Seleccionar raza
  const selectRaza = (razaId: number, razaNombre: string) => {
    setFormData((prev) => ({
      ...prev,
      raza: razaId.toString(),
    }));
    setRazaQuery(razaNombre);
    setShowRazaList(false);
  };

  const registraPaciente = async () => {
    try {
      // Preparar los datos para enviar al backend
      const pacienteData = {
        nombre: formData.nombre,
        id_raza: parseInt(formData.raza),
        sexo: formData.sexo,
        color: formData.color,
        fecha_nacimiento: formData.fechaNacimiento,
        codigo_chip: "", // Asumiendo que el código de chip es opcional y no se ingresa en este formulario
      };

      const response = await obtenerEspecies();
      if (response.ok) {
        setToastMessage("Paciente registrado exitosamente");
        // Limpiar formulario
        setFormData({
          nombre: "",
          especie: "",
          raza: "",
          sexo: "",
          color: "",
          fechaNacimiento: "",
          codigo_chip: "",
        });
        setEspecieQuery("");
        setRazaQuery("");
      } else {
        const errorData = await response.json();
        setToastMessage(
          `Error al registrar paciente: ${
            errorData.detail || "Error desconocido"
          }`
        );
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
                    name="nombre"
                    label="Nombre"
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Ej: copito"
                    value={formData.nombre}
                    onIonInput={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Input Especie con filtro*/}
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none" className="searchbar-container">
                  <IonInput
                    label="Especie"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Buscar especie..."
                    value={especieQuery}
                    onIonInput={(e) => {
                      setEspecieQuery(e.detail.value!);
                      setShowEspecieList(true);
                    }}
                    onIonFocus={() => setShowEspecieList(true)}
                  />
                </IonItem>
                {showEspecieList &&
                  especieQuery &&
                  filteredEspecies.length > 0 && (
                    <IonList className="filter-list">
                      {loadingEspecies ? (
                        <IonItem>
                          <IonSpinner />
                          <IonLabel>Cargando especies...</IonLabel>
                        </IonItem>
                      ) : (
                        filteredEspecies.map((especie) => (
                          <IonItem
                            key={especie.id_especie}
                            button
                            onClick={() =>
                              selectEspecie(
                                especie.id_especie,
                                especie.nombre_comun
                              )
                            }
                          >
                            <IonLabel>{especie.nombre_comun}</IonLabel>
                          </IonItem>
                        ))
                      )}
                    </IonList>
                  )}
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Input Raza con filtro*/}
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none" className="searchbar-container">
                  <IonInput
                    label="Raza"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder={
                      formData.especie
                        ? "Buscar raza..."
                        : "Primero selecciona una especie"
                    }
                    value={razaQuery}
                    disabled={!formData.especie} // Deshabilitado si no hay especie
                    onIonInput={(e) => {
                      if (formData.especie) {
                        // Solo funciona si hay especie
                        setRazaQuery(e.detail.value!);
                        setShowRazaList(true);
                      }
                    }}
                    onIonFocus={() => {
                      if (formData.especie) {
                        // Solo se abre la lista si hay especie
                        setShowRazaList(true);
                      }
                    }}
                  />
                </IonItem>
                {showRazaList &&
                  razaQuery &&
                  formData.especie &&
                  filteredRazas.length > 0 && (
                    <IonList className="filter-list">
                      {loadingRazas ? (
                        <IonItem>
                          <IonSpinner />
                          <IonLabel>Cargando razas...</IonLabel>
                        </IonItem>
                      ) : (
                        filteredRazas.map((raza: any) => (
                          <IonItem
                            key={raza.id_raza}
                            button
                            onClick={() =>
                              selectRaza(raza.id_raza, raza.nombre)
                            }
                          >
                            <IonLabel>{raza.nombre}</IonLabel>
                          </IonItem>
                        ))
                      )}
                    </IonList>
                  )}
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Input Color y sexo*/}
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    name="color"
                    label="Color"
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Ej: Naranja demoniaco"
                    value={formData.color}
                    onIonInput={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem lines="none">
                  <IonRadioGroup
                    className="radio-group-spaced"
                    value={formData.sexo}
                    onIonChange={(e) =>
                      setFormData((prev) => ({ ...prev, sexo: e.detail.value }))
                    }
                  >
                    <IonRadio slot="start" value="M">
                      M
                    </IonRadio>
                    <IonRadio slot="start" value="H">
                      H
                    </IonRadio>
                  </IonRadioGroup>
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
                    name="fechaNacimiento"
                    label="Fecha de nacimiento"
                    type="date"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Ej: dd-mm-aaaa"
                    value={formData.fechaNacimiento}
                    onIonInput={handleInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/*select de prueba */}
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonSelect
                    label="Popover"
                    fill="outline"
                    interface="popover"
                    placeholder="Select One"
                  >
                    <IonSelectOption value="brown">Brown</IonSelectOption>
                    <IonSelectOption value="blonde">Blonde</IonSelectOption>
                    <IonSelectOption value="red">Red</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Botón Registrar */}
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton
                  className="custom-button"
                  expand="block"
                  onClick={registraPaciente}
                >
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
