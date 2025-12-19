import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  IonButton,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  IonToast,
  IonSpinner,
  IonList,
} from "@ionic/react";
import {
  pawOutline,
  chevronForwardOutline,
  chevronBackOutline,
  downloadOutline,
  shareOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
} from "ionicons/icons";
import "../styles/main.css";
import "../styles/certificados.css";
import { PacienteData } from "../api/pacientes";
import ModalEscogerPaciente from "../components/rellenarFicha/modalEscogerPaciente";
import PatientHeader from "../components/rellenarFicha/PatientHeader";
import CertificadoCard from "../components/certificados/CertificadoCard";
import ModalSeleccionarConsulta from "../components/certificados/ModalSeleccionarConsulta";
import ModalDatosConsentimiento, {
  ConsentimientoDatos,
} from "../components/certificados/ModalDatosConsentimiento";
import ModalDatosExamenes, {
  ExamenesDatos,
} from "../components/certificados/ModalDatosExamenes";
import ModalDatosReceta, {
  RecetaDatos,
} from "../components/certificados/ModalDatosReceta";
import {
  descargarCertificadoTransporte,
  descargarConsentimientoInformado,
  descargarOrdenExamenes,
  descargarRecetaMedica,
  descargarResumenConsulta,
  descargarYCompartirPDF,
} from "../api/certificados";
import { useAuth } from "../hooks/useAuth";

// Tipos de certificados
type CertificadoTipo =
  | "transporte"
  | "consentimiento"
  | "examenes"
  | "receta"
  | "consulta";

interface CertificadoSeleccionado {
  tipo: CertificadoTipo;
  datos?: any;
}

const Certificados: React.FC = () => {
  const { sessionToken } = useAuth();
  // Estados del flujo
  const [paso, setPaso] = useState<1 | 2 | 3>(1); // 1: Selección paciente, 2: Dashboard certificados, 3: Resumen/Generación
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteData | null>(
    null
  );
  const [showModalPacientes, setShowModalPacientes] = useState(false);
  const [certificadoSeleccionado, setCertificadoSeleccionado] =
    useState<CertificadoTipo | null>(null);
  const [certificadoDatos, setCertificadoDatos] = useState<any>(null);

  // Estados de UI
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<
    "success" | "danger" | "warning"
  >("success");
  const [isLoading, setIsLoading] = useState(false);

  // Modales para certificados que requieren datos
  const [showConsentimientoModal, setShowConsentimientoModal] = useState(false);
  const [showExamenesModal, setShowExamenesModal] = useState(false);
  const [showRecetaModal, setShowRecetaModal] = useState(false);
  const [showConsultaModal, setShowConsultaModal] = useState(false);

  // Handler para selección de paciente
  const handlePacienteSelected = (paciente: PacienteData) => {
    setSelectedPaciente(paciente);
    setShowModalPacientes(false);
    setPaso(2); // Ir al dashboard de certificados
  };

  // Handler para seleccionar/deseleccionar certificado
  const handleToggleCertificado = (tipo: CertificadoTipo) => {
    // Si se hace clic en el certificado ya seleccionado, deseleccionar
    if (certificadoSeleccionado === tipo) {
      setCertificadoSeleccionado(null);
      setCertificadoDatos(null);
      return;
    }

    // Seleccionar nuevo certificado
    setCertificadoSeleccionado(tipo);
    setCertificadoDatos(null);

    // Si requiere datos, abrir modal
    if (tipo === "consentimiento") {
      setShowConsentimientoModal(true);
      return;
    } else if (tipo === "examenes") {
      setShowExamenesModal(true);
      return;
    } else if (tipo === "receta") {
      setShowRecetaModal(true);
      return;
    } else if (tipo === "consulta") {
      setShowConsultaModal(true);
      return;
    }

    // Certificados simples avanzan directamente a paso 3
    setPaso(3);
  };

  // Handlers para confirmación de datos desde modales
  const handleConsentimientoConfirmado = (datos: ConsentimientoDatos) => {
    setCertificadoDatos(datos);
    setPaso(3);
  };

  const handleExamenesConfirmado = (datos: ExamenesDatos) => {
    setCertificadoDatos(datos);
    setPaso(3);
  };

  const handleRecetaConfirmado = (datos: RecetaDatos) => {
    setCertificadoDatos(datos);
    setPaso(3);
  };

  const handleConsultaSeleccionada = (idConsulta: number) => {
    setCertificadoDatos({ id_consulta: idConsulta });
    setPaso(3);
  };

  // Handler para volver al paso anterior
  const handleVolver = () => {
    if (paso === 2) {
      setPaso(1);
      setSelectedPaciente(null);
      setCertificadoSeleccionado(null);
      setCertificadoDatos(null);
    } else if (paso === 3) {
      setPaso(2);
    }
  };

  // Handler para generar y compartir certificado
  const handleGenerar = async () => {
    if (!selectedPaciente || !certificadoSeleccionado) {
      console.error("No hay paciente o certificado seleccionado");
      return;
    }

    console.log("=== INICIO GENERACIÓN DE CERTIFICADO ===");
    console.log("Paciente:", selectedPaciente);
    console.log("Certificado seleccionado:", certificadoSeleccionado);
    console.log("Datos del certificado:", certificadoDatos);

    setIsLoading(true);
    try {
      let blob: Blob;
      let nombreArchivo = "";

      switch (certificadoSeleccionado) {
        case "transporte":
          console.log("Descargando certificado de transporte...");
          blob = await descargarCertificadoTransporte(
            selectedPaciente.id_paciente,
            sessionToken
          );
          nombreArchivo = `Certificado_Transporte_${selectedPaciente.nombre}.pdf`;
          break;

        case "consentimiento":
          console.log("Datos de consentimiento:", certificadoDatos);
          if (!certificadoDatos) {
            throw new Error("Faltan datos para consentimiento");
          }
          console.log("Descargando consentimiento informado...");
          blob = await descargarConsentimientoInformado(
            selectedPaciente.id_paciente,
            certificadoDatos,
            sessionToken
          );
          nombreArchivo = `Consentimiento_Informado_${selectedPaciente.nombre}.pdf`;
          break;

        case "examenes":
          console.log("Datos de exámenes:", certificadoDatos);
          if (!certificadoDatos) {
            throw new Error("Faltan datos para exámenes");
          }
          console.log("Descargando orden de exámenes...");
          blob = await descargarOrdenExamenes(
            selectedPaciente.id_paciente,
            certificadoDatos,
            sessionToken
          );
          nombreArchivo = `Orden_Examenes_${selectedPaciente.nombre}.pdf`;
          break;

        case "receta":
          console.log("Datos de receta:", certificadoDatos);
          if (!certificadoDatos) {
            throw new Error("Faltan datos para receta");
          }
          console.log("Descargando receta médica...");
          blob = await descargarRecetaMedica(
            selectedPaciente.id_paciente,
            certificadoDatos,
            sessionToken
          );
          nombreArchivo = `Receta_Medica_${selectedPaciente.nombre}.pdf`;
          break;

        case "consulta":
          console.log("Datos de consulta:", certificadoDatos);
          if (!certificadoDatos?.id_consulta) {
            throw new Error("Faltan datos para consulta");
          }
          console.log("Descargando resumen de consulta...");
          blob = await descargarResumenConsulta(
            certificadoDatos.id_consulta,
            sessionToken
          );
          nombreArchivo = `Resumen_Consulta_${selectedPaciente.nombre}.pdf`;
          break;

        default:
          throw new Error("Tipo de certificado no válido");
      }

      // Descargar
      console.log("Iniciando descarga...");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("✅ Descarga completada");

      // Compartir usando API nativa
      console.log("Iniciando compartir...");
      await descargarYCompartirPDF(blob, nombreArchivo);
      console.log("✅ Compartir completado");

      setToastMessage("Certificado generado y compartido exitosamente");
      setToastColor("success");
      setShowToast(true);

      // Volver al inicio después de 1.5 segundos
      setTimeout(() => {
        setPaso(1);
        setSelectedPaciente(null);
        setCertificadoSeleccionado(null);
        setCertificadoDatos(null);
      }, 1500);
    } catch (error) {
      console.error("❌ Error al generar certificado:", error);
      setToastMessage(
        error instanceof Error
          ? error.message
          : "Error al generar el certificado"
      );
      setToastColor("danger");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Generar Certificados</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Generar Certificados</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* PASO 1: Selección de Paciente */}
        {paso === 1 && !selectedPaciente && (
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
                <span>Seleccione un paciente para generar certificados</span>
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
        )}

        {/* PASO 2: Dashboard de Certificados */}
        {paso === 2 && selectedPaciente && (
          <>
            <PatientHeader
              paciente={selectedPaciente}
              onChangePaciente={() => setShowModalPacientes(true)}
            />

            <IonGrid fixed style={{ padding: "12px", maxWidth: "1200px" }}>
              <IonRow>
                <IonCol size="6">
                  <CertificadoCard
                    tipo="transporte"
                    titulo="Certificado de Transporte"
                    descripcion="Para viajes nacionales e internacionales"
                    selected={certificadoSeleccionado === "transporte"}
                    onClick={() => handleToggleCertificado("transporte")}
                  />
                </IonCol>

                <IonCol size="6">
                  <CertificadoCard
                    tipo="consentimiento"
                    titulo="Consentimiento Informado"
                    descripcion="Para procedimientos quirúrgicos"
                    selected={certificadoSeleccionado === "consentimiento"}
                    onClick={() => handleToggleCertificado("consentimiento")}
                  />
                </IonCol>

                <IonCol size="6">
                  <CertificadoCard
                    tipo="examenes"
                    titulo="Orden de Exámenes"
                    descripcion="Solicitud de estudios clínicos"
                    selected={certificadoSeleccionado === "examenes"}
                    onClick={() => handleToggleCertificado("examenes")}
                  />
                </IonCol>

                <IonCol size="6">
                  <CertificadoCard
                    tipo="receta"
                    titulo="Receta Médica"
                    descripcion="Prescripción de medicamentos"
                    selected={certificadoSeleccionado === "receta"}
                    onClick={() => handleToggleCertificado("receta")}
                  />
                </IonCol>

                <IonCol size="6">
                  <CertificadoCard
                    tipo="consulta"
                    titulo="Resumen de Consulta"
                    descripcion="Informe detallado de atención"
                    selected={certificadoSeleccionado === "consulta"}
                    onClick={() => handleToggleCertificado("consulta")}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}

        {/* PASO 3: Resumen y Generación */}
        {paso === 3 && selectedPaciente && (
          <>
            <PatientHeader
              paciente={selectedPaciente}
              onChangePaciente={() => {}}
            />

            <div style={{ padding: "16px" }}>
              <IonText>
                <h2>Resumen del certificado</h2>
                <p>Se generará el siguiente certificado:</p>
              </IonText>

              {certificadoSeleccionado && (
                <IonCard style={{ marginTop: "1rem" }}>
                  <IonCardContent>
                    <IonText color="primary">
                      <h3>
                        {certificadoSeleccionado === "transporte" &&
                          "Certificado de Transporte"}
                        {certificadoSeleccionado === "consentimiento" &&
                          "Consentimiento Informado"}
                        {certificadoSeleccionado === "examenes" &&
                          "Orden de Exámenes"}
                        {certificadoSeleccionado === "receta" &&
                          "Receta Médica"}
                        {certificadoSeleccionado === "consulta" &&
                          "Resumen de Consulta"}
                      </h3>
                    </IonText>

                    {/* Mostrar resumen de datos según el tipo */}
                    {certificadoSeleccionado === "consentimiento" &&
                      certificadoDatos && (
                        <div style={{ fontSize: "0.9em", marginTop: "0.5rem" }}>
                          <p>
                            <strong>Procedimiento:</strong>{" "}
                            {certificadoDatos.procedimiento}
                          </p>
                          <p>
                            <strong>Peso:</strong> {certificadoDatos.peso} kg
                          </p>
                          {certificadoDatos.autorizaciones_adicionales?.length >
                            0 && (
                            <p>
                              <strong>Autorizaciones:</strong>{" "}
                              {certificadoDatos.autorizaciones_adicionales.join(
                                ", "
                              )}
                            </p>
                          )}
                        </div>
                      )}

                    {certificadoSeleccionado === "examenes" &&
                      certificadoDatos && (
                        <div style={{ fontSize: "0.9em", marginTop: "0.5rem" }}>
                          <p>
                            <strong>Exámenes:</strong>{" "}
                            {certificadoDatos.examenes?.length || 0}
                          </p>
                          <ul>
                            {certificadoDatos.examenes?.map(
                              (ex: any, idx: number) => (
                                <li key={idx}>
                                  {ex.nombre} {ex.urgente && "(Urgente)"}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {certificadoSeleccionado === "receta" &&
                      certificadoDatos && (
                        <div style={{ fontSize: "0.9em", marginTop: "0.5rem" }}>
                          <p>
                            <strong>Medicamentos:</strong>{" "}
                            {certificadoDatos.recetas?.length || 0}
                          </p>
                          <ul>
                            {certificadoDatos.recetas?.map(
                              (rec: any, idx: number) => (
                                <li key={idx}>
                                  {rec.medicamento} - {rec.dosis}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {certificadoSeleccionado === "consulta" &&
                      certificadoDatos && (
                        <div style={{ fontSize: "0.9em", marginTop: "0.5rem" }}>
                          <p>
                            <strong>Consulta ID:</strong>{" "}
                            {certificadoDatos.id_consulta}
                          </p>
                        </div>
                      )}
                  </IonCardContent>
                </IonCard>
              )}
            </div>
          </>
        )}
      </IonContent>

      {/* Footer con botones de navegación */}
      {selectedPaciente && paso === 3 && (
        <IonFooter className="ficha-footer">
          <IonToolbar>
            <div className="footer-buttons-container">
              <IonButton
                className="cancel-button"
                fill="outline"
                onClick={handleVolver}
                disabled={isLoading}
              >
                <IonIcon icon={chevronBackOutline} slot="start" />
                Volver
              </IonButton>
              <IonButton
                className="save-button"
                onClick={handleGenerar}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" />
                    Generando...
                  </>
                ) : (
                  <>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" />
                    Generar y Compartir
                  </>
                )}
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
        hideMotivo={true}
      />

      {/* Toast para notificaciones */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
        color={toastColor}
      />

      {/* Modales para certificados que requieren datos */}
      <ModalSeleccionarConsulta
        isOpen={showConsultaModal}
        onClose={() => setShowConsultaModal(false)}
        onConsultaSeleccionada={handleConsultaSeleccionada}
        idPaciente={selectedPaciente?.id_paciente || 0}
      />

      <ModalDatosConsentimiento
        isOpen={showConsentimientoModal}
        onClose={() => setShowConsentimientoModal(false)}
        onConfirmar={handleConsentimientoConfirmado}
      />

      <ModalDatosExamenes
        isOpen={showExamenesModal}
        onClose={() => setShowExamenesModal(false)}
        onConfirmar={handleExamenesConfirmado}
      />

      <ModalDatosReceta
        isOpen={showRecetaModal}
        onClose={() => setShowRecetaModal(false)}
        onConfirmar={handleRecetaConfirmado}
      />
    </IonPage>
  );
};

export default Certificados;
