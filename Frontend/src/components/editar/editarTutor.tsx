import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonToast,
} from "@ionic/react";
import {
  TutorData,
  actualizarTutor,
  type TutorCreate,
} from "../../api/tutores";
import InputRut, { InputRutHandle } from "../registroTutor/inputRut";
import InputTelefono, {
  InputTelefonoHandle,
} from "../registroTutor/inputTelefono";
import { SelectorRegion } from "../registroTutor/SelectorRegion";
import { SelectorComuna } from "../registroTutor/SelectorComuna";
import { obtenerRegiones } from "../../api/regiones";
import { formatRegionName, formatComunaName } from "../../utils/formatters";

interface ModalEditarTutorProps {
  isOpen: boolean;
  onDismiss: () => void;
  tutor: TutorData | null;
}

const ModalEditarTutor: React.FC<ModalEditarTutorProps> = ({
  isOpen,
  onDismiss,
  tutor,
}) => {
  // Estados básicos del formulario
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [rut, setRut] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono2, setTelefono2] = useState("");
  const [celular, setCelular] = useState("");
  const [celular2, setCelular2] = useState("");
  const [email, setEmail] = useState("");
  const [observacion, setObservacion] = useState("");

  // Estados para regiones y comunas
  const [regiones, setRegiones] = useState<any[]>([]);
  const [loadingRegiones, setLoadingRegiones] = useState(false);
  const [regionQuery, setRegionQuery] = useState("");
  const [showRegionList, setShowRegionList] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [comunaQuery, setComunaQuery] = useState("");
  const [showComunaList, setShowComunaList] = useState(false);
  const [selectedComuna, setSelectedComuna] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Estados de control - ACTUALIZADOS para usar IonToast
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<"success" | "danger">("success");
  const [telefonoValue, setTelefonoValue] = useState("");

  // Referencias
  const inputRutRef = useRef<InputRutHandle>(null);
  const inputTelefonoRef = useRef<InputTelefonoHandle>(null);

  // Cargar regiones al montar
  useEffect(() => {
    const fetchRegiones = async () => {
      try {
        setLoadingRegiones(true);
        const data = await obtenerRegiones();
        setRegiones(data);
      } catch (error) {
        console.error("Error cargando regiones:", error);
      } finally {
        setLoadingRegiones(false);
      }
    };

    fetchRegiones();
  }, []);

  // Cargar datos del tutor cuando se abre el modal
  useEffect(() => {
    if (tutor && isOpen) {
      // Datos básicos
      setNombre(tutor.nombre ?? "");
      setApellidoPaterno(tutor.apellido_paterno ?? "");
      setApellidoMaterno(tutor.apellido_materno ?? "");
      setRut(tutor.rut ?? "");
      setDireccion(tutor.direccion ?? "");
      setTelefono2(tutor.telefono2 != null ? String(tutor.telefono2) : "");
      setCelular(tutor.celular != null ? String(tutor.celular) : "");
      setCelular2(tutor.celular2 != null ? String(tutor.celular2) : "");
      setEmail(tutor.email ?? "");
      setObservacion(tutor.observacion ?? "");

      // Teléfono principal - guardar el valor sin formato
      const telefonoStr = tutor.telefono != null ? String(tutor.telefono) : "";
      setTelefonoValue(telefonoStr);

      // Región
      if (tutor.region) {
        setRegionQuery(tutor.region);
        const regionEncontrada = regiones.find(
          (r) => formatRegionName(r) === tutor.region || r.name === tutor.region
        );
        setSelectedRegion(regionEncontrada || null);
      }

      // Comuna
      if (tutor.comuna) {
        setComunaQuery(tutor.comuna);
        setSelectedComuna({ id: tutor.comuna, name: tutor.comuna });
      }

      setSaving(false);
    }
  }, [tutor, isOpen, regiones]);

  // Filtros para regiones y comunas
  const filteredRegiones = useMemo(() => {
    return regiones.filter((region) => {
      if (!regionQuery.trim()) return true;
      const formattedName = formatRegionName(region);
      return (
        formattedName.toLowerCase().includes(regionQuery.toLowerCase()) ||
        region.name.toLowerCase().includes(regionQuery.toLowerCase())
      );
    });
  }, [regiones, regionQuery]);

  const filteredComunas = useMemo(() => {
    if (!selectedRegion) return [];
    const region = regiones.find((r) => r.id === selectedRegion.id);
    if (!region || !region.communes) return [];

    return region.communes.filter((comuna: any) => {
      if (!comunaQuery.trim()) return true;
      const formattedName = formatComunaName(comuna.name);
      return (
        formattedName.toLowerCase().includes(comunaQuery.toLowerCase()) ||
        comuna.name.toLowerCase().includes(comunaQuery.toLowerCase())
      );
    });
  }, [regiones, selectedRegion, comunaQuery]);

  // Handlers
  const selectRegion = (id: string, name: string, fullRegion: any) => {
    setSelectedRegion(fullRegion);
    setRegionQuery(name);
    setShowRegionList(false);
    setSelectedComuna(null);
    setComunaQuery("");
    setShowComunaList(false);
  };

  const selectComuna = (id: string, name: string) => {
    setSelectedComuna({ id, name });
    setComunaQuery(name);
    setShowComunaList(false);
  };

  const handlePhoneChange = (phone: string) => {
    setTelefonoValue(phone);
  };

  const handleRutChange = (rutValue: string) => {
    setRut(rutValue);
  };

  const toNumberOrNull = (v: string) => {
    const t = v.trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isNaN(n) ? null : n;
  };

  const handleGuardar = async () => {
    if (!tutor) return;

    try {
      setSaving(true);

      const rutActual = tutor.rut || "";

      const payload: TutorCreate = {
        nombre: nombre.trim(),
        apellido_paterno: apellidoPaterno.trim(),
        apellido_materno: apellidoMaterno.trim(),
        rut: rut,
        direccion: direccion.trim(),
        comuna: selectedComuna ? selectedComuna.name : comunaQuery.trim(),
        region: selectedRegion
          ? formatRegionName(selectedRegion)
          : regionQuery.trim(),
        telefono: toNumberOrNull(telefonoValue) ?? undefined,
        telefono2: toNumberOrNull(telefono2) ?? undefined,
        celular: toNumberOrNull(celular) ?? undefined,
        celular2: toNumberOrNull(celular2) ?? undefined,
        email: email.trim() || undefined,
        observacion: observacion.trim() || undefined,
      };

      await actualizarTutor(rutActual, payload);

      // Mostrar mensaje de éxito
      setToastMessage("Tutor actualizado exitosamente");
      setToastColor("success");
      setShowToast(true);

      window.dispatchEvent(new CustomEvent("tutores:updated"));

      // Cerrar modal después de mostrar el toast
      setTimeout(() => {
        onDismiss();
      }, 1500);
    } catch (err: any) {
      setToastMessage(err?.message || "No fue posible guardar los cambios");
      setToastColor("danger");
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar tutor</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          {/* RUT (readonly) */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  labelPlacement="stacked"
                  fill="outline"
                  value={rut}
                  readonly
                >
                  <div slot="label">
                    RUT (no editable) <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Nombre */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  type="text"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Daniela"
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

          {/* Apellidos */}
          <IonRow className="apellidos">
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  type="text"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Huenuman"
                  value={apellidoPaterno}
                  onIonInput={(e) => setApellidoPaterno(e.detail.value ?? "")}
                >
                  <div slot="label">
                    Primer Apellido <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  label="Segundo Apellido"
                  type="text"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Oliva"
                  value={apellidoMaterno}
                  onIonInput={(e) => setApellidoMaterno(e.detail.value ?? "")}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Dirección */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  type="text"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Calle Falsa 123"
                  value={direccion}
                  onIonInput={(e) => setDireccion(e.detail.value ?? "")}
                >
                  <div slot="label">
                    Dirección <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Teléfono Principal con InputTelefono */}
          <IonRow>
            <IonCol>
              <InputTelefono
                onPhoneChange={handlePhoneChange}
                ref={inputTelefonoRef}
              />
            </IonCol>
          </IonRow>

          {/* Teléfono 2 */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  type="tel"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Contacto 2"
                  label="Teléfono 2"
                  value={telefono2}
                  onIonInput={(e) => setTelefono2(e.detail.value ?? "")}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Celular */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  type="tel"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Celular"
                  label="Celular"
                  value={celular}
                  onIonInput={(e) => setCelular(e.detail.value ?? "")}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Celular 2 */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  type="tel"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Celular alternativo"
                  label="Celular 2"
                  value={celular2}
                  onIonInput={(e) => setCelular2(e.detail.value ?? "")}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Selector Región */}
          <IonRow>
            <IonCol>
              <SelectorRegion
                regionQuery={regionQuery}
                setRegionQuery={setRegionQuery}
                showRegionList={showRegionList}
                setShowRegionList={setShowRegionList}
                filteredRegiones={filteredRegiones}
                loadingRegiones={loadingRegiones}
                selectRegion={selectRegion}
              />
            </IonCol>
          </IonRow>

          {/* Selector Comuna */}
          <IonRow>
            <IonCol>
              <SelectorComuna
                comunaQuery={comunaQuery}
                setComunaQuery={setComunaQuery}
                showComunaList={showComunaList}
                setShowComunaList={setShowComunaList}
                filteredComunas={filteredComunas}
                loadingComunas={false}
                selectComuna={selectComuna}
                regionSeleccionada={!!selectedRegion}
              />
            </IonCol>
          </IonRow>

          {/* Email */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  type="email"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="govet@paw-solutions.com"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? "")}
                >
                  <div slot="label">
                    Email <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Observación */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  type="text"
                  labelPlacement="stacked"
                  fill="outline"
                  label="Observación"
                  placeholder="Notas u observaciones"
                  value={observacion}
                  onIonInput={(e) => setObservacion(e.detail.value ?? "")}
                />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <IonButton onClick={handleGuardar} disabled={saving || !tutor}>
            {saving ? "Guardando..." : "Guardar"}
          </IonButton>
          <IonButton fill="clear" onClick={onDismiss} disabled={saving}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>

      {/* Toast para mensajes de éxito y error */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
        color={toastColor}
      />
    </IonModal>
  );
};

export default ModalEditarTutor;