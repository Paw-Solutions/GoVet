import React, { useEffect, useState, useMemo } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonToggle,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonRadioGroup,
  IonRadio,
  IonLabel,
} from "@ionic/react";
import {
  PacienteData,
  actualizarTutorDePaciente,
  actualizarPaciente,
  type PacienteCreate,
} from "../../api/pacientes";
import { obtenerEspecies, obtenerRazas } from "../../api/especies";
import { SelectorEspecie } from "../registroPaciente/SelectorEspecie";
import { SelectorRaza } from "../registroPaciente/SelectorRaza";
import ModalBuscarTutor from "../registroPaciente/ModalBuscarTutor";

interface Tutor {
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
  comuna: string;
  region: string;
}

interface ModalEditarPacienteProps {
  isOpen: boolean;
  onDismiss: () => void;
  paciente: PacienteData | null;
}

const ModalEditarPaciente: React.FC<ModalEditarPacienteProps> = ({
  isOpen,
  onDismiss,
  paciente,
}) => {
  // Estados básicos del formulario
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [sexo, setSexo] = useState("");
  const [esterilizado, setEsterilizado] = useState(false);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [codigoChip, setCodigoChip] = useState("");

  // Estados para especie y raza
  const [especiesData, setEspeciesData] = useState<any[]>([]);
  const [razasData, setRazasData] = useState<any[]>([]);
  const [loadingEspecies, setLoadingEspecies] = useState(false);
  const [loadingRazas, setLoadingRazas] = useState(false);
  const [especieQuery, setEspecieQuery] = useState("");
  const [razaQuery, setRazaQuery] = useState("");
  const [showEspecieList, setShowEspecieList] = useState(false);
  const [showRazaList, setShowRazaList] = useState(false);
  const [especieSeleccionada, setEspecieSeleccionada] = useState<any>(null);
  const [razaSeleccionada, setRazaSeleccionada] = useState<any>(null);

  // Estado para tutor
  const [showModalBuscarTutor, setShowModalBuscarTutor] = useState(false);
  const [tutorSeleccionado, setTutorSeleccionado] = useState<Tutor | null>(
    null
  );

  // Estados de control
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cargar especies al montar
  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        setLoadingEspecies(true);
        const especies = await obtenerEspecies();
        setEspeciesData(especies);
      } catch (error) {
        console.error("Error cargando especies:", error);
      } finally {
        setLoadingEspecies(false);
      }
    };

    if (isOpen) {
      fetchEspecies();
    }
  }, [isOpen]);

  // Cargar razas cuando se selecciona una especie
  useEffect(() => {
    const fetchRazas = async () => {
      if (!especieSeleccionada) {
        setRazasData([]);
        return;
      }

      try {
        setLoadingRazas(true);
        const razas = await obtenerRazas(especieSeleccionada.nombre_comun);
        setRazasData(razas || []);
      } catch (error) {
        console.error("Error cargando razas:", error);
        setRazasData([]);
      } finally {
        setLoadingRazas(false);
      }
    };

    fetchRazas();
  }, [especieSeleccionada]);

  // Cargar datos del paciente cuando se abre el modal
  useEffect(() => {
    if (paciente && isOpen) {
      // Datos básicos
      setNombre(paciente.nombre ?? "");
      setColor(paciente.color ?? "");
      setSexo(paciente.sexo ?? "");
      setEsterilizado(paciente.esterilizado ?? false);
      setFechaNacimiento(paciente.fecha_nacimiento ?? "");
      setCodigoChip(paciente.codigo_chip ?? "");

      // Especie
      if (paciente.especie) {
        setEspecieQuery(paciente.especie);
        // Buscar la especie completa cuando se carguen las especies
        const especie = especiesData.find(
          (e) => e.nombre_comun === paciente.especie
        );
        setEspecieSeleccionada(especie || null);
      }

      // Raza
      if (paciente.raza) {
        setRazaQuery(paciente.raza);
        setRazaSeleccionada({
          id_raza: paciente.id_raza,
          nombre: paciente.raza,
        });
      }

      // Tutor
      if (paciente.tutor) {
        setTutorSeleccionado({
          rut: paciente.tutor.rut ?? "",
          nombre: paciente.tutor.nombre ?? "",
          apellido: `${paciente.tutor.apellido_paterno ?? ""} ${
            paciente.tutor.apellido_materno ?? ""
          }`.trim(),
          telefono: paciente.tutor.telefono?.toString() ?? "",
          email: paciente.tutor.email ?? "",
          direccion: "",
          comuna: "",
          region: "",
        });
      } else {
          // Limpiar tutor si el nuevo paciente no tiene uno
          setTutorSeleccionado(null);
        }

      setErrorMsg(null);
      setSaving(false);
    }
  }, [paciente, isOpen, especiesData]);

  // Filtros
  const filteredEspecies = useMemo(() => {
    return especiesData
      .filter((especie) => {
        if (!especieQuery.trim()) return true;
        return especie.nombre_comun
          .toLowerCase()
          .includes(especieQuery.toLowerCase());
      })
      .slice(0, 4);
  }, [especiesData, especieQuery]);

  const filteredRazas = useMemo(() => {
    return razasData
      .filter((raza: any) => {
        if (!razaQuery.trim()) return true;
        return raza.nombre.toLowerCase().includes(razaQuery.toLowerCase());
      })
      .slice(0, 4);
  }, [razasData, razaQuery]);

  // Handlers
  const selectEspecie = (especieId: number, especieNombre: string) => {
    const especie = especiesData.find((e) => e.id_especie === especieId);
    setEspecieSeleccionada(especie);
    setEspecieQuery(especieNombre);
    setShowEspecieList(false);
    // Limpiar raza al cambiar especie
    setRazaSeleccionada(null);
    setRazaQuery("");
  };

  const selectRaza = (razaId: number, razaNombre: string) => {
    setRazaSeleccionada({ id_raza: razaId, nombre: razaNombre });
    setRazaQuery(razaNombre);
    setShowRazaList(false);
  };

  const clearEspecie = () => {
    setEspecieSeleccionada(null);
    setEspecieQuery("");
    setRazaSeleccionada(null);
    setRazaQuery("");
    setRazasData([]);
  };

  const handleTutorSelected = (tutor: Tutor) => {
    setTutorSeleccionado(tutor);
    setShowModalBuscarTutor(false);
  };

  const handleGuardar = async () => {
    if (!paciente) return;

    try {
      setSaving(true);
      setErrorMsg(null);

      // Validaciones
      if (!razaSeleccionada?.id_raza) {
        throw new Error("Debe seleccionar una raza válida");
      }

      if (!tutorSeleccionado?.rut) {
        throw new Error("Debe seleccionar un tutor");
      }

      // Normalizar datos
      const fechaNorm = (fechaNacimiento || "").trim();
      const sexoNorm = (sexo || "").trim().toLowerCase();

      // 1) Actualizar datos base del paciente
      const payload: PacienteCreate = {
        nombre: nombre.trim(),
        id_raza: razaSeleccionada.id_raza,
        sexo: sexoNorm,
        color: color.trim(),
        fecha_nacimiento: fechaNorm,
        codigo_chip: codigoChip.trim() || undefined,
        esterilizado,
      };

      await actualizarPaciente(paciente.id_paciente, payload);

      // 2) Actualizar tutor si cambió el RUT
      const rutActual = paciente.tutor?.rut || "";
      const rutNuevo = tutorSeleccionado.rut.trim();
      if (rutNuevo && rutNuevo !== rutActual) {
        await actualizarTutorDePaciente(paciente.id_paciente, rutNuevo);
      }

      // 3) Refrescar la lista
      window.dispatchEvent(new CustomEvent("pacientes:updated"));

      // 4) Cerrar modal
      onDismiss();
    } catch (err: any) {
      setErrorMsg(err?.message || "No fue posible guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar paciente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          {/* Nombre */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  name="nombre"
                  label="Nombre"
                  type="text"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Ej: copito"
                  value={nombre}
                  onIonInput={(e) => setNombre(e.detail.value ?? "")}
                >
                  <div slot="label">
                    Nombre <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Selector de Especie */}
          <IonRow>
            <IonCol>
              <SelectorEspecie
                especieQuery={especieQuery}
                setEspecieQuery={setEspecieQuery}
                showEspecieList={showEspecieList}
                setShowEspecieList={setShowEspecieList}
                filteredEspecies={filteredEspecies}
                loadingEspecies={loadingEspecies}
                selectEspecie={selectEspecie}
                onClearEspecie={clearEspecie}
                hasSelectedEspecie={!!especieSeleccionada}
              />
            </IonCol>
          </IonRow>

          {/* Selector de Raza */}
          <IonRow>
            <IonCol>
              <SelectorRaza
                razaQuery={razaQuery}
                setRazaQuery={setRazaQuery}
                showRazaList={showRazaList}
                setShowRazaList={setShowRazaList}
                filteredRazas={filteredRazas}
                loadingRazas={loadingRazas}
                selectRaza={selectRaza}
                especieSeleccionada={!!especieSeleccionada}
              />
            </IonCol>
          </IonRow>

          {/* Color y Sexo */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  name="color"
                  label="Color"
                  type="text"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Ej: Naranja"
                  value={color}
                  onIonInput={(e) => setColor(e.detail.value ?? "")}
                >
                  <div slot="label">
                    Color <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem lines="none">
                <IonLabel>Sexo</IonLabel>
                <IonRadioGroup
                  className="radio-group-spaced"
                  value={sexo}
                  onIonChange={(e) => setSexo(e.detail.value)}
                >
                  <IonRadio slot="start" value="M">
                    M
                  </IonRadio>
                  <IonRadio slot="start" value="H">
                    H
                  </IonRadio>
                </IonRadioGroup>
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Fecha de Nacimiento */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  name="fechaNacimiento"
                  label="Fecha de nacimiento"
                  type="date"
                  labelPlacement="stacked"
                  fill="outline"
                  value={fechaNacimiento}
                  onIonInput={(e) => setFechaNacimiento(e.detail.value ?? "")}
                >
                  <div slot="label">
                    Fecha de nacimiento <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Toggle Esterilizado */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonLabel>¿Está esterilizado?</IonLabel>
                <IonToggle
                  slot="end"
                  checked={esterilizado}
                  onIonChange={(e) => setEsterilizado(e.detail.checked)}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Código Chip */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  name="codigo_chip"
                  label="Código Chip (Opcional)"
                  type="text"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Ej: 123456789012345"
                  value={codigoChip}
                  onIonInput={(e) => setCodigoChip(e.detail.value ?? "")}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Separador */}
          <IonRow>
            <IonCol>
              <hr style={{ margin: "20px 0", border: "1px solid #ddd" }} />
            </IonCol>
          </IonRow>

          {/* Sección de Tutor */}
          <IonRow>
            <IonCol>
              <IonText>
                <h3>Tutor Asignado</h3>
              </IonText>
            </IonCol>
          </IonRow>

          {tutorSeleccionado ? (
            <IonRow>
              <IonCol>
                <IonItem
                  lines="none"
                  style={{
                    border: "2px solid var(--ion-color-success)",
                    borderRadius: "8px",
                    background: "linear-gradient(145deg, #e8f5e8, #f0f9f0)",
                    margin: "4px 0",
                  }}
                >
                  <IonLabel>
                    <h2 style={{ fontWeight: "600" }}>
                      {`${tutorSeleccionado.nombre} ${tutorSeleccionado.apellido}`}
                    </h2>
                    <p>
                      <strong>RUT:</strong> {tutorSeleccionado.rut}
                    </p>
                    <p>
                      <strong>Email:</strong> {tutorSeleccionado.email || "N/A"}{" "}
                      •<strong> Tel:</strong>{" "}
                      {tutorSeleccionado.telefono || "N/A"}
                    </p>
                  </IonLabel>
                  <IonButton
                    slot="end"
                    fill="clear"
                    onClick={() => setShowModalBuscarTutor(true)}
                  >
                    Cambiar
                  </IonButton>
                </IonItem>
              </IonCol>
            </IonRow>
          ) : (
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowModalBuscarTutor(true)}
                >
                  Buscar Tutor
                </IonButton>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>

        {errorMsg && (
          <div style={{ color: "var(--ion-color-danger)", marginTop: 8 }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <IonButton onClick={handleGuardar} disabled={saving || !paciente}>
            {saving ? "Guardando..." : "Guardar"}
          </IonButton>
          <IonButton fill="clear" onClick={onDismiss} disabled={saving}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>

      {/* Modal para buscar tutor */}
      <ModalBuscarTutor
        isOpen={showModalBuscarTutor}
        onDidDismiss={() => setShowModalBuscarTutor(false)}
        onTutorSelected={handleTutorSelected}
        tutorSeleccionado={tutorSeleccionado}
      />
    </IonModal>
  );
};

export default ModalEditarPaciente;
