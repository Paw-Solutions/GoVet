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
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonSpinner,
  IonText,
  IonRadioGroup,
  IonRadio,
} from "@ionic/react";
import "../styles/registroPaciente.css";
import "../styles/main.css";
import { useRegistroPaciente } from "../hooks/useRegistroPaciente";
import { SelectorEspecie } from "../components/registroPaciente/SelectorEspecie";
import { SelectorRaza } from "../components/registroPaciente/SelectorRaza";
import RegistroTutor from "./registroTutor";

const RegistroPaciente: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

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
    clearEspecie, // Agregar esta línea
  } = useRegistroPaciente();

  // Filtros
  const filteredEspecies = especiesData
    .filter((especie) => {
      if (!especieQuery.trim()) {
        return true; // Mostrar todas si no hay búsqueda
      }
      return especie.nombre_comun
        .toLowerCase()
        .includes(especieQuery.toLowerCase());
    })
    .slice(0, 4);

  const filteredRazas = razasData
    .filter((raza: any) => {
      if (!razaQuery.trim()) {
        return true; // Mostrar todas las razas si no hay búsqueda
      }
      return raza.nombre.toLowerCase().includes(razaQuery.toLowerCase());
    })
    .slice(0, 4);

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
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
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
                  onClearEspecie={clearEspecie} // Agregar esta línea
                  hasSelectedEspecie={!!formData.especie} // Agregar esta línea
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
                      // Permitimos letras con acentos y ñ
                      const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;

                      // Lista blanca de teclas de control
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
                        e.preventDefault(); // bloquea lo demás
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

          <div className="tutor-section">
            <IonGrid>
              <IonRow>
                <IonCol className="tutor-header">
                  <IonText>
                    <IonLabel>
                      <p className="tutor-title">Asignar Tutor</p>
                    </IonLabel>
                    <div className="tutor-register-container">
                      <IonLabel>¿El tutor no está?</IonLabel>
                      <span
                        className="tutor-register-link"
                        onClick={() => setShowModal(true)}
                      >
                        Regístralo
                      </span>
                    </div>
                  </IonText>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonInput
                      name="rut"
                      label="Rut"
                      labelPlacement="stacked"
                      fill="outline"
                      placeholder="Ej: 12345678-9"
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonList>

        <IonToolbar>
          <IonButton
            className="custom-button"
            expand="block"
            onClick={registraPaciente}
          >
            Registrar paciente
          </IonButton>
        </IonToolbar>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <RegistroTutor />
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
