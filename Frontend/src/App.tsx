import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import BarraLateral from "./components/BarraLateral";
import Home from "./pages/home";
import RegistroTutor from "./pages/registroTutor";
import RegistroPaciente from "./pages/registroPaciente";
import VerTutores from "./pages/ver";
import Calendario from "./pages/calendario";
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
import RellenarFicha from "./pages/rellenarFicha";
import ModalEscogerPaciente from "./components/rellenarFicha/modalEscogerPaciente";
import Ver from "./pages/ver";

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

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <BarraLateral />
      <IonRouterOutlet id="main-content">
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/registro-tutor" component={RegistroTutor}></Route>
        <Route exact path="/ver" component={Ver}></Route>
        <Route
          exact
          path="/registro-paciente"
          component={RegistroPaciente}
        ></Route>
        <Route exact path="/rellenar-ficha" component={RellenarFicha}></Route>
        <Route exact path="/calendario" component={Calendario}></Route>
        <Route exact path="/test" component={ModalEscogerPaciente}></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
