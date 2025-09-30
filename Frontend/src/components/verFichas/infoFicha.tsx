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
  IonBadge,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import {
  closeOutline,
  pawOutline,
  personOutline,
  medicalOutline,
  eyeOutline,
  heartOutline,
  fitnessOutline,
  calendarOutline,
  clipboardOutline,
  informationCircleOutline,
  scaleOutline,
  bodyOutline,
  pulseOutline,
} from 'ionicons/icons';
import { FichaData, calcularEdadPaciente } from '../../api/fichas';

interface ModalInfoFichaProps {
  isOpen: boolean;
  onDismiss: () => void;
  ficha: FichaData | null;
}

const ModalInfoFicha: React.FC<ModalInfoFichaProps> = ({ isOpen, onDismiss, ficha }) => {
  // Función segura para cerrar el modal
  const handleDismiss = () => {
    try {
      onDismiss();
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para capitalizar texto
  const capitalizeText = (text?: string): string => {
    if (!text) return 'No especificado';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Función para obtener color del badge según sexo
  const getSexColor = (sexo?: string) => {
    switch (sexo?.toLowerCase()) {
      case 'm':
      case 'macho':
        return 'primary';
      case 'h':
      case 'hembra':
        return 'secondary';
      default:
        return 'medium';
    }
  };

  // Función para formatear sexo
  const formatSex = (sexo?: string) => {
    switch (sexo?.toLowerCase()) {
      case 'm':
        return 'Macho';
      case 'h':
        return 'Hembra';
      default:
        return 'No especificado';
    }
  };

  // Si no hay ficha, no renderizar nada
  if (!ficha) {
    return null;
  }

  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={handleDismiss}
      backdropDismiss={true}
      className="ficha-modal"
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={medicalOutline} style={{ marginRight: '8px' }} />
            Ficha Médica #{ficha.id_consulta}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={handleDismiss}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ficha-content">
        {/* Card 1: Información Básica de la Consulta */}
        <IonCard className="consultation-card">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={clipboardOutline} style={{ marginRight: '8px' }} />
              Información de la Consulta
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonItem lines="none" className="info-item">
                    <IonIcon icon={calendarOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h3>Fecha de Consulta</h3>
                      <p>{formatDate(ficha.fecha_consulta)}</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <IonItem lines="none" className="info-item">
                    <IonIcon icon={informationCircleOutline} slot="start" color="tertiary" />
                    <IonLabel>
                      <h3>ID Consulta</h3>
                      <p>#{ficha.id_consulta}</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
              
              {ficha.motivo && (
                <IonRow>
                  <IonCol size="12">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={clipboardOutline} slot="start" color="warning" />
                      <IonLabel>
                        <h3>Motivo de Consulta</h3>
                        <p>{ficha.motivo}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>
              )}
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Card 2: Información del Paciente */}
        {ficha.paciente && (
          <IonCard className="patient-card">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={pawOutline} style={{ marginRight: '8px' }} />
                Información del Paciente
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonLabel>
                        <h2>{ficha.paciente.nombre}</h2>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          {ficha.paciente.sexo && (
                            <IonBadge color={getSexColor(ficha.paciente.sexo)}>
                              {formatSex(ficha.paciente.sexo)}
                            </IonBadge>
                          )}
                          {ficha.paciente.especie && (
                            <IonChip outline>
                              <IonLabel>{capitalizeText(ficha.paciente.especie)}</IonLabel>
                            </IonChip>
                          )}
                        </div>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="6">
                    {ficha.paciente.fecha_nacimiento && (
                      <IonItem lines="none" className="info-item">
                        <IonIcon icon={calendarOutline} slot="start" color="success" />
                        <IonLabel>
                          <h3>Edad</h3>
                          <p>{calcularEdadPaciente(ficha.paciente.fecha_nacimiento)}</p>
                        </IonLabel>
                      </IonItem>
                    )}
                  </IonCol>
                </IonRow>

                <IonRow>
                  {ficha.paciente.raza && (
                    <IonCol size="12" sizeMd="4">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Raza</h3>
                          <p>{capitalizeText(ficha.paciente.raza)}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  )}
                  
                  {ficha.paciente.color && (
                    <IonCol size="12" sizeMd="4">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Color</h3>
                          <p>{capitalizeText(ficha.paciente.color)}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  )}

                  {ficha.paciente.codigo_chip && (
                    <IonCol size="12" sizeMd="4">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Chip</h3>
                          <p>{ficha.paciente.codigo_chip}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  )}
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        )}

        {/* Card 3: Información del Tutor */}
        {ficha.tutor && (
          <IonCard className="tutor-card">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={personOutline} style={{ marginRight: '8px' }} />
                Información del Tutor
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonLabel>
                        <h3>Nombre Completo</h3>
                        <p>
                          {ficha.tutor.nombre} {ficha.tutor.apellido_paterno} {ficha.tutor.apellido_materno}
                        </p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonLabel>
                        <h3>RUT</h3>
                        <p>{ficha.tutor.rut}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  {ficha.tutor.telefono && (
                    <IonCol size="12" sizeMd="6">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Teléfono</h3>
                          <p>{ficha.tutor.telefono}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  )}

                  {ficha.tutor.email && (
                    <IonCol size="12" sizeMd="6">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Email</h3>
                          <p>{ficha.tutor.email}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  )}
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        )}

        {/* Card 4: Examen Físico */}
        <IonCard className="physical-exam-card">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={eyeOutline} style={{ marginRight: '8px' }} />
              Examen Físico
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                {ficha.peso && (
                  <IonCol size="12" sizeMd="4">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={scaleOutline} slot="start" color="success" />
                      <IonLabel>
                        <h3>Peso</h3>
                        <p>{ficha.peso} kg</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}

                {ficha.condicion_corporal && (
                  <IonCol size="12" sizeMd="4">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={bodyOutline} slot="start" color="warning" />
                      <IonLabel>
                        <h3>Condición Corporal</h3>
                        <p>{capitalizeText(ficha.condicion_corporal)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}

                {ficha.estado_pelaje && (
                  <IonCol size="12" sizeMd="4">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={fitnessOutline} slot="start" color="tertiary" />
                      <IonLabel>
                        <h3>Estado del Pelaje</h3>
                        <p>{capitalizeText(ficha.estado_pelaje)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}
              </IonRow>

              <IonRow>
                {ficha.mucosas && (
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={eyeOutline} slot="start" color="danger" />
                      <IonLabel>
                        <h3>Mucosas</h3>
                        <p>{capitalizeText(ficha.mucosas)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}

                {ficha.dht && (
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={pulseOutline} slot="start" color="primary" />
                      <IonLabel>
                        <h3>DHT</h3>
                        <p>{capitalizeText(ficha.dht)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}
              </IonRow>

              <IonRow>
                {ficha.nodulos_linfaticos && (
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={medicalOutline} slot="start" color="secondary" />
                      <IonLabel>
                        <h3>Nódulos Linfáticos</h3>
                        <p>{capitalizeText(ficha.nodulos_linfaticos)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}

                {ficha.auscultacion_cardiaca_toraxica && (
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={heartOutline} slot="start" color="danger" />
                      <IonLabel>
                        <h3>Auscultación Cardíaca</h3>
                        <p>{capitalizeText(ficha.auscultacion_cardiaca_toraxica)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Card 5: Diagnóstico y Observaciones */}
        <IonCard className="diagnosis-card">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={medicalOutline} style={{ marginRight: '8px' }} />
              Diagnóstico y Observaciones
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {ficha.diagnostico && (
              <IonItem lines="none" className="info-item diagnosis-item">
                <IonLabel>
                  <h3>Diagnóstico</h3>
                  <p className="diagnosis-text">{ficha.diagnostico}</p>
                </IonLabel>
              </IonItem>
            )}

            {ficha.observaciones && (
              <IonItem lines="none" className="info-item observations-item">
                <IonLabel>
                  <h3>Observaciones</h3>
                  <p className="observations-text">{ficha.observaciones}</p>
                </IonLabel>
              </IonItem>
            )}
          </IonCardContent>
        </IonCard>

        {/* Botón de cierre */}
        <div style={{ padding: '20px', paddingBottom: '40px' }}>
          <IonButton expand="block" fill="outline" onClick={handleDismiss} size="large">
            <IonIcon icon={closeOutline} slot="start" />
            Cerrar Ficha
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalInfoFicha;