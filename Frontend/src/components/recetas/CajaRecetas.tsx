import React, { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
} from "@ionic/react";
import { medkitOutline, trashOutline } from "ionicons/icons";

// Definición del tipo de dato para una receta individual
export interface Receta {
  medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  numero_de_serie?: string;
}

interface CajaRecetasProps {
  recetas: Receta[];
  setRecetas: (r: Receta[]) => void;
}

const CajaRecetas: React.FC<CajaRecetasProps> = ({ recetas, setRecetas }) => {
  // Estado local temporal para los inputs
  const [tempReceta, setTempReceta] = useState<Receta>({
    medicamento: "",
    dosis: "",
    frecuencia: "",
    duracion: "",
    numero_de_serie: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target ?? {
      name: e.detail?.name,
      value: e.detail?.value,
    };
    const val = value ?? e.detail?.value ?? "";
    setTempReceta((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleAgregar = () => {
    // Validación simple: al menos el medicamento debe estar presente
    if (!tempReceta.medicamento.trim()) {
      return;
    }

    // Agrega al array principal
    setRecetas([...recetas, tempReceta]);

    // Limpia los inputs
    setTempReceta({
      medicamento: "",
      dosis: "",
      frecuencia: "",
      duracion: "",
      numero_de_serie: "",
    });
  };

  const handleEliminar = (index: number) => {
    const nuevasRecetas = recetas.filter((_, i) => i !== index);
    setRecetas(nuevasRecetas);
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={medkitOutline} style={{ marginRight: "8px" }} />
          Receta Médica
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <IonItem>
                <IonInput
                  label="Medicamento"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Nombre del medicamento"
                  name="medicamento"
                  value={tempReceta.medicamento}
                  onIonInput={handleChange}
                />
              </IonItem>
            </IonCol>
            <IonCol size="12" size-md="6">
              <IonItem>
                <IonInput
                  label="Dosis"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Ej: 500mg, 1 comprimido"
                  name="dosis"
                  value={tempReceta.dosis}
                  onIonInput={handleChange}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" size-md="4">
              <IonItem>
                <IonInput
                  label="Frecuencia"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Ej: cada 8 horas"
                  name="frecuencia"
                  value={tempReceta.frecuencia}
                  onIonInput={handleChange}
                />
              </IonItem>
            </IonCol>
            <IonCol size="12" size-md="4">
              <IonItem>
                <IonInput
                  label="Duración"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Ej: por 7 días"
                  name="duracion"
                  value={tempReceta.duracion}
                  onIonInput={handleChange}
                />
              </IonItem>
            </IonCol>
            <IonCol size="12" size-md="4">
              <IonItem>
                <IonInput
                  label="Número de serie (opcional)"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Número de serie"
                  name="numero_de_serie"
                  value={tempReceta.numero_de_serie}
                  onIonInput={handleChange}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" className="ion-text-end">
              <IonButton size="small" onClick={handleAgregar}>
                Agregar medicamento
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Lista de recetas agregadas */}
          {recetas.length > 0 && (
            <IonRow>
              <IonCol size="12">
                <IonList>
                  {recetas.map((receta, idx) => (
                    <IonItem key={idx}>
                      <IonLabel>
                        <h3>{receta.medicamento}</h3>
                        <p>
                          {receta.dosis && `Dosis: ${receta.dosis} · `}
                          {receta.frecuencia && `${receta.frecuencia} · `}
                          {receta.duracion && receta.duracion}
                          {receta.numero_de_serie &&
                            ` · N° ${receta.numero_de_serie}`}
                        </p>
                      </IonLabel>
                      <IonButtons slot="end">
                        <IonButton
                          fill="clear"
                          color="danger"
                          onClick={() => handleEliminar(idx)}
                        >
                          <IonIcon slot="icon-only" icon={trashOutline} />
                        </IonButton>
                      </IonButtons>
                    </IonItem>
                  ))}
                </IonList>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default CajaRecetas;
