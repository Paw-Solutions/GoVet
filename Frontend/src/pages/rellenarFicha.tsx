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
  IonTextarea,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonText,
  IonFooter,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonNote,
} from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  saveOutline,
  pawOutline,
  personOutline,
  idCardOutline,
  mailOutline,
  callOutline,
  calendarOutline,
  fishOutline,
  informationOutline,
  informationCircleOutline,
} from "ionicons/icons";
import "../styles/rellenarFicha.css";
import "../styles/variables.css";
import ModalEscogerPaciente from "../components/rellenarFicha/modalEscogerPaciente";
import { PacienteData } from "../api/pacientes"; // Importar la interfaz correcta
import { TutorData } from "../api/tutores";
import { ConsultaData, crearConsulta } from "../api/fichas";

const RellenarFicha: React.FC = () => {
  const [showModalPacientes, setShowModalPacientes] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "general" | "fisico" | "clinico"
  >("general");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteData | null>(
    null
  ); // Usar PacienteData

  // Estado para los campos del formulario
  const [formData, setFormData] = useState<ConsultaData>({
    id_paciente: 0,
    rut: "",
    fecha_consulta: new Date().toISOString().split("T")[0],
    motivo: "",
    diagnostico: "",
    observaciones: "",
    dht: "",
    nodulos_linfaticos: "",
    mucosas: "",
    peso: 0,
    auscultacion_cardiaca_toraxica: "",
    estado_pelaje: "",
    condicion_corporal: "",
    id_consulta: 0,
    motivo_consulta: "", // ← Agregar para compatibilidad con backend

    // Información relacionada del paciente
    paciente: {
      id_paciente: 0,
      nombre: "",
      color: "",
      sexo: "",
      fecha_nacimiento: "",
      codigo_chip: "",
      raza: "",
      especie: "",
    },

    // Información relacionada del tutor
    tutor: {
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      rut: "",
      telefono: "",
      email: "",
    },
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumericChange = (e: any) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [name]: numValue < 0 ? 0 : numValue || 0,
    }));
  };

  // Función corregida para manejar la selección del paciente desde el modal
  const handlePacienteSelected = (paciente: PacienteData) => {
    setSelectedPaciente(paciente);
    setFormData((prev) => ({
      ...prev,
      id_paciente: paciente.id_paciente,
      rut: paciente.tutor?.rut || "", // Usar el RUT del tutor del paciente seleccionado

      tutor: {
        nombre: paciente.tutor?.nombre || "",
        apellido_paterno: paciente.tutor?.apellido_paterno || "",
        apellido_materno: paciente.tutor?.apellido_materno || "",
        rut: paciente.tutor?.rut || "",
        telefono: paciente.tutor?.telefono?.toString() || "",
        email: paciente.tutor?.email || "",
      },

      paciente: {
        id_paciente: paciente.id_paciente,
        nombre: paciente.nombre || "",
        color: paciente.color || "",
        sexo: paciente.sexo || "",
        fecha_nacimiento: paciente.fecha_nacimiento || "",
        codigo_chip: paciente.codigo_chip || "",
        raza: paciente.raza || "",
        especie: paciente.especie || "",
      },
    }));
    setShowModalPacientes(false);
  };

  const navegarSiguiente = () => {
    if (currentStep === "general") {
      setCurrentStep("fisico");
    } else if (currentStep === "fisico") {
      setCurrentStep("clinico");
    }
  };

  const navegarAnterior = () => {
    if (currentStep === "clinico") {
      setCurrentStep("fisico");
    } else if (currentStep === "fisico") {
      setCurrentStep("general");
    }
  };

  const puedeAvanzar = () => {
    if (currentStep === "general") {
      return selectedPaciente && formData.motivo.trim();
    }
    return true;
  };

  const guardarFicha = async () => {
    setIsLoading(true);
    try {
      // Aquí harías la petición POST al backend
      console.log("Guardando ficha:", formData);
      const response = await crearConsulta(formData);
      setToastMessage("Ficha veterinaria guardada exitosamente");

      // Limpiar formulario después de guardar
      setFormData({
        id_paciente: 0,
        rut: "",
        fecha_consulta: new Date().toISOString().split("T")[0],
        motivo: "",
        diagnostico: "",
        observaciones: "",
        dht: "",
        nodulos_linfaticos: "",
        mucosas: "",
        peso: 0,
        auscultacion_cardiaca_toraxica: "",
        estado_pelaje: "",
        condicion_corporal: "",
        id_consulta: 0,
        motivo_consulta: "", // ← Agregar para compatibilidad con backend

        // Información relacionada del paciente
        paciente: {
          id_paciente: 0,
          nombre: "",
          color: "",
          sexo: "",
          fecha_nacimiento: "",
          codigo_chip: "",
          raza: "",
          especie: "",
        },

        // Información relacionada del tutor
        tutor: {
          nombre: "",
          apellido_paterno: "",
          apellido_materno: "",
          rut: "",
          telefono: "",
          email: "",
        },
      });

      setSelectedPaciente(null);
      setCurrentStep("general");
    } catch (error) {
      console.error("Error al guardar ficha:", error);
      setToastMessage("Error al guardar la ficha");
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "general":
        return 1;
      case "fisico":
        return 2;
      case "clinico":
        return 3;
      default:
        return 1;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "general":
        return "Información General";
      case "fisico":
        return "Examen Físico";
      case "clinico":
        return "Examen Clínico";
      default:
        return "Información General";
    }
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Generar ficha</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Generar ficha</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Indicador de progreso */}
        <IonItem>
          <div>
            <IonText>
              <h3>{getStepTitle()}</h3>
              <p color="medium">Paso {getStepNumber()} de 3</p>
            </IonText>
          </div>
        </IonItem>

        {/* Paso 1: Información General */}
        {currentStep === "general" && (
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem className="padding">
                  <IonTextarea
                    label="Motivo de la Consulta"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Describa el motivo de la consulta"
                    rows={4}
                    name="motivo"
                    value={formData.motivo}
                    onIonChange={handleInputChange}
                  />
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol className="ficha-general-container">
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowModalPacientes(true)}
                >
                  {selectedPaciente
                    ? "Cambiar Paciente"
                    : "Seleccionar Paciente"}
                </IonButton>
              </IonCol>
            </IonRow>

            {/* Información del paciente seleccionado */}
            <IonRow>
              <IonCol className="form-element-spacing">
                {selectedPaciente ? (
                  <IonCard>
                    <IonCardContent>
                      <IonText>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {/* Nombre del paciente */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <IonIcon icon={pawOutline} />
                            <span>
                              <strong>{selectedPaciente.nombre}</strong>
                            </span>
                          </div>

                          {/*Especie del paciente */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <IonIcon icon={informationCircleOutline} />
                            <span>
                              <strong>Especie: </strong>{" "}
                              {selectedPaciente.especie}
                            </span>
                          </div>

                          {/* Raza del paciente */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <IonIcon icon={informationCircleOutline} />
                            <span>
                              <strong>Raza: </strong> {selectedPaciente.raza}
                            </span>
                          </div>
                          {/* Sexo del paciente */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <IonIcon icon={informationCircleOutline} />
                            <span>
                              <strong>Sexo: </strong>{" "}
                              {selectedPaciente.sexo
                                ? selectedPaciente.sexo === "M"
                                  ? "Macho"
                                  : "Hembra"
                                : "No especificado"}
                            </span>
                          </div>
                          {/* Edad del paciente */}
                          {selectedPaciente.fecha_nacimiento && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <IonIcon icon={calendarOutline} />
                              <span>
                                <strong>Fecha de Nacimiento:</strong>{" "}
                                {new Date(
                                  selectedPaciente.fecha_nacimiento
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                ) : (
                  <IonCard>
                    <IonCardContent
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IonIcon
                        icon={pawOutline}
                        style={{ marginRight: "8px" }}
                      />
                      <IonText>No se ha seleccionado ningún paciente.</IonText>
                    </IonCardContent>
                  </IonCard>
                )}
              </IonCol>
            </IonRow>

            {/* Información del tutor (solo si hay paciente seleccionado) */}
            <IonRow>
              <IonCol className="form-element-spacing">
                {selectedPaciente && selectedPaciente.tutor ? (
                  <div>
                    <IonCard>
                      <IonCardContent>
                        <IonText>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            {/* Nombre del tutor */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <IonIcon icon={personOutline} />
                              <span>
                                <strong>
                                  {selectedPaciente.tutor.nombre}{" "}
                                  {selectedPaciente.tutor.apellido_paterno}{" "}
                                  {selectedPaciente.tutor.apellido_materno}
                                </strong>
                              </span>
                            </div>

                            {/* RUT del tutor */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <IonIcon icon={idCardOutline} />
                              <span>
                                <strong>RUT:</strong>{" "}
                                {selectedPaciente.tutor.rut}
                              </span>
                            </div>

                            {/* Teléfono (condicional) */}
                            {selectedPaciente.tutor.telefono && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <IonIcon icon={callOutline} />
                                <span>
                                  <strong>Teléfono:</strong>{" "}
                                  {selectedPaciente.tutor.telefono}
                                </span>
                              </div>
                            )}

                            {/* Email (condicional) */}
                            {selectedPaciente.tutor.email && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <IonIcon icon={mailOutline} />
                                <span>
                                  <strong>Email:</strong>{" "}
                                  {selectedPaciente.tutor.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </IonText>
                      </IonCardContent>
                    </IonCard>
                  </div>
                ) : (
                  <IonCard>
                    <IonCardContent
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IonIcon
                        icon={personOutline}
                        style={{ marginRight: "8px" }}
                      />
                      <IonText>No se ha seleccionado ningún paciente.</IonText>
                    </IonCardContent>
                  </IonCard>
                )}
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

        {/* Paso 2: Examen Físico */}
        {currentStep === "fisico" && (
          <IonList>
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonInput
                      label="Peso (kg)"
                      type="number"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Ej: 25.5"
                      name="peso"
                      value={formData.peso}
                      min={0} // ← Solo permite valores positivos
                      clearOnEdit={true}
                      onIonChange={handleNumericChange}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonSelect
                      label="Condición Corporal"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Seleccione condición"
                      name="condicion_corporal"
                      value={formData.condicion_corporal}
                      onIonChange={handleInputChange}
                    >
                      <IonSelectOption value="muy_delgado">
                        Muy Delgado
                      </IonSelectOption>
                      <IonSelectOption value="delgado">Delgado</IonSelectOption>
                      <IonSelectOption value="ideal">Ideal</IonSelectOption>
                      <IonSelectOption value="sobrepeso">
                        Sobrepeso
                      </IonSelectOption>
                      <IonSelectOption value="obeso">Obeso</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonSelect
                      label="Estado del Pelaje"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Seleccione estado"
                      name="estado_pelaje"
                      value={formData.estado_pelaje}
                      onIonChange={handleInputChange}
                    >
                      <IonSelectOption value="excelente">
                        Excelente
                      </IonSelectOption>
                      <IonSelectOption value="bueno">Bueno</IonSelectOption>
                      <IonSelectOption value="regular">Regular</IonSelectOption>
                      <IonSelectOption value="malo">Malo</IonSelectOption>
                      <IonSelectOption value="muy_malo">
                        Muy Malo
                      </IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonSelect
                      label="Mucosas"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Seleccione estado"
                      name="mucosas"
                      value={formData.mucosas}
                      onIonChange={handleInputChange}
                    >
                      <IonSelectOption value="rosadas">
                        Rosadas (Normal)
                      </IonSelectOption>
                      <IonSelectOption value="palidas">Pálidas</IonSelectOption>
                      <IonSelectOption value="cianoticas">
                        Cianóticas
                      </IonSelectOption>
                      <IonSelectOption value="ictericas">
                        Ictéricas
                      </IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonTextarea
                      label="Nódulos Linfáticos"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa el estado de los nódulos linfáticos"
                      rows={3}
                      name="nodulos_linfaticos"
                      value={formData.nodulos_linfaticos}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonList>
        )}

        {/* Paso 3: Examen Clínico */}
        {currentStep === "clinico" && (
          <IonList>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonTextarea
                      label="DHT (Deshidratación, Hidratación, Temperatura)"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa el estado de DHT"
                      rows={3}
                      name="dht"
                      value={formData.dht}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonTextarea
                      label="Auscultación Cardíaca y Torácica"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa los hallazgos de auscultación"
                      rows={3}
                      name="auscultacion_cardiaca_toraxica"
                      value={formData.auscultacion_cardiaca_toraxica}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonTextarea
                      label="Diagnóstico"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Ingrese el diagnóstico"
                      rows={4}
                      name="diagnostico"
                      value={formData.diagnostico}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonTextarea
                      label="Observaciones"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Observaciones adicionales"
                      rows={4}
                      name="observaciones"
                      value={formData.observaciones}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonList>
        )}

        {/* Espaciado para el footer */}
        <div style={{ height: "80px" }}></div>
      </IonContent>

      {/* Footer con botones de navegación */}
      <IonFooter>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-align-items-center">
              {currentStep === "general" ? (
                <>
                  <IonCol size="6" className="ion-text-start">
                    <IonText color="medium">
                      <small>Paso 1 de 3</small>
                    </IonText>
                  </IonCol>
                  <IonCol size="6" className="ion-text-end">
                    <IonButton
                      fill="solid"
                      onClick={navegarSiguiente}
                      disabled={!puedeAvanzar()}
                    >
                      Siguiente
                      <IonIcon icon={chevronForwardOutline} slot="end" />
                    </IonButton>
                  </IonCol>
                </>
              ) : currentStep === "fisico" ? (
                <>
                  <IonCol size="4" className="ion-text-start">
                    <IonButton fill="outline" onClick={navegarAnterior}>
                      <IonIcon icon={chevronBackOutline} slot="start" />
                      Anterior
                    </IonButton>
                  </IonCol>
                  <IonCol size="4" className="ion-text-center">
                    <IonText color="medium">
                      <small>Paso 2 de 3</small>
                    </IonText>
                  </IonCol>
                  <IonCol size="4" className="ion-text-end">
                    <IonButton fill="solid" onClick={navegarSiguiente}>
                      Siguiente
                      <IonIcon icon={chevronForwardOutline} slot="end" />
                    </IonButton>
                  </IonCol>
                </>
              ) : (
                <>
                  <IonCol size="4" className="ion-text-start">
                    <IonButton fill="outline" onClick={navegarAnterior}>
                      <IonIcon icon={chevronBackOutline} slot="start" />
                      Anterior
                    </IonButton>
                  </IonCol>
                  <IonCol size="4" className="ion-text-center">
                    <IonText color="medium">
                      <small>Paso 3 de 3</small>
                    </IonText>
                  </IonCol>
                  <IonCol size="4" className="ion-text-end">
                    <IonButton
                      fill="solid"
                      color="success"
                      onClick={guardarFicha}
                      disabled={isLoading}
                    >
                      <IonIcon icon={saveOutline} slot="start" />
                      {isLoading ? "Guardando..." : "Guardar"}
                    </IonButton>
                  </IonCol>
                </>
              )}
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>

      {/* Modal para escoger paciente */}
      <ModalEscogerPaciente
        isOpen={showModalPacientes}
        onDidDismiss={() => setShowModalPacientes(false)}
        onPacienteSelected={handlePacienteSelected} // Función corregida
      />

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
      />
    </IonPage>
  );
};

export default RellenarFicha;
