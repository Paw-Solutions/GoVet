import React from 'react';
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonButtons,
  IonText,
  IonBadge,
  IonAvatar,
} from '@ionic/react';
import {
  pawOutline,
  eyeOutline,
  pencilOutline,
  maleOutline,
  femaleOutline,
  calendarOutline,
  personOutline,
  personSharp,
} from 'ionicons/icons';
import { PacienteData } from '../../api/pacientes';

interface PacienteItemProps {
  paciente: PacienteData;
  onView: () => void;
  onEdit: () => void;
  disabled?: boolean;
  showTutor?: boolean;
  compact?: boolean;
}

const PacienteItem: React.FC<PacienteItemProps> = ({
  paciente,
  onView,
  onEdit,
  disabled = false,
  showTutor = true,
  compact = false,
}) => {
  // Función para obtener el color del badge según el sexo
  const getSexColor = (sexo?: string) => {
    switch (sexo?.toLowerCase()) {
      case 'm':
        return 'primary';
      case 'h':
        return 'secondary';
      default:
        return 'medium';
    }
  };

  // Función para obtener el ícono del sexo
  const getSexIcon = (sexo?: string) => {
    console.log('Sexo del paciente:', sexo);
    switch (sexo?.toLowerCase()) {
      case 'm':
        return maleOutline;
      case 'h':
        return femaleOutline;
      default:
        return pawOutline;
    }
  };

  // Función para calcular la edad aproximada
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

  // Función para obtener color del avatar basado en la especie
  const getAvatarColor = () => {
    if (!paciente.especie) return 'medium';
    
    const especies: { [key: string]: string } = {
      'perro': 'warning',
      'gato': 'tertiary',
      'conejo': 'success',
      'hamster': 'primary',
      'erizo': 'secondary',
      'tortuga': 'tertiary',
      'cuy': 'quaternary',
      'otra': 'dark',
    };
    
    return especies[paciente.especie.toLowerCase()] || 'medium';
  };

  const getIcon = () => {
    if (!paciente.especie) return pawOutline;
    
    const especies: { [key: string]: string } = {
      'perro': 'dog.svg',
      'gato': 'cat.svg',
      'conejo': 'rabbit.svg',
      'hamster': 'hamster.svg',
      'erizo': 'hedgehog.svg',
      'tortuga': 'turtle.svg',
      'cuy': 'cuy.svg',
    };
    
    return especies[paciente.especie.toLowerCase()] || pawOutline;
  };

  if (compact) {
    return (
      <IonItem button lines="full" disabled={disabled}>
        <IonAvatar slot="start" className={`avatar-${getAvatarColor()}`}>
            <IonIcon icon={pawOutline} color={getAvatarColor()} size='large'/>
        </IonAvatar>
        
        <IonLabel>
          <h3>{paciente.nombre}</h3>
          <p>{paciente.especie} • {paciente.raza}</p>
        </IonLabel>
        
        <IonButtons slot="end">
          <IonButton fill="clear" onClick={onView} disabled={disabled}>
            <IonIcon icon={eyeOutline} slot="icon-only" />
          </IonButton>
        </IonButtons>
      </IonItem>
    );
  }

  return (
    <IonItem lines="full" className="info-item">
      <IonAvatar slot="start" className={`avatar-${getAvatarColor()}`}>
        <IonIcon icon={getIcon()} size='default'/>
      </IonAvatar>
      
      <IonLabel style={{ padding: '5px' }}>
        {/* Nombre del paciente */}
        <h2 className="paciente-nombre">
          {paciente.nombre}
          {paciente.sexo && (
            <span style={{ marginLeft: '8px'}}>
              <IonIcon icon={getSexIcon(paciente.sexo)} />
            </span>
          )}
        </h2>

        {/* Información básica */}
        {paciente.raza && (
          <div className="info-item">
              <div>
                  <IonIcon src="/raza.svg" className='pacientes-icon'/>
                  <span style={{marginLeft: '8px'}}>{paciente.raza} {paciente.fecha_nacimiento && (
                    <IonText style={{ marginLeft: '3px'}}>
                      ({calculateAge(paciente.fecha_nacimiento)})
                    </IonText>
                  )}</span>
              </div>
          </div>
              )}
        {paciente.color && (
        <div className="info-item">
            <IonIcon src="/color.svg" className='pacientes-icon'/>
            <span style={{marginLeft: '8px'}}>{paciente.color}</span>
        </div>
        )}

        {/* Información del tutor */}
        {showTutor && (
          <div className="info-item">
            <IonIcon className='pacientes-icon' icon={personOutline} />
            {paciente.tutor?.nombre ? (
                <span>
                  : {paciente.tutor.nombre} {paciente.tutor.apellido_paterno}
                </span>
            ) : (
              <IonText className="tutor-name">
                <IonIcon icon={personOutline} className='pacientes-icon' />
                <span style={{ marginLeft: '8px' }}>Sin tutor asignado</span>
              </IonText>
            )}
          </div>
        )}
      </IonLabel>

      {/* Botones de acción */}
      <IonButtons slot="end">
        <IonButton 
          fill="clear" 
          onClick={onEdit} 
          disabled={disabled}
        >
          <IonIcon icon={pencilOutline} slot="icon-only" size='small' />
        </IonButton>
        <IonButton 
          fill="clear" 
          onClick={onView} 
          disabled={disabled}
          className="action-button view-button"
        >
          <IonIcon icon={eyeOutline} slot="icon-only" size='small' />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};

export default PacienteItem;