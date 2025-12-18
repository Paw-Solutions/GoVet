import { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import VistaDia from "../components/calendario/VistaDia";
import VistaSemana from "../components/calendario/VistaSemana";
import VistaMes from "../components/calendario/VistaMes";
import ModalAgendarCita from "../components/calendario/ModalAgendarCita";
import "../styles/calendario.css";
// Componente: Interfaz para gestionar horas y vista calendario
type VistaType = "dia" | "semana" | "mes";

const Calendario: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<VistaType>("semana");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mostrarModalAgendar, setMostrarModalAgendar] = useState(false);
  const location = useLocation();

  // Detectar si se debe abrir el modal desde URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("abrirModal") === "true") {
      setMostrarModalAgendar(true);
    }
  }, [location]);

  const handleVistaChange = (e: CustomEvent) => {
    setVistaActual(e.detail.value as VistaType);
  };

  const renderVista = () => {
    switch (vistaActual) {
      case "dia":
        return (
          <VistaDia
            fecha={fechaSeleccionada}
            onCambiarFecha={setFechaSeleccionada}
          />
        );
      case "semana":
        return (
          <VistaSemana
            fecha={fechaSeleccionada}
            onCambiarFecha={setFechaSeleccionada}
            onSeleccionarDia={(fecha: Date) => {
              setFechaSeleccionada(fecha);
              setVistaActual("dia");
            }}
          />
        );
      case "mes":
        return (
          <VistaMes
            fecha={fechaSeleccionada}
            onCambiarFecha={setFechaSeleccionada}
            onSeleccionarDia={(fecha: Date) => {
              setFechaSeleccionada(fecha);
              setVistaActual("dia");
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <IonPage>
      <PageHeader title="Calendario de Citas" />

      <IonContent fullscreen>
        <div className="calendario-container">
          {/* Selector de vista */}
          <div className="calendario-segmento">
            <IonSegment
              value={vistaActual}
              onIonChange={handleVistaChange}
              className="vista-selector"
            >
              <IonSegmentButton value="dia">
                <IonLabel>Día</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="semana">
                <IonLabel>Semana</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="mes">
                <IonLabel>Mes</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          {/* Vista del calendario */}
          <div className="calendario-vista">{renderVista()}</div>
        </div>

        {/* Modal para agendar nueva cita */}
        <ModalAgendarCita
          isOpen={mostrarModalAgendar}
          onClose={() => setMostrarModalAgendar(false)}
          fechaInicial={fechaSeleccionada}
          onCitaCreada={() => {
            // Aquí se refrescaría la vista
            setMostrarModalAgendar(false);
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Calendario;
