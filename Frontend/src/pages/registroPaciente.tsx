import React, { useState } from "react";
import {
  IonModal,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonSpinner,
  IonText,
  IonRadioGroup,
  IonRadio,
  IonToggle,
  IonIcon,
} from "@ionic/react";
import { search, add, person } from "ionicons/icons";
import "../styles/registroPaciente.css";
import "../styles/main.css";
import { useRegistroPaciente } from "../hooks/useRegistroPaciente";
import { SelectorEspecie } from "../components/registroPaciente/SelectorEspecie";
import { SelectorRaza } from "../components/registroPaciente/SelectorRaza";
import ModalBuscarTutor from "../components/registroPaciente/ModalBuscarTutor";
import RegistroTutor from "./registroTutor";
// Componente: Interfaz para gestionar pacientes
interface Tutor {
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
  comuna: string;
  region: string;
}

const RegistroPaciente: React.FC = () => {
  const [showModalRegistroTutor, setShowModalRegistroTutor] = useState(false);
  const [showModalBuscarTutor, setShowModalBuscarTutor] = useState(false);
  const [tutorSeleccionado, setTutorSeleccionado] = useState<Tutor | null>(
    null
  );

  const {
    formData,
    setFormData,
    especiesData,
    razasData,
    loadingEspecies,
    loadingRazas,
    initialLoading,
    especieQuery,
    razaQuery,
    showEspecieList,
    showRazaList,
    showToast,
    toastMessage,
    setEspecieQuery,
    setRazaQuery,
    setShowEspecieList,
    setShowRazaList,
    setShowToast,
    handleInputChange,
    selectEspecie,
    selectRaza,
    registraPaciente,
    clearEspecie,
  } = useRegistroPaciente();

  // Filtros
  const filteredEspecies = especiesData
    .filter((especie) => {
      if (!especieQuery.trim()) {
        return true;
      }
      return especie.nombre_comun
        .toLowerCase()
        .includes(especieQuery.toLowerCase());
    })
    .slice(0, 4);

  const filteredRazas = razasData
    .filter((raza: any) => {
      if (!razaQuery.trim()) {
        return true;
      }
      return raza.nombre.toLowerCase().includes(razaQuery.toLowerCase());
    })
    .slice(0, 4);

  const handleTutorSelected = (tutor: Tutor) => {
    setTutorSeleccionado(tutor);
    // Actualizar el formData con el RUT del tutor seleccionado
    setFormData((prev) => ({
      ...prev,
      rut_tutor: tutor.rut,
    }));
  };

  const handleRegistrarPaciente = async () => {
    if (!tutorSeleccionado) {
      setShowToast(true);
      // Aquí deberías usar un mensaje de error apropiado
      return;
    }
    await registraPaciente();
  };

  if (initialLoading) {
    return (
      <IonPage>
        <IonContent className="ion-text-center ion-padding">
          <IonSpinner name="crescent" color="primary" />
          <p>Cargando formulario...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Registrar Paciente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Registrar Paciente</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonGrid>
            {/* 1. Nombre del paciente */}
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    name="nombre"
                    label="Nombre"
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Ej: copito"
                    value={formData.nombre}
                    onIonInput={handleInputChange}
                  />
                </IonItem>
              </IonCol>
            </IonRow>

            {/* 2. Selección de especie */}
            <IonRow>
              <IonCol>
                <SelectorEspecie
                  especieQuery={especieQuery}
                  setEspecieQuery={setEspecieQuery}
                  showEspecieList={showEspecieList}
                  setShowEspecieList={setShowEspecieList}
                  filteredEspecies={filteredEspecies}
                  loadingEspecies={loadingEspecies}
                  selectEspecie={selectEspecie}
                  onClearEspecie={clearEspecie}
                  hasSelectedEspecie={!!formData.especie}
                />
              </IonCol>
            </IonRow>

            {/* 3. Selección de raza */}
            <IonRow>
              <IonCol>
                <SelectorRaza
                  razaQuery={razaQuery}
                  setRazaQuery={setRazaQuery}
                  showRazaList={showRazaList}
                  setShowRazaList={setShowRazaList}
                  filteredRazas={filteredRazas}
                  loadingRazas={loadingRazas}
                  selectRaza={selectRaza}
                  especieSeleccionada={!!formData.especie}
                />
              </IonCol>
            </IonRow>

            {/* 4. Color y Sexo */}
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    name="color"
                    label="Color"
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Ej: Naranja"
                    value={formData.color}
                    onIonInput={handleInputChange}
                    onKeyDown={(e) => {
                      const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;
                      const teclasPermitidas = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                        "Home",
                        "End",
                      ];

                      if (
                        !regex.test(e.key) &&
                        !teclasPermitidas.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem lines="none">
                  <IonRadioGroup
                    className="radio-group-spaced"
                    value={formData.sexo}
                    onIonChange={(e) =>
                      setFormData((prev) => ({ ...prev, sexo: e.detail.value }))
                    }
                  >
                    <IonRadio slot="start" value="M">
                      M
                    </IonRadio>
                    <IonRadio slot="start" value="H">
                      H
                    </IonRadio>
                  </IonRadioGroup>
                </IonItem>
              </IonCol>
            </IonRow>

            {/* 5. Fecha de nacimiento */}
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    name="fechaNacimiento"
                    label="Fecha de nacimiento"
                    type="date"
                    labelPlacement="stacked"
                    fill="outline"
                    value={formData.fechaNacimiento}
                    onIonInput={handleInputChange}
                  />
                </IonItem>
              </IonCol>
            </IonRow>

            {/* 5.5. Toggle de Esterilización */}
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonLabel>¿Está esterilizado?</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={formData.esterilizado || false}
                    onIonChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        esterilizado: e.detail.checked,
                      }))
                    }
                  />
                </IonItem>
              </IonCol>
            </IonRow>

            {/* 6. Código Chip (Opcional) */}
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonInput
                    name="codigo_chip"
                    label="Código Chip (Opcional)"
                    type="text"
                    labelPlacement="stacked"
                    fill="outline"
                    placeholder="Ej: 123456789012345"
                    value={formData.codigo_chip}
                    onIonInput={handleInputChange}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          <hr className="section-separator" />

          {/* Sección de tutor */}
          <div className="tutor-section">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonText>
                    <h3>Asignar Tutor</h3>
                  </IonText>
                </IonCol>
              </IonRow>

              {tutorSeleccionado ? (
                <IonRow>
                  <IonCol>
                    <IonItem
                      lines="none"
                      style={{
                        border: "2px solid var(--ion-color-success)",
                        borderRadius: "8px",
                        background: "linear-gradient(145deg, #e8f5e8, #f0f9f0)",
                        margin: "4px 0",
                      }}
                    >
                      <IonIcon icon={person} slot="start" color="success" />
                      <IonLabel>
                        <h2 style={{ fontWeight: "600" }}>
                          {`${tutorSeleccionado.nombre} ${tutorSeleccionado.apellido}`}
                        </h2>
                        <p>
                          <strong>RUT:</strong> {tutorSeleccionado.rut}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {tutorSeleccionado.email || "N/A"} •
                          <strong> Tel:</strong>{" "}
                          {tutorSeleccionado.telefono || "N/A"}
                        </p>
                      </IonLabel>
                      <IonButtons slot="end">
                        <IonButton
                          fill="clear"
                          onClick={() => setShowModalBuscarTutor(true)}
                        >
                          Cambiar
                        </IonButton>
                      </IonButtons>
                    </IonItem>
                  </IonCol>
                </IonRow>
              ) : (
                <IonRow>
                  <IonCol>
                    <IonButton
                      expand="block"
                      fill="outline"
                      onClick={() => setShowModalBuscarTutor(true)}
                    >
                      <IonIcon icon={search} slot="start" />
                      Buscar Tutor
                    </IonButton>
                  </IonCol>
                </IonRow>
              )}

              <IonRow>
                <IonCol>
                  <IonButton
                    expand="block"
                    fill="clear"
                    onClick={() => setShowModalRegistroTutor(true)}
                  >
                    <IonIcon icon={add} slot="start" />
                    Registrar Nuevo Tutor
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonList>

        <IonToolbar>
          <IonButton
            className="custom-button"
            expand="block"
            onClick={handleRegistrarPaciente}
            disabled={!tutorSeleccionado}
          >
            Registrar paciente
          </IonButton>
        </IonToolbar>

        {/* Modal para buscar tutor */}
        <ModalBuscarTutor
          isOpen={showModalBuscarTutor}
          onDidDismiss={() => setShowModalBuscarTutor(false)}
          onTutorSelected={handleTutorSelected}
          tutorSeleccionado={tutorSeleccionado}
        />

        {/* Modal para registrar tutor */}
        <IonModal
          isOpen={showModalRegistroTutor}
          onDidDismiss={() => setShowModalRegistroTutor(false)}
        >
          <RegistroTutor onClose={() => setShowModalRegistroTutor(false)} />
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          className="custom-toast"
        />
      </IonContent>
    </IonPage>
  );
};

export default RegistroPaciente;
