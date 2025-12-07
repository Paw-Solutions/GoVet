import React from "react";
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
  IonListHeader,
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
  IonNote,
} from "@ionic/react";
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
  thermometerOutline,
  waterOutline,
  timeOutline,
  shieldOutline,
  documentTextOutline,
  medkitOutline,
} from "ionicons/icons";
import "../../styles/infoFicha.css";
import { ConsultaData, calcularEdadPaciente } from "../../api/fichas";
// Componente: Visualizador del detalle de consulta
interface ModalInfoFichaProps {
  isOpen: boolean;
  onDismiss: () => void;
  consulta: ConsultaData | null;
}

const ModalInfoFicha: React.FC<ModalInfoFichaProps> = ({
  isOpen,
  onDismiss,
  consulta,
}) => {
  // Función segura para cerrar el modal
  const handleDismiss = () => {
    try {
      onDismiss();
    } catch (error) {
      console.error("Error closing modal:", error);
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Función para formatear fecha corta
  const formatShortDate = (dateString?: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Función para capitalizar texto
  const capitalizeText = (text?: string | number | null): string => {
    if (!text) return "No especificado";
    const textStr = String(text);
    return textStr.charAt(0).toUpperCase() + textStr.slice(1).toLowerCase();
  };

  // Función para obtener color del badge según sexo
  const getSexColor = (sexo?: string) => {
    switch (sexo?.toLowerCase()) {
      case "m":
      case "macho":
        return "primary";
      case "h":
      case "hembra":
        return "secondary";
      default:
        return "medium";
    }
  };

  // Función para obtener color del badge según pronóstico
  const getBadgeColor = (pronostico?: string) => {
    switch (pronostico?.toLowerCase()) {
      case "bueno":
      case "excelente":
        return "success";
      case "reservado":
      case "regular":
        return "warning";
      case "grave":
      case "malo":
        return "danger";
      default:
        return "medium";
    }
  };

  const formatEspecie = (especie?: string) => {
    if (!especie) return pawOutline;

    const especies: { [key: string]: string } = {
      perro: "dog.svg",
      gato: "cat.svg",
      conejo: "rabbit.svg",
      hamster: "hamster.svg",
      erizo: "hedgehog.svg",
      tortuga: "turtle.svg",
      cuy: "cuy.svg",
    };

    return especies[especie.toLowerCase()] || pawOutline;
  };
  // Función para formatear sexo
  const formatSex = (sexo?: string) => {
    switch (sexo?.toLowerCase()) {
      case "m":
        return maleOutline;
      case "h":
        return femaleOutline;
      default:
        return banOutline;
    }
  };

  // Si no hay ficha o no hay modal abierto, no renderizar nada
  if (!isOpen || !consulta) {
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
          <IonTitle>Ficha Clínica</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={handleDismiss}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Header Simple */}
        <div
          className="ion-padding-bottom ion-margin-bottom"
          style={{ borderBottom: "1px solid var(--ion-color-light-shade)" }}
        >
          <IonText color="medium">
            <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
              <IonIcon
                icon={calendarOutline}
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              />
              {formatDate(consulta.fecha_consulta)}
            </p>
          </IonText>
          <h1 className="ion-no-margin" style={{ marginBottom: "8px" }}>
            {consulta.motivo || "Consulta General"}
          </h1>
          {consulta.pronostico && (
            <IonBadge color={getBadgeColor(consulta.pronostico)}>
              {capitalizeText(consulta.pronostico)}
            </IonBadge>
          )}
        </div>

        {/* 1. Constantes Vitales (Grilla 3x2) */}
        <div className="ion-margin-bottom">
          <h3
            style={{ marginBottom: "12px", color: "var(--ion-color-primary)" }}
          >
            Constantes Vitales
          </h3>
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol size="4" className="ion-text-center">
                <IonIcon
                  icon={scaleOutline}
                  color="medium"
                  style={{ fontSize: "24px" }}
                />
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "4px 0",
                  }}
                >
                  {consulta.peso || "--"}
                </div>
                <small style={{ color: "var(--ion-color-medium)" }}>kg</small>
              </IonCol>
              <IonCol size="4" className="ion-text-center">
                <IonIcon
                  icon={thermometerOutline}
                  color="danger"
                  style={{ fontSize: "24px" }}
                />
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "4px 0",
                  }}
                >
                  {consulta.temperatura || "--"}
                </div>
                <small style={{ color: "var(--ion-color-medium)" }}>°C</small>
              </IonCol>
              <IonCol size="4" className="ion-text-center">
                <IonIcon
                  icon={heartOutline}
                  color="danger"
                  style={{ fontSize: "24px" }}
                />
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "4px 0",
                  }}
                >
                  {consulta.frecuencia_cardiaca || "--"}
                </div>
                <small style={{ color: "var(--ion-color-medium)" }}>LPM</small>
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: "12px" }}>
              <IonCol size="4" className="ion-text-center">
                <IonIcon
                  icon={pulseOutline}
                  color="primary"
                  style={{ fontSize: "24px" }}
                />
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "4px 0",
                  }}
                >
                  {consulta.frecuencia_respiratoria || "--"}
                </div>
                <small style={{ color: "var(--ion-color-medium)" }}>RPM</small>
              </IonCol>
              <IonCol size="4" className="ion-text-center">
                <IonIcon
                  icon={timeOutline}
                  color="warning"
                  style={{ fontSize: "24px" }}
                />
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "4px 0",
                  }}
                >
                  {consulta.tllc || "--"}
                </div>
                <small style={{ color: "var(--ion-color-medium)" }}>
                  seg TLLC
                </small>
              </IonCol>
              <IonCol size="4" className="ion-text-center">
                <IonIcon
                  icon={waterOutline}
                  color="tertiary"
                  style={{ fontSize: "24px" }}
                />
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "4px 0",
                  }}
                >
                  {consulta.deshidratacion || "--"}
                </div>
                <small style={{ color: "var(--ion-color-medium)" }}>
                  % Desh.
                </small>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* 2. Diagnóstico y Examen (Card Principal) */}
        <IonCard
          className="ion-no-margin ion-margin-bottom"
          style={{ borderLeft: "4px solid var(--ion-color-primary)" }}
        >
          <IonCardContent>
            <h3 style={{ color: "var(--ion-color-primary)", marginTop: 0 }}>
              Diagnóstico
            </h3>
            <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
              {consulta.diagnostico || "No registrado"}
            </p>

            {(consulta.mucosas ||
              consulta.condicion_corporal ||
              consulta.estado_pelaje ||
              consulta.estado_piel) && (
              <div className="ion-margin-top">
                {consulta.mucosas && (
                  <IonChip outline={true} color="secondary">
                    <IonLabel>Mucosas: {consulta.mucosas}</IonLabel>
                  </IonChip>
                )}
                {consulta.condicion_corporal && (
                  <IonChip outline={true} color="secondary">
                    <IonLabel>
                      Condición: {consulta.condicion_corporal}
                    </IonLabel>
                  </IonChip>
                )}
                {consulta.estado_pelaje && (
                  <IonChip outline={true} color="tertiary">
                    <IonLabel>Pelaje: {consulta.estado_pelaje}</IonLabel>
                  </IonChip>
                )}
                {consulta.estado_piel && (
                  <IonChip outline={true} color="tertiary">
                    <IonLabel>Piel: {consulta.estado_piel}</IonLabel>
                  </IonChip>
                )}
              </div>
            )}

            {consulta.examen_clinico && (
              <div className="ion-margin-top">
                <p style={{ marginBottom: "4px" }}>
                  <strong>Examen Clínico:</strong>
                </p>
                <p style={{ fontSize: "14px" }}>{consulta.examen_clinico}</p>
              </div>
            )}

            {consulta.observaciones && (
              <div className="ion-margin-top">
                <p style={{ marginBottom: "4px" }}>
                  <strong>Observaciones:</strong>
                </p>
                <p style={{ fontSize: "14px" }}>{consulta.observaciones}</p>
              </div>
            )}

            {consulta.nodulos_linfaticos && (
              <div className="ion-margin-top">
                <p style={{ marginBottom: "4px" }}>
                  <strong>Nódulos Linfáticos:</strong>
                </p>
                <p style={{ fontSize: "14px" }}>
                  {consulta.nodulos_linfaticos}
                </p>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        {/* 3. Tratamientos (Listas) */}
        {(consulta.receta_medica?.length ||
          consulta.vacunas_inoculadas?.length ||
          consulta.desparasitacion_interna ||
          consulta.desparasitacion_externa) && (
          <IonList inset={true} className="ion-margin-bottom">
            <IonListHeader>
              <IonLabel>Plan y Tratamiento</IonLabel>
            </IonListHeader>

            {/* Recetas Médicas */}
            {consulta.receta_medica && consulta.receta_medica.length > 0 && (
              <>
                <IonItem lines="none" color="light">
                  <IonLabel>
                    <h3 style={{ fontWeight: "600", margin: "8px 0" }}>
                      Receta Médica
                    </h3>
                  </IonLabel>
                </IonItem>
                {consulta.receta_medica.map((receta, index) => (
                  <IonItem key={`receta-${index}`} lines="full">
                    <IonIcon
                      icon={documentTextOutline}
                      slot="start"
                      color="primary"
                    />
                    <IonLabel>
                      <h2 style={{ fontWeight: "600" }}>
                        {receta.medicamento}
                      </h2>
                      <p style={{ fontSize: "13px", marginTop: "4px" }}>
                        {receta.frecuencia} por {receta.duracion}
                      </p>
                    </IonLabel>
                    <IonNote slot="end" color="dark">
                      {receta.dosis}
                    </IonNote>
                  </IonItem>
                ))}
              </>
            )}

            {/* Vacunas */}
            {consulta.vacunas_inoculadas &&
              consulta.vacunas_inoculadas.length > 0 && (
                <>
                  <IonItem lines="none" color="light">
                    <IonLabel>
                      <h3 style={{ fontWeight: "600", margin: "8px 0" }}>
                        Vacunas Administradas
                      </h3>
                    </IonLabel>
                  </IonItem>
                  {consulta.vacunas_inoculadas.map((vacuna, index) => (
                    <IonItem key={`vacuna-${index}`} lines="full">
                      <IonIcon
                        icon={shieldOutline}
                        slot="start"
                        color="success"
                      />
                      <IonLabel>
                        <h2 style={{ fontWeight: "600" }}>
                          {vacuna.nombre_vacuna}
                        </h2>
                        <p style={{ fontSize: "13px", marginTop: "4px" }}>
                          Fecha: {formatShortDate(vacuna.fecha_vacunacion)}
                          {vacuna.marca && ` • Marca: ${vacuna.marca}`}
                        </p>
                        {vacuna.proxima_dosis && (
                          <p
                            style={{
                              fontSize: "13px",
                              color: "var(--ion-color-warning)",
                            }}
                          >
                            Próxima dosis:{" "}
                            {formatShortDate(vacuna.proxima_dosis)}
                          </p>
                        )}
                      </IonLabel>
                    </IonItem>
                  ))}
                </>
              )}

            {/* Antiparasitarios Internos */}
            {consulta.desparasitacion_interna && (
              <>
                <IonItem lines="none" color="light">
                  <IonLabel>
                    <h3 style={{ fontWeight: "600", margin: "8px 0" }}>
                      Antiparasitario Interno
                    </h3>
                  </IonLabel>
                </IonItem>
                <IonItem lines="full">
                  <IonIcon icon={medkitOutline} slot="start" color="tertiary" />
                  <IonLabel>
                    <h2 style={{ fontWeight: "600" }}>
                      {consulta.desparasitacion_interna.nombre_desparasitante}
                    </h2>
                    <p style={{ fontSize: "13px", marginTop: "4px" }}>
                      Fecha:{" "}
                      {formatShortDate(
                        consulta.desparasitacion_interna.fecha_administracion
                      )}
                      {consulta.desparasitacion_interna.marca &&
                        ` • Marca: ${consulta.desparasitacion_interna.marca}`}
                    </p>
                    {consulta.desparasitacion_interna.proxima_dosis && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--ion-color-warning)",
                        }}
                      >
                        Próxima dosis:{" "}
                        {formatShortDate(
                          consulta.desparasitacion_interna.proxima_dosis
                        )}
                      </p>
                    )}
                  </IonLabel>
                </IonItem>
              </>
            )}

            {/* Antiparasitarios Externos */}
            {consulta.desparasitacion_externa && (
              <>
                <IonItem lines="none" color="light">
                  <IonLabel>
                    <h3 style={{ fontWeight: "600", margin: "8px 0" }}>
                      Antiparasitario Externo
                    </h3>
                  </IonLabel>
                </IonItem>
                <IonItem lines="full">
                  <IonIcon
                    icon={medkitOutline}
                    slot="start"
                    color="secondary"
                  />
                  <IonLabel>
                    <h2 style={{ fontWeight: "600" }}>
                      {consulta.desparasitacion_externa.nombre_desparasitante}
                    </h2>
                    <p style={{ fontSize: "13px", marginTop: "4px" }}>
                      Fecha:{" "}
                      {formatShortDate(
                        consulta.desparasitacion_externa.fecha_administracion
                      )}
                      {consulta.desparasitacion_externa.marca &&
                        ` • Marca: ${consulta.desparasitacion_externa.marca}`}
                    </p>
                    {consulta.desparasitacion_externa.proxima_dosis && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--ion-color-warning)",
                        }}
                      >
                        Próxima dosis:{" "}
                        {formatShortDate(
                          consulta.desparasitacion_externa.proxima_dosis
                        )}
                      </p>
                    )}
                  </IonLabel>
                </IonItem>
              </>
            )}

            {/* Indicaciones Generales */}
            {consulta.indicaciones_generales && (
              <>
                <IonItem lines="none" color="light">
                  <IonLabel>
                    <h3 style={{ fontWeight: "600", margin: "8px 0" }}>
                      Indicaciones Generales
                    </h3>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel className="ion-text-wrap">
                    <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                      {consulta.indicaciones_generales}
                    </p>
                  </IonLabel>
                </IonItem>
              </>
            )}

            {/* Orden de Exámenes */}
            {consulta.orden_de_examenes && (
              <>
                <IonItem lines="none" color="light">
                  <IonLabel>
                    <h3 style={{ fontWeight: "600", margin: "8px 0" }}>
                      Orden de Exámenes
                    </h3>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel className="ion-text-wrap">
                    <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                      {consulta.orden_de_examenes}
                    </p>
                  </IonLabel>
                </IonItem>
              </>
            )}
          </IonList>
        )}

        {/* Próxima Consulta */}
        {consulta.proxima_consulta && (
          <IonCard
            className="ion-margin-bottom"
            style={{ backgroundColor: "var(--ion-color-warning-tint)" }}
          >
            <IonCardContent>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <IonIcon
                  icon={calendarOutline}
                  color="warning"
                  style={{ fontSize: "20px" }}
                />
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "var(--ion-color-medium)",
                    }}
                  >
                    Próxima Consulta
                  </p>
                  <p style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                    {formatDate(consulta.proxima_consulta)}
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Información del Paciente y Tutor */}
        {(consulta.paciente || consulta.tutor) && (
          <IonCard className="ion-margin-bottom">
            <IonCardContent>
              {consulta.paciente && (
                <div className="ion-margin-bottom">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <IonIcon icon={pawOutline} color="primary" />
                    <h3 style={{ margin: 0, fontWeight: "600" }}>Paciente</h3>
                  </div>
                  <p style={{ margin: "4px 0", fontSize: "15px" }}>
                    <strong>{consulta.paciente.nombre}</strong>
                    {consulta.paciente.especie &&
                      ` • ${capitalizeText(consulta.paciente.especie)}`}
                    {consulta.paciente.raza &&
                      ` • ${capitalizeText(consulta.paciente.raza)}`}
                    {consulta.paciente.sexo && (
                      <IonIcon
                        icon={
                          consulta.paciente.sexo.toLowerCase() === "m"
                            ? maleOutline
                            : femaleOutline
                        }
                        style={{ marginLeft: "4px", verticalAlign: "middle" }}
                      />
                    )}
                  </p>
                  {consulta.paciente.fecha_nacimiento && (
                    <p
                      style={{
                        margin: "4px 0",
                        fontSize: "13px",
                        color: "var(--ion-color-medium)",
                      }}
                    >
                      Edad:{" "}
                      {calcularEdadPaciente(consulta.paciente.fecha_nacimiento)}
                    </p>
                  )}
                </div>
              )}

              {consulta.tutor && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <IonIcon icon={personOutline} color="secondary" />
                    <h3 style={{ margin: 0, fontWeight: "600" }}>Tutor</h3>
                  </div>
                  <p style={{ margin: "4px 0", fontSize: "15px" }}>
                    <strong>
                      {consulta.tutor.nombre} {consulta.tutor.apellido_paterno}{" "}
                      {consulta.tutor.apellido_materno}
                    </strong>
                  </p>
                  <p
                    style={{
                      margin: "4px 0",
                      fontSize: "13px",
                      color: "var(--ion-color-medium)",
                    }}
                  >
                    RUT: {consulta.tutor.rut}
                  </p>
                  {consulta.tutor.telefono && (
                    <p
                      style={{
                        margin: "4px 0",
                        fontSize: "13px",
                        color: "var(--ion-color-medium)",
                      }}
                    >
                      Tel: {consulta.tutor.telefono}
                    </p>
                  )}
                </div>
              )}
            </IonCardContent>
          </IonCard>
        )}

        {/* Botón de cierre */}
        <div style={{ paddingBottom: "24px" }}>
          <IonButton
            expand="block"
            fill="outline"
            onClick={handleDismiss}
            size="large"
          >
            <IonIcon icon={closeOutline} slot="start" />
            Cerrar Ficha
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalInfoFicha;
