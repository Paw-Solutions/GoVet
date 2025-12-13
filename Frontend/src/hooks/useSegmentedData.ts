import { useState, useCallback, useEffect } from "react";
import { TutorData } from "../api/tutores";
import { ConsultaData } from "../api/fichas";
import { PacienteData } from "../api/pacientes";
import { obtenerTutoresPaginados, obtenerTutorPorRut } from "../api/tutores";
import {
  obtenerPacientesPaginados,
  obtenerPacientePorId,
} from "../api/pacientes";
import { obtenerConsultasPaginadas, descargarPdfConsulta } from "../api/fichas";

interface PaginatedResponseTutores {
  tutores: TutorData[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
}

interface PaginatedResponsePacientes {
  pacientes: PacienteData[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
}

interface TutoresState {
  data: TutorData[];
  loading: boolean;
  error: string;
  busqueda: string;
  currentPage: number;
  hasMoreData: boolean;
  searchTimeout: NodeJS.Timeout | null;
  selectedTutor: TutorData | null;
  showTutorInfo: boolean;
  showTutorEdit: boolean;
}

interface PacientesState {
  data: PacienteData[];
  loading: boolean;
  error: string;
  busqueda: string;
  currentPage: number;
  hasMoreData: boolean;
  searchTimeout: NodeJS.Timeout | null;
  selectedPaciente: PacienteData | null;
  showPacienteInfo: boolean;
  showPacienteEdit: boolean;
}

interface TutoresActions {
  loadData: (resetList?: boolean, search?: string) => Promise<void>;
  handleSearch: (texto: string) => void;
  loadMore: (event: CustomEvent) => Promise<void>;
  refresh: (event?: CustomEvent) => Promise<void>;
  viewTutor: (tutor: TutorData) => void;
  editTutor: (tutor: TutorData) => void;
  editTutorFromInfo: () => void;
  closeTutorInfo: () => void;
  closeTutorEdit: () => void;
  retry: () => void;
}

interface PacientesActions {
  loadData: (resetList?: boolean, search?: string) => Promise<void>;
  handleSearch: (texto: string) => void;
  loadMore: (event: CustomEvent) => Promise<void>;
  refresh: (event?: CustomEvent) => Promise<void>;
  viewPaciente: (paciente: PacienteData) => void;
  editPaciente: (paciente: PacienteData) => void;
  editPacienteFromInfo: () => void;
  closePacienteInfo: () => void;
  closePacienteEdit: () => void;
  retry: () => void;
  viewTutorFromPaciente: (tutorData: TutorData) => void;
  viewConsultaFromPaciente: (consultaData: ConsultaData) => void;
  viewPacienteFromTutor: (pacienteData: PacienteData) => void;
}

interface PaginatedResponseConsultas {
  consultas: ConsultaData[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
}

interface ConsultasState {
  data: ConsultaData[];
  loading: boolean;
  error: string;
  busqueda: string;
  currentPage: number;
  hasMoreData: boolean;
  searchTimeout: NodeJS.Timeout | null;
  selectedConsulta: ConsultaData | null;
  showConsultaInfo: boolean;
  sortOrder: "desc" | "asc";
}

interface ConsultasActions {
  loadData: (
    resetList?: boolean,
    search?: string,
    sortOrder?: "desc" | "asc"
  ) => Promise<void>;
  handleSearch: (texto: string) => void;
  loadMore: (event: CustomEvent) => Promise<void>;
  refresh: (event?: CustomEvent) => Promise<void>;
  viewConsulta: (consulta: ConsultaData) => void;
  editConsulta: (consulta: ConsultaData) => void;
  exportConsulta: (consulta: ConsultaData) => void;
  handleShare: (consulta: ConsultaData) => Promise<void>;
  closeConsultaInfo: () => void;
  retry: () => void;
  handleSortOrderChange: (newOrder: "desc" | "asc") => void;
}

export const useSegmentedData = (initialSegment: string = "tutores") => {
  // Estados para tutores
  const [tutoresState, setTutoresState] = useState<TutoresState>({
    data: [],
    loading: false,
    error: "",
    busqueda: "",
    currentPage: 1,
    hasMoreData: true,
    searchTimeout: null,
    selectedTutor: null,
    showTutorInfo: false,
    showTutorEdit: false,
  });

  // Estados para pacientes
  const [pacientesState, setPacientesState] = useState<PacientesState>({
    data: [],
    loading: false,
    error: "",
    busqueda: "",
    currentPage: 1,
    hasMoreData: true,
    searchTimeout: null,
    selectedPaciente: null,
    showPacienteInfo: false,
    showPacienteEdit: false,
  });

  // Estados para consultas
  const [consultasState, setConsultasState] = useState<ConsultasState>({
    data: [],
    loading: false,
    error: "",
    busqueda: "",
    currentPage: 1,
    hasMoreData: true,
    searchTimeout: null,
    selectedConsulta: null,
    showConsultaInfo: false,
    sortOrder: "desc",
  });

  // ========== FUNCIONES PARA TUTORES ==========

  const loadTutoresData = useCallback(
    async (resetList: boolean = true, search?: string) => {
      setTutoresState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const page = resetList ? 1 : tutoresState.currentPage + 1;
        const data: PaginatedResponseTutores = await obtenerTutoresPaginados(
          page,
          50,
          search
        );

        setTutoresState((prev) => ({
          ...prev,
          data: resetList ? data.tutores : [...prev.data, ...data.tutores],
          currentPage: resetList ? 1 : page,
          hasMoreData: data.pagination.has_next,
          loading: false,
        }));
      } catch (error) {
        setTutoresState((prev) => ({
          ...prev,
          error: "Error de conexión al cargar tutores",
          loading: false,
        }));
        console.error("Error loading tutores:", error);
      }
    },
    [tutoresState.currentPage]
  );

  const handleTutoresSearch = useCallback(
    (texto: string) => {
      setTutoresState((prev) => {
        if (prev.searchTimeout) {
          clearTimeout(prev.searchTimeout);
        }

        const timeout = setTimeout(() => {
          loadTutoresData(true, texto.trim() || undefined);
        }, 500);

        return {
          ...prev,
          busqueda: texto,
          searchTimeout: timeout,
        };
      });
    },
    [loadTutoresData]
  );

  const loadMoreTutores = useCallback(
    async (event: CustomEvent) => {
      if (tutoresState.hasMoreData && !tutoresState.loading) {
        await loadTutoresData(false, tutoresState.busqueda.trim() || undefined);
      }
      (event.target as HTMLIonInfiniteScrollElement).complete();
    },
    [
      tutoresState.hasMoreData,
      tutoresState.loading,
      tutoresState.busqueda,
      loadTutoresData,
    ]
  );

  const refreshTutores = useCallback(
    async (event?: CustomEvent) => {
      await loadTutoresData(true, tutoresState.busqueda.trim() || undefined);
      if (event) {
        event.detail.complete();
      }
    },
    [loadTutoresData, tutoresState.busqueda]
  );

  const viewTutor = useCallback((tutor: TutorData) => {
    setTutoresState((prev) => ({
      ...prev,
      selectedTutor: tutor,
      showTutorInfo: true,
    }));
  }, []);

  const closeTutorInfo = useCallback(() => {
    setTutoresState((prev) => ({
      ...prev,
      showTutorInfo: false,
    }));
    setTimeout(() => {
      setTutoresState((prev) => ({
        ...prev,
        selectedTutor: null,
      }));
    }, 150);
  }, []);

  const editTutor = useCallback((tutor: TutorData) => {
    setTutoresState((prev) => ({
      ...prev,
      selectedTutor: tutor,
      showTutorInfo: false,
      showTutorEdit: true,
    }));
  }, []);

  const closeTutorEdit = useCallback(() => {
    setTutoresState((prev) => ({
      ...prev,
      showTutorEdit: false,
    }));
    setTimeout(() => {
      setTutoresState((prev) => ({
        ...prev,
        selectedTutor: null,
      }));
    }, 150);
  }, []);

  const editTutorFromInfo = useCallback(() => {
    setTutoresState((prev) => ({
      ...prev,
      showTutorInfo: false,
      showTutorEdit: true,
    }));
  }, []);

  const retryTutores = useCallback(() => {
    loadTutoresData(true, tutoresState.busqueda.trim() || undefined);
  }, [loadTutoresData, tutoresState.busqueda]);

  // ========== FUNCIONES PARA PACIENTES ==========

  const loadPacientesData = useCallback(
    async (resetList: boolean = true, search?: string) => {
      setPacientesState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const page = resetList ? 1 : pacientesState.currentPage + 1;
        const data: PaginatedResponsePacientes =
          await obtenerPacientesPaginados(page, 50, search);

        setPacientesState((prev) => ({
          ...prev,
          data: resetList ? data.pacientes : [...prev.data, ...data.pacientes],
          currentPage: resetList ? 1 : page,
          hasMoreData: data.pagination.has_next,
          loading: false,
        }));
      } catch (error) {
        setPacientesState((prev) => ({
          ...prev,
          error: "Error de conexión al cargar pacientes",
          loading: false,
        }));
        console.error("Error loading pacientes:", error);
      }
    },
    [pacientesState.currentPage]
  );

  const handlePacientesSearch = useCallback(
    (texto: string) => {
      setPacientesState((prev) => {
        if (prev.searchTimeout) {
          clearTimeout(prev.searchTimeout);
        }

        const timeout = setTimeout(() => {
          loadPacientesData(true, texto.trim() || undefined);
        }, 500);

        return {
          ...prev,
          busqueda: texto,
          searchTimeout: timeout,
        };
      });
    },
    [loadPacientesData]
  );

  const loadMorePacientes = useCallback(
    async (event: CustomEvent) => {
      if (pacientesState.hasMoreData && !pacientesState.loading) {
        await loadPacientesData(
          false,
          pacientesState.busqueda.trim() || undefined
        );
      }
      (event.target as HTMLIonInfiniteScrollElement).complete();
    },
    [
      pacientesState.hasMoreData,
      pacientesState.loading,
      pacientesState.busqueda,
      loadPacientesData,
    ]
  );

  const refreshPacientes = useCallback(
    async (event?: CustomEvent) => {
      await loadPacientesData(
        true,
        pacientesState.busqueda.trim() || undefined
      );
      if (event) {
        event.detail.complete();
      }
    },
    [loadPacientesData, pacientesState.busqueda]
  );

  const viewPaciente = useCallback((paciente: PacienteData) => {
    setPacientesState((prev) => ({
      ...prev,
      selectedPaciente: paciente,
      showPacienteInfo: true,
    }));
  }, []);

  const closePacienteInfo = useCallback(() => {
    setPacientesState((prev) => ({
      ...prev,
      showPacienteInfo: false,
    }));
    setTimeout(() => {
      setPacientesState((prev) => ({
        ...prev,
        selectedPaciente: null,
      }));
    }, 150);
  }, []);

  const editPaciente = useCallback((paciente: PacienteData) => {
    console.log("Editar paciente:", paciente);
    setPacientesState((prev) => ({
      ...prev,
      selectedPaciente: paciente,
      showPacienteInfo: false,
      showPacienteEdit: true,
    }));
  }, []);

  const closePacienteEdit = useCallback(() => {
    setPacientesState((prev) => ({
      ...prev,
      showPacienteEdit: false,
    }));
    setTimeout(() => {
      setPacientesState((prev) => ({
        ...prev,
        selectedPaciente: null,
      }));
    }, 150);
  }, []);

  const editPacienteFromInfo = useCallback(() => {
    setPacientesState((prev) => ({
      ...prev,
      showPacienteInfo: false,
      showPacienteEdit: true,
    }));
  }, []);

  // Función para ver tutor desde el modal de paciente
  const viewTutorFromPaciente = useCallback((tutorData: TutorData) => {
    // 1. Cerrar modal de paciente inmediatamente
    setPacientesState((prev) => ({
      ...prev,
      showPacienteInfo: false,
    }));

    // 2. Obtener datos completos del tutor y luego abrir modal
    setTimeout(async () => {
      try {
        // Fetch complete tutor data from API using RUT
        const tutorCompleto = await obtenerTutorPorRut(tutorData.rut);
        setTutoresState((prev) => ({
          ...prev,
          selectedTutor: tutorCompleto,
          showTutorInfo: true,
        }));
      } catch (error) {
        console.error("Error obteniendo datos completos del tutor:", error);
        // Si falla, usar los datos parciales (fallback)
        setTutoresState((prev) => ({
          ...prev,
          selectedTutor: tutorData,
          showTutorInfo: true,
        }));
      }
    }, 200);
  }, []);

  // Función para ver consulta desde el modal de paciente
  const viewConsultaFromPaciente = useCallback((consultaData: ConsultaData) => {
    // 1. Cerrar modal de paciente
    setPacientesState((prev) => ({
      ...prev,
      showPacienteInfo: false,
    }));

    // 2. Abrir modal de consulta
    setTimeout(() => {
      setConsultasState((prev) => ({
        ...prev,
        selectedConsulta: consultaData,
        showConsultaInfo: true,
      }));
    }, 200);
  }, []);

  // Función para ver paciente desde el modal de tutor
  const viewPacienteFromTutor = useCallback((pacienteData: PacienteData) => {
    // 1. Cerrar modal de tutor inmediatamente
    setTutoresState((prev) => ({
      ...prev,
      showTutorInfo: false,
    }));

    // 2. Obtener datos completos del paciente y luego abrir modal
    setTimeout(async () => {
      try {
        const pacienteCompleto = await obtenerPacientePorId(
          pacienteData.id_paciente
        );
        setPacientesState((prev) => ({
          ...prev,
          selectedPaciente: pacienteCompleto,
          showPacienteInfo: true,
        }));
      } catch (error) {
        console.error("Error obteniendo datos completos del paciente:", error);
        // Si falla, usar los datos parciales
        setPacientesState((prev) => ({
          ...prev,
          selectedPaciente: pacienteData,
          showPacienteInfo: true,
        }));
      }
    }, 200);
  }, []);

  const retryPacientes = useCallback(() => {
    loadPacientesData(true, pacientesState.busqueda.trim() || undefined);
  }, [loadPacientesData, pacientesState.busqueda]);

  // FUNCIONES PARA consultaS
  const loadConsultasData = useCallback(
    async (
      resetList: boolean = true,
      search?: string,
      sortOrder?: "desc" | "asc"
    ) => {
      setConsultasState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const page = resetList ? 1 : consultasState.currentPage + 1;
        const order = sortOrder || consultasState.sortOrder;
        const data: PaginatedResponseConsultas =
          await obtenerConsultasPaginadas(page, 50, search, order);

        setConsultasState((prev) => ({
          ...prev,
          data: resetList ? data.consultas : [...prev.data, ...data.consultas],
          currentPage: resetList ? 1 : page,
          hasMoreData: data.pagination.has_next,
          loading: false,
          sortOrder: order,
        }));
        console.log("Datos obtenidos: ", data.consultas);
      } catch (error) {
        setConsultasState((prev) => ({
          ...prev,
          error: "Error de conexión al cargar consultas",
          loading: false,
        }));
        console.error("Error loading consultas:", error);
      }
    },
    [consultasState.currentPage, consultasState.sortOrder]
  );

  const handleConsultasSearch = useCallback(
    (texto: string) => {
      setConsultasState((prev) => {
        if (prev.searchTimeout) {
          clearTimeout(prev.searchTimeout);
        }

        const timeout = setTimeout(() => {
          loadConsultasData(true, texto.trim() || undefined);
        }, 500);

        return {
          ...prev,
          busqueda: texto,
          searchTimeout: timeout,
        };
      });
    },
    [loadConsultasData]
  );

  const loadMoreConsultas = useCallback(
    async (event: CustomEvent) => {
      if (consultasState.hasMoreData && !consultasState.loading) {
        await loadConsultasData(
          false,
          consultasState.busqueda.trim() || undefined
        );
      }
      (event.target as HTMLIonInfiniteScrollElement).complete();
    },
    [
      consultasState.hasMoreData,
      consultasState.loading,
      consultasState.busqueda,
      loadConsultasData,
    ]
  );

  const refreshConsultas = useCallback(
    async (event?: CustomEvent) => {
      await loadConsultasData(
        true,
        consultasState.busqueda.trim() || undefined
      );
      if (event) {
        event.detail.complete();
      }
    },
    [loadConsultasData, consultasState.busqueda]
  );

  const viewConsulta = useCallback((consulta: ConsultaData) => {
    setConsultasState((prev) => ({
      ...prev,
      selectedConsulta: consulta,
      showConsultaInfo: true,
    }));
  }, []);

  const closeConsultaInfo = useCallback(() => {
    setConsultasState((prev) => ({
      ...prev,
      showConsultaInfo: false,
    }));
    setTimeout(() => {
      setConsultasState((prev) => ({
        ...prev,
        selectedConsulta: null,
      }));
    }, 150);
  }, []);

  const handleSortOrderChange = useCallback(
    (newOrder: "desc" | "asc") => {
      setConsultasState((prev) => ({
        ...prev,
        sortOrder: newOrder,
      }));
      loadConsultasData(
        true,
        consultasState.busqueda.trim() || undefined,
        newOrder
      );
    },
    [loadConsultasData, consultasState.busqueda]
  );

  const editConsulta = useCallback((consulta: ConsultaData) => {
    console.log("Editar consulta:", consulta);
    // Aqui va la logica d edicion k aun no se implementa ups
  }, []);

  const handleShare = useCallback(async (consulta: ConsultaData) => {
    try {
      console.log("Obteniendo PDF para compartir...");
      
      // Llamar al endpoint que ya existe en el backend
      const blob = await descargarPdfConsulta(consulta.id_consulta);

      // Verificar que el blob tenga contenido
      if (!blob || blob.size === 0) {
        throw new Error("El PDF descargado está vacío");
      }
      
      console.log("Blob descargado, tamaño:", blob.size, "bytes", "tipo:", blob.type);

      // Nombre del archivo
      const fecha = consulta.fecha_consulta
        ? new Date(consulta.fecha_consulta).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const nombrePaciente = consulta.paciente?.nombre || "paciente";
      
      const nombreSeguro = nombrePaciente
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita tildes
          .replace(/[^a-zA-Z0-9]/g, "_"); // Reemplaza no alfanuméricos por _

      const fileName = `consulta_${nombreSeguro}_${fecha}.pdf`;

      const file = new File([blob], fileName, { 
              type: "application/pdf",
              lastModified: Date.now()
            });

      // Verificar si el navegador soporta compartir archivos
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        console.log("Iniciando share...");
        await navigator.share({
          title: "Resumen consulta Veterinaria - GoVet",
          text: "Te comparto el resumen de la consulta veterinaria.",
          files: [file],
        });
        console.log("PDF compartido exitosamente");
      } else {
        alert("Tu navegador no soporta compartir archivos. Intenta descargar el PDF en su lugar.");
      }
    } catch (err: any) {
      // No mostrar error si el usuario simplemente canceló el share
      if (err.name === 'AbortError') {
        console.log("El usuario canceló el compartir");
        return;
      }
      
      // Para cualquier otro error, mostrar en consola pero no alertar al usuario
      // ya que el share pudo haber sido exitoso
      console.error("Error al compartir:", err);
      
      // Solo mostrar alert si es un error crítico (no de permisos o red)
      if (err.name !== 'NotAllowedError' && err.name !== 'TypeError') {
        alert(`Error al compartir el PDF: ${err.message || err}`);
      }
    }
  }, [])
  
  const exportConsulta = useCallback(async (consulta: ConsultaData) => {
    try {
      console.log("Descargando PDF de consulta:", consulta.id_consulta);

      // Llamar al endpoint que ya existe en el backend
      const blob = await descargarPdfConsulta(consulta.id_consulta);

      // Crear URL temporal para el blob
      const url = window.URL.createObjectURL(blob);

      // Crear elemento <a> temporal para forzar la descarga
      const link = document.createElement("a");
      link.href = url;

      // Nombre del archivo: consulta_{nombrePaciente}_{fecha}.pdf
      const fecha = consulta.fecha_consulta
        ? new Date(consulta.fecha_consulta).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const nombrePaciente = consulta.paciente?.nombre || "paciente";
      link.download = `consulta_${nombrePaciente}_${fecha}.pdf`;

      // Simular click para iniciar descarga
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error exportando consulta:", error);
      alert("Error al descargar el PDF. Por favor, intente nuevamente.");
    }
  }, []);

  const retryConsultas = useCallback(() => {
    loadConsultasData(true, consultasState.busqueda.trim() || undefined);
  }, [loadConsultasData, consultasState.busqueda]);

  // ========== EFECTOS ==========

  // Cargar tutores al montar el hook
  useEffect(() => {
    // Solo cargar el segmento inicial
    if (initialSegment === "tutores") {
      loadTutoresData();
    } else if (initialSegment === "pacientes") {
      loadPacientesData();
    } else if (initialSegment === "consultas") {
      loadConsultasData();
    }
  }, [initialSegment]);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (tutoresState.searchTimeout) {
        clearTimeout(tutoresState.searchTimeout);
      }
      if (pacientesState.searchTimeout) {
        clearTimeout(pacientesState.searchTimeout);
      }
      if (consultasState.searchTimeout) {
        clearTimeout(consultasState.searchTimeout);
      }
    };
  }, [
    tutoresState.searchTimeout,
    pacientesState.searchTimeout,
    consultasState.searchTimeout,
  ]);

  // ========== RETURN ==========

  const tutoresActions: TutoresActions = {
    loadData: loadTutoresData,
    handleSearch: handleTutoresSearch,
    loadMore: loadMoreTutores,
    refresh: refreshTutores,
    viewTutor,
    editTutor,
    editTutorFromInfo,
    closeTutorInfo,
    closeTutorEdit,
    retry: retryTutores,
  };

  const pacientesActions: PacientesActions = {
    loadData: loadPacientesData,
    handleSearch: handlePacientesSearch,
    loadMore: loadMorePacientes,
    refresh: refreshPacientes,
    viewPaciente,
    editPaciente,
    editPacienteFromInfo,
    closePacienteInfo,
    closePacienteEdit,
    retry: retryPacientes,
    viewTutorFromPaciente,
    viewConsultaFromPaciente,
    viewPacienteFromTutor,
  };

  const consultasActions: ConsultasActions = {
    loadData: loadConsultasData,
    handleSearch: handleConsultasSearch,
    loadMore: loadMoreConsultas,
    refresh: refreshConsultas,
    viewConsulta,
    editConsulta,
    exportConsulta,
    handleShare,
    closeConsultaInfo,
    retry: retryConsultas,
    handleSortOrderChange,
  };

  return {
    tutores: {
      // Estado
      data: tutoresState.data,
      loading: tutoresState.loading,
      error: tutoresState.error,
      busqueda: tutoresState.busqueda,
      hasMoreData: tutoresState.hasMoreData,
      selectedTutor: tutoresState.selectedTutor,
      showTutorInfo: tutoresState.showTutorInfo,
      showTutorEdit: tutoresState.showTutorEdit,
      // Acciones
      ...tutoresActions,
    },
    pacientes: {
      // Estado
      data: pacientesState.data,
      loading: pacientesState.loading,
      error: pacientesState.error,
      busqueda: pacientesState.busqueda,
      hasMoreData: pacientesState.hasMoreData,
      selectedPaciente: pacientesState.selectedPaciente,
      showPacienteInfo: pacientesState.showPacienteInfo,
      showPacienteEdit: pacientesState.showPacienteEdit,
      // Acciones
      ...pacientesActions,
    },
    consultas: {
      data: consultasState.data,
      loading: consultasState.loading,
      error: consultasState.error,
      busqueda: consultasState.busqueda,
      hasMoreData: consultasState.hasMoreData,
      selectedConsulta: consultasState.selectedConsulta,
      showConsultaInfo: consultasState.showConsultaInfo,
      sortOrder: consultasState.sortOrder,
      // Acciones
      ...consultasActions,
    },
  };
};

export type { TutoresActions, PacientesActions, ConsultasActions };
