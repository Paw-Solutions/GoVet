import React from 'react';
import { TutorData } from '../../api/tutores';
import { PacienteData } from '../../api/pacientes';
import ModalInfoTutor from '../verTutores/infoTutor';
import ModalInfoPaciente from '../verPacientes/infoPaciente';

interface ModalsContainerProps {
  // Props para modal de tutores
  showTutorInfo: boolean;
  selectedTutor: TutorData | null;
  onCloseTutorInfo: () => void;
  
  // Props para modal de pacientes
  showPacienteInfo: boolean;
  selectedPaciente: PacienteData | null;
  onClosePacienteInfo: () => void;
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
      />
    </>
  );
};

export default ModalsContainer;