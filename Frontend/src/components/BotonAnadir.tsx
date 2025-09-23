import React, { useState } from "react";
import { IonButton, IonIcon, IonPopover } from "@ionic/react";
import {
  addOutline,
  personAddOutline,
  pawOutline,
  timeOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "../styles/botonAnadir.css";

interface OpcionMenu {
  value: string;
  label: string;
  icon?: string;
  ruta?: string;
}

interface BotonAnadirProps {
  onClick?: () => void;
  icon?: string;
  className?: string;
  disabled?: boolean;
  color?: string;
  opciones?: OpcionMenu[];
  onSeleccionarOpcion?: (valor: string) => void;
  tieneSelect?: boolean;
  tipo?: "simple" | "opcionesDefault"; // Cambiado de 'veterinaria' a 'opcionesDefault'
}

const BotonAnadir: React.FC<BotonAnadirProps> = ({
  onClick,
  icon = addOutline,
  className = "",
  disabled = false,
  color = "#c757c0",
  opciones = [],
  onSeleccionarOpcion,
  tieneSelect = false,
  tipo = "opcionesDefault", // Cambiado valor por defecto
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  // Opciones predefinidas por defecto
  const opcionesDefault: OpcionMenu[] = [
    {
      value: "registro-tutor",
      label: "Registrar Tutor",
      icon: personAddOutline,
      ruta: "/registro-tutor",
    },
    {
      value: "registro-paciente",
      label: "Registrar Paciente",
      icon: pawOutline,
      ruta: "/registro-paciente",
    },
    {
      value: "ver-tutores",
      label: "Ver Tutores",
      icon: timeOutline,
      ruta: "/ver-tutores",
    },
  ];

  // Seleccionar opciones según el tipo
  const opcionesActuales =
    opciones.length > 0
      ? opciones
      : tipo === "opcionesDefault"
      ? opcionesDefault
      : [];

  const handleSeleccion = (opcion: OpcionMenu) => {
    // Si hay callback personalizado, usarlo
    if (onSeleccionarOpcion) {
      onSeleccionarOpcion(opcion.value);
    }
    // Si no hay callback pero hay ruta, navegar automáticamente
    else if (opcion.ruta) {
      history.push(opcion.ruta);
    }

    setIsOpen(false);
  };

  // Si tiene select habilitado o hay opciones disponibles
  if (tieneSelect || opcionesActuales.length > 0) {
    return (
      <div className="boton-anadir-container">
        <IonButton
          id="trigger-button"
          className={`boton-anadir ${className}`}
          disabled={disabled}
          style={{ "--background": color }}
          onClick={() => setIsOpen(true)}
        >
          <IonIcon slot="icon-only" icon={addOutline} />
        </IonButton>

        <IonPopover
          trigger="trigger-button"
          isOpen={isOpen}
          onDidDismiss={() => setIsOpen(false)}
          showBackdrop={true}
          side="top"
          alignment="end"
        >
          <div className="popover-content">
            {opcionesActuales.map((opcion, index) => (
              <IonButton
                key={index}
                fill="solid"
                expand="block"
                onClick={() => handleSeleccion(opcion)}
                className="opcion-menu"
              >
                {opcion.icon && <IonIcon icon={opcion.icon} slot="start" />}
                <span>{opcion.label}</span>
              </IonButton>
            ))}
          </div>
        </IonPopover>
      </div>
    );
  }

  // Botón normal sin select
  return (
    <IonButton
      className={`boton-anadir ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ "--background": color }}
    >
      <IonIcon slot="icon-only" icon={icon} />
    </IonButton>
  );
};

export default BotonAnadir;
