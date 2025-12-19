import { useState, useCallback, useEffect } from "react";
import { TutorData, obtenerTutoresPaginados } from "../api/tutores";
import { useAuth } from "./useAuth"; 

export const useTutorSearch = () => {
  const {sessionToken} = useAuth();
  const [tutores, setTutores] = useState<TutorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const loadTutores = useCallback(
    async (resetList: boolean = true, search?: string) => {
      setLoading(true);
      setError("");

      try {
        const page = resetList ? 1 : currentPage + 1;
        const data = await obtenerTutoresPaginados(page, 50, search, sessionToken);

        setTutores((prev) =>
          resetList ? data.tutores : [...prev, ...data.tutores]
        );
        setCurrentPage(resetList ? 1 : page);
        setHasMoreData(data.pagination.has_next);
      } catch (err) {
        setError("Error al buscar tutores");
        console.error("Error loading tutores:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  const handleSearch = useCallback(
    (texto: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      setBusqueda(texto);

      const timeout = setTimeout(() => {
        loadTutores(true, texto.trim() || undefined);
      }, 500);

      setSearchTimeout(timeout);
    },
    [loadTutores, searchTimeout]
  );

  const loadMore = useCallback(async () => {
    if (hasMoreData && !loading) {
      await loadTutores(false, busqueda.trim() || undefined);
    }
  }, [hasMoreData, loading, busqueda, loadTutores]);

  const reset = useCallback(() => {
    setTutores([]);
    setBusqueda("");
    setCurrentPage(1);
    setHasMoreData(true);
    setError("");
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  }, [searchTimeout]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return {
    tutores,
    loading,
    error,
    busqueda,
    hasMoreData,
    handleSearch,
    loadMore,
    loadTutores,
    reset,
  };
};
