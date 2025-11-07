import React from "react";
import { TutorData } from "../../api/tutores";
import { PacienteData } from "../../api/pacientes";
import { ConsultaData } from "../../api/fichas";
import ModalInfoTutor from "../verTutores/infoTutor";
import ModalInfoPaciente from "../verPacientes/infoPaciente";
import ModalInfoFicha from "../verFichas/infoFicha";
import ModalEditarPaciente from "../editar/editarPaciente";
import ModalEditarTutor from "../editar/editarTutor";

interface ModalsContainerProps {
  // Props para modal de tutores
  showTutorInfo: boolean;
  selectedTutor: TutorData | null;
  onCloseTutorInfo: () => void;

  // Props para modal de pacientes
  showPacienteInfo: boolean;
  selectedPaciente: PacienteData | null;
  onClosePacienteInfo: () => void;

  // Props para modal de fichas
  showConsultaInfo: boolean;
  selectedConsulta: ConsultaData | null;
  onCloseConsultaInfo: () => void;

  // Props para modal edicion tutores
  showTutorEdit?: boolean;
  onCloseTutorEdit?: () => void;

  // Props para modal edicion pacientes
  showPacienteEdit?: boolean;
  onClosePacienteEdit?: () => void;

  // Navegación entre modales
  onViewTutorFromPaciente?: (tutorData: TutorData) => void;
  onViewConsultaFromPaciente?: (consulta: ConsultaData) => void;
}

const ModalsContainer: React.FC<ModalsContainerProps> = ({
  // Tutores
  showTutorInfo,
  selectedTutor,
  onCloseTutorInfo,

  // Pacientes
  showPacienteInfo,
  selectedPaciente,
  onClosePacienteInfo,

  // Fichas
  showConsultaInfo,
  selectedConsulta,
  onCloseConsultaInfo,

  // Editar tutores
  showTutorEdit,
  onCloseTutorEdit,

  // Editar pacientes
  showPacienteEdit,
  onClosePacienteEdit,

  // Navegación entre modales
  onViewTutorFromPaciente,
  onViewConsultaFromPaciente,
}) => {
  return (
    <>
      {/* Modal de información del tutor */}
      <ModalInfoTutor
        isOpen={showTutorInfo}
        onDismiss={onCloseTutorInfo}
        tutor={selectedTutor}
      />

      {/* Modal de información del paciente */}
      <ModalInfoPaciente
        isOpen={showPacienteInfo}
        onDismiss={onClosePacienteInfo}
        paciente={selectedPaciente}
        onViewTutor={onViewTutorFromPaciente}
        onViewConsulta={onViewConsultaFromPaciente}
      />

      {/* Modal de informacion de consulta*/}
      <ModalInfoFicha
        isOpen={showConsultaInfo}
        onDismiss={onCloseConsultaInfo}
        consulta={selectedConsulta}
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
    </>
  );
};

export default ModalsContainer;
