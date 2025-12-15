import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { logoGoogle, pawOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { renderGoogleButton } from "../utils/googleAuth";

import "../styles/login.css";

const Login: React.FC = () => {
  const history = useHistory();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await renderGoogleButton("gsi-login-container", (token) => {
        // Persistir el token en el contexto
        loginWithToken(token);
        // Redirigir al home después del login exitoso
        history.push("/");
      });
    } catch (e: any) {
      setError(e?.message || "Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen={true} className="login-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Iniciar Sesión</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="login-container">
          {/* Logo y marca */}
          <div className="login-brand">
            <IonIcon icon={pawOutline} className="login-logo-icon" />
            <h1 className="login-title">GoVet</h1>
            <IonText color="medium">
              <p className="login-subtitle">Sistema de Gestión Veterinaria</p>
            </IonText>
          </div>

          {/* Card de login */}
          <IonCard className="login-card">
            <IonCardHeader>
              <IonCardTitle>Bienvenido</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText color="medium">
                <p className="login-description">
                  Inicia sesión con tu cuenta de Google para acceder al sistema
                </p>
              </IonText>

              {/* Botón de Google */}
              <div className="login-button-container">
                <IonButton
                  expand="block"
                  className="google-login-button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <IonSpinner name="crescent" />
                  ) : (
                    <>
                      <IonIcon icon={logoGoogle} slot="start" />
                      Iniciar sesión con Google
                    </>
                  )}
                </IonButton>

                {/* Contenedor para el botón de Google One Tap */}
                <div id="gsi-login-container" className="gsi-container" />
              </div>

              {/* Mensaje de error */}
              {error && (
                <IonText color="danger">
                  <p className="login-error">{error}</p>
                </IonText>
              )}
            </IonCardContent>
          </IonCard>

          {/* Footer informativo */}
          {/*<div className="login-footer">
            <IonText color="medium">
              <p className="login-footer-text">
                Al iniciar sesión, aceptas nuestros términos de servicio y
                política de privacidad
              </p>
            </IonText>
          </div>*/}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
