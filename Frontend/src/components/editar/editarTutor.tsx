import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
} from "@ionic/react";
import { TutorData } from "../../api/tutores";

interface ModalEditarTutorProps {
  isOpen: boolean;
  onDismiss: () => void;
  tutor: TutorData | null;
}

const ModalEditarTutor: React.FC<ModalEditarTutorProps> = ({
  isOpen,
  onDismiss,
  tutor,
}) => {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [rut, setRut] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [region, setRegion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [telefono2, setTelefono2] = useState("");
  const [celular, setCelular] = useState("");
  const [celular2, setCelular2] = useState("");
  const [email, setEmail] = useState("");
  const [observacion, setObservacion] = useState("");

  useEffect(() => {
    if (tutor) {
      setNombre(tutor.nombre ?? "");
      setApellidoPaterno(tutor.apellido_paterno ?? "");
      setApellidoMaterno(tutor.apellido_materno ?? "");
      setRut(tutor.rut ?? "");
      setDireccion(tutor.direccion ?? "");
      setComuna(tutor.comuna ?? "");
      setRegion(tutor.region ?? "");
      setTelefono(
        tutor.telefono !== undefined && tutor.telefono !== null
          ? String(tutor.telefono)
          : ""
      );
      setTelefono2(
        tutor.telefono2 !== undefined && tutor.telefono2 !== null
          ? String(tutor.telefono2)
          : ""
      );
      setCelular(
        tutor.celular !== undefined && tutor.celular !== null
          ? String(tutor.celular)
          : ""
      );
      setCelular2(
        tutor.celular2 !== undefined && tutor.celular2 !== null
          ? String(tutor.celular2)
          : ""
      );
      setEmail(tutor.email ?? "");
      setObservacion(tutor.observacion ?? "");
    }
  }, [tutor]);

  const handleGuardar = () => {
    if (!tutor) return;

    const actualizado: TutorData = {
      ...tutor,
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      rut,
      direccion,
      comuna,
      region,
      // Convertimos strings a números cuando corresponda.
      telefono: telefono ? Number(telefono) : (undefined as unknown as number),
      telefono2: telefono2 ? Number(telefono2) : (undefined as unknown as number),
      celular: celular ? Number(celular) : (undefined as unknown as number),
      celular2: celular2 ? Number(celular2) : (undefined as unknown as number),
      email,
      observacion,
    };

    onDismiss();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar tutor</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput
            value={nombre}
            placeholder="Nombre"
            onIonInput={(e) => setNombre(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Apellido paterno</IonLabel>
          <IonInput
            value={apellidoPaterno}
            placeholder="Apellido paterno"
            onIonInput={(e) => setApellidoPaterno(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Apellido materno</IonLabel>
          <IonInput
            value={apellidoMaterno}
            placeholder="Apellido materno"
            onIonInput={(e) => setApellidoMaterno(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">RUT</IonLabel>
          <IonInput
            value={rut}
            placeholder="12.345.678-9"
            onIonInput={(e) => setRut(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Dirección</IonLabel>
          <IonInput
            value={direccion}
            placeholder="Dirección"
            onIonInput={(e) => setDireccion(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Comuna</IonLabel>
          <IonInput
            value={comuna}
            placeholder="Comuna"
            onIonInput={(e) => setComuna(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Región</IonLabel>
          <IonInput
            value={region}
            placeholder="Región"
            onIonInput={(e) => setRegion(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Teléfono</IonLabel>
          <IonInput
            type="tel"
            value={telefono}
            placeholder="Fijo o contacto 1"
            onIonInput={(e) => setTelefono(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Teléfono 2</IonLabel>
          <IonInput
            type="tel"
            value={telefono2}
            placeholder="Contacto 2"
            onIonInput={(e) => setTelefono2(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Celular</IonLabel>
          <IonInput
            type="tel"
            value={celular}
            placeholder="Celular"
            onIonInput={(e) => setCelular(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Celular 2</IonLabel>
          <IonInput
            type="tel"
            value={celular2}
            placeholder="Celular alternativo"
            onIonInput={(e) => setCelular2(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            placeholder="correo@dominio.com"
            onIonInput={(e) => setEmail(e.detail.value ?? "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Observación</IonLabel>
          <IonInput
            value={observacion}
            placeholder="Notas u observaciones"
            onIonInput={(e) => setObservacion(e.detail.value ?? "")}
          />
        </IonItem>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <IonButton onClick={handleGuardar}>Guardar</IonButton>
          <IonButton fill="clear" onClick={onDismiss}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalEditarTutor;