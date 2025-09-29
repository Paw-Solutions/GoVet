import { useState, useCallback, useEffect } from 'react';
import { TutorData } from '../api/tutores';
import { PacienteData } from '../api/pacientes';
import { obtenerTutoresPaginados } from '../api/tutores';
import { obtenerPacientesPaginados } from '../api/pacientes';

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
}

interface TutoresActions {
  loadData: (resetList?: boolean, search?: string) => Promise<void>;
  handleSearch: (texto: string) => void;
  loadMore: (event: CustomEvent) => Promise<void>;
  refresh: (event?: CustomEvent) => Promise<void>;
  viewTutor: (tutor: TutorData) => void;
  editTutor: (tutor: TutorData) => void;
  closeTutorInfo: () => void;
  retry: () => void;
}

interface PacientesActions {
  loadData: (resetList?: boolean, search?: string) => Promise<void>;
  handleSearch: (texto: string) => void;
  loadMore: (event: CustomEvent) => Promise<void>;
  refresh: (event?: CustomEvent) => Promise<void>;
  viewPaciente: (paciente: PacienteData) => void;
  editPaciente: (paciente: PacienteData) => void;
  closePacienteInfo: () => void;
  retry: () => void;
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
  });

  // ========== FUNCIONES PARA TUTORES ==========

  const loadTutoresData = useCallback(async (resetList: boolean = true, search?: string) => {
    setTutoresState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      const page = resetList ? 1 : tutoresState.currentPage + 1;
      const data: PaginatedResponseTutores = await obtenerTutoresPaginados(page, 50, search);
      
      setTutoresState(prev => ({
        ...prev,
        data: resetList ? data.tutores : [...prev.data, ...data.tutores],
        currentPage: resetList ? 1 : page,
        hasMoreData: data.pagination.has_next,
        loading: false,
      }));
    } catch (error) {
      setTutoresState(prev => ({
        ...prev,
        error: "Error de conexión al cargar tutores",
        loading: false,
      }));
      console.error("Error loading tutores:", error);
    }
  }, [tutoresState.currentPage]);

  const handleTutoresSearch = useCallback((texto: string) => {
    setTutoresState(prev => {
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
  }, [loadTutoresData]);

  const loadMoreTutores = useCallback(async (event: CustomEvent) => {
    if (tutoresState.hasMoreData && !tutoresState.loading) {
      await loadTutoresData(false, tutoresState.busqueda.trim() || undefined);
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  }, [tutoresState.hasMoreData, tutoresState.loading, tutoresState.busqueda, loadTutoresData]);

  const refreshTutores = useCallback(async (event?: CustomEvent) => {
    await loadTutoresData(true, tutoresState.busqueda.trim() || undefined);
    if (event) {
      event.detail.complete();
    }
  }, [loadTutoresData, tutoresState.busqueda]);

  const viewTutor = useCallback((tutor: TutorData) => {
    setTutoresState(prev => ({
      ...prev,
      selectedTutor: tutor,
      showTutorInfo: true,
    }));
  }, []);

  const closeTutorInfo = useCallback(() => {
    setTutoresState(prev => ({
      ...prev,
      showTutorInfo: false,
    }));
    setTimeout(() => {
      setTutoresState(prev => ({
        ...prev,
        selectedTutor: null,
      }));
    }, 150);
  }, []);

  const editTutor = useCallback((tutor: TutorData) => {
    console.log("Editar tutor:", tutor);
    // Aquí puedes implementar la lógica de edición
  }, []);

  const retryTutores = useCallback(() => {
    loadTutoresData(true, tutoresState.busqueda.trim() || undefined);
  }, [loadTutoresData, tutoresState.busqueda]);

  // ========== FUNCIONES PARA PACIENTES ==========

  const loadPacientesData = useCallback(async (resetList: boolean = true, search?: string) => {
    setPacientesState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      const page = resetList ? 1 : pacientesState.currentPage + 1;
      const data: PaginatedResponsePacientes = await obtenerPacientesPaginados(page, 50, search);
      
      setPacientesState(prev => ({
        ...prev,
        data: resetList ? data.pacientes : [...prev.data, ...data.pacientes],
        currentPage: resetList ? 1 : page,
        hasMoreData: data.pagination.has_next,
        loading: false,
      }));
    } catch (error) {
      setPacientesState(prev => ({
        ...prev,
        error: "Error de conexión al cargar pacientes",
        loading: false,
      }));
      console.error("Error loading pacientes:", error);
    }
  }, [pacientesState.currentPage]);

  const handlePacientesSearch = useCallback((texto: string) => {
    setPacientesState(prev => {
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
  }, [loadPacientesData]);

  const loadMorePacientes = useCallback(async (event: CustomEvent) => {
    if (pacientesState.hasMoreData && !pacientesState.loading) {
      await loadPacientesData(false, pacientesState.busqueda.trim() || undefined);
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  }, [pacientesState.hasMoreData, pacientesState.loading, pacientesState.busqueda, loadPacientesData]);

  const refreshPacientes = useCallback(async (event?: CustomEvent) => {
    await loadPacientesData(true, pacientesState.busqueda.trim() || undefined);
    if (event) {
      event.detail.complete();
    }
  }, [loadPacientesData, pacientesState.busqueda]);

  const viewPaciente = useCallback((paciente: PacienteData) => {
    setPacientesState(prev => ({
      ...prev,
      selectedPaciente: paciente,
      showPacienteInfo: true,
    }));
  }, []);

  const closePacienteInfo = useCallback(() => {
    setPacientesState(prev => ({
      ...prev,
      showPacienteInfo: false,
    }));
    setTimeout(() => {
      setPacientesState(prev => ({
        ...prev,
        selectedPaciente: null,
      }));
    }, 150);
  }, []);

  const editPaciente = useCallback((paciente: PacienteData) => {
    console.log("Editar paciente:", paciente);
    // Aquí puedes implementar la lógica de edición
  }, []);

  const retryPacientes = useCallback(() => {
    loadPacientesData(true, pacientesState.busqueda.trim() || undefined);
  }, [loadPacientesData, pacientesState.busqueda]);

  // ========== EFECTOS ==========

  // Cargar tutores al montar el hook
  useEffect(() => {
    // Solo cargar el segmento inicial
    if (initialSegment === 'tutores') {
      loadTutoresData();
    } else if (initialSegment === 'pacientes') {
      loadPacientesData();
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
    };
  }, [tutoresState.searchTimeout, pacientesState.searchTimeout]);

  // ========== RETURN ==========

  const tutoresActions: TutoresActions = {
    loadData: loadTutoresData,
    handleSearch: handleTutoresSearch,
    loadMore: loadMoreTutores,
    refresh: refreshTutores,
    viewTutor,
    editTutor,
    closeTutorInfo,
    retry: retryTutores,
  };

  const pacientesActions: PacientesActions = {
    loadData: loadPacientesData,
    handleSearch: handlePacientesSearch,
    loadMore: loadMorePacientes,
    refresh: refreshPacientes,
    viewPaciente,
    editPaciente,
    closePacienteInfo,
    retry: retryPacientes,
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
      // Acciones
      ...pacientesActions,
    },
  };
};

export type { TutoresActions, PacientesActions };