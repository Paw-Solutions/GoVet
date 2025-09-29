import React from 'react';
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
} from '@ionic/react';
import {
  closeOutline,
  personOutline,
  callOutline,
  mailOutline,
  locationOutline,
  pawOutline,
} from 'ionicons/icons';
import { PacienteData } from '../../api/pacientes';

interface ModalInfoPacienteProps {
  isOpen: boolean;
  onDismiss: () => void;
  paciente: PacienteData | null;
}

const ModalInfoPaciente: React.FC<ModalInfoPacienteProps> = ({ isOpen, onDismiss, paciente }) => {
  // Función segura para cerrar el modal
  const handleDismiss = () => {
    try {
      onDismiss();
    } catch (error) {
      console.error('Error closing modal:', error);
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
            <IonButton onClick={handleDismiss}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Información Personal */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={pawOutline} style={{ marginRight: '8px' }} />
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
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Botón de cierre adicional */}
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <IonButton expand="block" fill="outline" onClick={handleDismiss}>
            Cerrar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalInfoPaciente;