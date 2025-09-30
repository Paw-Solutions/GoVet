import React from 'react';
import { TutorData } from '../../api/tutores';
import { PacienteData } from '../../api/pacientes';
import { FichaData } from '../../api/fichas';
import ModalInfoTutor from '../verTutores/infoTutor';
import ModalInfoPaciente from '../verPacientes/infoPaciente';
import ModalInfoFicha from '../verFichas/infoFicha';

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
  showFichaInfo: boolean;
  selectedFicha: FichaData | null;
  onCloseFichaInfo: () => void;
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
  showFichaInfo,
  selectedFicha,
  onCloseFichaInfo,
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
      
      {/* Modal de informacion de ficha*/}
      <ModalInfoFicha
        isOpen={showFichaInfo}
        onDismiss={onCloseFichaInfo}
        ficha={selectedFicha}
      />
    </>
  );
};

export default ModalsContainer;