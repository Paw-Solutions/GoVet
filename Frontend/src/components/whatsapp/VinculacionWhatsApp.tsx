import React, { useState, useEffect, useRef } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonIcon,
  IonText,
  IonBadge,
  IonAlert,
  useIonToast,
} from "@ionic/react";
import {
  checkmarkCircle,
  closeCircle,
  refreshOutline,
  logoWhatsapp,
  logOutOutline,
  warningOutline,
} from "ionicons/icons";
import QRCode from "./QRCode";
import {
  getWhatsAppQR,
  getWhatsAppStatus,
  desvincularWhatsApp,
  WhatsAppStatus,
} from "../../api/whatsapp";
import "../../styles/VinculacionWhatsApp.css";

/**
 * Estados posibles del componente
 * - loading: Cargando estado inicial
 * - connected: WhatsApp conectado exitosamente
 * - disconnected: WhatsApp desconectado, mostrando QR
 * - error: Error de comunicación con el servicio
 */
type ConnectionState = "loading" | "connected" | "disconnected" | "error";

/**
 * Componente autónomo para gestionar la vinculación de WhatsApp
 * Maneja los estados: loading, connected, disconnected, error
 */
const VinculacionWhatsApp: React.FC = () => {
  const [state, setState] = useState<ConnectionState>("loading");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<WhatsAppStatus>({ conectado: false });
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [qrTimestamp, setQrTimestamp] = useState<number | null>(null);
  const [qrAge, setQrAge] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [present] = useIonToast();

  // Refs para manejo de polling sin race conditions
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  /**
   * Carga el estado de WhatsApp y el QR si es necesario
   * Implementa cancelación de requests y manejo robusto de errores
   */
  const loadWhatsAppData = async (showLoadingState = true) => {
    // Cancelar requests anteriores
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      if (showLoadingState) {
        setState("loading");
      }
      setError(null);

      // Verificar estado de conexión
      const statusData = await getWhatsAppStatus();

      if (!isMountedRef.current) return;

      setStatus(statusData);
      setFailureCount(0); // Reset en éxito

      if (statusData.conectado) {
        setState("connected");
        setQrCode(null);
        setQrTimestamp(null);
      } else {
        // Si no está conectado, obtener QR
        const qrData = await getWhatsAppQR();

        if (!isMountedRef.current) return;

        setQrCode(qrData.qr);
        setQrTimestamp(Date.now());
        setState("disconnected");
      }
    } catch (err: any) {
      // Ignorar errores de cancelación
      if (err?.name === "AbortError") {
        return;
      }

      if (!isMountedRef.current) return;

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Servicio de WhatsApp no disponible";
      setError(errorMessage);
      setState("error");
      setFailureCount((prev) => prev + 1);

      present({
        message: errorMessage,
        duration: 3000,
        color: "danger",
        cssClass: "toast-error",
      });
    }
  };

  /**
   * Inicia el polling para verificar el estado automáticamente
   * Optimizado: Solo verifica status (no obtiene QR en cada poll)
   * Implementa backoff exponencial en caso de fallos
   */
  const startPolling = () => {
    console.log("[WhatsApp-Debug] Iniciando polling...");

    // Siempre detener polling anterior primero
    stopPolling();

    // Calcular intervalo con backoff exponencial
    const baseInterval = 5000;
    const backoffMultiplier = Math.min(
      Math.pow(2, Math.floor(failureCount / 3)),
      8
    );
    const interval = baseInterval * backoffMultiplier;

    pollingIntervalRef.current = setInterval(async () => {
      try {
        // Solo verificar status (no obtener QR cada vez)
        const statusData = await getWhatsAppStatus();

        if (!isMountedRef.current) {
          stopPolling();
          return;
        }

        setStatus(statusData);
        setFailureCount(0); // Reset en éxito

        // Si está conectado ahora
        if (statusData.conectado) {
          console.log("WhatsApp connected successfully");
          setState("connected");
          setQrCode(null);
          setQrTimestamp(null);
          stopPolling();

          present({
            message: "¡WhatsApp conectado exitosamente!",
            duration: 3000,
            color: "success",
            cssClass: "toast-success",
          });
        }
        // Si sigue desconectado, el QR ya está cargado (no recargar)
      } catch (err: any) {
        console.error("Polling error:", err);

        if (!isMountedRef.current) return;

        const newFailureCount = failureCount + 1;
        setFailureCount(newFailureCount);

        // Después de 3 fallos consecutivos, reiniciar con backoff
        if (newFailureCount % 3 === 0) {
          stopPolling();
          setTimeout(() => {
            if (isMountedRef.current && state === "disconnected") {
              startPolling();
            }
          }, 1000);
        }
      }
    }, interval);
  };

  /**
   * Detiene el polling de forma segura
   */
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  /**
   * Maneja la desvinculación del dispositivo
   * IMPORTANTE: Después de desvincular, el microservicio borra las credenciales
   * pero NO reinicia automáticamente. Debemos llamar a /iniciar para generar nuevo QR.
   */
  const handleDesvincular = async () => {
    console.log("Starting WhatsApp unlinking process");

    try {
      // Paso 1: Mostrar loading y detener polling
      setState("loading");
      stopPolling();

      // Paso 2: Llamar API de desvinculación
      const result = await desvincularWhatsApp();

      if (!isMountedRef.current) return;

      if (!result.ok) {
        throw new Error(result.mensaje || "Error al desvincular dispositivo");
      }

      // Paso 3: Desvinculación exitosa
      console.log("WhatsApp unlinked successfully");

      setQrCode(null);
      setQrTimestamp(null);
      setFailureCount(0);
      setStatus({ conectado: false });
      setState("loading");

      present({
        message: "Dispositivo desvinculado. Generando nuevo QR...",
        duration: 5000,
        color: "success",
        cssClass: "toast-success",
      });

      // Paso 4: Esperar inicial para que comience la limpieza
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (!isMountedRef.current) return;

      // Paso 5: POLLING hasta confirmar desconexión real (máx 10 intentos)
      console.log("Polling for disconnection confirmation...");
      let isReallyDisconnected = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isReallyDisconnected && attempts < maxAttempts) {
        attempts++;

        const checkStatus = await getWhatsAppStatus();

        if (!checkStatus.conectado) {
          isReallyDisconnected = true;
          console.log("Disconnection confirmed");
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (!isMountedRef.current) return;
      }

      if (!isReallyDisconnected) {
        console.error("Timeout: could not confirm disconnection in 20s");
        setState("error");
        setError(
          "El microservicio no completó la desvinculación. Credenciales cacheadas. Ejecuta: docker restart whatsapp-ms"
        );
        return;
      }

      // Paso 6: POLLING hasta que aparezca el QR (máx 15 intentos = 30s)
      console.log("Polling for new QR code...");
      let qrGenerated = false;
      let qrAttempts = 0;
      const maxQRAttempts = 15;

      while (!qrGenerated && qrAttempts < maxQRAttempts) {
        qrAttempts++;

        try {
          const qrData = await getWhatsAppQR();

          if (qrData.qr) {
            console.log(`QR code generated after ${qrAttempts} attempts`);
            setQrCode(qrData.qr);
            setQrTimestamp(Date.now());
            setState("disconnected");
            setStatus({ conectado: false });
            qrGenerated = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        } catch (err) {
          console.warn("Error fetching QR:", err);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (!isMountedRef.current) return;
      }

      if (!qrGenerated) {
        console.error("Timeout: QR not generated in 30s");
        setState("error");
        setError(
          "El microservicio no generó un QR después de desvinculación. Recarga la página o reinicia: docker restart whatsapp-ms"
        );
        return;
      }

      // Paso 7: Iniciar polling para detectar cuando escaneen el QR
      console.log("Starting status polling");
      startPolling();
    } catch (err) {
      console.error("Error during unlinking:", err);

      if (!isMountedRef.current) return;

      const errorMessage =
        err instanceof Error ? err.message : "Error al desvincular dispositivo";

      setState("error");
      setError(errorMessage);

      present({
        message: errorMessage,
        duration: 3000,
        color: "danger",
        cssClass: "toast-error",
      });

      // Intentar recargar el estado actual después de un error
      setTimeout(() => {
        if (isMountedRef.current) {
          loadWhatsAppData();
        }
      }, 3000);
    }
  };

  /**
   * Maneja el refresco manual
   */
  const handleRefresh = async () => {
    console.log("[WhatsApp-Debug] Refresco manual solicitado");
    setFailureCount(0); // Reset contador de fallos
    await loadWhatsAppData();
  };

  /**
   * Efecto para carga inicial y configuración de polling
   */
  useEffect(() => {
    console.log("[WhatsApp-Debug] Componente montado");
    isMountedRef.current = true;

    loadWhatsAppData();
    startPolling();

    // Cleanup al desmontar
    return () => {
      console.log("[WhatsApp-Debug] Componente desmontado - limpiando...");
      isMountedRef.current = false;
      stopPolling();

      // Cancelar requests en curso
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Efecto para ajustar polling según el estado
   * Simplificado para evitar race conditions
   */
  useEffect(() => {
    console.log("[WhatsApp-Debug] Cambio de estado:", state);

    // Si está conectado o en error, detener polling
    if (state === "connected" || state === "error") {
      stopPolling();
    }
    // Si está desconectado, asegurar que polling esté activo
    else if (state === "disconnected") {
      if (!pollingIntervalRef.current) {
        console.log(
          "[WhatsApp-Debug] Estado desconectado sin polling, iniciando..."
        );
        startPolling();
      }
    }
  }, [state]);

  /**
   * Renderiza el contenido según el estado
   */
  const renderContent = () => {
    switch (state) {
      case "loading":
        return (
          <div className="whatsapp-loading-container">
            <IonSpinner name="crescent" />
            <IonText color="medium">
              <p>Cargando información de WhatsApp...</p>
            </IonText>
          </div>
        );

      case "error":
        return (
          <div className="whatsapp-error-container">
            <IonIcon icon={closeCircle} color="danger" size="large" />
            <IonText color="danger">
              <h3>Error de conexión</h3>
              <p>{error}</p>
            </IonText>
            <IonButton expand="block" fill="outline" onClick={handleRefresh}>
              <IonIcon slot="start" icon={refreshOutline} />
              Reintentar
            </IonButton>
          </div>
        );

      case "connected":
        return (
          <div className="whatsapp-status-container whatsapp-success">
            <IonIcon icon={checkmarkCircle} color="success" size="large" />
            <IonBadge color="success">Conectado</IonBadge>
            <IonText color="dark">
              <h3>WhatsApp conectado correctamente</h3>
              <p>
                El servicio de notificaciones está activo y funcionando. Las
                alertas se enviarán automáticamente a los tutores.
              </p>
            </IonText>

            <div className="whatsapp-button-group">
              <IonButton
                expand="block"
                fill="outline"
                onClick={handleRefresh}
                className="whatsapp-action-button"
              >
                <IonIcon slot="start" icon={refreshOutline} />
                Verificar estado
              </IonButton>

              <IonButton
                expand="block"
                color="danger"
                fill="outline"
                onClick={() => setShowAlert(true)}
                className="whatsapp-action-button"
              >
                <IonIcon slot="start" icon={logOutOutline} />
                Desvincular dispositivo
              </IonButton>
            </div>
          </div>
        );

      case "disconnected":
        return (
          <div className="whatsapp-qr-container">
            <IonBadge color="warning">Desconectado</IonBadge>

            {qrCode ? (
              <>
                <IonText color="dark">
                  <h3>Escanea el código QR</h3>
                  <p className="whatsapp-qr-instructions">
                    1. Abre WhatsApp en tu teléfono
                    <br />
                    2. Ve a <strong>Ajustes</strong> →{" "}
                    <strong>Dispositivos vinculados</strong>
                    <br />
                    3. Toca <strong>Vincular un dispositivo</strong>
                    <br />
                    4. Escanea este código QR
                  </p>
                </IonText>

                <div className="whatsapp-qr-code-wrapper">
                  <QRCode value={qrCode} size={280} />
                </div>

                {/* Indicador de edad del QR */}
                {qrAge > 40 && (
                  <IonText color="warning">
                    <div className="whatsapp-qr-warning">
                      <IonIcon icon={warningOutline} />
                      <p>
                        Este código puede haber expirado ({qrAge}s). Si no
                        funciona, haz clic en &quot;Recargar QR&quot;.
                      </p>
                    </div>
                  </IonText>
                )}

                <IonText color="medium">
                  <p className="whatsapp-qr-hint">
                    El estado se verifica automáticamente cada{" "}
                    {Math.max(
                      5,
                      Math.floor(
                        5 *
                          Math.min(Math.pow(2, Math.floor(failureCount / 3)), 8)
                      )
                    )}
                    s{qrAge > 0 && ` • Edad del código: ${qrAge}s`}
                  </p>
                </IonText>
              </>
            ) : (
              <IonText color="medium">
                <p>No hay código QR disponible en este momento.</p>
              </IonText>
            )}

            <IonButton expand="block" onClick={handleRefresh}>
              <IonIcon slot="start" icon={refreshOutline} />
              Recargar QR
            </IonButton>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <IonCard className="whatsapp-card">
        <IonCardHeader>
          <div className="whatsapp-card-header-content">
            <IonIcon
              icon={logoWhatsapp}
              className="whatsapp-icon"
              color="success"
            />
            <IonCardTitle>Conexión WhatsApp</IonCardTitle>
          </div>
        </IonCardHeader>

        <IonCardContent>{renderContent()}</IonCardContent>
      </IonCard>

      {/* Alert de confirmación para desvincular */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass="alert-warning"
        header="⚠️ Desvincular dispositivo"
        subHeader="Esta acción cerrará la sesión de WhatsApp"
        message="¿Estás seguro de que deseas desvincular este dispositivo? Deberás escanear un nuevo código QR para reconectar."
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "alert-button-cancel",
          },
          {
            text: "Sí, desvincular",
            role: "confirm",
            cssClass: "alert-button-destructive",
            handler: handleDesvincular,
          },
        ]}
      />
    </>
  );
};

export default VinculacionWhatsApp;
