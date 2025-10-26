import React, { useEffect, useState } from "react";
import {
  IonModal, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonInput, IonItem, IonLabel,
  IonToggle,
} from "@ionic/react";
import { PacienteData, actualizarTutorDePaciente, actualizarPaciente, type PacienteCreate } from "../../api/pacientes";
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
  const [rutTutor, setRutTutor] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  useEffect(() => {
    if (paciente) {
      setNombre(paciente.nombre ?? "");
      setColor(paciente.color ?? "");
      setSexo(paciente.sexo ?? "");
      setEsterilizado(paciente.esterilizado ?? false);
      setFechaNacimiento(paciente.fecha_nacimiento ?? "");
      setCodigoChip(paciente.codigo_chip ?? "");
      setRutTutor(paciente.tutor?.rut ?? "");
      setErrorMsg(null);
      setSaving(false);
    }
  }, [paciente, isOpen]);

  const handleGuardar = async () => {
    if (!paciente) return;

    try {
      setSaving(true);
      setErrorMsg(null);

      // Validaciones mínimas
      if (paciente.id_raza == null) {
        throw new Error(
          "Este paciente no tiene id_raza definido. No es posible actualizar sin una raza."
        );
      }
      // Normaliza fecha a YYYY-MM-DD si el usuario puso algo distinto
      const fechaNorm = (fechaNacimiento || "").trim();
      // Normaliza sexo 
      const sexoNorm = (sexo || "").trim().toLowerCase(); // 'm' | 'h'

      // 1) Actualizar datos “base” del paciente
      const payload: PacienteCreate = {
        nombre: nombre.trim(),
        id_raza: paciente.id_raza,              // Conserva la raza actual
        sexo: sexoNorm,                         // 'm' o 'h'
        color: color.trim(),
        fecha_nacimiento: fechaNorm,            // YYYY-MM-DD
        codigo_chip: codigoChip.trim() || undefined,
        esterilizado,
      };

      await actualizarPaciente(paciente.id_paciente, payload);

      // 2) Actualizar tutor si cambió el RUT
      const rutActual = paciente.tutor?.rut || "";
      const rutNuevo = rutTutor.trim();
      if (rutNuevo && rutNuevo !== rutActual) {
        await actualizarTutorDePaciente(paciente.id_paciente, rutNuevo);
      }

      // 3) Refrescar la lista (evento global que ya escuchas en Ver.tsx)
      window.dispatchEvent(new CustomEvent("pacientes:updated"));

      // 4) Cerrar modal
      onDismiss();
    } catch (err: any) {
      setErrorMsg(err?.message || "No fue posible guardar los cambios.");
    } finally {
      setSaving(false);
    }
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

        {/* RUT del Tutor*/}
        <IonItem>
          <IonLabel position="stacked">RUT del tutor</IonLabel>
          <IonInput
            value={rutTutor}
            placeholder="12.345.678-9"
            onIonInput={(e) => setRutTutor(e.detail.value ?? "")}
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
            placeholder="m: macho | h: hembra"
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
            placeholder="YYYY-MM-DD"
            onIonInput={(e) => setFechaNacimiento(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Codigo de chip</IonLabel>
          <IonInput
            value={codigoChip}
            placeholder="Opcional"
            onIonInput={(e) => setCodigoChip(e.detail.value ?? "")}
          />
        </IonItem>

        {errorMsg && (
          <div style={{ color: "var(--ion-color-danger)", marginTop: 8 }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <IonButton onClick={handleGuardar} disabled={saving || !paciente}>
            {saving ? "Guardando..." : "Guardar"}
          </IonButton>
          <IonButton fill="clear" onClick={onDismiss} disabled={saving}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalEditarPaciente;