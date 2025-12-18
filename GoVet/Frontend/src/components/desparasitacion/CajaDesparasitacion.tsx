import React from "react";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonIcon,
  IonButtons,
} from "@ionic/react";
import { trashOutline } from "ionicons/icons";

interface DesparasitacionProps {
  titulo: string;
  tipo: "interna" | "externa";
  datos: {
    nombre_desparasitante: string;
    marca: string;
    numero_de_serie?: string;
    fecha_administracion: string;
    proxima_dosis?: string;
    requiere_proxima?: boolean;
  };
  setDatos: (datos: any) => void;
  onAgregar: () => void;
  onEliminar?: () => void;
  datoGuardado?: {
    nombre_desparasitante: string;
    marca: string;
    numero_de_serie?: string;
    fecha_administracion: string;
    proxima_dosis?: string;
    requiere_proxima?: boolean;
  } | null;
}

const CajaDesparasitacion: React.FC<DesparasitacionProps> = ({
  titulo,
  tipo,
  datos,
  setDatos,
  onAgregar,
  onEliminar,
  datoGuardado,
}) => {
  const handleChange = (e: any) => {
    const { name, value } = e.target ?? {
      name: e.detail?.name,
      value: e.detail?.value,
    };
    const val = value ?? e.detail?.value ?? "";
    setDatos((prev: any) => {
      const next = { ...prev, [name]: val };

      // Si cambia la fecha de administración y requiere próxima dosis, calcular +30 días
      if (
        name === "fecha_administracion" &&
        next.requiere_proxima !== false &&
        (!next.proxima_dosis || next.proxima_dosis === "")
      ) {
        const fecha = new Date(val);
        if (!isNaN(fecha.getTime())) {
          const proxima = new Date(fecha);
          // Para desparasitación, típicamente es cada 30 días (1 mes)
          proxima.setDate(proxima.getDate() + 30);
          next.proxima_dosis = proxima.toISOString().split("T")[0];
        }
      }

      return next;
    });
  };

  const handleToggle = (e: any) => {
    const checked = e.detail?.checked ?? (e.target ? e.target.checked : false);
    setDatos((prev: any) => ({
      ...prev,
      requiere_proxima: !!checked,
      proxima_dosis: checked ? prev.proxima_dosis : "",
    }));
  };

  // Opciones predefinidas según el tipo
  const opcionesProductos =
    tipo === "interna"
      ? ["Milbemax", "Drontal", "Panacur", "Endogard", "Otro"]
      : ["Bravecto", "NexGard", "Simparica", "Revolution", "Frontline", "Otro"];

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{titulo}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <IonItem>
                <IonSelect
                  label="Nombre del desparasitante"
                  labelPlacement="stacked"
                  fill="outline"
                  name="nombre_desparasitante"
                  value={datos.nombre_desparasitante}
                  onIonChange={handleChange}
                >
                  {opcionesProductos.map((producto) => (
                    <IonSelectOption key={producto} value={producto}>
                      {producto}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
            <IonCol size="12" size-md="6">
              <IonItem>
                <IonInput
                  label="Marca"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Marca del producto"
                  name="marca"
                  value={datos.marca}
                  onIonInput={handleChange}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" size-md="6">
              <IonItem>
                <IonInput
                  label="Número de serie / cert."
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Número de serie o certificado"
                  name="numero_de_serie"
                  value={datos.numero_de_serie}
                  onIonInput={handleChange}
                />
              </IonItem>
            </IonCol>
            <IonCol size="12" size-md="6">
              <IonItem>
                <IonInput
                  label="Fecha de administración"
                  labelPlacement="stacked"
                  fill="outline"
                  type="date"
                  name="fecha_administracion"
                  value={datos.fecha_administracion}
                  onIonInput={handleChange}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" size-md="6">
              <IonItem lines="none">
                <IonLabel>Requiere próxima dosis</IonLabel>
                <IonToggle
                  name="requiere_proxima"
                  checked={datos.requiere_proxima !== false}
                  onIonChange={handleToggle}
                />
              </IonItem>
            </IonCol>

            {datos.requiere_proxima !== false && (
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    label="Próxima dosis"
                    labelPlacement="stacked"
                    fill="outline"
                    type="date"
                    name="proxima_dosis"
                    value={datos.proxima_dosis}
                    onIonInput={handleChange}
                  />
                </IonItem>
              </IonCol>
            )}
          </IonRow>

          <IonRow>
            <IonCol size="12" className="ion-text-end">
              <IonButton size="small" onClick={onAgregar}>
                Agregar desparasitación
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Mostrar datos guardados si existen */}
          {datoGuardado && datoGuardado.nombre_desparasitante && (
            <IonRow>
              <IonCol size="12">
                <IonItem lines="none" className="ion-margin-top">
                  <IonLabel>
                    <h3>
                      <strong>{datoGuardado.nombre_desparasitante}</strong>
                    </h3>
                    <p>
                      {datoGuardado.marca && `${datoGuardado.marca} · `}
                      {datoGuardado.numero_de_serie &&
                        `N° ${datoGuardado.numero_de_serie} · `}
                      Fecha: {datoGuardado.fecha_administracion}
                      {datoGuardado.proxima_dosis &&
                        ` · Próx: ${datoGuardado.proxima_dosis}`}
                    </p>
                  </IonLabel>
                  {onEliminar && (
                    <IonButtons slot="end">
                      <IonButton
                        fill="clear"
                        color="danger"
                        onClick={onEliminar}
                      >
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonButton>
                    </IonButtons>
                  )}
                </IonItem>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default CajaDesparasitacion;
