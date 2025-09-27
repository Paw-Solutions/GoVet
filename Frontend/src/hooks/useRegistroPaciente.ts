import { useState, useEffect, useCallback } from "react";
import { obtenerEspecies, obtenerRazas } from "../api/especies";
import { registrarPaciente, PacienteData } from "../api/pacientes";

export interface FormData {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  color: string;
  fechaNacimiento: string;
  codigo_chip: string;
}

export const useRegistroPaciente = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    especie: "",
    raza: "",
    sexo: "",
    color: "",
    fechaNacimiento: "",
    codigo_chip: "",
  });

  const [especiesData, setEspeciesData] = useState<any[]>([]);
  const [razasData, setRazasData] = useState<any[]>([]);
  const [loadingEspecies, setLoadingEspecies] = useState(false);
  const [loadingRazas, setLoadingRazas] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [especieQuery, setEspecieQuery] = useState("");
  const [razaQuery, setRazaQuery] = useState("");
  const [showEspecieList, setShowEspecieList] = useState(false);
  const [showRazaList, setShowRazaList] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleCargarRazas = useCallback(async (nombreEspecie: string) => {
    console.log("🔄 Cargando razas para:", nombreEspecie);
    setLoadingRazas(true);
    try {
      const razas = await obtenerRazas(nombreEspecie);
      console.log("✅ Razas cargadas:", razas ? razas.length : 0, "razas");
      setRazasData(razas || []);
    } catch (error) {
      console.error("❌ Error cargando razas:", error);
      setRazasData([]);
      setToastMessage("Error de conexión al cargar razas");
      setShowToast(true);
    } finally {
      setLoadingRazas(false);
    }
  }, []);

  const handleCargarEspecies = useCallback(async () => {
    console.log("🔄 Iniciando carga de especies...");
    setLoadingEspecies(true);
    try {
      const especies = await obtenerEspecies();
      console.log("✅ Especies cargadas:", especies.length, "especies");
      setEspeciesData(especies);
    } catch (error) {
      console.error("❌ Error cargando especies:", error);
      setToastMessage("Error de conexión al cargar especies");
      setShowToast(true);
    } finally {
      setLoadingEspecies(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      await handleCargarEspecies();
      setInitialLoading(false);
    };
    loadInitialData();
  }, [handleCargarEspecies]);

  useEffect(() => {
    if (formData.especie && especiesData.length > 0) {
      const especieSeleccionada = especiesData.find(
        (esp) => esp.id_especie === parseInt(formData.especie)
      );
      if (especieSeleccionada) {
        handleCargarRazas(especieSeleccionada.nombre_comun);
      }
    } else {
      setRazasData([]);
    }
  }, [formData.especie, handleCargarRazas]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectEspecie = (especieId: number, especieNombre: string) => {
    setFormData((prev) => ({
      ...prev,
      especie: especieId.toString(),
      raza: "",
    }));
    setEspecieQuery(especieNombre);
    setShowEspecieList(false);
    setRazaQuery("");
  };

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
      if (
        !formData.nombre ||
        !formData.raza ||
        !formData.sexo ||
        !formData.color ||
        !formData.fechaNacimiento
      ) {
        setToastMessage("Por favor completa todos los campos requeridos");
        setShowToast(true);
        return;
      }

      const pacienteData: PacienteData = {
        nombre: formData.nombre,
        id_raza: parseInt(formData.raza),
        sexo: formData.sexo,
        color: formData.color,
        fecha_nacimiento: formData.fechaNacimiento,
        codigo_chip: formData.codigo_chip || "",
      };

      const resultado = await registrarPaciente(pacienteData);
      console.log("✅ Paciente registrado exitosamente:", resultado);
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
    } catch (error) {
      console.error("❌ Error registrando paciente:", error);
      setToastMessage("Error al registrar paciente");
    }
    setShowToast(true);
  };

  return {
    formData,
    setFormData,
    especiesData,
    razasData,
    loadingEspecies,
    loadingRazas,
    initialLoading,
    especieQuery,
    razaQuery,
    showEspecieList,
    showRazaList,
    showToast,
    toastMessage,
    setEspecieQuery,
    setRazaQuery,
    setShowEspecieList,
    setShowRazaList,
    setShowToast,
    handleInputChange,
    selectEspecie,
    selectRaza,
    registraPaciente,
  };
};
