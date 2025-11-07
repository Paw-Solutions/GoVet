import { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonSpinner,
  useIonToast,
} from "@ionic/react";
import { closeOutline, saveOutline } from "ionicons/icons";
import { editarCita, type Cita, type CitaUpdate } from "../../api/citas";

interface ModalEditarCitaProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita;
  onCitaActualizada: () => void;
}

const ModalEditarCita: React.FC<ModalEditarCitaProps> = ({
  isOpen,
  onClose,
  cita,
  onCitaActualizada,
}) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const [fechaHora, setFechaHora] = useState(cita.fecha_hora);
  const [motivo, setMotivo] = useState(cita.motivo);
  const [notas, setNotas] = useState(cita.notas || "");
  const [estado, setEstado] = useState(cita.estado);

  const handleGuardar = async () => {
    if (!motivo.trim()) {
      present({
        message: "El motivo no puede estar vacío",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const citaActualizada: CitaUpdate = {
        fecha_hora: fechaHora,
        motivo: motivo,
        notas: notas || undefined,
        estado: estado,
      };

      await editarCita(cita.id_cita, citaActualizada);

      present({
        message: "Cita actualizada exitosamente",
        duration: 3000,
        color: "success",
        icon: saveOutline,
      });

      onCitaActualizada();
      onClose();
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      present({
        message: "Error al actualizar la cita",
        duration: 3000,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar Cita</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose} disabled={loading}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Información del tutor (no editable) */}
        <div className="info-section">
          <h3>Información del Tutor</h3>
          <IonItem lines="none">
            <IonLabel>
              <h2>
                {cita.tutor_nombre} {cita.tutor_apellido_paterno}{" "}
                {cita.tutor_apellido_materno}
              </h2>
              <p>RUT: {cita.rut_tutor}</p>
              {cita.tutor_telefono && <p>Teléfono: {cita.tutor_telefono}</p>}
              {cita.tutor_email && <p>Email: {cita.tutor_email}</p>}
            </IonLabel>
          </IonItem>
        </div>

        {/* Pacientes (no editable en este modal) */}
        <div className="info-section">
          <h3>Pacientes</h3>
          <IonItem lines="none">
            <IonLabel>
              {cita.pacientes.map((p) => p.nombre).join(", ")}
            </IonLabel>
          </IonItem>
        </div>

        {/* Fecha y hora */}
        <div className="form-section">
          <h3>Fecha y Hora</h3>
          <IonDatetime
            value={fechaHora}
            onIonChange={(e) => setFechaHora(e.detail.value as string)}
            presentation="date-time"
            locale="es-CL"
            min={new Date().toISOString()}
          />
        </div>

        {/* Estado */}
        <IonItem>
          <IonLabel position="stacked">Estado</IonLabel>
          <IonSelect
            value={estado}
            onIonChange={(e) => setEstado(e.detail.value)}
          >
            <IonSelectOption value="programada">Programada</IonSelectOption>
            <IonSelectOption value="confirmada">Confirmada</IonSelectOption>
            <IonSelectOption value="completada">Completada</IonSelectOption>
            <IonSelectOption value="cancelada">Cancelada</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* Motivo */}
        <IonItem>
          <IonLabel position="stacked">
            Motivo <span className="required">*</span>
          </IonLabel>
          <IonInput
            value={motivo}
            onIonInput={(e) => setMotivo(e.detail.value || "")}
            placeholder="Motivo de la cita"
          />
        </IonItem>

        {/* Notas */}
        <IonItem>
          <IonLabel position="stacked">Notas</IonLabel>
          <IonTextarea
            value={notas}
            onIonInput={(e) => setNotas(e.detail.value || "")}
            placeholder="Notas adicionales..."
            rows={4}
          />
        </IonItem>

        {/* Botones */}
        <div className="modal-botones mt-4">
          <IonButton
            expand="block"
            fill="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </IonButton>

          <IonButton expand="block" onClick={handleGuardar} disabled={loading}>
            {loading ? (
              <>
                <IonSpinner name="crescent" />
                Guardando...
              </>
            ) : (
              <>
                <IonIcon icon={saveOutline} slot="start" />
                Guardar Cambios
              </>
            )}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalEditarCita;
