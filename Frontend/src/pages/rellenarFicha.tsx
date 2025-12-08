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
  IonModal,
  IonAlert,
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
  pulseOutline,
  bodyOutline,
  clipboardOutline,
  flaskOutline,
  medkitOutline,
  documentTextOutline,
  closeOutline,
  closeCircleOutline,
} from "ionicons/icons";
import "../styles/rellenarFicha.css";
import "../styles/variables.css";
import ModalEscogerPaciente from "../components/rellenarFicha/modalEscogerPaciente";
import CajaDesparasitacion from "../components/desparasitacion/CajaDesparasitacion";
import CajaRecetas from "../components/recetas/CajaRecetas";
import ModuleCard from "../components/rellenarFicha/ModuleCard";
import PatientHeader from "../components/rellenarFicha/PatientHeader";
import { PacienteData } from "../api/pacientes";
import { TutorData } from "../api/tutores";
import {
  ConsultaData,
  crearConsulta,
  VacunasData,
  RecetaMedicaData,
  DesparasitacionData,
} from "../api/fichas";

// Componente: Dashboard con 6 módulos para gestionar consultas
const RellenarFicha: React.FC = () => {
  const [showModalPacientes, setShowModalPacientes] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [touchedModules, setTouchedModules] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [requiereProximaConsulta, setRequiereProximaConsulta] = useState(false);
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
    vacunas_inoculadas: undefined,
    desparasitacion_interna: undefined,
    desparasitacion_externa: undefined,
    examen_clinico: "",
    indicaciones_generales: "",
    receta_medica: undefined,
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

  // Función para abrir módulo y marcarlo como tocado
  const openModule = (moduleId: string) => {
    setActiveModule(moduleId);
    setTouchedModules((prev) => new Set(prev).add(moduleId));
  };

  // Función de validación para determinar el estado de cada módulo
  const getModuleStatus = (
    moduleId: string
  ): "empty" | "complete" | "incomplete" | "visited" => {
    const isTouched = touchedModules.has(moduleId);

    switch (moduleId) {
      case "identificacion":
        if (formData.motivo.trim()) return "complete";
        return isTouched ? "visited" : "empty";

      case "constantes":
        const hasAllConstantes =
          formData.peso > 0 && (formData.temperatura ?? 0) > 0;
        const hasSomeConstantes =
          formData.peso > 0 ||
          (formData.temperatura ?? 0) > 0 ||
          (formData.frecuencia_cardiaca ?? 0) > 0 ||
          (formData.frecuencia_respiratoria ?? 0) > 0;

        if (hasAllConstantes) return "complete";
        if (hasSomeConstantes) return "incomplete";
        if (isTouched) return "visited";
        return "empty";

      case "examen_fisico":
        const hasAllFisico = formData.mucosas && formData.condicion_corporal;
        const hasSomeFisico =
          formData.mucosas ||
          formData.condicion_corporal ||
          formData.estado_pelaje ||
          formData.estado_piel ||
          formData.nodulos_linfaticos;

        if (hasAllFisico) return "complete";
        if (hasSomeFisico) return "incomplete";
        if (isTouched) return "visited";
        return "empty";

      case "diagnostico":
        if (formData.diagnostico.trim()) return "complete";
        if (formData.examen_clinico?.trim() || formData.observaciones?.trim())
          return "incomplete";
        if (isTouched) return "visited";
        return "empty";

      case "vacunacion":
        if (
          formData.vacunas_inoculadas &&
          formData.vacunas_inoculadas.length > 0
        )
          return "complete";
        return isTouched ? "visited" : "empty";

      case "antiparasitarios":
        if (
          formData.desparasitacion_interna ||
          formData.desparasitacion_externa
        )
          return "complete";
        return isTouched ? "visited" : "empty";

      case "plan_tratamiento":
        if (
          (recetaMedicaData && recetaMedicaData.length > 0) ||
          formData.indicaciones_generales?.trim()
        )
          return "complete";
        if (formData.orden_de_examenes?.trim()) return "incomplete";
        if (isTouched) return "visited";
        return "empty";

      default:
        return "empty";
    }
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

      console.log("=== INICIO LOG GUARDADO FICHA ===");
      console.log(
        "📋 Datos completos a enviar:",
        JSON.stringify(dataToSend, null, 2)
      );
      console.log("\n🐾 Paciente:", {
        id: dataToSend.id_paciente,
        nombre: dataToSend.paciente?.nombre,
        especie: dataToSend.paciente?.especie,
        raza: dataToSend.paciente?.raza,
      });
      console.log("\n👤 Tutor:", {
        rut: dataToSend.rut,
        nombre: dataToSend.tutor?.nombre,
      });
      console.log("\n🩺 Constantes Vitales:", {
        peso: dataToSend.peso,
        temperatura: dataToSend.temperatura,
        fc: dataToSend.frecuencia_cardiaca,
        fr: dataToSend.frecuencia_respiratoria,
        tllc: dataToSend.tllc,
      });
      console.log("\n🔬 Examen Físico:", {
        mucosas: dataToSend.mucosas,
        condicion_corporal: dataToSend.condicion_corporal,
        estado_pelaje: dataToSend.estado_pelaje,
        estado_piel: dataToSend.estado_piel,
        nodulos_linfaticos: dataToSend.nodulos_linfaticos?.substring(0, 50),
      });
      console.log("\n📝 Diagnóstico:", {
        motivo: dataToSend.motivo,
        examen_clinico: dataToSend.examen_clinico?.substring(0, 50),
        diagnostico: dataToSend.diagnostico?.substring(0, 50),
        observaciones: dataToSend.observaciones?.substring(0, 50),
      });
      console.log(
        "\n💉 Vacunas:",
        dataToSend.vacunas_inoculadas?.length || 0,
        "registradas"
      );
      if (dataToSend.vacunas_inoculadas) {
        dataToSend.vacunas_inoculadas.forEach((v, i) =>
          console.log(`  ${i + 1}. ${v.nombre_vacuna} - ${v.fecha_vacunacion}`)
        );
      }
      console.log("\n🐛 Desparasitación:");
      console.log(
        "  Interna:",
        dataToSend.desparasitacion_interna?.nombre_desparasitante ||
          "No registrada"
      );
      console.log(
        "  Externa:",
        dataToSend.desparasitacion_externa?.nombre_desparasitante ||
          "No registrada"
      );
      console.log(
        "\n💊 Recetas Médicas:",
        dataToSend.receta_medica?.length || 0,
        "registradas"
      );
      if (dataToSend.receta_medica) {
        dataToSend.receta_medica.forEach((r, i) =>
          console.log(
            `  ${i + 1}. ${r.medicamento} - ${r.dosis} cada ${
              r.frecuencia
            } por ${r.duracion}`
          )
        );
      }
      console.log(
        "\n📅 Indicaciones:",
        dataToSend.indicaciones_generales?.substring(0, 50) ||
          "Sin indicaciones"
      );
      console.log("=== FIN LOG GUARDADO FICHA ===\n");

      const response = await crearConsulta(dataToSend);
      console.log("✅ Respuesta del servidor:", response);
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
        vacunas_inoculadas: undefined,
        desparasitacion_interna: undefined,
        desparasitacion_externa: undefined,
        examen_clinico: "",
        indicaciones_generales: "",
        receta_medica: [],
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
      setActiveModule(null);
    } catch (error) {
      console.error("Error al guardar ficha:", error);
      setToastMessage("Error al guardar la ficha");
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }
  };

  const handleCancelar = () => {
    // Limpiar todo el formulario y estados
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
      motivo_consulta: "",
      estado_piel: "",
      temperatura: 0,
      frecuencia_cardiaca: 0,
      frecuencia_respiratoria: 0,
      vacunas_inoculadas: undefined,
      desparasitacion_interna: undefined,
      desparasitacion_externa: undefined,
      examen_clinico: "",
      indicaciones_generales: "",
      receta_medica: [],
      tllc: 0,
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
    setActiveModule(null);
    setTouchedModules(new Set());
    setRequiereProximaConsulta(false);
    setShowCancelAlert(false);
    setToastMessage("Formulario cancelado");
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Generar ficha clínica</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Generar ficha clínica</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Banner de Paciente */}
        {!selectedPaciente ? (
          <IonCard>
            <IonCardContent>
              <IonText
                color="medium"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <IonIcon icon={pawOutline} />
                <span>No se ha seleccionado ningún paciente</span>
              </IonText>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => setShowModalPacientes(true)}
                style={{ marginTop: "12px" }}
              >
                Seleccionar Paciente
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <PatientHeader
            paciente={selectedPaciente}
            motivo={formData.motivo}
            onChangePaciente={() => setShowModalPacientes(true)}
          />
        )}

        {/* Dashboard Grid - 6 Módulos */}
        {selectedPaciente && (
          <IonGrid fixed style={{ padding: "12px", maxWidth: "1200px" }}>
            <IonRow>
              <IonCol size="6" sizeMd="4" sizeLg="3">
                <ModuleCard
                  icon={pulseOutline}
                  title="Constantes Vitales"
                  status={getModuleStatus("constantes")}
                  onClick={() => openModule("constantes")}
                />
              </IonCol>
              <IonCol size="6" sizeMd="4" sizeLg="3">
                <ModuleCard
                  icon={bodyOutline}
                  title="Examen Físico"
                  status={getModuleStatus("examen_fisico")}
                  onClick={() => openModule("examen_fisico")}
                />
              </IonCol>
              <IonCol size="6" sizeMd="4" sizeLg="3">
                <ModuleCard
                  icon={clipboardOutline}
                  title="Diagnóstico Clínico"
                  status={getModuleStatus("diagnostico")}
                  onClick={() => openModule("diagnostico")}
                />
              </IonCol>
              <IonCol size="6" sizeMd="4" sizeLg="3">
                <ModuleCard
                  icon="/vaccine.svg"
                  iconType="svg"
                  title="Vacunación"
                  status={getModuleStatus("vacunacion")}
                  onClick={() => openModule("vacunacion")}
                />
              </IonCol>
              <IonCol size="6" sizeMd="4" sizeLg="3">
                <ModuleCard
                  icon="/pills.svg"
                  iconType="svg"
                  title="Antiparasitarios"
                  status={getModuleStatus("antiparasitarios")}
                  onClick={() => openModule("antiparasitarios")}
                />
              </IonCol>
              <IonCol size="6" sizeMd="4" sizeLg="3">
                <ModuleCard
                  icon={documentTextOutline}
                  title="Plan y Tratamiento"
                  status={getModuleStatus("plan_tratamiento")}
                  onClick={() => openModule("plan_tratamiento")}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

        {/* MODAL 1: Constantes Vitales */}
        <IonModal
          className="module-modal"
          isOpen={activeModule === "constantes"}
          onDidDismiss={() => setActiveModule(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Constantes Vitales</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setActiveModule(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonInput
                  label="Peso (kg)"
                  labelPlacement="stacked"
                  fill="outline"
                  type="number"
                  step="0.1"
                  name="peso"
                  value={formData.peso}
                  onIonChange={handleNumericChange}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  label="Temperatura (°C)"
                  labelPlacement="stacked"
                  fill="outline"
                  type="number"
                  step="0.1"
                  name="temperatura"
                  value={formData.temperatura}
                  onIonChange={handleNumericChange}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  label="Frecuencia Cardíaca (lpm)"
                  labelPlacement="stacked"
                  fill="outline"
                  type="number"
                  name="frecuencia_cardiaca"
                  value={formData.frecuencia_cardiaca}
                  onIonChange={handleNumericChange}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  label="Frecuencia Respiratoria (rpm)"
                  labelPlacement="stacked"
                  fill="outline"
                  type="number"
                  name="frecuencia_respiratoria"
                  value={formData.frecuencia_respiratoria}
                  onIonChange={handleNumericChange}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  label="TLLC - Tiempo de Llenado Capilar (seg)"
                  labelPlacement="stacked"
                  fill="outline"
                  type="number"
                  step="0.1"
                  name="tllc"
                  value={formData.tllc}
                  onIonChange={handleNumericChange}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              className="modal-close-button"
              onClick={() => setActiveModule(null)}
            >
              Cerrar
            </IonButton>
          </IonContent>
        </IonModal>

        {/* MODAL 2: Examen Físico */}
        <IonModal
          className="module-modal"
          isOpen={activeModule === "examen_fisico"}
          onDidDismiss={() => setActiveModule(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Examen Físico</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setActiveModule(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonSelect
                  label="Mucosas"
                  labelPlacement="stacked"
                  fill="outline"
                  interface="action-sheet"
                  name="mucosas"
                  value={formData.mucosas}
                  onIonChange={handleInputChange}
                >
                  <IonSelectOption value="Rosadas y brillantes">
                    Rosadas y brillantes
                  </IonSelectOption>
                  <IonSelectOption value="Pálidas">Pálidas</IonSelectOption>
                  <IonSelectOption value="Cianóticas">
                    Cianóticas
                  </IonSelectOption>
                  <IonSelectOption value="Ictéricas">Ictéricas</IonSelectOption>
                  <IonSelectOption value="Congestivas">
                    Congestivas
                  </IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonSelect
                  label="Condición Corporal"
                  labelPlacement="stacked"
                  fill="outline"
                  interface="action-sheet"
                  name="condicion_corporal"
                  value={formData.condicion_corporal}
                  onIonChange={handleInputChange}
                >
                  <IonSelectOption value="Muy delgado">
                    Muy delgado
                  </IonSelectOption>
                  <IonSelectOption value="Delgado">Delgado</IonSelectOption>
                  <IonSelectOption value="Normal">Normal</IonSelectOption>
                  <IonSelectOption value="Sobrepeso">Sobrepeso</IonSelectOption>
                  <IonSelectOption value="Obeso">Obeso</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonSelect
                  label="Estado del Pelaje"
                  labelPlacement="stacked"
                  fill="outline"
                  interface="action-sheet"
                  name="estado_pelaje"
                  value={formData.estado_pelaje}
                  onIonChange={handleInputChange}
                >
                  <IonSelectOption value="Muy bueno">Muy bueno</IonSelectOption>
                  <IonSelectOption value="Bueno">Bueno</IonSelectOption>
                  <IonSelectOption value="Regular">Regular</IonSelectOption>
                  <IonSelectOption value="Malo">Malo</IonSelectOption>
                  <IonSelectOption value="Muy malo">Muy malo</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonSelect
                  label="Estado de la Piel"
                  labelPlacement="stacked"
                  fill="outline"
                  interface="action-sheet"
                  name="estado_piel"
                  value={formData.estado_piel}
                  onIonChange={handleInputChange}
                >
                  <IonSelectOption value="Muy bueno">Muy bueno</IonSelectOption>
                  <IonSelectOption value="Bueno">Bueno</IonSelectOption>
                  <IonSelectOption value="Regular">Regular</IonSelectOption>
                  <IonSelectOption value="Malo">Malo</IonSelectOption>
                  <IonSelectOption value="Muy malo">Muy malo</IonSelectOption>
                </IonSelect>
              </IonItem>
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
            </IonList>
            <IonButton
              expand="block"
              className="modal-close-button"
              onClick={() => setActiveModule(null)}
            >
              Cerrar
            </IonButton>
          </IonContent>
        </IonModal>

        {/* MODAL 3: Diagnóstico Clínico */}
        <IonModal
          className="module-modal"
          isOpen={activeModule === "diagnostico"}
          onDidDismiss={() => setActiveModule(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Diagnóstico Clínico</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setActiveModule(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonTextarea
                  label="Examen Clínico"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Describa el examen clínico realizado"
                  rows={4}
                  name="examen_clinico"
                  value={formData.examen_clinico}
                  onIonChange={handleInputChange}
                />
              </IonItem>
              <IonItem>
                <IonTextarea
                  label="Observaciones"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Observaciones adicionales"
                  rows={3}
                  name="observaciones"
                  value={formData.observaciones}
                  onIonChange={handleInputChange}
                />
              </IonItem>
              <IonItem>
                <IonTextarea
                  label="Diagnóstico"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Diagnóstico final"
                  rows={4}
                  name="diagnostico"
                  value={formData.diagnostico}
                  onIonChange={handleInputChange}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              className="modal-close-button"
              onClick={() => setActiveModule(null)}
            >
              Cerrar
            </IonButton>
          </IonContent>
        </IonModal>

        {/* MODAL 4: Vacunación */}
        <IonModal
          className="module-modal"
          isOpen={activeModule === "vacunacion"}
          onDidDismiss={() => setActiveModule(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Vacunación</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setActiveModule(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Agregar Vacuna</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonSelect
                      label="Nombre de la Vacuna"
                      labelPlacement="stacked"
                      fill="outline"
                      interface="action-sheet"
                      name="nombre_vacuna"
                      value={vacunasData.nombre_vacuna}
                      onIonChange={handleVacunasChange}
                    >
                      <IonSelectOption value="Antirrábica">
                        Antirrábica
                      </IonSelectOption>
                      <IonSelectOption value="Triple Felina">
                        Triple Felina
                      </IonSelectOption>
                      <IonSelectOption value="Quíntuple Canina">
                        Quíntuple Canina
                      </IonSelectOption>
                      <IonSelectOption value="Séxtuple Canina">
                        Séxtuple Canina
                      </IonSelectOption>
                      <IonSelectOption value="Octuple Canina">
                        Octuple Canina
                      </IonSelectOption>
                      <IonSelectOption value="Traqueobronquitis">
                        Traqueobronquitis
                      </IonSelectOption>
                      <IonSelectOption value="Leucemia Felina">
                        Leucemia Felina
                      </IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Fecha de Vacunación"
                      labelPlacement="stacked"
                      fill="outline"
                      type="date"
                      name="fecha_vacunacion"
                      value={vacunasData.fecha_vacunacion}
                      onIonChange={handleVacunasChange}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label="Marca"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Marca de la vacuna"
                      name="marca"
                      value={vacunasData.marca}
                      onIonChange={handleVacunasChange}
                    />
                  </IonItem>
                  {vacunasData.nombre_vacuna === "Antirrábica" && (
                    <IonItem>
                      <IonInput
                        label="N° Certificado"
                        labelPlacement="stacked"
                        fill="outline"
                        placeholder="Número de certificado"
                        name="numero_de_serie"
                        value={vacunasData.numero_de_serie}
                        onIonChange={handleVacunasChange}
                      />
                    </IonItem>
                  )}
                  <IonItem>
                    <IonToggle
                      checked={vacunasData.requiere_proxima}
                      onIonChange={handleVacunaToggle}
                    >
                      Requiere próxima dosis
                    </IonToggle>
                  </IonItem>
                  {vacunasData.requiere_proxima && (
                    <IonItem>
                      <IonInput
                        label="Fecha de Próxima Dosis"
                        labelPlacement="stacked"
                        fill="outline"
                        type="date"
                        name="proxima_dosis"
                        value={vacunasData.proxima_dosis}
                        onIonChange={handleVacunasChange}
                      />
                    </IonItem>
                  )}
                </IonList>
                <IonButton
                  expand="block"
                  onClick={handleAgregarVacuna}
                  style={{ marginTop: "16px" }}
                >
                  Agregar Vacuna
                </IonButton>
              </IonCardContent>
            </IonCard>

            {/* Lista de Vacunas Agregadas */}
            {formData.vacunas_inoculadas &&
              formData.vacunas_inoculadas.length > 0 && (
                <IonCard style={{ marginTop: "16px" }}>
                  <IonCardHeader>
                    <IonCardTitle>Vacunas Registradas</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList>
                      {formData.vacunas_inoculadas.map((vacuna, index) => (
                        <IonItem key={index}>
                          <IonLabel>
                            <h3>{vacuna.nombre_vacuna}</h3>
                            <p>Fecha: {vacuna.fecha_vacunacion}</p>
                            {vacuna.marca && <p>Marca: {vacuna.marca}</p>}
                            {vacuna.requiere_proxima &&
                              vacuna.proxima_dosis && (
                                <p>Próxima dosis: {vacuna.proxima_dosis}</p>
                              )}
                          </IonLabel>
                          <IonButton
                            slot="end"
                            color="danger"
                            fill="clear"
                            onClick={() => handleEliminarVacuna(index)}
                          >
                            Eliminar
                          </IonButton>
                        </IonItem>
                      ))}
                    </IonList>
                  </IonCardContent>
                </IonCard>
              )}

            <IonButton
              expand="block"
              className="modal-close-button"
              onClick={() => setActiveModule(null)}
            >
              Cerrar
            </IonButton>
          </IonContent>
        </IonModal>

        {/* MODAL 5: Antiparasitarios */}
        <IonModal
          className="module-modal"
          isOpen={activeModule === "antiparasitarios"}
          onDidDismiss={() => setActiveModule(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Antiparasitarios</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setActiveModule(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <CajaDesparasitacion
              titulo="Desparasitación Interna"
              tipo="interna"
              datos={desparasitacionInternaData}
              setDatos={setDesparasitacionInternaData}
              onAgregar={handleAgregarDesparasitacionInterna}
              datoGuardado={formData.desparasitacion_interna ?? null}
            />

            <CajaDesparasitacion
              titulo="Desparasitación Externa"
              tipo="externa"
              datos={desparasitacionExternaData}
              setDatos={setDesparasitacionExternaData}
              onAgregar={handleAgregarDesparasitacionExterna}
              datoGuardado={formData.desparasitacion_externa ?? null}
            />

            <IonButton
              expand="block"
              className="modal-close-button"
              onClick={() => setActiveModule(null)}
            >
              Cerrar
            </IonButton>
          </IonContent>
        </IonModal>

        {/* MODAL 6: Plan y Tratamiento */}
        <IonModal
          className="module-modal"
          isOpen={activeModule === "plan_tratamiento"}
          onDidDismiss={() => setActiveModule(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Plan y Tratamiento</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setActiveModule(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <CajaRecetas
              recetas={recetaMedicaData}
              setRecetas={setRecetaMedicaData}
            />

            <IonList style={{ marginTop: "24px" }}>
              <IonItem>
                <IonTextarea
                  label="Indicaciones Generales"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Indicaciones para el tutor"
                  rows={4}
                  name="indicaciones_generales"
                  value={formData.indicaciones_generales}
                  onIonChange={handleInputChange}
                />
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              className="modal-close-button"
              onClick={() => setActiveModule(null)}
            >
              Cerrar
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>

      {/* Footer Fijo con Botones */}
      {selectedPaciente && (
        <IonFooter className="ficha-footer">
          <IonToolbar>
            <div className="footer-buttons-container">
              <IonButton
                className="cancel-button"
                fill="outline"
                onClick={() => setShowCancelAlert(true)}
                disabled={isLoading}
              >
                <IonIcon icon={closeCircleOutline} slot="start" />
                Cancelar
              </IonButton>
              <IonButton
                className="save-button"
                expand="block"
                onClick={guardarFicha}
                disabled={isLoading}
              >
                <IonIcon icon={saveOutline} slot="start" />
                {isLoading ? "Guardando..." : "Guardar"}
              </IonButton>
            </div>
          </IonToolbar>
        </IonFooter>
      )}

      {/* Modal para escoger paciente */}
      <ModalEscogerPaciente
        isOpen={showModalPacientes}
        onDidDismiss={() => setShowModalPacientes(false)}
        onPacienteSelected={handlePacienteSelected}
        motivoConsulta={formData.motivo}
        onMotivoChange={(motivo) =>
          setFormData((prev) => ({ ...prev, motivo }))
        }
      />

      {/* Alert de confirmación para cancelar */}
      <IonAlert
        isOpen={showCancelAlert}
        onDidDismiss={() => setShowCancelAlert(false)}
        header="¿Cancelar ficha?"
        message="Se perderán todos los datos ingresados. ¿Estás seguro?"
        buttons={[
          {
            text: "No",
            role: "cancel",
            cssClass: "alert-button-cancel",
          },
          {
            text: "Sí, cancelar",
            role: "destructive",
            cssClass: "alert-button-confirm",
            handler: handleCancelar,
          },
        ]}
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
