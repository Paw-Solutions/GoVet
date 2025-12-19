import { useState, useCallback, useEffect } from "react";
import { PacienteData } from "../api/pacientes";
import { obtenerPacientesPaginados } from "../api/pacientes";
import { useAuth } from "./useAuth";
import {
  descargarCertificadoTransporte,
  descargarConsentimientoInformado,
  descargarOrdenExamenes,
  descargarRecetaMedica,
  descargarYCompartirPDF,
  ConsentimientoInformadoRequest,
  OrdenExamenesRequest,
  RecetaMedicaRequest,
} from "../api/certificados";
import { useIonToast } from "@ionic/react";

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

interface CertificadosState {
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

interface CertificadosActions {
  loadData: (resetList?: boolean, search?: string) => Promise<void>;
  handleSearch: (texto: string) => void;
  loadMore: (event: CustomEvent) => Promise<void>;
  refresh: (event?: CustomEvent) => Promise<void>;
  viewPaciente: (paciente: PacienteData) => void;
  closePacienteInfo: () => void;
  retry: () => void;
  generarCertificadoTransporte: (paciente: PacienteData) => Promise<void>;
  generarConsentimientoInformado: (
    paciente: PacienteData,
    data: ConsentimientoInformadoRequest
  ) => Promise<void>;
  generarOrdenExamenes: (
    paciente: PacienteData,
    data: OrdenExamenesRequest
  ) => Promise<void>;
  generarRecetaMedica: (
    paciente: PacienteData,
    data: RecetaMedicaRequest
  ) => Promise<void>;
}

export const useCertificadosData = (tipoCertificado: string) => {
  const { sessionToken } = useAuth();
  const [presentToast] = useIonToast();

  const [state, setState] = useState<CertificadosState>({
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

  // ========== CARGAR DATOS ==========

  const loadData = useCallback(
    async (resetList: boolean = true, search?: string) => {
      setState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const page = resetList ? 1 : state.currentPage + 1;
        const data: PaginatedResponsePacientes =
          await obtenerPacientesPaginados(page, 50, search, sessionToken);

        setState((prev) => ({
          ...prev,
          data: resetList ? data.pacientes : [...prev.data, ...data.pacientes],
          currentPage: page,
          hasMoreData: data.pagination.has_next,
          loading: false,
        }));
      } catch (err) {
        console.error("Error al cargar pacientes:", err);
        setState((prev) => ({
          ...prev,
          error: "Error al cargar pacientes",
          loading: false,
        }));
      }
    },
    [state.currentPage, sessionToken]
  );

  // ========== BÚSQUEDA ==========

  const handleSearch = useCallback(
    (texto: string) => {
      setState((prev) => {
        if (prev.searchTimeout) {
          clearTimeout(prev.searchTimeout);
        }

        const timeout = setTimeout(() => {
          loadData(true, texto);
        }, 500);

        return {
          ...prev,
          busqueda: texto,
          searchTimeout: timeout,
        };
      });
    },
    [loadData]
  );

  // ========== CARGAR MÁS ==========

  const loadMore = useCallback(
    async (event: CustomEvent) => {
      if (!state.hasMoreData) {
        (event.target as HTMLIonInfiniteScrollElement).complete();
        return;
      }

      await loadData(false, state.busqueda);
      (event.target as HTMLIonInfiniteScrollElement).complete();
    },
    [state.hasMoreData, state.busqueda, loadData]
  );

  // ========== REFRESH ==========

  const refresh = useCallback(
    async (event?: CustomEvent) => {
      await loadData(true, state.busqueda);
      if (event) {
        (event.target as HTMLIonRefresherElement).complete();
      }
    },
    [state.busqueda, loadData]
  );

  // ========== VER PACIENTE ==========

  const viewPaciente = useCallback((paciente: PacienteData) => {
    setState((prev) => ({
      ...prev,
      selectedPaciente: paciente,
      showPacienteInfo: true,
    }));
  }, []);

  const closePacienteInfo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedPaciente: null,
      showPacienteInfo: false,
    }));
  }, []);

  // ========== RETRY ==========

  const retry = useCallback(() => {
    loadData(true, state.busqueda);
  }, [state.busqueda, loadData]);

  // ========== GENERAR CERTIFICADOS ==========

  const generarCertificadoTransporte = useCallback(
    async (paciente: PacienteData) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const blob = await descargarCertificadoTransporte(
          paciente.id_paciente,
          sessionToken
        );

        await descargarYCompartirPDF(
          blob,
          `certificado_transporte_${paciente.nombre}.pdf`
        );

        presentToast({
          message: "Certificado generado exitosamente",
          duration: 2000,
          color: "success",
        });
      } catch (error) {
        console.error("Error al generar certificado:", error);
        presentToast({
          message: "Error al generar el certificado",
          duration: 3000,
          color: "danger",
        });
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [sessionToken, presentToast]
  );

  const generarConsentimientoInformado = useCallback(
    async (paciente: PacienteData, data: ConsentimientoInformadoRequest) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const blob = await descargarConsentimientoInformado(
          paciente.id_paciente,
          data,
          sessionToken
        );

        await descargarYCompartirPDF(
          blob,
          `consentimiento_informado_${paciente.nombre}.pdf`
        );

        presentToast({
          message: "Consentimiento generado exitosamente",
          duration: 2000,
          color: "success",
        });
      } catch (error) {
        console.error("Error al generar consentimiento:", error);
        presentToast({
          message: "Error al generar el consentimiento",
          duration: 3000,
          color: "danger",
        });
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [sessionToken, presentToast]
  );

  const generarOrdenExamenes = useCallback(
    async (paciente: PacienteData, data: OrdenExamenesRequest) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const blob = await descargarOrdenExamenes(
          paciente.id_paciente,
          data,
          sessionToken
        );

        await descargarYCompartirPDF(
          blob,
          `orden_examenes_${paciente.nombre}.pdf`
        );

        presentToast({
          message: "Orden de exámenes generada exitosamente",
          duration: 2000,
          color: "success",
        });
      } catch (error) {
        console.error("Error al generar orden de exámenes:", error);
        presentToast({
          message: "Error al generar la orden de exámenes",
          duration: 3000,
          color: "danger",
        });
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [sessionToken, presentToast]
  );

  const generarRecetaMedica = useCallback(
    async (paciente: PacienteData, data: RecetaMedicaRequest) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const blob = await descargarRecetaMedica(
          paciente.id_paciente,
          data,
          sessionToken
        );

        await descargarYCompartirPDF(
          blob,
          `receta_medica_${paciente.nombre}.pdf`
        );

        presentToast({
          message: "Receta médica generada exitosamente",
          duration: 2000,
          color: "success",
        });
      } catch (error) {
        console.error("Error al generar receta médica:", error);
        presentToast({
          message: "Error al generar la receta médica",
          duration: 3000,
          color: "danger",
        });
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [sessionToken, presentToast]
  );

  // ========== CARGAR DATOS INICIAL ==========

  useEffect(() => {
    loadData(true, "");
  }, []);

  // ========== RETORNO ==========

  return {
    ...state,
    loadData,
    handleSearch,
    loadMore,
    refresh,
    viewPaciente,
    closePacienteInfo,
    retry,
    generarCertificadoTransporte,
    generarConsentimientoInformado,
    generarOrdenExamenes,
    generarRecetaMedica,
  };
};
