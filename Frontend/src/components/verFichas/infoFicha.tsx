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
  femaleOutline,
  maleOutline,
  banOutline,
} from 'ionicons/icons';
import "../../styles/infoFicha.css";
import { ConsultaData, calcularEdadPaciente } from '../../api/fichas';
// Componente: Visualizador del detalle de consulta
interface ModalInfoFichaProps {
  isOpen: boolean;
  onDismiss: () => void;
  consulta: ConsultaData | null;
}

const ModalInfoFicha: React.FC<ModalInfoFichaProps> = ({ isOpen, onDismiss, consulta }) => {
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

  const formatEspecie = (especie?: string) => {
    if (!especie) return pawOutline;

    const especies: { [key: string]: string } = {
      perro: 'dog.svg',
      gato: 'cat.svg',
      conejo: 'rabbit.svg',
      hamster: 'hamster.svg',
      erizo: 'hedgehog.svg',
      tortuga: 'turtle.svg',
      cuy: 'cuy.svg',
    };

    return especies[especie.toLowerCase()] || pawOutline;
  };
  // Función para formatear sexo
  const formatSex = (sexo?: string) => {
    switch (sexo?.toLowerCase()) {
      case 'm':
        return maleOutline;
      case 'h':
        return femaleOutline;
      default:
        return banOutline;
    }
  };

  // Si no hay ficha, no renderizar nada
  if (!consulta) {
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
            Ficha Médica #{consulta.id_consulta}
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
                      <p>{formatDate(consulta.fecha_consulta)}</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <IonItem lines="none" className="info-item">
                    <IonIcon icon={informationCircleOutline} slot="start" color="tertiary" />
                    <IonLabel>
                      <h3>ID Consulta</h3>
                      <p>#{consulta.id_consulta}</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
              
              {consulta.motivo && (
                <IonRow>
                  <IonCol size="12">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={clipboardOutline} slot="start" color="warning" />
                      <IonLabel>
                        <h3>Motivo de Consulta</h3>
                        <p>{consulta.motivo}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>
              )}
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Card 2: Información del Paciente */}
        {consulta.paciente && (
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
                      <IonIcon src={formatEspecie(consulta.paciente.especie)} slot="start" color="primary" />
                      <IonLabel>
                        <b>{consulta.paciente.nombre}
                          {consulta.paciente.sexo && (
                            <IonIcon icon={formatSex(consulta.paciente.sexo)} style={{size: "15px"}}/>
                          )}
                        </b>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="6">
                    {consulta.paciente.fecha_nacimiento && (
                      <IonItem lines="none" className="info-item">
                        <IonIcon icon={calendarOutline} slot="start" color="success" />
                        <IonLabel>
                          <h3>Edad</h3>
                          <p>{calcularEdadPaciente(consulta.paciente.fecha_nacimiento)}</p>
                        </IonLabel>
                      </IonItem>
                    )}
                  </IonCol>
                </IonRow>

                <IonRow>
                  {consulta.paciente.raza && (
                    <IonCol size="12" sizeMd="4">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Raza</h3>
                          <p>{capitalizeText(consulta.paciente.raza)}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  )}

                  {consulta.paciente.color && (
                    <IonCol size="12" sizeMd="4">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Color</h3>
                          <p>{capitalizeText(consulta.paciente.color)}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  )}

                  {consulta.paciente.codigo_chip && (
                    <IonCol size="12" sizeMd="4">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Chip</h3>
                          <p>{consulta.paciente.codigo_chip}</p>
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
        {consulta.tutor && (
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
                          {consulta.tutor.nombre} {consulta.tutor.apellido_paterno} {consulta.tutor.apellido_materno}
                        </p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonLabel>
                        <h3>RUT</h3>
                        <p>{consulta.tutor.rut}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  {consulta.tutor.telefono && (
                    <IonCol size="12" sizeMd="6">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Teléfono</h3>
                          <p>{consulta.tutor.telefono}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  )}

                  {consulta.tutor.email && (
                    <IonCol size="12" sizeMd="6">
                      <IonItem lines="none" className="info-item">
                        <IonLabel>
                          <h3>Email</h3>
                          <p>{consulta.tutor.email}</p>
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
                {consulta.peso && (
                  <IonCol size="12" sizeMd="4">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={scaleOutline} slot="start" color="success" />
                      <IonLabel>
                        <h3>Peso</h3>
                        <p>{consulta.peso} kg</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}

                {consulta.condicion_corporal && (
                  <IonCol size="12" sizeMd="4">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={bodyOutline} slot="start" color="warning" />
                      <IonLabel>
                        <h3>Condición Corporal</h3>
                        <p>{capitalizeText(consulta.condicion_corporal)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}

                {consulta.estado_pelaje && (
                  <IonCol size="12" sizeMd="4">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={fitnessOutline} slot="start" color="tertiary" />
                      <IonLabel>
                        <h3>Estado del Pelaje</h3>
                        <p>{capitalizeText(consulta.estado_pelaje)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}
              </IonRow>

              <IonRow>
                {consulta.mucosas && (
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={eyeOutline} slot="start" color="danger" />
                      <IonLabel>
                        <h3>Mucosas</h3>
                        <p>{capitalizeText(consulta.mucosas)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}

                {consulta.dht && (
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={pulseOutline} slot="start" color="primary" />
                      <IonLabel>
                        <h3>DHT</h3>
                        <p>{capitalizeText(consulta.dht)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}
              </IonRow>

              <IonRow>
                {consulta.nodulos_linfaticos && (
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={medicalOutline} slot="start" color="secondary" />
                      <IonLabel>
                        <h3>Nódulos Linfáticos</h3>
                        <p>{capitalizeText(consulta.nodulos_linfaticos)}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                )}

                {consulta.auscultacion_cardiaca_toraxica && (
                  <IonCol size="12" sizeMd="6">
                    <IonItem lines="none" className="info-item">
                      <IonIcon icon={heartOutline} slot="start" color="danger" />
                      <IonLabel>
                        <h3>Auscultación Cardíaca</h3>
                        <p>{capitalizeText(consulta.auscultacion_cardiaca_toraxica)}</p>
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
            {consulta.diagnostico && (
              <IonItem lines="none" className="info-item diagnosis-item">
                <IonLabel>
                  <h3>Diagnóstico</h3>
                  <p className="diagnosis-text">{consulta.diagnostico}</p>
                </IonLabel>
              </IonItem>
            )}

            {consulta.observaciones && (
              <IonItem lines="none" className="info-item observations-item">
                <IonLabel>
                  <h3>Observaciones</h3>
                  <p className="observations-text">{consulta.observaciones}</p>
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