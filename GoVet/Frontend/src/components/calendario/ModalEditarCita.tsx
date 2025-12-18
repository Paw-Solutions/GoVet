/*
 * Este componente está temporalmente deshabilitado.
 * Google Calendar API no soporta edición directa de eventos.
 * Para editar un evento, se debe eliminar y crear uno nuevo.
 */
// Componente: Gestor de edición y eliminación de cita
import { IonModal } from "@ionic/react";
import { CalendarEvent } from "../../api/calendario";

interface ModalEditarCitaProps {
  isOpen: boolean;
  onClose: () => void;
  evento: CalendarEvent;
  onEventoActualizado: () => void;
}

const ModalEditarCita: React.FC<ModalEditarCitaProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      {/* Componente deshabilitado - requiere implementación con Google Calendar API */}
    </IonModal>
  );
};

export default ModalEditarCita;
