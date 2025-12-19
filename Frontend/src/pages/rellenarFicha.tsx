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
  IonRange,
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
  trashOutline,
} from "ionicons/icons";
import "../styles/rellenarFicha.css";
import "../styles/variables.css";
import ModalEscogerPaciente from "../components/rellenarFicha/modalEscogerPaciente";
import CajaDesparasitacion from "../components/desparasitacion/CajaDesparasitacion";
import CajaRecetas, { Receta } from "../components/recetas/CajaRecetas";
import ModuleCard from "../components/rellenarFicha/ModuleCard";
import PatientHeader from "../components/rellenarFicha/PatientHeader";
import ModalAgendarTratamiento from "../components/calendario/ModalAgendarTratamiento";
import { PacienteData } from "../api/pacientes";
import { TutorData } from "../api/tutores";
import {
  ConsultaData,
  crearConsulta,
  VacunasData,
  RecetaMedicaData,
  DesparasitacionData,
} from "../api/fichas";
import { TratamientoInfo } from "../utils/notificationHelpers";
import { useAuth } from "../hooks/useAuth";

// ==================== FUNCIONES DE MAPEO DE DATOS ====================

/**
 * Convierte RecetaMedicaData[] (de la API) a Receta[] (formato interno del componente)
 * Maneja la conversión de frecuencia y duración de string a number
 */
const mapRecetaMedicaDataToReceta = (data: RecetaMedicaData[]): Receta[] => {
  return data.map((recetaData) => ({
    medicamento: recetaData.medicamento,
    dosis: recetaData.dosis,
    frecuencia: parseInt(recetaData.frecuencia, 10) || 0,
    duracion: parseInt(recetaData.duracion, 10) || 0,
    numero_de_serie: recetaData.numero_de_serie,
  }));
};

/**
 * Convierte Receta[] (formato interno) a RecetaMedicaData[] (para enviar a la API)
 * Maneja la conversión de frecuencia y duración de number a string
 */
const mapRecetaToRecetaMedicaData = (recetas: Receta[]): RecetaMedicaData[] => {
  return recetas.map((receta) => ({
    medicamento: receta.medicamento,
    dosis: receta.dosis,
    frecuencia: receta.frecuencia.toString(),
    duracion: receta.duracion.toString(),
    numero_de_serie: receta.numero_de_serie,
  }));
};

// ==================== COMPONENTE ====================

// Componente: Dashboard con 6 módulos para gestionar consultas
const RellenarFicha: React.FC = () => {
  const { sessionToken } = useAuth();
  const [showModalPacientes, setShowModalPacientes] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [touchedModules, setTouchedModules] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<
    "success" | "danger" | "warning"
  >("success");
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

  // Estado para recetas médicas como array (ahora usa el tipo Receta del componente)
  const [recetaMedicaData, setRecetaMedicaData] = useState<Receta[]>([]);

  // Estados para el sistema de agendamiento de vacunas
  interface GrupoVacunas {
    fecha: string;
    vacunas: VacunasData[];
  }

  const [pendingVaccineAlerts, setPendingVaccineAlerts] = useState<
    GrupoVacunas[]
  >([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [citasCreadas, setCitasCreadas] = useState(0);

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
    estado_pelaje: "3",
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
    //console.log("Vacuna agregada:", vacunasData);
    //console.log("Formulario actualizado:", formData);
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

  const handleEliminarDesparasitacionInterna = () => {
    setFormData((prev) => ({
      ...prev,
      desparasitacion_interna: undefined,
    }));
  };

  const handleEliminarDesparasitacionExterna = () => {
    setFormData((prev) => ({
      ...prev,
      desparasitacion_externa: undefined,
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

  // useEffect para cargar el paciente desde sessionStorage si existe
  useEffect(() => {
    const pacienteStr = sessionStorage.getItem("pacienteParaFicha");
    if (pacienteStr) {
      try {
        const pacienteData: PacienteData = JSON.parse(pacienteStr);
        handlePacienteSelected(pacienteData);
        sessionStorage.removeItem("pacienteParaFicha");
      } catch (error) {
        console.error("Error parsing paciente data:", error);
      }
    }

    // Restaurar alertas pendientes de vacunas si existen
    const pendingVaccinesStr = sessionStorage.getItem(
      "vacunasPendientesAgendar"
    );
    if (pendingVaccinesStr) {
      try {
        const data = JSON.parse(pendingVaccinesStr);
        if (data.grupos && data.paciente && data.tutor) {
          setPendingVaccineAlerts(data.grupos);
          setSelectedPaciente(data.paciente);
          setFormData((prev) => ({
            ...prev,
            paciente: data.paciente.paciente || data.paciente,
            tutor: data.tutor,
          }));
          setCurrentAlertIndex(data.currentIndex || 0);
          setCitasCreadas(data.citasCreadas || 0);
          setShowScheduleModal(true);
        }
      } catch (error) {
        console.error("Error restoring pending vaccines:", error);
        sessionStorage.removeItem("vacunasPendientesAgendar");
      }
    }
  }, []);

  // Función para agrupar vacunas por fecha
  const agruparVacunasPorFecha = (vacunas: VacunasData[]): GrupoVacunas[] => {
    const grupos = new Map<string, VacunasData[]>();

    vacunas.forEach((vacuna) => {
      if (vacuna.proxima_dosis) {
        const fecha = vacuna.proxima_dosis;
        if (!grupos.has(fecha)) {
          grupos.set(fecha, []);
        }
        grupos.get(fecha)!.push(vacuna);
      }
    });

    // Convertir a array y ordenar por fecha
    return Array.from(grupos.entries())
      .map(([fecha, vacunas]) => ({ fecha, vacunas }))
      .sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
  };

  // Función para procesar vacunas y comenzar flujo de agendamiento
  const procesarVacunasParaAgendar = (vacunas: VacunasData[]) => {
    const vacunasConProxima = vacunas.filter(
      (v) => v.requiere_proxima && v.proxima_dosis
    );

    if (vacunasConProxima.length === 0) {
      return;
    }

    const grupos = agruparVacunasPorFecha(vacunasConProxima);

    // Guardar en sessionStorage
    sessionStorage.setItem(
      "vacunasPendientesAgendar",
      JSON.stringify({
        grupos,
        paciente: selectedPaciente,
        tutor: formData.tutor,
        currentIndex: 0,
        citasCreadas: 0,
      })
    );

    setPendingVaccineAlerts(grupos);
    setCurrentAlertIndex(0);
    setCitasCreadas(0);
    setShowScheduleModal(true);
  };

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
          (formData.peso ?? 0) > 0 && (formData.temperatura ?? 0) > 0;
        const hasSomeConstantes =
          (formData.peso ?? 0) > 0 ||
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
        if ((formData.diagnostico ?? "").trim()) return "complete";
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
      // Preparar datos con recetas médicas, convirtiendo de Receta[] a RecetaMedicaData[]
      const dataToSend = {
        ...formData,
        receta_medica:
          recetaMedicaData.length > 0
            ? mapRecetaToRecetaMedicaData(recetaMedicaData)
            : undefined,
      };

      //console.log("=== INICIO LOG GUARDADO FICHA ===");
      /*console.log(
        "📋 Datos completos a enviar:",
        JSON.stringify(dataToSend, null, 2)
      );*/
      /*console.log("\n🐾 Paciente:", {
        id: dataToSend.id_paciente,
        nombre: dataToSend.paciente?.nombre,
        especie: dataToSend.paciente?.especie,
        raza: dataToSend.paciente?.raza,
      });*/
      /*console.log("\n👤 Tutor:", {
        rut: dataToSend.rut,
        nombre: dataToSend.tutor?.nombre,
      });*/
      /*console.log("\n🩺 Constantes Vitales:", {
        peso: dataToSend.peso,
        temperatura: dataToSend.temperatura,
        fc: dataToSend.frecuencia_cardiaca,
        fr: dataToSend.frecuencia_respiratoria,
        tllc: dataToSend.tllc,
      });*/
      /*console.log("\n🔬 Examen Físico:", {
        mucosas: dataToSend.mucosas,
        condicion_corporal: dataToSend.condicion_corporal,
        estado_pelaje: dataToSend.estado_pelaje,
        estado_piel: dataToSend.estado_piel,
        nodulos_linfaticos: dataToSend.nodulos_linfaticos?.substring(0, 50),
      });*/
      /*console.log("\n📝 Diagnóstico:", {
        motivo: dataToSend.motivo,
        examen_clinico: dataToSend.examen_clinico?.substring(0, 50),
        diagnostico: dataToSend.diagnostico?.substring(0, 50),
        observaciones: dataToSend.observaciones?.substring(0, 50),
      });*/
      /*console.log(
        "\n💉 Vacunas:",
        dataToSend.vacunas_inoculadas?.length || 0,
        "registradas"
      );*/
      /*if (dataToSend.vacunas_inoculadas) {
        dataToSend.vacunas_inoculadas.forEach((v, i) =>
          console.log(`  ${i + 1}. ${v.nombre_vacuna} - ${v.fecha_vacunacion}`)
        );
      }*/
      //console.log("\n🐛 Desparasitación:");
      /*console.log(
        "  Interna:",
        dataToSend.desparasitacion_interna?.nombre_desparasitante ||
          "No registrada"
      );*/
      /*console.log(
        "  Externa:",
        dataToSend.desparasitacion_externa?.nombre_desparasitante ||
          "No registrada"
      );*/
      /*console.log(
        "\n💊 Recetas Médicas:",
        dataToSend.receta_medica?.length || 0,
        "registradas"
      );*/
      if (dataToSend.receta_medica) {
        dataToSend.receta_medica.forEach((r, i) =>
          console.log(
            `  ${i + 1}. ${r.medicamento} - ${r.dosis} cada ${
              r.frecuencia
            } por ${r.duracion}`
          )
        );
      }
      /*console.log(
        "\n📅 Indicaciones:",
        dataToSend.indicaciones_generales?.substring(0, 50) ||
          "Sin indicaciones"
      );*/
      //console.log("=== FIN LOG GUARDADO FICHA ===\n");

      const response = await crearConsulta(dataToSend, sessionToken);
      //console.log("✅ Respuesta del servidor:", response);

      // Verificar si hay vacunas con próxima dosis para agendar
      const tieneVacunasParaAgendar =
        dataToSend.vacunas_inoculadas &&
        dataToSend.vacunas_inoculadas.some(
          (v) => v.requiere_proxima && v.proxima_dosis
        );

      // Solo mostrar toast si NO hay vacunas para agendar
      // (si hay vacunas, el toast se mostrará después del flujo de agendamiento)
      if (!tieneVacunasParaAgendar) {
        setToastMessage("Ficha veterinaria guardada exitosamente");
        setToastColor("success");
      }

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

      setRecetaMedicaData([]);
      setActiveModule(null);

      // NO limpiar selectedPaciente todavía si hay vacunas para agendar
      if (!tieneVacunasParaAgendar) {
        setSelectedPaciente(null);
      }

      // Procesar vacunas con próxima dosis para agendar (al final)
      if (
        dataToSend.vacunas_inoculadas &&
        dataToSend.vacunas_inoculadas.length > 0
      ) {
        procesarVacunasParaAgendar(dataToSend.vacunas_inoculadas);
      }
    } catch (error) {
      console.error("Error al guardar ficha:", error);
      setToastMessage("Error al guardar la ficha");
      setToastColor("danger");
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
      estado_pelaje: "3",
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
    setToastColor("warning");
    setShowToast(true);
  };

  // Handlers para el flujo de agendamiento de vacunas
  const handleCitaCreada = () => {
    const newCitasCreadas = citasCreadas + 1;
    setCitasCreadas(newCitasCreadas);

    const nextIndex = currentAlertIndex + 1;

    // Actualizar sessionStorage
    if (nextIndex < pendingVaccineAlerts.length) {
      sessionStorage.setItem(
        "vacunasPendientesAgendar",
        JSON.stringify({
          grupos: pendingVaccineAlerts,
          paciente: selectedPaciente,
          tutor: formData.tutor,
          currentIndex: nextIndex,
          citasCreadas: newCitasCreadas,
        })
      );
      setCurrentAlertIndex(nextIndex);
    } else {
      // Es la última alerta, limpiar y mostrar resumen
      sessionStorage.removeItem("vacunasPendientesAgendar");
      setShowScheduleModal(false);
      setToastMessage(
        `Ficha guardada. ${newCitasCreadas} cita(s) de vacunación agendada(s) exitosamente`
      );
      setToastColor("success");
      setShowToast(true);
      setPendingVaccineAlerts([]);
      setCurrentAlertIndex(0);
      setCitasCreadas(0);
      // Ahora sí limpiar el paciente seleccionado
      setSelectedPaciente(null);
    }
  };

  const handleAgendarDespues = () => {
    const nextIndex = currentAlertIndex + 1;

    if (nextIndex < pendingVaccineAlerts.length) {
      // Actualizar sessionStorage
      sessionStorage.setItem(
        "vacunasPendientesAgendar",
        JSON.stringify({
          grupos: pendingVaccineAlerts,
          paciente: selectedPaciente,
          tutor: formData.tutor,
          currentIndex: nextIndex,
          citasCreadas,
        })
      );
      setCurrentAlertIndex(nextIndex);
    } else {
      // Es la última, cerrar y limpiar
      sessionStorage.removeItem("vacunasPendientesAgendar");
      setShowScheduleModal(false);
      if (citasCreadas > 0) {
        setToastMessage(
          `Ficha guardada. ${citasCreadas} cita(s) de vacunación agendada(s) exitosamente`
        );
        setToastColor("success");
        setShowToast(true);
      } else {
        setToastMessage("Ficha veterinaria guardada exitosamente");
        setToastColor("success");
        setShowToast(true);
      }
      setPendingVaccineAlerts([]);
      setCurrentAlertIndex(0);
      setCitasCreadas(0);
      // Ahora sí limpiar el paciente seleccionado
      setSelectedPaciente(null);
    }
  };

  const handleCancelarAgendamiento = () => {
    sessionStorage.removeItem("vacunasPendientesAgendar");
    setShowScheduleModal(false);
    setPendingVaccineAlerts([]);
    setCurrentAlertIndex(0);
    if (citasCreadas > 0) {
      setToastMessage(
        `Ficha guardada. ${citasCreadas} cita(s) de vacunación agendada(s) antes de cancelar`
      );
      setToastColor("success");
      setShowToast(true);
    } else {
      setToastMessage("Ficha veterinaria guardada exitosamente");
      setToastColor("success");
      setShowToast(true);
    }
    setCitasCreadas(0);
    // Limpiar el paciente seleccionado después de cancelar
    setSelectedPaciente(null);
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
                  title="Frecuencia y Constantes Vitales"
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
              <IonTitle>Frecuencia y Constantes Vitales</IonTitle>
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
                <IonLabel position="stacked">
                  Estado del Pelaje:{" "}
                  {parseFloat(formData.estado_pelaje || "3").toFixed(1)}
                </IonLabel>
                <IonRange
                  min={1}
                  max={5}
                  step={0.5}
                  value={parseFloat(formData.estado_pelaje || "3")}
                  pin={true}
                  pinFormatter={(value: number) => value.toFixed(1)}
                  ticks={true}
                  snaps={true}
                  onIonChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      estado_pelaje: (e.detail.value as number).toString(),
                    }));
                  }}
                >
                  <IonLabel slot="start">1</IonLabel>
                  <IonLabel slot="end">5</IonLabel>
                </IonRange>
              </IonItem>
              <IonItem>
                <IonInput
                  label="Estado de la Piel"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Describa el estado de la piel"
                  name="estado_piel"
                  value={formData.estado_piel}
                  onIonChange={handleInputChange}
                />
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
                          <IonButtons slot="end">
                            <IonButton
                              fill="clear"
                              color="danger"
                              onClick={() => handleEliminarVacuna(index)}
                            >
                              <IonIcon slot="icon-only" icon={trashOutline} />
                            </IonButton>
                          </IonButtons>
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
              onEliminar={handleEliminarDesparasitacionInterna}
              datoGuardado={formData.desparasitacion_interna ?? null}
            />

            <CajaDesparasitacion
              titulo="Desparasitación Externa"
              tipo="externa"
              datos={desparasitacionExternaData}
              setDatos={setDesparasitacionExternaData}
              onAgregar={handleAgregarDesparasitacionExterna}
              onEliminar={handleEliminarDesparasitacionExterna}
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

            <IonButton
              expand="block"
              color="primary"
              href="https://sso.sag.gob.cl:8443/auth/realms/SAG/protocol/openid-connect/auth?client_id=antimicrobianos&redirect_uri=https%3A%2F%2Fantimicrobianos.sag.gob.cl%2F%23%2Fmv%2Fprescripciones&state=f2fdcbe0-4778-4924-89a8-e221d95e857c&response_mode=fragment&response_type=code&scope=openid&nonce=4c4e8780-0c2b-4e76-8eb1-125039234f96"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: "16px", marginBottom: "16px" }}
            >
              Ir a SAG
            </IonButton>

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
        cssClass="alert-warning"
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
            cssClass: "alert-button-destructive",
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
        color={toastColor}
        cssClass={
          toastColor === "success"
            ? "toast-success"
            : toastColor === "danger"
            ? "toast-error"
            : "toast-warning"
        }
      />

      {/* Modal para agendar tratamientos (vacunas) */}
      {showScheduleModal &&
        pendingVaccineAlerts.length > 0 &&
        currentAlertIndex < pendingVaccineAlerts.length &&
        selectedPaciente && (
          <ModalAgendarTratamiento
            isOpen={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
            tratamientos={pendingVaccineAlerts[currentAlertIndex].vacunas.map(
              (v) => ({
                nombre: v.nombre_vacuna,
                marca: v.marca,
                numero_de_serie: v.numero_de_serie,
              })
            )}
            paciente={selectedPaciente}
            tutor={{
              nombre: selectedPaciente.tutor?.nombre || "",
              apellido_paterno: selectedPaciente.tutor?.apellido_paterno || "",
              apellido_materno: selectedPaciente.tutor?.apellido_materno || "",
              rut: selectedPaciente.tutor?.rut || "",
              telefono: selectedPaciente.tutor?.telefono || 0,
              telefono2: 0,
              comuna: "",
              region: "",
              celular: 0,
              celular2: 0,
              email: selectedPaciente.tutor?.email || "",
              observacion: "",
              direccion: "",
            }}
            fechaProxima={pendingVaccineAlerts[currentAlertIndex].fecha}
            tipoTratamiento="vacuna"
            onCitaCreada={handleCitaCreada}
            totalAlertas={pendingVaccineAlerts.length}
            alertaActual={currentAlertIndex + 1}
            onAgendarDespues={handleAgendarDespues}
            onCancelar={handleCancelarAgendamiento}
          />
        )}
    </IonPage>
  );
};

export default RellenarFicha;
