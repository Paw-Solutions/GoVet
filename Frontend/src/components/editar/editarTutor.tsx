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
import {
  validarFormatoRut,
  validarEmail,
  validarTelefono,
  validarCampoObligatorio,
  validarNombre,
  mensajesError,
} from "../../utils/validaciones";
import { useAuth } from "../../hooks/useAuth";

// Componente: Editor de información de tutor
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
  const {sessionToken} = useAuth();
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

  // Estados para errores de validación
  const [errores, setErrores] = useState({
    rut: "",
    nombre: "",
    apellidoPaterno: "",
    direccion: "",
    telefono: "",
    email: "",
    region: "",
    comuna: "",
  });

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

      // Teléfono principal - usar el ref para establecer el valor
      const telefonoStr = tutor.telefono != null ? String(tutor.telefono) : "";
      setTelefonoValue(telefonoStr);
      if (inputTelefonoRef.current && telefonoStr) {
        inputTelefonoRef.current.setValue(telefonoStr);
      }

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

      // Limpiar errores
      setErrores({
        rut: "",
        nombre: "",
        apellidoPaterno: "",
        direccion: "",
        telefono: "",
        email: "",
        region: "",
        comuna: "",
      });

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
    // Limpiar error de región
    setErrores((prev) => ({ ...prev, region: "" }));
  };

  const selectComuna = (id: string, name: string) => {
    setSelectedComuna({ id, name });
    setComunaQuery(name);
    setShowComunaList(false);
    // Limpiar error de comuna
    setErrores((prev) => ({ ...prev, comuna: "" }));
  };

  const handleRutChange = (rutValue: string) => {
    setRut(rutValue);
    // Validar RUT
    if (!validarCampoObligatorio(rutValue)) {
      setErrores((prev) => ({ ...prev, rut: mensajesError.rutRequerido }));
    } else if (!validarFormatoRut(rutValue)) {
      setErrores((prev) => ({ ...prev, rut: mensajesError.rutInvalido }));
    } else {
      setErrores((prev) => ({ ...prev, rut: "" }));
    }
  };

  // Validación de nombre
  const handleNombreChange = (valor: string) => {
    setNombre(valor);
    if (!validarCampoObligatorio(valor)) {
      setErrores((prev) => ({
        ...prev,
        nombre: mensajesError.nombreRequerido,
      }));
    } else if (!validarNombre(valor)) {
      setErrores((prev) => ({ ...prev, nombre: mensajesError.nombreInvalido }));
    } else {
      setErrores((prev) => ({ ...prev, nombre: "" }));
    }
  };

  // Validación de apellido paterno
  const handleApellidoPaternoChange = (valor: string) => {
    setApellidoPaterno(valor);
    if (!validarCampoObligatorio(valor)) {
      setErrores((prev) => ({
        ...prev,
        apellidoPaterno: mensajesError.apellidoRequerido,
      }));
    } else if (!validarNombre(valor)) {
      setErrores((prev) => ({
        ...prev,
        apellidoPaterno: mensajesError.apellidoInvalido,
      }));
    } else {
      setErrores((prev) => ({ ...prev, apellidoPaterno: "" }));
    }
  };

  // Validación de dirección
  const handleDireccionChange = (valor: string) => {
    setDireccion(valor);
    if (!validarCampoObligatorio(valor)) {
      setErrores((prev) => ({
        ...prev,
        direccion: mensajesError.direccionRequerida,
      }));
    } else {
      setErrores((prev) => ({ ...prev, direccion: "" }));
    }
  };

  // Validación de teléfono
  const handlePhoneChange = (phone: string) => {
    setTelefonoValue(phone);
    if (!validarCampoObligatorio(phone)) {
      setErrores((prev) => ({
        ...prev,
        telefono: mensajesError.telefonoRequerido,
      }));
    } else if (!validarTelefono(phone)) {
      setErrores((prev) => ({
        ...prev,
        telefono: mensajesError.telefonoInvalido,
      }));
    } else {
      setErrores((prev) => ({ ...prev, telefono: "" }));
    }
  };

  // Validación de email
  const handleEmailChange = (valor: string) => {
    setEmail(valor);
    if (!validarCampoObligatorio(valor)) {
      setErrores((prev) => ({ ...prev, email: mensajesError.emailRequerido }));
    } else if (!validarEmail(valor)) {
      setErrores((prev) => ({ ...prev, email: mensajesError.emailInvalido }));
    } else {
      setErrores((prev) => ({ ...prev, email: "" }));
    }
  };

  // Validación de región
  const handleRegionChange = (regionName: string) => {
    setRegionQuery(regionName);

    // Si el campo está vacío, limpiar la región seleccionada y comuna
    if (!validarCampoObligatorio(regionName)) {
      setSelectedRegion(null);
      setSelectedComuna(null);
      setComunaQuery("");
      setErrores((prev) => ({
        ...prev,
        region: mensajesError.regionRequerida,
        comuna: "", // Limpiar error de comuna también
      }));
    } else {
      // Si no coincide con la región seleccionada, limpiarla
      if (selectedRegion && formatRegionName(selectedRegion) !== regionName) {
        setSelectedRegion(null);
        setSelectedComuna(null);
        setComunaQuery("");
      }
      setErrores((prev) => ({ ...prev, region: "" }));
    }
  };

  // Validación de comuna
  const handleComunaChange = (comunaName: string) => {
    setComunaQuery(comunaName);

    // Si el campo está vacío, limpiar la comuna seleccionada
    if (!validarCampoObligatorio(comunaName)) {
      setSelectedComuna(null);
      setErrores((prev) => ({
        ...prev,
        comuna: mensajesError.comunaRequerida,
      }));
    } else {
      // Si no coincide con la comuna seleccionada, limpiarla
      if (selectedComuna && selectedComuna.name !== comunaName) {
        setSelectedComuna(null);
      }
      setErrores((prev) => ({ ...prev, comuna: "" }));
    }
  };

  const toNumberOrNull = (v: string) => {
    const t = v.trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isNaN(n) ? null : n;
  };

  const handleGuardar = async () => {
    if (!tutor) return;

    // Validar todos los campos antes de enviar
    const nuevosErrores = {
      rut: "",
      nombre: "",
      apellidoPaterno: "",
      direccion: "",
      telefono: "",
      email: "",
      region: "",
      comuna: "",
    };

    // Validar RUT
    if (!validarCampoObligatorio(rut)) {
      nuevosErrores.rut = mensajesError.rutRequerido;
    } else if (!validarFormatoRut(rut)) {
      nuevosErrores.rut = mensajesError.rutInvalido;
    }

    // Validar nombre
    if (!validarCampoObligatorio(nombre)) {
      nuevosErrores.nombre = mensajesError.nombreRequerido;
    } else if (!validarNombre(nombre)) {
      nuevosErrores.nombre = mensajesError.nombreInvalido;
    }

    // Validar apellido paterno
    if (!validarCampoObligatorio(apellidoPaterno)) {
      nuevosErrores.apellidoPaterno = mensajesError.apellidoRequerido;
    } else if (!validarNombre(apellidoPaterno)) {
      nuevosErrores.apellidoPaterno = mensajesError.apellidoInvalido;
    }

    // Validar dirección
    if (!validarCampoObligatorio(direccion)) {
      nuevosErrores.direccion = mensajesError.direccionRequerida;
    }

    // Validar teléfono
    if (!validarCampoObligatorio(telefonoValue)) {
      nuevosErrores.telefono = mensajesError.telefonoRequerido;
    } else if (!validarTelefono(telefonoValue)) {
      nuevosErrores.telefono = mensajesError.telefonoInvalido;
    }

    // Validar email
    if (!validarCampoObligatorio(email)) {
      nuevosErrores.email = mensajesError.emailRequerido;
    } else if (!validarEmail(email)) {
      nuevosErrores.email = mensajesError.emailInvalido;
    }

    // Validar región
    const regionFinal = selectedRegion
      ? formatRegionName(selectedRegion)
      : regionQuery.trim();
    if (!validarCampoObligatorio(regionFinal)) {
      nuevosErrores.region = mensajesError.regionRequerida;
    }

    // Validar comuna
    const comunaFinal = selectedComuna
      ? selectedComuna.name
      : comunaQuery.trim();
    if (!validarCampoObligatorio(comunaFinal)) {
      nuevosErrores.comuna = mensajesError.comunaRequerida;
    }

    // Actualizar estado de errores
    setErrores(nuevosErrores);

    // Si hay errores, no continuar
    const hayErrores = Object.values(nuevosErrores).some(
      (error) => error !== ""
    );
    if (hayErrores) {
      setToastMessage("Por favor, corrija los errores antes de continuar");
      setToastColor("danger");
      setShowToast(true);
      return;
    }

    try {
      setSaving(true);

      const rutActual = tutor.rut || "";

      const payload: TutorCreate = {
        nombre: nombre.trim(),
        apellido_paterno: apellidoPaterno.trim(),
        apellido_materno: apellidoMaterno.trim(),
        rut: rut,
        direccion: direccion.trim(),
        comuna: comunaFinal,
        region: regionFinal,
        telefono: toNumberOrNull(telefonoValue) ?? undefined,
        telefono2: toNumberOrNull(telefono2) ?? undefined,
        celular: toNumberOrNull(celular) ?? undefined,
        celular2: toNumberOrNull(celular2) ?? undefined,
        email: email.trim() || undefined,
        observacion: observacion.trim() || undefined,
      };

      await actualizarTutor(rutActual, payload, sessionToken);

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

  // Calcular si hay errores o campos vacíos
  const tieneErrores = Object.values(errores).some((error) => error !== "");
  const formularioIncompleto =
    !rut ||
    !nombre ||
    !apellidoPaterno ||
    !direccion ||
    !telefonoValue ||
    !email ||
    (!selectedRegion && !regionQuery.trim()) ||
    (!selectedComuna && !comunaQuery.trim());

  const deshabilitarGuardar =
    saving || !tutor || tieneErrores || formularioIncompleto;

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
              <InputRut
                onRutChange={handleRutChange}
                ref={inputRutRef}
                initialValue={rut}
                readonly={true}
              />
              {errores.rut && (
                <IonText color="danger">
                  <small>{errores.rut}</small>
                </IonText>
              )}
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
                  onIonInput={(e) => handleNombreChange(e.detail.value ?? "")}
                  className={errores.nombre ? "ion-invalid ion-touched" : ""}
                >
                  <div slot="label">
                    Nombre <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
              {errores.nombre && (
                <IonText color="danger">
                  <small>{errores.nombre}</small>
                </IonText>
              )}
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
                  onIonInput={(e) =>
                    handleApellidoPaternoChange(e.detail.value ?? "")
                  }
                  className={
                    errores.apellidoPaterno ? "ion-invalid ion-touched" : ""
                  }
                >
                  <div slot="label">
                    Primer Apellido <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
              {errores.apellidoPaterno && (
                <IonText color="danger">
                  <small>{errores.apellidoPaterno}</small>
                </IonText>
              )}
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
                  onIonInput={(e) =>
                    handleDireccionChange(e.detail.value ?? "")
                  }
                  className={errores.direccion ? "ion-invalid ion-touched" : ""}
                >
                  <div slot="label">
                    Dirección <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
              {errores.direccion && (
                <IonText color="danger">
                  <small>{errores.direccion}</small>
                </IonText>
              )}
            </IonCol>
          </IonRow>

          {/* Teléfono Principal con InputTelefono */}
          <IonRow>
            <IonCol>
              <InputTelefono
                onPhoneChange={handlePhoneChange}
                ref={inputTelefonoRef}
                initialValue={telefonoValue}
              />
              {errores.telefono && (
                <IonText color="danger">
                  <small>{errores.telefono}</small>
                </IonText>
              )}
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
                setRegionQuery={handleRegionChange}
                showRegionList={showRegionList}
                setShowRegionList={setShowRegionList}
                filteredRegiones={filteredRegiones}
                loadingRegiones={loadingRegiones}
                selectRegion={selectRegion}
              />
              {errores.region && (
                <IonText color="danger">
                  <small>{errores.region}</small>
                </IonText>
              )}
            </IonCol>
          </IonRow>

          {/* Selector Comuna */}
          <IonRow>
            <IonCol>
              <SelectorComuna
                comunaQuery={comunaQuery}
                setComunaQuery={handleComunaChange}
                showComunaList={showComunaList}
                setShowComunaList={setShowComunaList}
                filteredComunas={filteredComunas}
                loadingComunas={false}
                selectComuna={selectComuna}
                regionSeleccionada={!!selectedRegion}
              />
              {errores.comuna && (
                <IonText color="danger">
                  <small>{errores.comuna}</small>
                </IonText>
              )}
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
                  onIonInput={(e) => handleEmailChange(e.detail.value ?? "")}
                  className={errores.email ? "ion-invalid ion-touched" : ""}
                >
                  <div slot="label">
                    Email <IonText color="danger">(*)</IonText>
                  </div>
                </IonInput>
              </IonItem>
              {errores.email && (
                <IonText color="danger">
                  <small>{errores.email}</small>
                </IonText>
              )}
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
          <IonButton onClick={handleGuardar} disabled={deshabilitarGuardar}>
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
