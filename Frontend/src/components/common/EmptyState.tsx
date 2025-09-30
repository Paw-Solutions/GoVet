import React from 'react';
import { IonText } from '@ionic/react';
import '../../styles/ver.css';

interface EmptyStateProps {
  isEmpty: boolean;
  busqueda: string;
  type: 'tutores' | 'pacientes' | 'fichas';
}

const EmptyState: React.FC<EmptyStateProps> = ({ isEmpty, busqueda, type }) => {
  if (!isEmpty) return null;

  return (
    <div className="no-results">
      <IonText>
        <h3>No se encontraron {type}</h3>
        <p>
          {busqueda
            ? `No hay ${type} que coincidan con "${busqueda}"`
            : `No hay ${type} registrados aún`}
        </p>
      </IonText>
    </div>
  );
};

export default EmptyState;