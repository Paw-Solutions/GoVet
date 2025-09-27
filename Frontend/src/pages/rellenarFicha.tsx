import { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonText,
  IonFooter,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonNote,
} from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  saveOutline,
  pawOutline,
  personOutline,
} from "ionicons/icons";
import "../styles/registroTutor.css";
import "../styles/variables.css";
import ModalEscogerPaciente from '../components/modalEscogerPaciente';
import { PacienteData } from '../api/pacientes'; // Importar la interfaz correcta

interface FichaVeterinaria {
  id_paciente: number;
  rut: string;
  fecha_consulta: string;
  motivo: string;
  diagnostico: string;
  observaciones: string;
  dht: string;
  nodulos_linfaticos: string;
  mucosas: string;
  peso: number;
  auscultacion_cardiaca_toraxica: string;
  estado_pelaje: string;
  condicion_corporal: string;
}

const RellenarFicha: React.FC = () => {
  const [showModalPacientes, setShowModalPacientes] = useState(false);
  const [currentStep, setCurrentStep] = useState<'general' | 'fisico' | 'clinico'>('general');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteData | null>(null); // Usar PacienteData

  // Estado para los campos del formulario
  const [formData, setFormData] = useState<FichaVeterinaria>({
    id_paciente: 0,
    rut: "",
    fecha_consulta: new Date().toISOString().split('T')[0], // Fecha automática
    motivo: "",
    diagnostico: "",
    observaciones: "",
    dht: "",
    nodulos_linfaticos: "",
    mucosas: "",
    peso: 0,
    auscultacion_cardiaca_toraxica: "",
    estado_pelaje: "",
    condicion_corporal: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumericChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  // Función corregida para manejar la selección del paciente desde el modal
  const handlePacienteSelected = (paciente: PacienteData) => {
    setSelectedPaciente(paciente);
    setFormData(prev => ({
      ...prev,
      id_paciente: paciente.id_paciente,
      rut: paciente.tutor?.rut || "" // Usar el RUT del tutor del paciente seleccionado
    }));
    setShowModalPacientes(false);
  };

  const navegarSiguiente = () => {
    if (currentStep === 'general') {
      setCurrentStep('fisico');
    } else if (currentStep === 'fisico') {
      setCurrentStep('clinico');
    }
  };

  const navegarAnterior = () => {
    if (currentStep === 'clinico') {
      setCurrentStep('fisico');
    } else if (currentStep === 'fisico') {
      setCurrentStep('general');
    }
  };

  const puedeAvanzar = () => {
    if (currentStep === 'general') {
      return selectedPaciente && formData.motivo.trim();
    }
    return true;
  };

  const guardarFicha = async () => {
    setIsLoading(true);
    try {
      // Aquí harías la petición POST al backend
      console.log("Guardando ficha:", formData);
      setToastMessage("Ficha veterinaria guardada exitosamente");
      
      // Limpiar formulario después de guardar
      setFormData({
        id_paciente: 0,
        rut: "",
        fecha_consulta: new Date().toISOString().split('T')[0],
        motivo: "",
        diagnostico: "",
        observaciones: "",
        dht: "",
        nodulos_linfaticos: "",
        mucosas: "",
        peso: 0,
        auscultacion_cardiaca_toraxica: "",
        estado_pelaje: "",
        condicion_corporal: "",
      });
      
      setSelectedPaciente(null);
      setCurrentStep('general');
    } catch (error) {
      console.error("Error al guardar ficha:", error);
      setToastMessage("Error al guardar la ficha");
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'general': return 1;
      case 'fisico': return 2;
      case 'clinico': return 3;
      default: return 1;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'general': return 'Información General';
      case 'fisico': return 'Examen Físico';
      case 'clinico': return 'Examen Clínico';
      default: return 'Información General';
    }
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Generar ficha</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Generar ficha</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Indicador de progreso */}
        <div style={{ padding: '10px 20px' }}>
          <IonText>
            <h3>{getStepTitle()}</h3>
            <p color="medium">Paso {getStepNumber()} de 3</p>
          </IonText>
        </div>

        {/* Paso 1: Información General */}
        {currentStep === 'general' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={pawOutline} style={{ marginRight: '8px' }} />
                Seleccionar Paciente
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonButton 
                      expand="block" 
                      fill="outline" 
                      onClick={() => setShowModalPacientes(true)}
                    >
                      <IonIcon icon={pawOutline} slot="start" />
                      {selectedPaciente ? `${selectedPaciente.nombre} - ${selectedPaciente.especie}` : 'Seleccionar Paciente'}
                    </IonButton>
                  </IonCol>
                </IonRow>

                {/* Información del tutor (solo si hay paciente seleccionado) */}
                {selectedPaciente && selectedPaciente.tutor && (
                  <IonRow>
                    <IonCol size="12">
                      <div style={{ 
                        padding: '12px', 
                        backgroundColor: 'var(--ion-color-light)', 
                        borderRadius: '8px',
                        marginTop: '10px'
                      }}>
                        <IonText>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <IonIcon icon={personOutline} style={{ marginRight: '6px', fontSize: '16px' }} />
                            <strong style={{ fontSize: '14px' }}>Información del Tutor</strong>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
                            <p style={{ margin: '2px 0' }}>
                              <strong>Nombre:</strong> {selectedPaciente.tutor.nombre} {selectedPaciente.tutor.apellido_paterno} {selectedPaciente.tutor.apellido_materno}
                            </p>
                            <p style={{ margin: '2px 0' }}>
                              <strong>RUT:</strong> {selectedPaciente.tutor.rut}
                            </p>
                            {selectedPaciente.tutor.telefono && (
                              <p style={{ margin: '2px 0' }}>
                                <strong>Teléfono:</strong> {selectedPaciente.tutor.telefono}
                              </p>
                            )}
                            {selectedPaciente.tutor.email && (
                              <p style={{ margin: '2px 0' }}>
                                <strong>Email:</strong> {selectedPaciente.tutor.email}
                              </p>
                            )}
                          </div>
                        </IonText>
                      </div>
                    </IonCol>
                  </IonRow>
                )}

                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonTextarea
                        label="Motivo de la Consulta"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Describa el motivo de la consulta"
                        rows={4}
                        name="motivo"
                        value={formData.motivo}
                        onIonChange={handleInputChange}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        )}

        {/* Paso 2: Examen Físico */}
        {currentStep === 'fisico' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Examen Físico</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" size-md="6">
                      <IonItem>
                        <IonInput
                          label="Peso (kg)"
                          type="number"
                          labelPlacement="floating"
                          fill="outline"
                          placeholder="Ej: 25.5"
                          name="peso"
                          value={formData.peso}
                          onIonChange={handleNumericChange}
                        />
                      </IonItem>
                    </IonCol>
                    <IonCol size="12" size-md="6">
                      <IonItem>
                        <IonSelect
                          label="Condición Corporal"
                          labelPlacement="floating"
                          fill="outline"
                          placeholder="Seleccione condición"
                          name="condicion_corporal"
                          value={formData.condicion_corporal}
                          onIonChange={handleInputChange}
                        >
                          <IonSelectOption value="muy_delgado">Muy Delgado (1/5)</IonSelectOption>
                          <IonSelectOption value="delgado">Delgado (2/5)</IonSelectOption>
                          <IonSelectOption value="ideal">Ideal (3/5)</IonSelectOption>
                          <IonSelectOption value="sobrepeso">Sobrepeso (4/5)</IonSelectOption>
                          <IonSelectOption value="obeso">Obeso (5/5)</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="12" size-md="6">
                      <IonItem>
                        <IonSelect
                          label="Estado del Pelaje"
                          labelPlacement="floating"
                          fill="outline"
                          placeholder="Seleccione estado"
                          name="estado_pelaje"
                          value={formData.estado_pelaje}
                          onIonChange={handleInputChange}
                        >
                          <IonSelectOption value="excelente">Excelente</IonSelectOption>
                          <IonSelectOption value="bueno">Bueno</IonSelectOption>
                          <IonSelectOption value="regular">Regular</IonSelectOption>
                          <IonSelectOption value="malo">Malo</IonSelectOption>
                          <IonSelectOption value="muy_malo">Muy Malo</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                    <IonCol size="12" size-md="6">
                      <IonItem>
                        <IonSelect
                          label="Mucosas"
                          labelPlacement="floating"
                          fill="outline"
                          placeholder="Seleccione estado"
                          name="mucosas"
                          value={formData.mucosas}
                          onIonChange={handleInputChange}
                        >
                          <IonSelectOption value="rosadas">Rosadas (Normal)</IonSelectOption>
                          <IonSelectOption value="palidas">Pálidas</IonSelectOption>
                          <IonSelectOption value="cianoticas">Cianóticas</IonSelectOption>
                          <IonSelectOption value="ictericas">Ictéricas</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonTextarea
                          label="Nódulos Linfáticos"
                          labelPlacement="floating"
                          fill="outline"
                          placeholder="Describa el estado de los nódulos linfáticos"
                          rows={3}
                          name="nodulos_linfaticos"
                          value={formData.nodulos_linfaticos}
                          onIonChange={handleInputChange}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Paso 3: Examen Clínico */}
        {currentStep === 'clinico' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Examen Clínico</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonTextarea
                          label="DHT (Deshidratación, Hidratación, Temperatura)"
                          labelPlacement="floating"
                          fill="outline"
                          placeholder="Describa el estado de DHT"
                          rows={3}
                          name="dht"
                          value={formData.dht}
                          onIonChange={handleInputChange}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonTextarea
                          label="Auscultación Cardíaca y Torácica"
                          labelPlacement="floating"
                          fill="outline"
                          placeholder="Describa los hallazgos de auscultación"
                          rows={3}
                          name="auscultacion_cardiaca_toraxica"
                          value={formData.auscultacion_cardiaca_toraxica}
                          onIonChange={handleInputChange}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonTextarea
                          label="Diagnóstico"
                          labelPlacement="floating"
                          fill="outline"
                          placeholder="Ingrese el diagnóstico"
                          rows={4}
                          name="diagnostico"
                          value={formData.diagnostico}
                          onIonChange={handleInputChange}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonTextarea
                          label="Observaciones"
                          labelPlacement="floating"
                          fill="outline"
                          placeholder="Observaciones adicionales"
                          rows={4}
                          name="observaciones"
                          value={formData.observaciones}
                          onIonChange={handleInputChange}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Espaciado para el footer */}
        <div style={{ height: '80px' }}></div>
      </IonContent>

      {/* Footer con botones de navegación */}
      <IonFooter>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-align-items-center">
              {currentStep === 'general' ? (
                <>
                  <IonCol size="6" className="ion-text-start">
                    <IonText color="medium">
                      <small>Paso 1 de 3</small>
                    </IonText>
                  </IonCol>
                  <IonCol size="6" className="ion-text-end">
                    <IonButton 
                      fill="solid" 
                      onClick={navegarSiguiente}
                      disabled={!puedeAvanzar()}
                    >
                      Siguiente
                      <IonIcon icon={chevronForwardOutline} slot="end" />
                    </IonButton>
                  </IonCol>
                </>
              ) : currentStep === 'fisico' ? (
                <>
                  <IonCol size="4" className="ion-text-start">
                    <IonButton fill="outline" onClick={navegarAnterior}>
                      <IonIcon icon={chevronBackOutline} slot="start" />
                      Anterior
                    </IonButton>
                  </IonCol>
                  <IonCol size="4" className="ion-text-center">
                    <IonText color="medium">
                      <small>Paso 2 de 3</small>
                    </IonText>
                  </IonCol>
                  <IonCol size="4" className="ion-text-end">
                    <IonButton fill="solid" onClick={navegarSiguiente}>
                      Siguiente
                      <IonIcon icon={chevronForwardOutline} slot="end" />
                    </IonButton>
                  </IonCol>
                </>
              ) : (
                <>
                  <IonCol size="4" className="ion-text-start">
                    <IonButton fill="outline" onClick={navegarAnterior}>
                      <IonIcon icon={chevronBackOutline} slot="start" />
                      Anterior
                    </IonButton>
                  </IonCol>
                  <IonCol size="4" className="ion-text-center">
                    <IonText color="medium">
                      <small>Paso 3 de 3</small>
                    </IonText>
                  </IonCol>
                  <IonCol size="4" className="ion-text-end">
                    <IonButton
                      fill="solid"
                      color="success"
                      onClick={guardarFicha}
                      disabled={isLoading}
                    >
                      <IonIcon icon={saveOutline} slot="start" />
                      {isLoading ? 'Guardando...' : 'Guardar'}
                    </IonButton>
                  </IonCol>
                </>
              )}
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>

      {/* Modal para escoger paciente */}
      <ModalEscogerPaciente
        isOpen={showModalPacientes}
        onDismiss={() => setShowModalPacientes(false)}
        onPacienteSelected={handlePacienteSelected} // Función corregida
      />

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
      />
    </IonPage>
  );
};

export default RellenarFicha;