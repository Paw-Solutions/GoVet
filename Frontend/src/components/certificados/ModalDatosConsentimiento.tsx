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
  IonCheckbox,
  IonIcon,
  IonList,
} from "@ionic/react";
import { closeOutline, checkmarkOutline } from "ionicons/icons";

export interface ConsentimientoDatos {
  procedimiento: string;
  indicaciones: string;
  objetivos: string;
  peso: number;
  autorizaciones_adicionales: string[];
  testigo_requerido: boolean;
}

interface ModalDatosConsentimientoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (datos: ConsentimientoDatos) => void;
}

const ModalDatosConsentimiento: React.FC<ModalDatosConsentimientoProps> = ({
  isOpen,
  onClose,
  onConfirmar,
}) => {
  const [procedimiento, setProcedimiento] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [peso, setPeso] = useState<number | undefined>(undefined);
  const [testigoRequerido, setTestigoRequerido] = useState(false);
  const [autorizaciones, setAutorizaciones] = useState({
    anestesia: false,
    cirugia: false,
    hospitalizacion: false,
    eutanasia: false,
  });

  const handleConfirmar = () => {
    if (!procedimiento || !indicaciones || !objetivos || !peso) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const autorizacionesSeleccionadas: string[] = [];
    if (autorizaciones.anestesia) autorizacionesSeleccionadas.push("Anestesia");
    if (autorizaciones.cirugia) autorizacionesSeleccionadas.push("Cirugía");
    if (autorizaciones.hospitalizacion)
      autorizacionesSeleccionadas.push("Hospitalización");
    if (autorizaciones.eutanasia) autorizacionesSeleccionadas.push("Eutanasia");

    const datos: ConsentimientoDatos = {
      procedimiento,
      indicaciones,
      objetivos,
      peso: peso || 0,
      autorizaciones_adicionales: autorizacionesSeleccionadas,
      testigo_requerido: testigoRequerido,
    };

    onConfirmar(datos);
    handleCerrar();
  };

  const handleCerrar = () => {
    setProcedimiento("");
    setIndicaciones("");
    setObjetivos("");
    setPeso(undefined);
    setTestigoRequerido(false);
    setAutorizaciones({
      anestesia: false,
      cirugia: false,
      hospitalizacion: false,
      eutanasia: false,
    });
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCerrar}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Datos del Consentimiento Informado</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCerrar}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Procedimiento *</IonLabel>
            <IonInput
              value={procedimiento}
              onIonInput={(e) => setProcedimiento(e.detail.value || "")}
              placeholder="Ej: Esterilización"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Indicaciones *</IonLabel>
            <IonTextarea
              value={indicaciones}
              onIonInput={(e) => setIndicaciones(e.detail.value || "")}
              placeholder="Indicaciones del procedimiento"
              rows={3}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Objetivos *</IonLabel>
            <IonTextarea
              value={objetivos}
              onIonInput={(e) => setObjetivos(e.detail.value || "")}
              placeholder="Objetivos del procedimiento"
              rows={3}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Peso (kg) *</IonLabel>
            <IonInput
              type="number"
              value={peso}
              onIonInput={(e) => setPeso(parseFloat(e.detail.value || "0"))}
              placeholder="Peso del paciente"
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel>
              <h3>Autorizaciones Adicionales</h3>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Anestesia</IonLabel>
            <IonCheckbox
              slot="start"
              checked={autorizaciones.anestesia}
              onIonChange={(e) =>
                setAutorizaciones({
                  ...autorizaciones,
                  anestesia: e.detail.checked,
                })
              }
            />
          </IonItem>

          <IonItem>
            <IonLabel>Cirugía</IonLabel>
            <IonCheckbox
              slot="start"
              checked={autorizaciones.cirugia}
              onIonChange={(e) =>
                setAutorizaciones({
                  ...autorizaciones,
                  cirugia: e.detail.checked,
                })
              }
            />
          </IonItem>

          <IonItem>
            <IonLabel>Hospitalización</IonLabel>
            <IonCheckbox
              slot="start"
              checked={autorizaciones.hospitalizacion}
              onIonChange={(e) =>
                setAutorizaciones({
                  ...autorizaciones,
                  hospitalizacion: e.detail.checked,
                })
              }
            />
          </IonItem>

          <IonItem>
            <IonLabel>Eutanasia</IonLabel>
            <IonCheckbox
              slot="start"
              checked={autorizaciones.eutanasia}
              onIonChange={(e) =>
                setAutorizaciones({
                  ...autorizaciones,
                  eutanasia: e.detail.checked,
                })
              }
            />
          </IonItem>

          <IonItem>
            <IonLabel>¿Se requiere testigo?</IonLabel>
            <IonCheckbox
              slot="start"
              checked={testigoRequerido}
              onIonChange={(e) => setTestigoRequerido(e.detail.checked)}
            />
          </IonItem>
        </IonList>

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

export default ModalDatosConsentimiento;
