import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonIcon,
  IonList,
  IonCheckbox,
  IonText,
} from "@ionic/react";
import {
  closeOutline,
  checkmarkOutline,
  addOutline,
  trashOutline,
} from "ionicons/icons";

export interface Examen {
  nombre: string;
  descripcion?: string;
  urgente: boolean;
}

export interface ExamenesDatos {
  examenes: Examen[];
  observaciones?: string;
}

interface ModalDatosExamenesProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (datos: ExamenesDatos) => void;
}

const ModalDatosExamenes: React.FC<ModalDatosExamenesProps> = ({
  isOpen,
  onClose,
  onConfirmar,
}) => {
  const [examenes, setExamenes] = useState<Examen[]>([
    { nombre: "", descripcion: "", urgente: false },
  ]);
  const [observaciones, setObservaciones] = useState("");

  const handleAgregarExamen = () => {
    setExamenes([...examenes, { nombre: "", descripcion: "", urgente: false }]);
  };

  const handleEliminarExamen = (index: number) => {
    if (examenes.length > 1) {
      setExamenes(examenes.filter((_, i) => i !== index));
    }
  };

  const handleCambiarExamen = (
    index: number,
    campo: keyof Examen,
    valor: any
  ) => {
    const nuevosExamenes = [...examenes];
    nuevosExamenes[index] = { ...nuevosExamenes[index], [campo]: valor };
    setExamenes(nuevosExamenes);
  };

  const handleConfirmar = () => {
    const examenesValidos = examenes.filter((e) => e.nombre.trim() !== "");

    if (examenesValidos.length === 0) {
      alert("Debes agregar al menos un examen");
      return;
    }

    const datos: ExamenesDatos = {
      examenes: examenesValidos,
      observaciones: observaciones || undefined,
    };

    onConfirmar(datos);
    handleCerrar();
  };

  const handleCerrar = () => {
    setExamenes([{ nombre: "", descripcion: "", urgente: false }]);
    setObservaciones("");
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCerrar}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Orden de Exámenes</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCerrar}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h3>Exámenes Solicitados</h3>
        </IonText>

        <IonList>
          {examenes.map((examen, index) => (
            <div
              key={index}
              style={{
                marginBottom: "1rem",
                border: "1px solid var(--ion-color-light)",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <IonText color="primary">
                  <strong>Examen {index + 1}</strong>
                </IonText>
                {examenes.length > 1 && (
                  <IonButton
                    size="small"
                    fill="clear"
                    color="danger"
                    onClick={() => handleEliminarExamen(index)}
                  >
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                )}
              </div>

              <IonItem>
                <IonLabel position="stacked">Nombre del Examen *</IonLabel>
                <IonInput
                  value={examen.nombre}
                  onIonInput={(e) =>
                    handleCambiarExamen(index, "nombre", e.detail.value || "")
                  }
                  placeholder="Ej: Hemograma completo"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonTextarea
                  value={examen.descripcion}
                  onIonInput={(e) =>
                    handleCambiarExamen(
                      index,
                      "descripcion",
                      e.detail.value || ""
                    )
                  }
                  placeholder="Detalles adicionales del examen"
                  rows={2}
                />
              </IonItem>

              <IonItem>
                <IonLabel>¿Examen urgente?</IonLabel>
                <IonCheckbox
                  slot="start"
                  checked={examen.urgente}
                  onIonChange={(e) =>
                    handleCambiarExamen(index, "urgente", e.detail.checked)
                  }
                />
              </IonItem>
            </div>
          ))}
        </IonList>

        <IonButton expand="block" fill="outline" onClick={handleAgregarExamen}>
          <IonIcon slot="start" icon={addOutline} />
          Agregar Otro Examen
        </IonButton>

        <IonItem style={{ marginTop: "1rem" }}>
          <IonLabel position="stacked">Observaciones Generales</IonLabel>
          <IonTextarea
            value={observaciones}
            onIonInput={(e) => setObservaciones(e.detail.value || "")}
            placeholder="Observaciones adicionales sobre los exámenes"
            rows={3}
          />
        </IonItem>

        <div style={{ marginTop: "1rem" }}>
          <IonButton expand="block" onClick={handleConfirmar}>
            <IonIcon slot="start" icon={checkmarkOutline} />
            Confirmar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalDatosExamenes;
