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
import { TutorData, actualizarTutor, type TutorCreate } from "../../api/tutores";

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

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (tutor) {
      setNombre(tutor.nombre ?? "");
      setApellidoPaterno(tutor.apellido_paterno ?? "");
      setApellidoMaterno(tutor.apellido_materno ?? "");
      setRut(tutor.rut ?? "");
      setDireccion(tutor.direccion ?? "");
      setComuna(tutor.comuna ?? "");
      setRegion(tutor.region ?? "");
      setTelefono(tutor.telefono != null ? String(tutor.telefono) : "");
      setTelefono2(tutor.telefono2 != null ? String(tutor.telefono2) : "");
      setCelular(tutor.celular != null ? String(tutor.celular) : "");
      setCelular2(tutor.celular2 != null ? String(tutor.celular2) : "");
      setEmail(tutor.email ?? "");
      setObservacion(tutor.observacion ?? "");
      setErrorMsg(null);
      setSaving(false);
    }
  }, [tutor, isOpen]);

  const toNumberOrNull = (v: string) => {
    const t = v.trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isNaN(n) ? null : n;
  };

  const handleGuardar = async () => {
    if (!tutor) return;

    try {
      setSaving(true);
      setErrorMsg(null);

      const rutActual = tutor.rut || "";

      const payload: TutorCreate = {
        nombre: nombre.trim(),
        apellido_paterno: apellidoPaterno.trim(),
        apellido_materno: apellidoMaterno.trim(),
        rut: rut,
        direccion: direccion.trim(),
        comuna: comuna.trim(),
        region: region.trim(),
        telefono: toNumberOrNull(telefono) ?? undefined,
        telefono2: toNumberOrNull(telefono2) ?? undefined,
        celular: toNumberOrNull(celular) ?? undefined,
        celular2: toNumberOrNull(celular2) ?? undefined,
        email: email.trim() || undefined,
        observacion: observacion.trim() || undefined,
      };

      await actualizarTutor(rutActual, payload);

      window.dispatchEvent(new CustomEvent("tutores:updated"));
      onDismiss();
    } catch (err: any) {
      setErrorMsg(err?.message || "No fue posible guardar los cambios.");
    } finally {
      setSaving(false);
    }
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
          <IonLabel position="stacked">RUT (no editable)</IonLabel>
          <IonInput value={rut} readonly />
        </IonItem>

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

        {errorMsg && (
          <div style={{ color: "var(--ion-color-danger)", marginTop: 8 }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <IonButton onClick={handleGuardar} disabled={saving || !tutor}>
            {saving ? "Guardando..." : "Guardar"}
          </IonButton>
          <IonButton fill="clear" onClick={onDismiss} disabled={saving}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalEditarTutor;