import React from "react";
import { TutorData } from "../../api/tutores";
import { PacienteData } from "../../api/pacientes";
import { ConsultaData } from "../../api/fichas";
import ModalInfoTutor from "../verTutores/infoTutor";
import ModalInfoPaciente from "../verPacientes/infoPaciente";
import ModalInfoFicha from "../verFichas/infoFicha";
import ModalEditarPaciente from "../editar/editarPaciente";
import ModalEditarTutor from "../editar/editarTutor";
import ModalEditarConsulta from "../editar/editarConsulta";

interface ModalsContainerProps {
  // Props para modal de tutores
  showTutorInfo: boolean;
  selectedTutor: TutorData | null;
  onCloseTutorInfo: () => void;
  onEditTutorFromInfo?: () => void; // Nueva prop para editar desde info

  // Props para modal de pacientes
  showPacienteInfo: boolean;
  selectedPaciente: PacienteData | null;
  onClosePacienteInfo: () => void;
  onEditPacienteFromInfo?: () => void; // Nueva prop para editar desde info

  // Props para modal de fichas
  showConsultaInfo: boolean;
  selectedConsulta: ConsultaData | null;
  onCloseConsultaInfo: () => void;
  onEditConsultaFromInfo?: () => void; // Nueva prop para editar desde info

  // Props para modal edicion tutores
  showTutorEdit?: boolean;
  onCloseTutorEdit?: () => void;

  // Props para modal edicion pacientes
  showPacienteEdit?: boolean;
  onClosePacienteEdit?: () => void;

  // Props para modal edicion consultas
  showConsultaEdit?: boolean;
  onCloseConsultaEdit?: () => void;

  // Navegación entre modales
  onViewTutorFromPaciente?: (tutorData: TutorData) => void;
  onViewConsultaFromPaciente?: (consulta: ConsultaData) => void;
  onViewPacienteFromTutor?: (pacienteData: PacienteData) => void;
}

const ModalsContainer: React.FC<ModalsContainerProps> = ({
  // Tutores
  showTutorInfo,
  selectedTutor,
  onCloseTutorInfo,
  onEditTutorFromInfo,

  // Pacientes
  showPacienteInfo,
  selectedPaciente,
  onClosePacienteInfo,
  onEditPacienteFromInfo,

  // Fichas
  showConsultaInfo,
  selectedConsulta,
  onCloseConsultaInfo,
  onEditConsultaFromInfo,

  // Editar tutores
  showTutorEdit,
  onCloseTutorEdit,

  // Editar pacientes
  showPacienteEdit,
  onClosePacienteEdit,

  // Editar consultas
  showConsultaEdit,
  onCloseConsultaEdit,

  // Navegación entre modales
  onViewTutorFromPaciente,
  onViewConsultaFromPaciente,
  onViewPacienteFromTutor,
}) => {
  return (
    <>
      {/* Modal de información del tutor */}
      <ModalInfoTutor
        isOpen={showTutorInfo}
        onDismiss={onCloseTutorInfo}
        tutor={selectedTutor}
        onEdit={onEditTutorFromInfo}
        onViewPaciente={onViewPacienteFromTutor}
      />

      {/* Modal de información del paciente */}
      <ModalInfoPaciente
        isOpen={showPacienteInfo}
        onDismiss={onClosePacienteInfo}
        paciente={selectedPaciente}
        onViewTutor={onViewTutorFromPaciente}
        onViewConsulta={onViewConsultaFromPaciente}
        onEdit={onEditPacienteFromInfo}
      />

      {/* Modal de informacion de consulta*/}
      <ModalInfoFicha
        isOpen={showConsultaInfo}
        onDismiss={onCloseConsultaInfo}
        consulta={selectedConsulta}
        onEdit={onEditConsultaFromInfo}
      />

      {/* Modal de edicion de tutor*/}
      <ModalEditarTutor
        isOpen={!!showTutorEdit}
        onDismiss={onCloseTutorEdit ?? (() => {})}
        tutor={selectedTutor}
      />

      {/* Modal de edicion de paciente*/}
      <ModalEditarPaciente
        isOpen={!!showPacienteEdit}
        onDismiss={onClosePacienteEdit ?? (() => {})}
        paciente={selectedPaciente}
      />

      {/* Modal de edicion de consulta*/}
      <ModalEditarConsulta
        isOpen={!!showConsultaEdit}
        onDismiss={onCloseConsultaEdit ?? (() => {})}
        consulta={selectedConsulta}
      />
    </>
  );
};

export default ModalsContainer;
