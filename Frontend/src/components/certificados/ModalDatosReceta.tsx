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
  IonText,
} from "@ionic/react";
import {
  closeOutline,
  checkmarkOutline,
  addOutline,
  trashOutline,
} from "ionicons/icons";

export interface Receta {
  medicamento: string;
  dosis: string;
  frecuencia: number;
  duracion: number;
  numero_serie?: string;
}

export interface RecetaDatos {
  recetas: Receta[];
  observaciones?: string;
}

interface ModalDatosRecetaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (datos: RecetaDatos) => void;
}

const ModalDatosReceta: React.FC<ModalDatosRecetaProps> = ({
  isOpen,
  onClose,
  onConfirmar,
}) => {
  const [recetas, setRecetas] = useState<Receta[]>([
    {
      medicamento: "",
      dosis: "",
      frecuencia: 8,
      duracion: 7,
      numero_serie: "",
    },
  ]);
  const [observaciones, setObservaciones] = useState("");

  const handleAgregarReceta = () => {
    setRecetas([
      ...recetas,
      {
        medicamento: "",
        dosis: "",
        frecuencia: 8,
        duracion: 7,
        numero_serie: "",
      },
    ]);
  };

  const handleEliminarReceta = (index: number) => {
    if (recetas.length > 1) {
      setRecetas(recetas.filter((_, i) => i !== index));
    }
  };

  const handleCambiarReceta = (
    index: number,
    campo: keyof Receta,
    valor: any
  ) => {
    const nuevasRecetas = [...recetas];
    nuevasRecetas[index] = { ...nuevasRecetas[index], [campo]: valor };
    setRecetas(nuevasRecetas);
  };

  const handleConfirmar = () => {
    const recetasValidas = recetas.filter(
      (r) => r.medicamento.trim() !== "" && r.dosis.trim() !== ""
    );

    if (recetasValidas.length === 0) {
      alert("Debes agregar al menos un medicamento con dosis");
      return;
    }

    const datos: RecetaDatos = {
      recetas: recetasValidas,
      observaciones: observaciones || undefined,
    };

    onConfirmar(datos);
    handleCerrar();
  };

  const handleCerrar = () => {
    setRecetas([
      {
        medicamento: "",
        dosis: "",
        frecuencia: 8,
        duracion: 7,
        numero_serie: "",
      },
    ]);
    setObservaciones("");
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCerrar}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Receta Médica</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCerrar}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h3>Medicamentos Recetados</h3>
        </IonText>

        <IonList>
          {recetas.map((receta, index) => (
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
                  <strong>Medicamento {index + 1}</strong>
                </IonText>
                {recetas.length > 1 && (
                  <IonButton
                    size="small"
                    fill="clear"
                    color="danger"
                    onClick={() => handleEliminarReceta(index)}
                  >
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                )}
              </div>

              <IonItem>
                <IonLabel position="stacked">Medicamento *</IonLabel>
                <IonInput
                  value={receta.medicamento}
                  onIonInput={(e) =>
                    handleCambiarReceta(
                      index,
                      "medicamento",
                      e.detail.value || ""
                    )
                  }
                  placeholder="Nombre del medicamento"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Dosis *</IonLabel>
                <IonInput
                  value={receta.dosis}
                  onIonInput={(e) =>
                    handleCambiarReceta(index, "dosis", e.detail.value || "")
                  }
                  placeholder="Ej: 10 mg"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Frecuencia (horas)</IonLabel>
                <IonInput
                  type="number"
                  value={receta.frecuencia}
                  onIonInput={(e) =>
                    handleCambiarReceta(
                      index,
                      "frecuencia",
                      parseInt(e.detail.value || "8")
                    )
                  }
                  placeholder="Cada cuántas horas"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Duración (días)</IonLabel>
                <IonInput
                  type="number"
                  value={receta.duracion}
                  onIonInput={(e) =>
                    handleCambiarReceta(
                      index,
                      "duracion",
                      parseInt(e.detail.value || "7")
                    )
                  }
                  placeholder="Días de tratamiento"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">
                  Número de Serie (opcional)
                </IonLabel>
                <IonInput
                  value={receta.numero_serie}
                  onIonInput={(e) =>
                    handleCambiarReceta(
                      index,
                      "numero_serie",
                      e.detail.value || ""
                    )
                  }
                  placeholder="N° de serie del medicamento"
                />
              </IonItem>
            </div>
          ))}
        </IonList>

        <IonButton expand="block" fill="outline" onClick={handleAgregarReceta}>
          <IonIcon slot="start" icon={addOutline} />
          Agregar Otro Medicamento
        </IonButton>

        <IonItem style={{ marginTop: "1rem" }}>
          <IonLabel position="stacked">Observaciones Generales</IonLabel>
          <IonTextarea
            value={observaciones}
            onIonInput={(e) => setObservaciones(e.detail.value || "")}
            placeholder="Observaciones adicionales sobre la receta"
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

export default ModalDatosReceta;
