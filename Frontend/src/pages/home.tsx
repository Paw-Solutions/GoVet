import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonSpinner,
  IonText,
} from "@ionic/react";
import {
  add,
  logoApple,
  pawOutline,
  personAddOutline,
  settingsSharp,
  timeOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/home.css";

const Home: React.FC = () => {
  const history = useHistory();
  const API_URL = import.meta.env.VITE_API_URL; // usa tu variable de entorno

  // Estado para los últimos tutores
  const [ultimosTutores, setUltimosTutores] = useState<any[]>([]);
  const [loadingTutores, setLoadingTutores] = useState(false);
  const [errorTutores, setErrorTutores] = useState("");

  // Función para cargar los últimos tutores
  const cargarUltimosTutores = async () => {
    try {
      setLoadingTutores(true);
      setErrorTutores("");
      const response = await fetch(`${API_URL}/tutores/`);

      if (response.ok) {
        const tutores = await response.json();
        // Mostrar solo los últimos 3 tutores
        setUltimosTutores(tutores.slice(-3).reverse());
      } else {
        setErrorTutores("No se pudieron cargar los tutores");
      }
    } catch (error) {
      setErrorTutores("Error de conexión");
    } finally {
      setLoadingTutores(false);
    }
  };

  // Cargar tutores al montar el componente
  useEffect(() => {
    cargarUltimosTutores();
  }, []);

  const navegarARegistroTutor = () => {
    history.push("/registro-tutor");
  };

  const navegarARegistroPaciente = () => {
    history.push("/registro-paciente");
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inicio</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow className="button-row">
            <IonCol>
              <IonItem>
              <IonButton
                className="custom-button"
                expand="block"
                onClick={navegarARegistroTutor}
                style={{ margin: "10px 0" }}
              >
                <IonIcon
                  className="button-icon"
                  slot="start"
                  icon={personAddOutline}
                ></IonIcon>
                Registro Tutor
              </IonButton>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonButton
                className="custom-button"
                expand="block"
                onClick={navegarARegistroPaciente}
                style={{ margin: "10px 0" }}
              >
                <IonIcon
                  className="button-icon"
                  slot="start"
                  icon={pawOutline}
                ></IonIcon>
                Registro Paciente
              </IonButton>
            </IonCol>
          </IonRow>
          {/* Recuadro de últimos tutores registrados */}
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon
                      icon={timeOutline}
                      style={{ marginRight: "8px" }}
                    />
                    Últimos Tutores Registrados
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  {loadingTutores ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <IonSpinner />
                      <IonText>
                        <p>Cargando tutores...</p>
                      </IonText>
                    </div>
                  ) : errorTutores ? (
                    <IonText color="danger">
                      <p>{errorTutores}</p>
                    </IonText>
                  ) : ultimosTutores.length === 0 ? (
                    <IonText color="medium">
                      <p>No hay tutores registrados aún</p>
                    </IonText>
                  ) : (
                    <IonList>
                      {ultimosTutores.map((tutor, index) => (
                        <IonItem key={tutor.rut || index} lines="inset">
                          <IonLabel>
                            <h2>
                              {tutor.nombre} {tutor.apellido_paterno}
                            </h2>
                            <p>RUT: {tutor.rut}</p>
                            <p>Email: {tutor.email}</p>
                            <p>
                              Comuna: {tutor.comuna}, {tutor.region}
                            </p>
                          </IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  )}

                  {/* Botón para actualizar la lista */}
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={cargarUltimosTutores}
                    style={{ marginTop: "0.625rem" }}
                  >
                    <IonIcon icon={timeOutline} slot="start" />
                    Actualizar
                  </IonButton>
                  <IonButton
                    className="custom-button"
                    expand="block"
                    onClick={navegarARegistroTutor}
                    style={{ margin: "10px 0" }}
                  >
                    <IonIcon
                      className="button-icon"
                      slot="start"
                      icon={personAddOutline}
                    ></IonIcon>
                    Registro Tutor
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
