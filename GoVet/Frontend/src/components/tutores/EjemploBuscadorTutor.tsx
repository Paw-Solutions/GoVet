import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonChip,
  IonLabel,
} from "@ionic/react";
import { closeOutline, checkmarkOutline } from "ionicons/icons";
import { BuscadorTutor } from "./index";
import { TutorData } from "../../api/tutores";

/**
 * Componente de ejemplo para mostrar cómo usar BuscadorTutor
 * Este es solo un ejemplo educativo - adaptar según necesidades
 */
const EjemploBuscadorTutor: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [tutorSeleccionado, setTutorSeleccionado] = useState<TutorData | null>(
    null
  );

  const handleSelectTutor = (tutor: TutorData) => {
    setTutorSeleccionado(tutor);
    console.log("Tutor seleccionado:", tutor);
  };

  const handleConfirm = () => {
    if (tutorSeleccionado) {
      console.log("Tutor confirmado:", tutorSeleccionado);
      setShowModal(false);
      // Aquí va tu lógica después de confirmar
    }
  };

  return (
    <>
      {/* Botón para abrir el modal */}
      <IonButton onClick={() => setShowModal(true)}>
        {tutorSeleccionado ? "Cambiar Tutor" : "Seleccionar Tutor"}
      </IonButton>

      {/* Mostrar tutor seleccionado */}
      {tutorSeleccionado && (
        <IonChip color="success">
          <IonIcon icon={checkmarkOutline} />
          <IonLabel>
            {tutorSeleccionado.nombre} {tutorSeleccionado.apellido_paterno}
          </IonLabel>
        </IonChip>
      )}

      {/* Modal con el buscador */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Buscar Tutor</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          {/* Componente BuscadorTutor */}
          <BuscadorTutor
            onSelectTutor={handleSelectTutor}
            tutorSeleccionado={tutorSeleccionado}
            autoLoad={true}
            maxHeight="calc(100vh - 200px)"
          />

          {/* Botón de confirmación */}
          <div style={{ padding: "1rem" }}>
            <IonButton
              expand="block"
              onClick={handleConfirm}
              disabled={!tutorSeleccionado}
            >
              Confirmar Selección
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default EjemploBuscadorTutor;
