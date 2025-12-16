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
  IonAccordion,
  IonAccordionGroup,
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
  timeOutline,
  documentTextOutline,
  medkitOutline,
  colorWandOutline,
  waterOutline,
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

        {/* Acordeón para todas las secciones */}
        <IonAccordionGroup
          expand="inset"
          multiple={true}
          value={["constantes", "examen", "diagnostico", "tratamientos"]}
        >
          {/* 1. Constantes Vitales */}
          <IonAccordion value="constantes">
            <IonItem slot="header" color="light">
              <IonIcon
                icon={pulseOutline}
                slot="start"
                color="primary"
                style={{ fontSize: "24px" }}
              />
              <IonLabel>
                <h2
                  style={{
                    fontWeight: "600",
                    color: "var(--ion-color-primary)",
                  }}
                >
                  Frecuencia y Constantes Vitales
                </h2>
              </IonLabel>
            </IonItem>
            <div slot="content" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="6" className="ion-text-center">
                    <IonIcon
                      icon={scaleOutline}
                      color="primary"
                      style={{ fontSize: "28px" }}
                    />
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        margin: "8px 0 4px 0",
                        color: "var(--ion-color-primary)",
                      }}
                    >
                      {consulta.peso || "--"}
                    </div>
                    <small style={{ color: "var(--ion-color-medium)" }}>
                      Peso (kg)
                    </small>
                  </IonCol>
                  <IonCol size="6" className="ion-text-center">
                    <IonIcon
                      icon={thermometerOutline}
                      color="danger"
                      style={{ fontSize: "28px" }}
                    />
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        margin: "8px 0 4px 0",
                        color: "var(--ion-color-danger)",
                      }}
                    >
                      {consulta.temperatura || "--"}
                    </div>
                    <small style={{ color: "var(--ion-color-medium)" }}>
                      Temp (°C)
                    </small>
                  </IonCol>
                </IonRow>
                <IonRow style={{ marginTop: "16px" }}>
                  <IonCol size="6" className="ion-text-center">
                    <IonIcon
                      icon={heartOutline}
                      color="danger"
                      style={{ fontSize: "28px" }}
                    />
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        margin: "8px 0 4px 0",
                        color: "var(--ion-color-danger)",
                      }}
                    >
                      {consulta.frecuencia_cardiaca || "--"}
                    </div>
                    <small style={{ color: "var(--ion-color-medium)" }}>
                      FC (LPM)
                    </small>
                  </IonCol>
                  <IonCol size="6" className="ion-text-center">
                    <IonIcon
                      icon={pulseOutline}
                      color="primary"
                      style={{ fontSize: "28px" }}
                    />
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        margin: "8px 0 4px 0",
                        color: "var(--ion-color-primary)",
                      }}
                    >
                      {consulta.frecuencia_respiratoria || "--"}
                    </div>
                    <small style={{ color: "var(--ion-color-medium)" }}>
                      FR (RPM)
                    </small>
                  </IonCol>
                </IonRow>
                <IonRow style={{ marginTop: "16px" }}>
                  <IonCol size="6" className="ion-text-center">
                    <IonIcon
                      icon={timeOutline}
                      color="warning"
                      style={{ fontSize: "28px" }}
                    />
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        margin: "8px 0 4px 0",
                        color: "var(--ion-color-warning)",
                      }}
                    >
                      {consulta.tllc || "--"}
                    </div>
                    <small style={{ color: "var(--ion-color-medium)" }}>
                      TLLC (seg)
                    </small>
                  </IonCol>
                  <IonCol size="6" className="ion-text-center">
                    <IonIcon
                      icon={waterOutline}
                      color="tertiary"
                      style={{ fontSize: "28px" }}
                    />
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        margin: "8px 0 4px 0",
                        color: "var(--ion-color-tertiary)",
                      }}
                    >
                      {consulta.dht ? `${consulta.dht}%` : "--"}
                    </div>
                    <small style={{ color: "var(--ion-color-medium)" }}>
                      DHT (%)
                    </small>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>

          {/* 2. Examen Físico */}
          {(consulta.mucosas ||
            consulta.condicion_corporal ||
            consulta.estado_pelaje ||
            consulta.estado_piel ||
            consulta.nodulos_linfaticos ||
            consulta.examen_clinico) && (
            <IonAccordion value="examen">
              <IonItem slot="header" color="light">
                <IonIcon
                  icon={bodyOutline}
                  slot="start"
                  color="tertiary"
                  style={{ fontSize: "24px" }}
                />
                <IonLabel>
                  <h2
                    style={{
                      fontWeight: "600",
                      color: "var(--ion-color-tertiary)",
                    }}
                  >
                    Examen Físico
                  </h2>
                </IonLabel>
              </IonItem>
              <div slot="content" className="ion-padding">
                {/* Chips para datos estructurados */}
                {(consulta.mucosas ||
                  consulta.condicion_corporal ||
                  consulta.estado_pelaje ||
                  consulta.estado_piel) && (
                  <div className="ion-margin-bottom">
                    {consulta.mucosas && (
                      <IonChip outline={true} color="tertiary">
                        <IonLabel>Mucosas: {consulta.mucosas}</IonLabel>
                      </IonChip>
                    )}
                    {consulta.condicion_corporal && (
                      <IonChip outline={true} color="tertiary">
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

                {/* Examen clínico detallado */}
                {consulta.examen_clinico && (
                  <div className="ion-margin-bottom">
                    <p
                      style={{
                        marginBottom: "6px",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      Examen Clínico:
                    </p>
                    <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                      {consulta.examen_clinico}
                    </p>
                  </div>
                )}

                {/* Nódulos linfáticos */}
                {consulta.nodulos_linfaticos && (
                  <div>
                    <p
                      style={{
                        marginBottom: "6px",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      Nódulos Linfáticos:
                    </p>
                    <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                      {consulta.nodulos_linfaticos}
                    </p>
                  </div>
                )}
              </div>
            </IonAccordion>
          )}

          {/* 3. Diagnóstico */}
          <IonAccordion value="diagnostico">
            <IonItem slot="header" color="light">
              <IonIcon
                icon={medicalOutline}
                slot="start"
                color="secondary"
                style={{ fontSize: "24px" }}
              />
              <IonLabel>
                <h2
                  style={{
                    fontWeight: "600",
                    color: "var(--ion-color-secondary)",
                  }}
                >
                  Diagnóstico
                </h2>
              </IonLabel>
            </IonItem>
            <div slot="content" className="ion-padding">
              <p style={{ fontSize: "16px", lineHeight: "1.6", margin: 0 }}>
                {consulta.diagnostico || "No registrado"}
              </p>

              {consulta.observaciones && (
                <div className="ion-margin-top">
                  <p
                    style={{
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Observaciones:
                  </p>
                  <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                    {consulta.observaciones}
                  </p>
                </div>
              )}
            </div>
          </IonAccordion>

          {/* 4. Tratamientos */}
          {(consulta.recetas?.length ||
            consulta.tratamientos?.length ||
            consulta.indicaciones_generales) && (
            <IonAccordion value="tratamientos">
              <IonItem slot="header" color="light">
                <IonIcon
                  icon={medkitOutline}
                  slot="start"
                  color="warning"
                  style={{ fontSize: "24px" }}
                />
                <IonLabel>
                  <h2
                    style={{
                      fontWeight: "600",
                      color: "var(--ion-color-warning)",
                    }}
                  >
                    Plan y Tratamiento
                  </h2>
                </IonLabel>
              </IonItem>
              <div slot="content">
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                  {/* Recetas Médicas */}
                  {consulta.recetas && consulta.recetas.length > 0 && (
                    <>
                      <IonItem lines="none" color="light">
                        <IonLabel>
                          <h3
                            style={{
                              fontWeight: "600",
                              margin: "8px 0",
                              color: "var(--ion-color-warning)",
                            }}
                          >
                            Receta Médica
                          </h3>
                        </IonLabel>
                      </IonItem>
                      {consulta.recetas.map((receta, index) => (
                        <IonItem key={`receta-${index}`} lines="full">
                          <IonIcon
                            icon={documentTextOutline}
                            slot="start"
                            color="warning"
                            style={{ fontSize: "24px" }}
                          />
                          <IonLabel>
                            <h2 style={{ fontWeight: "600", fontSize: "15px" }}>
                              {receta.medicamento}
                            </h2>
                            <p
                              style={{
                                fontSize: "14px",
                                marginTop: "4px",
                                color: "var(--ion-color-dark)",
                              }}
                            >
                              Dosis: {receta.dosis}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                marginTop: "2px",
                                color: "var(--ion-color-medium)",
                              }}
                            >
                              Cada {receta.frecuencia}h · Por {receta.duracion}{" "}
                              días
                            </p>
                            {receta.numero_serie && (
                              <p
                                style={{
                                  fontSize: "12px",
                                  color: "var(--ion-color-medium)",
                                  marginTop: "2px",
                                }}
                              >
                                Serie: {receta.numero_serie}
                              </p>
                            )}
                          </IonLabel>
                        </IonItem>
                      ))}
                    </>
                  )}

                  {/* Procedimientos (Vacunas/Antiparasitarios) */}
                  {consulta.tratamientos &&
                    consulta.tratamientos.length > 0 && (
                      <>
                        <IonItem lines="none" color="light">
                          <IonLabel>
                            <h3
                              style={{
                                fontWeight: "600",
                                margin: "8px 0",
                                color: "var(--ion-color-success)",
                              }}
                            >
                              Procedimientos Aplicados
                            </h3>
                          </IonLabel>
                        </IonItem>
                        {consulta.tratamientos.map((tratamiento, index) => {
                          // Determinar icono según tipo de tratamiento
                          let iconColor = "success";
                          let icon = medkitOutline;

                          if (
                            tratamiento.tipo_tratamiento
                              ?.toLowerCase()
                              .includes("vacuna") ||
                            tratamiento.nombre_tratamiento
                              ?.toLowerCase()
                              .includes("vacuna")
                          ) {
                            icon = colorWandOutline;
                            iconColor = "success";
                          } else if (
                            tratamiento.tipo_tratamiento
                              ?.toLowerCase()
                              .includes("antiparasitario")
                          ) {
                            icon = medkitOutline;
                            iconColor = "success";
                          }

                          return (
                            <IonItem key={`tratamiento-${index}`} lines="full">
                              <IonIcon
                                icon={icon}
                                slot="start"
                                color={iconColor}
                                style={{ fontSize: "24px" }}
                              />
                              <IonLabel>
                                <h2
                                  style={{
                                    fontWeight: "600",
                                    fontSize: "15px",
                                  }}
                                >
                                  {tratamiento.nombre_tratamiento}
                                </h2>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    marginTop: "4px",
                                    color: "var(--ion-color-dark)",
                                  }}
                                >
                                  {tratamiento.fecha_tratamiento &&
                                    `Fecha: ${formatShortDate(
                                      tratamiento.fecha_tratamiento
                                    )}`}
                                  {tratamiento.dosis &&
                                    (tratamiento.fecha_tratamiento
                                      ? " · "
                                      : "") + `Dosis: ${tratamiento.dosis}`}
                                </p>
                                {(tratamiento.marca ||
                                  tratamiento.numero_serial) && (
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      color: "var(--ion-color-medium)",
                                      marginTop: "2px",
                                    }}
                                  >
                                    {tratamiento.marca &&
                                      `Marca: ${tratamiento.marca}`}
                                    {tratamiento.marca &&
                                      tratamiento.numero_serial &&
                                      " · "}
                                    {tratamiento.numero_serial &&
                                      `Serie: ${tratamiento.numero_serial}`}
                                  </p>
                                )}
                                {tratamiento.proxima_dosis && (
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      color: "var(--ion-color-warning)",
                                      marginTop: "4px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Próxima dosis:{" "}
                                    {formatShortDate(tratamiento.proxima_dosis)}
                                  </p>
                                )}
                              </IonLabel>
                            </IonItem>
                          );
                        })}
                      </>
                    )}

                  {/* Indicaciones Generales */}
                  {consulta.indicaciones_generales && (
                    <>
                      <IonItem lines="none" color="light">
                        <IonLabel>
                          <h3
                            style={{
                              fontWeight: "600",
                              margin: "8px 0",
                              color: "var(--ion-color-medium)",
                            }}
                          >
                            Indicaciones Generales
                          </h3>
                        </IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonIcon
                          icon={clipboardOutline}
                          slot="start"
                          color="medium"
                          style={{ fontSize: "24px" }}
                        />
                        <IonLabel className="ion-text-wrap">
                          <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                            {consulta.indicaciones_generales}
                          </p>
                        </IonLabel>
                      </IonItem>
                    </>
                  )}
                </IonList>
              </div>
            </IonAccordion>
          )}
        </IonAccordionGroup>

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
