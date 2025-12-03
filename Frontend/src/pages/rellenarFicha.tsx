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
  IonToggle,
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
import CajaDesparasitacion from "../components/desparasitacion/CajaDesparasitacion";
import CajaRecetas from "../components/recetas/CajaRecetas";
import { PacienteData } from "../api/pacientes"; // Importar la interfaz correcta
import { TutorData } from "../api/tutores";
import {
  ConsultaData,
  crearConsulta,
  VacunasData,
  RecetaMedicaData,
  DesparasitacionData,
} from "../api/fichas";
// Componente: Interfaz para gestionar consultas
const RellenarFicha: React.FC = () => {
  const [showModalPacientes, setShowModalPacientes] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "general" | "fisico" | "clinico" | "post_pronostico" | "receta_medica"
  >("general");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteData | null>(
    null
  ); // Usar PacienteData

  const [vacunasData, setVacunasData] = useState<VacunasData>({
    nombre_vacuna: "",
    fecha_vacunacion: new Date().toISOString().split("T")[0],
    marca: "",
    numero_de_serie: "",
    proxima_dosis: new Date(new Date().setDate(new Date().getDate() + 28))
      .toISOString()
      .split("T")[0],
    requiere_proxima: true,
  });

  const [desparasitacionInternaData, setDesparasitacionInternaData] =
    useState<DesparasitacionData>({
      nombre_desparasitante: "",
      fecha_administracion: new Date().toISOString().split("T")[0],
      marca: "",
      numero_de_serie: "",
      proxima_dosis: new Date(new Date().setDate(new Date().getDate() + 30))
        .toISOString()
        .split("T")[0],
      requiere_proxima: true,
    });

  const [desparasitacionExternaData, setDesparasitacionExternaData] =
    useState<DesparasitacionData>({
      nombre_desparasitante: "",
      fecha_administracion: new Date().toISOString().split("T")[0],
      marca: "",
      numero_de_serie: "",
      proxima_dosis: new Date(new Date().setDate(new Date().getDate() + 30))
        .toISOString()
        .split("T")[0],
      requiere_proxima: true,
    });

  // Estado para recetas médicas como array
  const [recetaMedicaData, setRecetaMedicaData] = useState<RecetaMedicaData[]>(
    []
  );

  // Estado para los campos del formulario
  const [formData, setFormData] = useState<ConsultaData>({
    id_paciente: 0,
    rut: "",
    fecha_consulta: new Date().toISOString().split("T")[0],
    motivo: "",
    diagnostico: "",
    observaciones: "",
    nodulos_linfaticos: "",
    mucosas: "Rosadas y brillantes",
    peso: 0,
    estado_pelaje: "Muy bueno",
    condicion_corporal: "",
    id_consulta: 0,
    motivo_consulta: "", // ← Agregar para compatibilidad con backend
    estado_piel: "Muy bueno",
    temperatura: 0,
    frecuencia_cardiaca: 0,
    frecuencia_respiratoria: 0,
    deshidratacion: 0,
    vacunas_inoculadas: undefined,
    desparasitacion_interna: undefined,
    desparasitacion_externa: undefined,
    examen_clinico: "",
    indicaciones_generales: "",
    orden_de_examenes: "",
    receta_medica: undefined,
    proxima_consulta: "",
    tllc: 0,

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

  // Los handlers de receta médica ahora están en el componente CajaRecetas

  const handleVacunasChange = (e: any) => {
    const { name, value } = e.target ?? {
      name: e.detail?.name,
      value: e.detail?.value,
    };
    // Acepta eventos de Ion y DOM
    const val = value ?? e.detail?.value ?? "";
    setVacunasData((prev) => {
      const next = { ...prev, [name]: val };
      // Si cambió la fecha de vacunación y no hay próxima dosis explícita, calcular +28 días
      if (
        name === "fecha_vacunacion" &&
        (!next.proxima_dosis || next.proxima_dosis === "")
      ) {
        if (
          name === "fecha_vacunacion" &&
          next.requiere_proxima !== false &&
          (!next.proxima_dosis || next.proxima_dosis === "")
        ) {
          const fecha = new Date(val);
          if (!isNaN(fecha.getTime())) {
            const proxima = new Date(fecha);
            proxima.setDate(proxima.getDate() + 28);
            next.proxima_dosis = proxima.toISOString().split("T")[0];
          }
        }
      }
      // Si selecciona la vacuna "Antirrábica", mantener campo número de certificado visible (numero_de_serie)
      return next;
    });
  };

  const handleVacunaToggle = (e: any) => {
    const checked = e.detail?.checked ?? (e.target ? e.target.checked : false);
    setVacunasData((prev) => ({
      ...prev,
      requiere_proxima: !!checked,
      // si se desactiva, eliminar próxima dosis temporalmente
      proxima_dosis: checked ? prev.proxima_dosis : "",
    }));
  };

  const handleAgregarVacuna = () => {
    setFormData((prev) => {
      const vacuna = { ...vacunasData };
      // Si requiere próxima dosis y no se proporcionó, calcular +28 días desde fecha_vacunacion
      if (
        vacuna.requiere_proxima !== false &&
        !vacuna.proxima_dosis &&
        vacuna.fecha_vacunacion
      ) {
        const f = new Date(vacuna.fecha_vacunacion);
        if (!isNaN(f.getTime())) {
          f.setDate(f.getDate() + 28);
          vacuna.proxima_dosis = f.toISOString().split("T")[0];
        }
      }
      return {
        ...prev,
        vacunas_inoculadas: [...(prev.vacunas_inoculadas || []), vacuna],
      };
    });
    console.log("Vacuna agregada:", vacunasData);
    console.log("Formulario actualizado:", formData);
    setVacunasData({
      nombre_vacuna: "",
      fecha_vacunacion: new Date().toISOString().split("T")[0],
      marca: "",
      numero_de_serie: "",
      proxima_dosis: "",
      requiere_proxima: true,
    });
  };

  const handleEliminarVacuna = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      vacunas_inoculadas: prev.vacunas_inoculadas
        ? prev.vacunas_inoculadas.filter((_, i) => i !== index)
        : undefined,
    }));
  };

  const handleDesparasitacionInternaChange = (e: any) => {
    const { name, value } = e.target ?? {
      name: e.detail?.name,
      value: e.detail?.value,
    };
    const val = value ?? e.detail?.value ?? "";
    setDesparasitacionInternaData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleAgregarDesparasitacionInterna = () => {
    const desparasitacion = { ...desparasitacionInternaData };
    // Si requiere próxima dosis y no se proporcionó, calcular +30 días
    if (
      desparasitacion.requiere_proxima !== false &&
      !desparasitacion.proxima_dosis &&
      desparasitacion.fecha_administracion
    ) {
      const f = new Date(desparasitacion.fecha_administracion);
      if (!isNaN(f.getTime())) {
        f.setDate(f.getDate() + 30);
        desparasitacion.proxima_dosis = f.toISOString().split("T")[0];
      }
    }

    setFormData((prev) => ({
      ...prev,
      desparasitacion_interna: desparasitacion,
    }));
    // Reset form
    setDesparasitacionInternaData({
      nombre_desparasitante: "",
      fecha_administracion: new Date().toISOString().split("T")[0],
      marca: "",
      numero_de_serie: "",
      proxima_dosis: "",
      requiere_proxima: true,
    });
  };

  const handleDesparasitacionExternaChange = (e: any) => {
    const { name, value } = e.target ?? {
      name: e.detail?.name,
      value: e.detail?.value,
    };
    const val = value ?? e.detail?.value ?? "";
    setDesparasitacionExternaData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleAgregarDesparasitacionExterna = () => {
    const desparasitacion = { ...desparasitacionExternaData };
    // Si requiere próxima dosis y no se proporcionó, calcular +30 días
    if (
      desparasitacion.requiere_proxima !== false &&
      !desparasitacion.proxima_dosis &&
      desparasitacion.fecha_administracion
    ) {
      const f = new Date(desparasitacion.fecha_administracion);
      if (!isNaN(f.getTime())) {
        f.setDate(f.getDate() + 30);
        desparasitacion.proxima_dosis = f.toISOString().split("T")[0];
      }
    }

    setFormData((prev) => ({
      ...prev,
      desparasitacion_externa: desparasitacion,
    }));
    // Reset form
    setDesparasitacionExternaData({
      nombre_desparasitante: "",
      fecha_administracion: new Date().toISOString().split("T")[0],
      marca: "",
      numero_de_serie: "",
      proxima_dosis: "",
      requiere_proxima: true,
    });
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

  // useEffect para cargar el paciente desde sessionStorage si existe
  useEffect(() => {
    const pacienteStr = sessionStorage.getItem("pacienteParaFicha");
    if (pacienteStr) {
      try {
        const pacienteData: PacienteData = JSON.parse(pacienteStr);
        handlePacienteSelected(pacienteData);
        sessionStorage.removeItem("pacienteParaFicha");
      } catch (error) {
        console.error("Error parsing paciente from sessionStorage:", error);
      }
    }
  }, []);

  const navegarSiguiente = () => {
    if (currentStep === "general") {
      setCurrentStep("fisico");
    } else if (currentStep === "fisico") {
      setCurrentStep("clinico");
    } else if (currentStep === "clinico") {
      setCurrentStep("post_pronostico");
    } else if (currentStep === "post_pronostico") {
      setCurrentStep("receta_medica");
    }
  };

  const navegarAnterior = () => {
    if (currentStep === "clinico") {
      setCurrentStep("fisico");
    } else if (currentStep === "fisico") {
      setCurrentStep("general");
    } else if (currentStep === "post_pronostico") {
      setCurrentStep("clinico");
    } else if (currentStep === "receta_medica") {
      setCurrentStep("post_pronostico");
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
      // Preparar datos con recetas médicas
      const dataToSend = {
        ...formData,
        receta_medica:
          recetaMedicaData.length > 0 ? recetaMedicaData : undefined,
      };

      console.log("Guardando ficha:", dataToSend);
      const response = await crearConsulta(dataToSend);
      setToastMessage("Ficha veterinaria guardada exitosamente");

      // Limpiar formulario después de guardar
      setFormData({
        id_paciente: 0,
        rut: "",
        fecha_consulta: new Date().toISOString().split("T")[0],
        motivo: "",
        diagnostico: "",
        observaciones: "",
        nodulos_linfaticos: "",
        mucosas: "",
        peso: 0,
        estado_pelaje: "",
        condicion_corporal: "",
        id_consulta: 0,
        motivo_consulta: "", // ← Agregar para compatibilidad con backend
        estado_piel: "",
        temperatura: 0,
        frecuencia_cardiaca: 0,
        frecuencia_respiratoria: 0,
        deshidratacion: 0,
        vacunas_inoculadas: undefined,
        desparasitacion_interna: undefined,
        desparasitacion_externa: undefined,
        examen_clinico: "",
        indicaciones_generales: "",
        orden_de_examenes: "",
        receta_medica: [],
        proxima_consulta: "",
        tllc: 0,

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
      setRecetaMedicaData([]);
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
      case "post_pronostico":
        return 4;
      case "receta_medica":
        return 5;
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
      case "post_pronostico":
        return "Post pronóstico";
      case "receta_medica":
        return "Receta Médica";
      default:
        return "Información General";
    }
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
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
              <p color="medium">Paso {getStepNumber()} de 5</p>
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
                                  {selectedPaciente.tutor.email != "NaN"
                                    ? selectedPaciente.tutor.email
                                    : "No asignado"}
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
                    <IonInput
                      label="Frecuencia cardíaca ( 1pm )"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Ej: 80"
                      type="number"
                      name="frecuencia_cardiaca"
                      value={formData.frecuencia_cardiaca}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonInput
                      label="Frecuencia respiratoria ( rpm )"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Ej: 20"
                      type="number"
                      name="frecuencia_respiratoria"
                      value={formData.frecuencia_respiratoria}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonTextarea
                      label="Condición corporal"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Valores de 3-5"
                      rows={3}
                      name="condicion_corporal"
                      value={formData.condicion_corporal}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonTextarea
                      label="Estado de la piel"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa el estado de la piel"
                      rows={3}
                      name="estado_piel"
                      value={formData.estado_piel}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonTextarea
                      label="Estado del pelaje"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa el estado del pelaje"
                      rows={3}
                      name="estado_pelaje"
                      value={formData.estado_pelaje}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonTextarea
                      label="Mucosas"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Rosadas y brillantes"
                      rows={3}
                      name="mucosas"
                      value={formData.mucosas}
                      onIonChange={handleInputChange}
                    />
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
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonInput
                      label="Temperatura (°C)"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa el estado del pelaje"
                      type="number"
                      name="temperatura"
                      value={formData.temperatura}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonInput
                      label="Deshidtratación (%)"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa el estado del pelaje"
                      type="number"
                      name="deshidratacion"
                      value={formData.deshidratacion}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonInput
                      label="TLLC - Tiempo de Llenado Capilar (seg)"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Ej: 2"
                      type="number"
                      name="tllc"
                      value={formData.tllc}
                      onIonChange={handleNumericChange}
                      step="0.1"
                      min="0"
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonTextarea
                      label="Examen clínico"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa el examen clínico realizado"
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
                      label="Pre diagnósticos"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa los pre diagnósticos realizados"
                      rows={4}
                      name="observaciones"
                      value={formData.observaciones}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>Vacunas administradas</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonGrid>
                        <IonRow>
                          <IonCol size="12" size-md="6">
                            <IonItem>
                              <IonSelect
                                label="Nombre de vacuna"
                                labelPlacement="stacked"
                                fill="outline"
                                name="nombre_vacuna"
                                value={vacunasData.nombre_vacuna}
                                onIonChange={handleVacunasChange}
                              >
                                <IonSelectOption value="Sextuple">
                                  Sextuple
                                </IonSelectOption>
                                <IonSelectOption value="KC triple Felina">
                                  KC triple Felina
                                </IonSelectOption>
                                <IonSelectOption value="Antirrábica">
                                  Leucemia y Antirrábica
                                </IonSelectOption>
                              </IonSelect>
                            </IonItem>
                          </IonCol>
                          <IonCol size="12" size-md="6">
                            <IonItem>
                              <IonInput
                                label="Marca"
                                labelPlacement="stacked"
                                fill="outline"
                                placeholder="Marca del producto"
                                name="marca"
                                value={vacunasData.marca}
                                onIonChange={handleVacunasChange}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size="12" size-md="4">
                            <IonItem>
                              <IonInput
                                label="Número de serie / cert."
                                labelPlacement="stacked"
                                fill="outline"
                                placeholder="Número de serie o certificado"
                                name="numero_de_serie"
                                value={vacunasData.numero_de_serie}
                                onIonChange={handleVacunasChange}
                              />
                            </IonItem>
                          </IonCol>

                          <IonCol size="12" size-md="4">
                            <IonItem>
                              <IonInput
                                label="Fecha vacunación"
                                labelPlacement="stacked"
                                fill="outline"
                                type="date"
                                name="fecha_vacunacion"
                                value={vacunasData.fecha_vacunacion}
                                onIonChange={handleVacunasChange}
                              />
                            </IonItem>
                          </IonCol>

                          <IonCol size="12" size-md="4">
                            <IonItem lines="none">
                              <IonLabel>Requiere próxima dosis</IonLabel>
                              <IonToggle
                                name="requiere_proxima"
                                checked={vacunasData.requiere_proxima}
                                onIonChange={handleVacunaToggle}
                              />
                            </IonItem>
                          </IonCol>

                          {vacunasData.requiere_proxima && (
                            <IonCol size="12" size-md="4">
                              <IonItem>
                                <IonInput
                                  label="Próxima dosis"
                                  labelPlacement="stacked"
                                  fill="outline"
                                  type="date"
                                  name="proxima_dosis"
                                  value={vacunasData.proxima_dosis}
                                  onIonChange={handleVacunasChange}
                                />
                              </IonItem>
                            </IonCol>
                          )}
                        </IonRow>

                        <IonRow>
                          <IonCol size="12" className="ion-text-end">
                            <IonButton
                              size="small"
                              onClick={handleAgregarVacuna}
                            >
                              Agregar vacuna
                            </IonButton>
                          </IonCol>
                        </IonRow>

                        {/* Listado de vacunas añadidas */}
                        {(formData.vacunas_inoculadas || []).length > 0 && (
                          <>
                            <IonRow>
                              <IonCol size="12">
                                <IonList>
                                  {(formData.vacunas_inoculadas || []).map(
                                    (v: any, idx: number) => (
                                      <IonItem key={idx}>
                                        <IonLabel>
                                          <h3>{v.nombre_vacuna}</h3>
                                          <p>
                                            {v.marca ? `${v.marca} · ` : ""}
                                            {v.numero_de_serie
                                              ? `N° ${v.numero_de_serie} · `
                                              : ""}
                                            Fecha: {v.fecha_vacunacion} · Próx:{" "}
                                            {v.proxima_dosis}
                                          </p>
                                        </IonLabel>
                                        <IonButtons slot="end">
                                          <IonButton
                                            fill="clear"
                                            color="danger"
                                            onClick={() =>
                                              handleEliminarVacuna(idx)
                                            }
                                          >
                                            Eliminar
                                          </IonButton>
                                        </IonButtons>
                                      </IonItem>
                                    )
                                  )}
                                </IonList>
                              </IonCol>
                            </IonRow>
                          </>
                        )}
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>

              {/* Sección Desparasitación Interna */}
              <IonRow>
                <IonCol size="12">
                  <CajaDesparasitacion
                    titulo="Desparasitación Interna (Opcional)"
                    tipo="interna"
                    datos={desparasitacionInternaData}
                    setDatos={setDesparasitacionInternaData}
                    onAgregar={handleAgregarDesparasitacionInterna}
                    datoGuardado={formData.desparasitacion_interna}
                  />
                </IonCol>
              </IonRow>

              {/* Sección Desparasitación Externa */}
              <IonRow>
                <IonCol size="12">
                  <CajaDesparasitacion
                    titulo="Desparasitación Externa (Opcional)"
                    tipo="externa"
                    datos={desparasitacionExternaData}
                    setDatos={setDesparasitacionExternaData}
                    onAgregar={handleAgregarDesparasitacionExterna}
                    datoGuardado={formData.desparasitacion_externa}
                  />
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonTextarea
                      label="Diagnóstico"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa el diagnóstico realizado"
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
                    <IonSelect
                      label="Pronóstico"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Seleccione un pronóstico"
                      name="pronostico"
                      value={formData.pronostico}
                      onIonChange={handleInputChange}
                    >
                      <IonSelectOption value="favorable">
                        Favorable
                      </IonSelectOption>
                      <IonSelectOption value="desfavorable">
                        Desfavorable
                      </IonSelectOption>
                      <IonSelectOption value="reservado">
                        Reservado
                      </IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonList>
        )}

        {/* Paso 4: post pronostico */}
        {currentStep === "post_pronostico" && (
          <IonList>
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonInput
                      label="Indicaciones generales"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa las indicaciones generales realizadas"
                      type="text"
                      name="indicaciones_generales"
                      value={formData.indicaciones_generales}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonInput
                      label="Orden de exámenes"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa la orden de examenes realizados"
                      type="text"
                      name="orden_de_examenes"
                      value={formData.orden_de_examenes}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonTextarea
                      label="Pre diagnósticos"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Describa los pre diagnósticos realizados"
                      rows={4}
                      name="observaciones"
                      value={formData.observaciones}
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
                      placeholder="Describa el diagnóstico realizado"
                      rows={4}
                      name="diagnostico"
                      value={formData.diagnostico}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonList>
        )}

        {/* Paso 5: receta médica */}
        {currentStep === "receta_medica" && (
          <CajaRecetas
            recetas={recetaMedicaData}
            setRecetas={setRecetaMedicaData}
          />
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
                      <small>Paso 1 de 5</small>
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
                      <small>Paso 2 de 5</small>
                    </IonText>
                  </IonCol>
                  <IonCol size="4" className="ion-text-end">
                    <IonButton fill="solid" onClick={navegarSiguiente}>
                      Siguiente
                      <IonIcon icon={chevronForwardOutline} slot="end" />
                    </IonButton>
                  </IonCol>
                </>
              ) : currentStep === "clinico" ? (
                <>
                  <IonCol size="4" className="ion-text-start">
                    <IonButton fill="outline" onClick={navegarAnterior}>
                      <IonIcon icon={chevronBackOutline} slot="start" />
                      Anterior
                    </IonButton>
                  </IonCol>
                  <IonCol size="4" className="ion-text-center">
                    <IonText color="medium">
                      <small>Paso 3 de 5</small>
                    </IonText>
                  </IonCol>
                  <IonCol size="4" className="ion-text-end">
                    <IonButton fill="solid" onClick={navegarSiguiente}>
                      Siguiente
                      <IonIcon icon={chevronForwardOutline} slot="end" />
                    </IonButton>
                  </IonCol>
                </>
              ) : currentStep === "post_pronostico" ? (
                <>
                  <IonCol size="4" className="ion-text-start">
                    <IonButton fill="outline" onClick={navegarAnterior}>
                      <IonIcon icon={chevronBackOutline} slot="start" />
                      Anterior
                    </IonButton>
                  </IonCol>
                  <IonCol size="4" className="ion-text-center">
                    <IonText color="medium">
                      <small>Paso 4 de 5</small>
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
                      <small>Paso 5 de 5</small>
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

      {/* Botón flotante para agregar nueva ficha rápidamente */}
      {currentStep === "general" && !selectedPaciente && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "16px",
            zIndex: 999,
          }}
        >
          <IonButton
            fill="solid"
            shape="round"
            onClick={() => setShowModalPacientes(true)}
            style={{ width: "56px", height: "56px" }}
          >
            <IonIcon icon={saveOutline} style={{ fontSize: "24px" }} />
          </IonButton>
        </div>
      )}

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
