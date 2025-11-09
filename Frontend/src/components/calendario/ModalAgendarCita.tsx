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
  IonChip,
  IonNote,
  IonSpinner,
  useIonToast,
} from "@ionic/react";
import {
  closeOutline,
  checkmarkOutline,
  personOutline,
  pawOutline,
} from "ionicons/icons";
import { crearCita, type CitaCreate } from "../../api/citas";

interface ModalAgendarCitaProps {
  isOpen: boolean;
  onClose: () => void;
  fechaInicial?: Date;
  onCitaCreada: () => void;
}

const ModalAgendarCita: React.FC<ModalAgendarCitaProps> = ({
  isOpen,
  onClose,
  fechaInicial = new Date(),
  onCitaCreada,
}) => {
  const [present] = useIonToast();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [rutTutor, setRutTutor] = useState("");
  const [tutorEncontrado, setTutorEncontrado] = useState(false);
  const [nombreTutor, setNombreTutor] = useState("");

  const [pacientesSeleccionados, setPacientesSeleccionados] = useState<
    number[]
  >([]);
  const [pacientesDisponibles] = useState([
    { id_paciente: 1, nombre: "Firulais", especie: "Perro" },
    { id_paciente: 2, nombre: "Michi", especie: "Gato" },
    { id_paciente: 3, nombre: "Luna", especie: "Gato" },
    { id_paciente: 4, nombre: "Max", especie: "Perro" },
  ]); // Mock data

  const [fechaHora, setFechaHora] = useState(fechaInicial.toISOString());
  const [motivo, setMotivo] = useState("");
  const [notas, setNotas] = useState("");

  const resetForm = () => {
    setPaso(1);
    setRutTutor("");
    setTutorEncontrado(false);
    setNombreTutor("");
    setPacientesSeleccionados([]);
    setFechaHora(new Date().toISOString());
    setMotivo("");
    setNotas("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const buscarTutor = () => {
    // Mock: Simular búsqueda de tutor
    if (rutTutor.trim()) {
      setTutorEncontrado(true);
      setNombreTutor("Juan Pérez González");
      present({
        message: "Tutor encontrado",
        duration: 2000,
        color: "success",
      });
    } else {
      present({
        message: "Ingresa un RUT válido",
        duration: 2000,
        color: "warning",
      });
    }
  };

  const togglePaciente = (id: number) => {
    if (pacientesSeleccionados.includes(id)) {
      setPacientesSeleccionados(pacientesSeleccionados.filter((p) => p !== id));
    } else {
      setPacientesSeleccionados([...pacientesSeleccionados, id]);
    }
  };

  const handleSiguiente = () => {
    if (paso === 1 && !tutorEncontrado) {
      present({
        message: "Debes buscar un tutor primero",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    if (paso === 2 && pacientesSeleccionados.length === 0) {
      present({
        message: "Selecciona al menos un paciente",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    if (paso === 3 && !motivo.trim()) {
      present({
        message: "Ingresa el motivo de la cita",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    setPaso(paso + 1);
  };

  const handleAnterior = () => {
    setPaso(paso - 1);
  };

  const handleCrearCita = async () => {
    setLoading(true);
    try {
      const nuevaCita: CitaCreate = {
        rut_tutor: rutTutor,
        fecha_hora: fechaHora,
        motivo: motivo,
        notas: notas || undefined,
        pacientes_ids: pacientesSeleccionados,
      };

      await crearCita(nuevaCita);

      present({
        message: "Cita agendada exitosamente",
        duration: 3000,
        color: "success",
        icon: checkmarkOutline,
      });

      onCitaCreada();
      handleClose();
    } catch (error) {
      console.error("Error al crear cita:", error);
      present({
        message: "Error al agendar la cita",
        duration: 3000,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPaso1 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <IonIcon icon={personOutline} className="paso-icon" />
        <h3>Buscar Tutor</h3>
        <p>Ingresa el RUT del tutor responsable</p>
      </div>

      <IonItem>
        <IonLabel position="stacked">RUT del Tutor</IonLabel>
        <IonInput
          value={rutTutor}
          onIonInput={(e) => setRutTutor(e.detail.value || "")}
          placeholder="12345678-9"
          disabled={tutorEncontrado}
        />
      </IonItem>

      {!tutorEncontrado ? (
        <IonButton expand="block" onClick={buscarTutor} className="mt-4">
          Buscar Tutor
        </IonButton>
      ) : (
        <div className="tutor-encontrado">
          <IonChip color="success">
            <IonIcon icon={checkmarkOutline} />
            <IonLabel>Tutor: {nombreTutor}</IonLabel>
          </IonChip>
          <IonButton
            fill="clear"
            size="small"
            onClick={() => {
              setTutorEncontrado(false);
              setNombreTutor("");
            }}
          >
            Cambiar tutor
          </IonButton>
        </div>
      )}
    </div>
  );

  const renderPaso2 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <IonIcon icon={pawOutline} className="paso-icon" />
        <h3>Seleccionar Pacientes</h3>
        <p>Elige los pacientes para la cita</p>
      </div>

      <div className="pacientes-lista">
        {pacientesDisponibles.map((paciente) => (
          <IonItem
            key={paciente.id_paciente}
            button
            onClick={() => togglePaciente(paciente.id_paciente)}
            className={
              pacientesSeleccionados.includes(paciente.id_paciente)
                ? "paciente-seleccionado"
                : ""
            }
          >
            <IonIcon icon={pawOutline} slot="start" />
            <IonLabel>
              <h3>{paciente.nombre}</h3>
              <p>{paciente.especie}</p>
            </IonLabel>
            {pacientesSeleccionados.includes(paciente.id_paciente) && (
              <IonIcon icon={checkmarkOutline} slot="end" color="success" />
            )}
          </IonItem>
        ))}
      </div>

      {pacientesSeleccionados.length > 0 && (
        <IonNote className="mt-3">
          {pacientesSeleccionados.length}{" "}
          {pacientesSeleccionados.length === 1
            ? "paciente seleccionado"
            : "pacientes seleccionados"}
        </IonNote>
      )}
    </div>
  );

  const renderPaso3 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <h3>Fecha, Hora y Motivo</h3>
        <p>Selecciona cuándo será la cita y su motivo</p>
      </div>

      <IonDatetime
        value={fechaHora}
        onIonChange={(e) => setFechaHora(e.detail.value as string)}
        presentation="date-time"
        locale="es-CL"
        min={new Date().toISOString()}
      />

      <IonItem className="mt-3">
        <IonLabel position="stacked">
          Motivo de la cita <span className="required">*</span>
        </IonLabel>
        <IonInput
          value={motivo}
          onIonInput={(e) => setMotivo(e.detail.value || "")}
          placeholder="Ej: Vacunación, Control, Revisión..."
        />
      </IonItem>
    </div>
  );

  const renderPaso4 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <h3>Notas y Resumen</h3>
        <p>Información adicional y confirmación</p>
      </div>

      <IonItem>
        <IonLabel position="stacked">Notas adicionales (opcional)</IonLabel>
        <IonTextarea
          value={notas}
          onIonInput={(e) => setNotas(e.detail.value || "")}
          placeholder="Información adicional sobre la cita..."
          rows={4}
        />
      </IonItem>

      {/* Resumen */}
      <div className="resumen-cita">
        <h4>Resumen</h4>
        <div className="resumen-item">
          <strong>Tutor:</strong> {nombreTutor}
        </div>
        <div className="resumen-item">
          <strong>Pacientes:</strong>{" "}
          {pacientesDisponibles
            .filter((p) => pacientesSeleccionados.includes(p.id_paciente))
            .map((p) => p.nombre)
            .join(", ")}
        </div>
        <div className="resumen-item">
          <strong>Fecha:</strong> {new Date(fechaHora).toLocaleString("es-CL")}
        </div>
        <div className="resumen-item">
          <strong>Motivo:</strong> {motivo || "(Sin especificar)"}
        </div>
      </div>
    </div>
  );

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agendar Cita - Paso {paso} de 4</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Indicador de pasos */}
        <div className="pasos-indicador">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`paso-punto ${paso >= num ? "activo" : ""} ${
                paso === num ? "actual" : ""
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Contenido del paso actual */}
        {paso === 1 && renderPaso1()}
        {paso === 2 && renderPaso2()}
        {paso === 3 && renderPaso3()}
        {paso === 4 && renderPaso4()}

        {/* Botones de navegación */}
        <div className="modal-botones">
          {paso > 1 && (
            <IonButton
              expand="block"
              fill="outline"
              onClick={handleAnterior}
              disabled={loading}
            >
              Anterior
            </IonButton>
          )}

          {paso < 4 ? (
            <IonButton expand="block" onClick={handleSiguiente}>
              Siguiente
            </IonButton>
          ) : (
            <IonButton
              expand="block"
              onClick={handleCrearCita}
              disabled={loading}
            >
              {loading ? (
                <>
                  <IonSpinner name="crescent" />
                  Agendando...
                </>
              ) : (
                "Confirmar Cita"
              )}
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalAgendarCita;
