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
  IonSearchbar,
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
  const [toastMessage, setToastMessage] = useState("");

  // Datos de especies y razas (a futuro vendrán de BD)
  //Para conectar con base de datos en el futuro:
  //Reemplazar especiesData y razasData con llamadas a API
  //Agregar estados de loading
  //implementar debounce para las búsquedas
  //Manejar errores de red
  const especiesData = [
    { nombre: "Perro", id: "perro" },
    { nombre: "Gato", id: "gato" },
  ];

  const razasData = {
    perro: [
      "Golden Retriever",
      "Labrador",
      "Pastor Alemán",
      "Bulldog",
      "Poodle",
      "Chihuahua",
      "Mestizo",
    ],
    gato: [
      "Persa",
      "Siamés",
      "Maine Coon",
      "Bengala",
      "Ragdoll",
      "British Shorthair",
      "Mestizo",
    ],
  };

  // Estados para el filtrado
  const [especieQuery, setEspecieQuery] = useState("");
  const [razaQuery, setRazaQuery] = useState("");
  const [showEspecieList, setShowEspecieList] = useState(false);
  const [showRazaList, setShowRazaList] = useState(false);

  // Filtrar especies
  const filteredEspecies = especiesData
    .filter((especie) =>
      especie.nombre.toLowerCase().includes(especieQuery.toLowerCase())
    )
    .slice(0, 4); // Limitar a 4 resultados

  // Filtrar razas según la especie seleccionada
  const filteredRazas = formData.especie
    ? (razasData[formData.especie as keyof typeof razasData] || [])
        .filter((raza) => raza.toLowerCase().includes(razaQuery.toLowerCase()))
        .slice(0, 4) // Limitar a 4 resultados
    : [];

  // Manejador de cambios en los inputs
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Seleccionar especie
  const selectEspecie = (especieId: string, especieNombre: string) => {
    setFormData((prev) => ({
      ...prev,
      especie: especieId,
      raza: "", // Limpiar raza cuando cambia la especie
    }));
    setEspecieQuery(especieNombre);
    setShowEspecieList(false);
    setRazaQuery(""); // Limpiar búsqueda de raza
  };

  // Seleccionar raza
  const selectRaza = (raza: string) => {
    setFormData((prev) => ({
      ...prev,
      raza: raza,
    }));
    setRazaQuery(raza);
    setShowRazaList(false);
  };

  const registraPaciente = async () => {
    try {
      const response = await fetch("DaniAPI/tutores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

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
        });
      } else {
        setToastMessage("Error al registrar paciente");
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
                    labelPlacement="floating"
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
                    labelPlacement="floating"
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
                      {filteredEspecies.map((especie) => (
                        <IonItem
                          key={especie.id}
                          button
                          onClick={() =>
                            selectEspecie(especie.id, especie.nombre)
                          }
                        >
                          <IonLabel>{especie.nombre}</IonLabel>
                        </IonItem>
                      ))}
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
                    labelPlacement="floating"
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
                      {filteredRazas.map((raza) => (
                        <IonItem
                          key={raza}
                          button
                          onClick={() => selectRaza(raza)}
                        >
                          <IonLabel>{raza}</IonLabel>
                        </IonItem>
                      ))}
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
                    labelPlacement="floating"
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

          {/* Input Fecha de nacimiento*/}
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    name="fechaNacimiento"
                    label="Fecha de nacimiento"
                    type="date"
                    labelPlacement="floating"
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
