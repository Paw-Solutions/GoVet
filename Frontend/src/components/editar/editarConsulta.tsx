import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonToast,
  IonButtons,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonText,
  IonFooter,
  IonRange,
} from "@ionic/react";
import {
  closeOutline,
  saveOutline,
  pulseOutline,
  bodyOutline,
  clipboardOutline,
  documentTextOutline,
  pawOutline,
  closeCircleOutline,
  calendarOutline,
} from "ionicons/icons";
import { ConsultaData, actualizarConsulta } from "../../api/fichas";
import { useAuth } from "../../hooks/useAuth";
import ModuleCard from "../rellenarFicha/ModuleCard";
import "../../styles/rellenarFicha.css";

interface ModalEditarConsultaProps {
  isOpen: boolean;
  onDismiss: () => void;
  consulta: ConsultaData | null;
}

// Componente: Editor de información de consulta con estilo dashboard
const ModalEditarConsulta: React.FC<ModalEditarConsultaProps> = ({
  isOpen,
  onDismiss,
  consulta,
}) => {
  const { sessionToken } = useAuth();

  // Estado del módulo activo
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [touchedModules, setTouchedModules] = useState<Set<string>>(new Set());

  // Estados del formulario
  const [motivo, setMotivo] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [examenClinico, setExamenClinico] = useState("");
  const [prediagnostico, setPrediagnostico] = useState("");
  const [pronostico, setPronostico] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [indicacionesGenerales, setIndicacionesGenerales] = useState("");

  // Constantes vitales
  const [peso, setPeso] = useState<number>(0);
  const [temperatura, setTemperatura] = useState<number>(0);
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState<number>(0);
  const [frecuenciaRespiratoria, setFrecuenciaRespiratoria] =
    useState<number>(0);
  const [tllc, setTllc] = useState<number>(0);
  const [dht, setDht] = useState<number>(0);

  // Examen físico
  const [mucosas, setMucosas] = useState("");
  const [condicionCorporal, setCondicionCorporal] = useState("");
  const [estadoPelaje, setEstadoPelaje] = useState("");
  const [estadoPiel, setEstadoPiel] = useState("");
  const [nodulosLinfaticos, setNodulosLinfaticos] = useState("");
  const [auscultacionCardiaca, setAuscultacionCardiaca] = useState("");

  // Estados de control
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<"success" | "danger">("success");

  // Cargar datos de la consulta cuando se abre el modal
  useEffect(() => {
    if (isOpen && consulta) {
      setMotivo(consulta.motivo || "");
      setDiagnostico(consulta.diagnostico || "");
      setExamenClinico(consulta.examen_clinico || "");
      setPrediagnostico(consulta.prediagnostico || "");
      setPronostico(consulta.pronostico || "");
      setObservaciones(consulta.observaciones || "");
      setIndicacionesGenerales(consulta.indicaciones_generales || "");

      setPeso(consulta.peso || 0);
      setTemperatura(consulta.temperatura || 0);
      setFrecuenciaCardiaca(consulta.frecuencia_cardiaca || 0);
      setFrecuenciaRespiratoria(consulta.frecuencia_respiratoria || 0);
      setTllc(consulta.tllc || 0);
      setDht(consulta.dht || 0);

      setMucosas(consulta.mucosas || "");
      setCondicionCorporal(consulta.condicion_corporal || "");
      setEstadoPelaje(consulta.estado_pelaje || "");
      setEstadoPiel(consulta.estado_piel || "");
      setNodulosLinfaticos(consulta.nodulos_linfaticos || "");
      setAuscultacionCardiaca(consulta.auscultacion_cardiaca_toraxica || "");

      setActiveModule(null);
      setTouchedModules(new Set());
    }
  }, [isOpen, consulta]);

  const openModule = (moduleId: string) => {
    setActiveModule(moduleId);
    setTouchedModules((prev) => new Set(prev).add(moduleId));
  };

  const getModuleStatus = (
    moduleId: string
  ): "empty" | "complete" | "incomplete" | "visited" => {
    const isTouched = touchedModules.has(moduleId);

    switch (moduleId) {
      case "constantes":
        const hasAllConstantes = peso > 0 && temperatura > 0;
        const hasSomeConstantes =
          peso > 0 ||
          temperatura > 0 ||
          frecuenciaCardiaca > 0 ||
          frecuenciaRespiratoria > 0;
        if (hasAllConstantes) return "complete";
        if (hasSomeConstantes) return "incomplete";
        if (isTouched) return "visited";
        return "empty";

      case "examen_fisico":
        const hasAllFisico = mucosas && condicionCorporal;
        const hasSomeFisico =
          mucosas ||
          condicionCorporal ||
          estadoPelaje ||
          estadoPiel ||
          nodulosLinfaticos;
        if (hasAllFisico) return "complete";
        if (hasSomeFisico) return "incomplete";
        if (isTouched) return "visited";
        return "empty";

      case "diagnostico":
        if (diagnostico.trim()) return "complete";
        if (examenClinico.trim() || observaciones.trim()) return "incomplete";
        if (isTouched) return "visited";
        return "empty";

      case "plan":
        if (indicacionesGenerales.trim()) return "complete";
        if (isTouched) return "visited";
        return "empty";

      default:
        return "empty";
    }
  };

  const handleSave = async () => {
    if (!consulta) return;

    try {
      setSaving(true);

      const consultaActualizada: ConsultaData = {
        ...consulta,
        motivo,
        diagnostico,
        examen_clinico: examenClinico,
        prediagnostico,
        pronostico,
        observaciones,
        indicaciones_generales: indicacionesGenerales,
        peso,
        temperatura,
        frecuencia_cardiaca: frecuenciaCardiaca,
        frecuencia_respiratoria: frecuenciaRespiratoria,
        tllc,
        dht,
        mucosas,
        condicion_corporal: condicionCorporal,
        estado_pelaje: estadoPelaje,
        estado_piel: estadoPiel,
        nodulos_linfaticos: nodulosLinfaticos,
        auscultacion_cardiaca_toraxica: auscultacionCardiaca,
      };

      await actualizarConsulta(
        consulta.id_consulta,
        consultaActualizada,
        sessionToken
      );

      setToastMessage("Consulta actualizada exitosamente");
      setToastColor("success");
      setShowToast(true);

      window.dispatchEvent(new CustomEvent("consultas:updated"));

      setTimeout(() => {
        onDismiss();
      }, 1000);
    } catch (error) {
      console.error("Error actualizando consulta:", error);
      setToastMessage("Error al actualizar la consulta");
      setToastColor("danger");
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setActiveModule(null);
    onDismiss();
  };

  if (!consulta) return null;

  return (
    <>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={onDismiss}
        className="fullscreen-modal"
      >
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonTitle>Editar Consulta</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCancel}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen={true}>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Editar Consulta</IonTitle>
            </IonToolbar>
          </IonHeader>

          {/* Banner de información del paciente */}
          <IonCard>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="4">
                    <IonText color="medium">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <IonIcon icon={pawOutline} />
                        <strong>Paciente</strong>
                      </div>
                    </IonText>
                    <IonText>
                      <p style={{ margin: 0 }}>
                        {consulta.paciente?.nombre || "N/A"}
                      </p>
                    </IonText>
                  </IonCol>
                  <IonCol size="12" sizeMd="4">
                    <IonText color="medium">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <IonIcon icon={calendarOutline} />
                        <strong>Fecha</strong>
                      </div>
                    </IonText>
                    <IonText>
                      <p style={{ margin: 0 }}>
                        {consulta.fecha_consulta
                          ? new Date(
                              consulta.fecha_consulta
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </IonText>
                  </IonCol>
                  <IonCol size="12" sizeMd="4">
                    <IonItem>
                      <IonLabel position="stacked">Motivo de Consulta</IonLabel>
                      <IonTextarea
                        value={motivo}
                        onIonChange={(e) => setMotivo(e.detail.value || "")}
                        rows={2}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Dashboard Grid - Módulos */}
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
                  icon={documentTextOutline}
                  title="Plan de Tratamiento"
                  status={getModuleStatus("plan")}
                  onClick={() => openModule("plan")}
                />
              </IonCol>
            </IonRow>
          </IonGrid>

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
                    value={peso}
                    onIonChange={(e) =>
                      setPeso(parseFloat(e.detail.value || "0"))
                    }
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Temperatura (°C)"
                    labelPlacement="stacked"
                    fill="outline"
                    type="number"
                    step="0.1"
                    value={temperatura}
                    onIonChange={(e) =>
                      setTemperatura(parseFloat(e.detail.value || "0"))
                    }
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Frecuencia Cardíaca (lpm)"
                    labelPlacement="stacked"
                    fill="outline"
                    type="number"
                    value={frecuenciaCardiaca}
                    onIonChange={(e) =>
                      setFrecuenciaCardiaca(parseFloat(e.detail.value || "0"))
                    }
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Frecuencia Respiratoria (rpm)"
                    labelPlacement="stacked"
                    fill="outline"
                    type="number"
                    value={frecuenciaRespiratoria}
                    onIonChange={(e) =>
                      setFrecuenciaRespiratoria(
                        parseFloat(e.detail.value || "0")
                      )
                    }
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="TLLC - Tiempo de Llenado Capilar (seg)"
                    labelPlacement="stacked"
                    fill="outline"
                    type="number"
                    step="0.1"
                    value={tllc}
                    onIonChange={(e) =>
                      setTllc(parseFloat(e.detail.value || "0"))
                    }
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Deshidratación (%)"
                    labelPlacement="stacked"
                    fill="outline"
                    type="number"
                    value={dht}
                    onIonChange={(e) =>
                      setDht(parseFloat(e.detail.value || "0"))
                    }
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
                    value={mucosas}
                    onIonChange={(e) => setMucosas(e.detail.value)}
                  >
                    <IonSelectOption value="Rosadas y brillantes">
                      Rosadas y brillantes
                    </IonSelectOption>
                    <IonSelectOption value="Pálidas">Pálidas</IonSelectOption>
                    <IonSelectOption value="Cianóticas">
                      Cianóticas
                    </IonSelectOption>
                    <IonSelectOption value="Ictéricas">
                      Ictéricas
                    </IonSelectOption>
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
                    value={condicionCorporal}
                    onIonChange={(e) => setCondicionCorporal(e.detail.value)}
                  >
                    <IonSelectOption value="Muy delgado">
                      Muy delgado
                    </IonSelectOption>
                    <IonSelectOption value="Delgado">Delgado</IonSelectOption>
                    <IonSelectOption value="Normal">Normal</IonSelectOption>
                    <IonSelectOption value="Sobrepeso">
                      Sobrepeso
                    </IonSelectOption>
                    <IonSelectOption value="Obeso">Obeso</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">
                    Estado del Pelaje:{" "}
                    {parseFloat(estadoPelaje || "3").toFixed(1)}
                  </IonLabel>
                  <IonRange
                    min={1}
                    max={5}
                    step={0.5}
                    value={parseFloat(estadoPelaje || "3")}
                    pin={true}
                    pinFormatter={(value: number) => value.toFixed(1)}
                    ticks={true}
                    snaps={true}
                    onIonChange={(e) => {
                      setEstadoPelaje((e.detail.value as number).toString());
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
                    value={estadoPiel}
                    onIonChange={(e) => setEstadoPiel(e.detail.value || "")}
                  />
                </IonItem>
                <IonItem>
                  <IonTextarea
                    label="Nódulos Linfáticos"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Describa el estado de los nódulos linfáticos"
                    rows={3}
                    value={nodulosLinfaticos}
                    onIonChange={(e) =>
                      setNodulosLinfaticos(e.detail.value || "")
                    }
                  />
                </IonItem>
                <IonItem>
                  <IonTextarea
                    label="Auscultación Cardíaca"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Describa la auscultación cardíaca"
                    rows={3}
                    value={auscultacionCardiaca}
                    onIonChange={(e) =>
                      setAuscultacionCardiaca(e.detail.value || "")
                    }
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
                    value={examenClinico}
                    onIonChange={(e) => setExamenClinico(e.detail.value || "")}
                  />
                </IonItem>
                <IonItem>
                  <IonTextarea
                    label="Prediagnóstico"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Prediagnóstico preliminar"
                    rows={3}
                    value={prediagnostico}
                    onIonChange={(e) => setPrediagnostico(e.detail.value || "")}
                  />
                </IonItem>
                <IonItem>
                  <IonTextarea
                    label="Diagnóstico"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Diagnóstico final"
                    rows={4}
                    value={diagnostico}
                    onIonChange={(e) => setDiagnostico(e.detail.value || "")}
                  />
                </IonItem>
                <IonItem>
                  <IonTextarea
                    label="Pronóstico"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Pronóstico del paciente"
                    rows={3}
                    value={pronostico}
                    onIonChange={(e) => setPronostico(e.detail.value || "")}
                  />
                </IonItem>
                <IonItem>
                  <IonTextarea
                    label="Observaciones"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Observaciones adicionales"
                    rows={3}
                    value={observaciones}
                    onIonChange={(e) => setObservaciones(e.detail.value || "")}
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

          {/* MODAL 4: Plan de Tratamiento */}
          <IonModal
            className="module-modal"
            isOpen={activeModule === "plan"}
            onDidDismiss={() => setActiveModule(null)}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>Plan de Tratamiento</IonTitle>
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
                    label="Indicaciones Generales"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Indicaciones para el tutor"
                    rows={6}
                    value={indicacionesGenerales}
                    onIonChange={(e) =>
                      setIndicacionesGenerales(e.detail.value || "")
                    }
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
        <IonFooter className="ficha-footer">
          <IonToolbar>
            <div className="footer-buttons-container">
              <IonButton
                className="cancel-button"
                fill="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                <IonIcon icon={closeCircleOutline} slot="start" />
                Cancelar
              </IonButton>
              <IonButton
                className="save-button"
                expand="block"
                onClick={handleSave}
                disabled={saving}
              >
                <IonIcon icon={saveOutline} slot="start" />
                {saving ? "Guardando..." : "Guardar Cambios"}
              </IonButton>
            </div>
          </IonToolbar>
        </IonFooter>
      </IonModal>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        color={toastColor}
      />
    </>
  );
};

export default ModalEditarConsulta;
