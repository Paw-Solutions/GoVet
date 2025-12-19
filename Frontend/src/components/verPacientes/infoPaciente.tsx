import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import {
  closeOutline,
  personOutline,
  callOutline,
  mailOutline,
  locationOutline,
  pawOutline,
  documentTextOutline,
  pencilOutline,
  calendarOutline,
} from "ionicons/icons";
import { PacienteData } from "../../api/pacientes";
import { TutorData } from "../../api/tutores";
import HistorialConsultas from "./HistorialConsultas";
import PendientesPaciente from "./PendientesPaciente";
import ModalAgendarCita from "../calendario/ModalAgendarCita";
// Componente: Visualizador del detalle de un paciente
interface ModalInfoPacienteProps {
  isOpen: boolean;
  onDismiss: () => void;
  paciente: PacienteData | null;
  onViewTutor?: (tutorData: TutorData) => void;
  onViewConsulta?: (consulta: any) => void;
  onEdit?: () => void;
}

const ModalInfoPaciente: React.FC<ModalInfoPacienteProps> = ({
  isOpen,
  onDismiss,
  paciente,
  onViewTutor,
  onViewConsulta,
  onEdit,
}) => {
  const [showHistorial, setShowHistorial] = useState(false);
  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const history = useHistory();

  // Función para calcular edad aproximada
  const calculateAge = (fechaNacimiento?: string) => {
    if (!fechaNacimiento) return null;

    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} días`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} meses`;
    } else {
      return `${Math.floor(diffDays / 365)} años`;
    }
  };

  // Función para navegar al perfil del tutor
  const handleViewTutor = () => {
    if (paciente?.tutor && onViewTutor) {
      // Convertir el tutor parcial del paciente a TutorData completo
      const tutorCompleto: TutorData = {
        nombre: paciente.tutor.nombre ?? "",
        apellido_paterno: paciente.tutor.apellido_paterno ?? "",
        apellido_materno: paciente.tutor.apellido_materno ?? "",
        rut: paciente.tutor.rut ?? "",
        telefono: paciente.tutor.telefono ?? 0,
        email: paciente.tutor.email ?? "",
        // Campos que no vienen en paciente.tutor pero son requeridos en TutorData
        direccion: "",
        telefono2: 0,
        comuna: "",
        region: "",
        celular: 0,
        celular2: 0,
        observacion: "",
      };
      onViewTutor(tutorCompleto);
    }
  };

  // Función para abrir el historial de consultas
  const handleViewHistorial = () => {
    //console.log("🔍 Abriendo historial de consultas para paciente:", paciente);
    setShowHistorial(true);
  };

  // Función segura para cerrar el modal
  const handleDismiss = () => {
    try {
      setShowHistorial(false);
      onDismiss();
    } catch (error) {
      console.error("Error closing modal:", error);
    }
  };

  // Función para manejar la edición
  const handleEdit = () => {
    try {
      if (onEdit) {
        onEdit();
      }
    } catch (error) {
      console.error("Error opening edit:", error);
    }
  };

  // Si no hay paciente, no renderizar nada
  if (!paciente) {
    return null;
  }

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleDismiss}
      backdropDismiss={true}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Información del Paciente</IonTitle>
          <IonButtons slot="end">
            {onEdit && (
              <IonButton onClick={handleEdit} fill="clear" color="primary">
                <IonIcon icon={pencilOutline} slot="icon-only" />
              </IonButton>
            )}
            <IonButton onClick={handleDismiss} fill="clear">
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Información Personal */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={pawOutline} style={{ marginRight: "8px" }} />
              Información Personal
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h2>Nombre</h2>
                  <p>{paciente.nombre}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>Raza</h2>
                  <p>{paciente.raza}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>Especie</h2>
                  <p>{paciente.especie}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>Fecha de nacimiento</h2>
                  <p>
                    {paciente.fecha_nacimiento
                      ? new Date(
                          paciente.fecha_nacimiento
                        ).toLocaleDateString() +
                        " (" +
                        calculateAge(paciente.fecha_nacimiento) +
                        ")"
                      : "Desconocida"}
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>Sexo</h2>
                  <p>{paciente.sexo === "H" ? "Hembra" : "Macho"}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>
                    {paciente.sexo === "H"
                      ? "¿Esterilizada?"
                      : "¿Esterilizado?"}
                  </h2>
                  <p>{paciente.esterilizado ? "Sí" : "No"}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h2>Especie</h2>
                  <p>{paciente.especie}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Información del Tutor */}
        {paciente?.tutor && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={personOutline} style={{ marginRight: "8px" }} />
                Información del Tutor
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {/* Nombre del tutor - CLICKEABLE */}
                <IonItem
                  button
                  onClick={handleViewTutor}
                  detail={onViewTutor ? true : false}
                  disabled={!onViewTutor}
                  style={{ cursor: onViewTutor ? "pointer" : "default" }}
                >
                  <IonLabel>
                    <h2>Tutor</h2>
                    <p
                      style={{
                        color: onViewTutor
                          ? "var(--ion-color-primary)"
                          : "inherit",
                        fontWeight: "500",
                      }}
                    >
                      {paciente.tutor.nombre} {paciente.tutor.apellido_paterno}{" "}
                      {paciente.tutor.apellido_materno || ""}
                    </p>
                    {onViewTutor && (
                      <IonText color="medium" style={{ fontSize: "0.85em" }}>
                        <p>Toca para ver perfil completo</p>
                      </IonText>
                    )}
                  </IonLabel>
                </IonItem>

                {/* RUT */}
                <IonItem>
                  <IonLabel>
                    <h2>RUT</h2>
                    <p>{paciente.tutor.rut}</p>
                  </IonLabel>
                </IonItem>

                {/* Teléfono */}
                {paciente.tutor.telefono && (
                  <IonItem>
                    <IonLabel>
                      <h2>Teléfono</h2>
                      <p>{paciente.tutor.telefono}</p>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      size="small"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `tel:${paciente.tutor!.telefono}`,
                          "_system"
                        );
                      }}
                    >
                      <IonIcon icon={callOutline} slot="start" />
                      Llamar
                    </IonButton>
                  </IonItem>
                )}

                {/* Email */}
                {paciente.tutor.email && paciente.tutor.email !== "NaN" && (
                  <IonItem>
                    <IonLabel>
                      <h2>Email</h2>
                      <p>{paciente.tutor.email}</p>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      size="small"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `mailto:${paciente.tutor!.email}`,
                          "_system"
                        );
                      }}
                    >
                      <IonIcon icon={mailOutline} slot="start" />
                      Enviar
                    </IonButton>
                  </IonItem>
                )}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Widget de Vacunas Pendientes */}
        {paciente && (
          <PendientesPaciente
            idPaciente={paciente.id_paciente}
            onVerDetalleVacuna={(vacuna) => {
              // TODO: Implementar modal de detalle de vacuna
              //console.log("Ver detalle de vacuna:", vacuna);
            }}
          />
        )}

        {/* Botón para ver historial de consultas */}
        <div style={{ padding: "16px" }}>
          <IonButton
            expand="block"
            fill="solid"
            color="secondary"
            onClick={handleViewHistorial}
          >
            <IonIcon icon={documentTextOutline} slot="start" />
            Ver Historial de Consultas
          </IonButton>
        </div>

        {/* Botón para agregar ficha */}
        <div style={{ padding: "16px" }}>
          <IonButton
            expand="block"
            fill="solid"
            color="primary"
            onClick={() => {
              if (paciente) {
                // Guardar el paciente en sessionStorage para rellenarFicha
                sessionStorage.setItem(
                  "pacienteParaFicha",
                  JSON.stringify(paciente)
                );
                // Navegar a RellenarFicha
                history.push("/rellenar-ficha");
                // Cerrar el modal
                onDismiss();
              }
            }}
          >
            <IonIcon icon={documentTextOutline} slot="start" />
            Agregar Ficha
          </IonButton>
        </div>

        {/* Botón para agendar cita */}
        <div style={{ padding: "16px" }}>
          <IonButton
            expand="block"
            fill="solid"
            color="tertiary"
            onClick={() => setShowAgendarModal(true)}
          >
            <IonIcon icon={calendarOutline} slot="start" />
            Agendar Cita
          </IonButton>
        </div>

        {/* Botón de cierre adicional */}
        <div style={{ padding: "20px", textAlign: "center" }}>
          <IonButton expand="block" fill="outline" onClick={handleDismiss}>
            Cerrar
          </IonButton>
        </div>
      </IonContent>

      {/* Modal de historial de consultas */}
      <HistorialConsultas
        isOpen={showHistorial}
        onDismiss={() => setShowHistorial(false)}
        paciente={paciente}
        onViewConsulta={(consulta) => {
          setShowHistorial(false);
          if (onViewConsulta) {
            onViewConsulta(consulta);
          }
        }}
      />

      {/* Modal para agendar cita con datos pre-cargados */}
      {paciente && (
        <ModalAgendarCita
          isOpen={showAgendarModal}
          onClose={() => setShowAgendarModal(false)}
          tutorInicial={
            paciente.tutor
              ? {
                  nombre: paciente.tutor.nombre ?? "",
                  apellido_paterno: paciente.tutor.apellido_paterno ?? "",
                  apellido_materno: paciente.tutor.apellido_materno ?? "",
                  rut: paciente.tutor.rut ?? "",
                  telefono: paciente.tutor.telefono ?? 0,
                  email: paciente.tutor.email ?? "",
                  direccion: "",
                  telefono2: 0,
                  comuna: "",
                  region: "",
                  celular: 0,
                  celular2: 0,
                  observacion: "",
                }
              : undefined
          }
          pacienteInicial={paciente}
          onCitaCreada={() => {
            setShowAgendarModal(false);
          }}
        />
      )}
    </IonModal>
  );
};

export default ModalInfoPaciente;
