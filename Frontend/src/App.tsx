import { Redirect, Route } from "react-router-dom";
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
import Home from "./pages/home"; // Home no lazy - es la landing page
import { registerServiceWorker } from "./utils/serviceWorker";
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

// Lazy load de páginas secundarias
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
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/">
              <Home />
            </Route>
            <Suspense fallback={<PageLoader />}>
              <Route
                exact
                path="/registro-tutor"
                component={RegistroTutor}
              ></Route>
              <Route exact path="/ver" component={Ver}></Route>
              <Route
                exact
                path="/registro-paciente"
                component={RegistroPaciente}
              ></Route>
              <Route
                exact
                path="/rellenar-ficha"
                component={RellenarFicha}
              ></Route>
              <Route exact path="/calendario" component={Calendario}></Route>
              <Route exact path="/ajustes" component={Ajustes}></Route>
              <Route
                exact
                path="/test"
                component={ModalEscogerPaciente}
              ></Route>
            </Suspense>
          </IonRouterOutlet>
          <BottomTabs />
        </IonTabs>
        {/* Indicadores PWA: Offline, Actualizaciones */}
        <PWAStatus /> 
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
