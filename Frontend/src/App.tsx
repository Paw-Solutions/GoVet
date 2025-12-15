import { Redirect, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonSpinner,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import BottomTabs from "./components/BottomTabs";
import PWAStatus from "./components/PWAStatus";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login"; // Página de login - NO lazy, es la landing page
import { registerServiceWorker } from "./utils/serviceWorker";
import { useAuth } from "./hooks/useAuth";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* GoVet Design System - Sistema consolidado de estilos */
import "./styles/index.css";

// Lazy load de todas las páginas protegidas
const Home = lazy(() => import("./pages/home"));
const RegistroTutor = lazy(() => import("./pages/registroTutor"));
const RegistroPaciente = lazy(() => import("./pages/registroPaciente"));
const Ver = lazy(() => import("./pages/ver"));
const Calendario = lazy(() => import("./pages/calendario"));
const RellenarFicha = lazy(() => import("./pages/rellenarFicha"));
const Ajustes = lazy(() => import("./pages/Ajustes"));
const ModalEscogerPaciente = lazy(
  () => import("./components/rellenarFicha/modalEscogerPaciente")
);

// Loading fallback
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "var(--background-color)",
    }}
  >
    <IonSpinner
      name="crescent"
      color="primary"
      style={{ width: "48px", height: "48px" }}
    />
  </div>
);

/*
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
/*import "@ionic/react/css/palettes/dark.system.css"; */

/* Theme variables */
/*import "./theme/variables.css"; */

setupIonicReact();

/**
 * Componente interno para manejar la lógica de rutas
 * Permite usar useLocation dentro del Router
 */
const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Ocultar tabs en la página de login
  const showTabs = location.pathname !== "/login";

  // Mostrar spinner mientras se verifica la autenticación inicial
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {showTabs ? (
        <IonTabs>
          <IonRouterOutlet>
            {/* Ruta raíz - redirige según autenticación */}
            <Route exact path="/">
              {isAuthenticated ? (
                <Redirect to="/home" />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            {/* Rutas protegidas */}
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute exact path="/home" component={Home} />
              <ProtectedRoute
                exact
                path="/registro-tutor"
                component={RegistroTutor}
              />
              <ProtectedRoute exact path="/ver" component={Ver} />
              <ProtectedRoute
                exact
                path="/registro-paciente"
                component={RegistroPaciente}
              />
              <ProtectedRoute
                exact
                path="/rellenar-ficha"
                component={RellenarFicha}
              />
              <ProtectedRoute exact path="/calendario" component={Calendario} />
              <ProtectedRoute exact path="/ajustes" component={Ajustes} />
              <ProtectedRoute
                exact
                path="/test"
                component={ModalEscogerPaciente}
              />
            </Suspense>
          </IonRouterOutlet>
          <BottomTabs />
        </IonTabs>
      ) : (
        <IonRouterOutlet>
          {/* Ruta pública - Login */}
          <Route exact path="/login">
            <Login />
          </Route>
          {/* Redirigir cualquier otra ruta a login si no está autenticado */}
          <Route>
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      )}
    </>
  );
};

const App: React.FC = () => {
  // Registrar Service Worker al montar la app
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      registerServiceWorker()
        .then((registration) => {
          if (registration) {
            console.log("✅ PWA: Service Worker activo");
          }
        })
        .catch((error) => {
          console.error("❌ PWA: Error al registrar Service Worker", error);
        });
    }
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <AppRoutes />
        {/* Indicadores PWA: Offline, Actualizaciones */}
        <PWAStatus />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
