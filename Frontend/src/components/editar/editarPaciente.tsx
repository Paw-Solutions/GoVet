import React, { useEffect, useState } from "react";
import {
  IonModal, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonInput, IonItem, IonLabel,
  IonToggle,
} from "@ionic/react";
import { PacienteData } from "../../api/pacientes";
// import { actualizarPaciente } from "../../api/pacientes"; // si la tienes

interface ModalEditarPacienteProps {
  isOpen: boolean;
  onDismiss: () => void;
  paciente: PacienteData | null;

}

const ModalEditarPaciente: React.FC<ModalEditarPacienteProps> = ({
  isOpen,
  onDismiss,
  paciente,
}) => {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [sexo, setSexo] = useState("");
  const [esterilizado, setEsterilizado] = useState(false);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [codigoChip, setCodigoChip] = useState("");


  useEffect(() => {
    if (paciente) {
      setNombre(paciente.nombre ?? "");
      setColor(paciente.color ?? "");
      setSexo(paciente.sexo ?? "");
      setEsterilizado(paciente.esterilizado ?? false);
      setFechaNacimiento(paciente.fecha_nacimiento ?? "");
      setCodigoChip(paciente.codigo_chip ?? "");
    }
  }, [paciente]);

  const handleGuardar = async () => {
    if (!paciente) return;

    const actualizado: PacienteData = {
      ...paciente,
      nombre,
      color,
      sexo,
      esterilizado,
    };

    // 1) Persistir en backend (si tienes endpoint)
    // await actualizarPaciente(actualizado);

    // 2) Cerrar modal
    onDismiss();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar paciente</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput
            value={nombre}
            placeholder="Nombre del paciente"
            onIonInput={(e) => setNombre(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Color</IonLabel>
          <IonInput
            value={color}
            placeholder="Color"
            onIonInput={(e) => setColor(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Sexo</IonLabel>
          <IonInput
            value={sexo}
            placeholder="M"
            onIonInput={(e) => setSexo(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
            <IonLabel>Esterilizado</IonLabel>
            <IonToggle
                checked={esterilizado}
                onIonChange={(e) => setEsterilizado(e.detail.checked)}
            />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Fecha de nacimiento</IonLabel>
          <IonInput
            value={fechaNacimiento}
            placeholder=""
            onIonInput={(e) => setFechaNacimiento(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Codigo de chip</IonLabel>
          <IonInput
            value={codigoChip}
            placeholder=""
            onIonInput={(e) => setCodigoChip(e.detail.value ?? "")}
          />
        </IonItem>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <IonButton onClick={handleGuardar}>Guardar</IonButton>
          <IonButton fill="clear" onClick={onDismiss}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalEditarPaciente;