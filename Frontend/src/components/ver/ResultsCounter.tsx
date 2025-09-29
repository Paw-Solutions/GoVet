import React from 'react';
import { IonText } from '@ionic/react';
import '../../styles/ver.css';

interface ResultsCounterProps {
  count: number;
  busqueda: string;
  hasMoreData: boolean;
  type: 'tutores' | 'pacientes';
}

const ResultsCounter: React.FC<ResultsCounterProps> = ({
  count,
  busqueda,
  hasMoreData,
  type
}) => {
  const getCountText = () => {
    if (count === 0) return `No se encontraron ${type}`;
    if (count === 1) return `1 ${type.slice(0, -1)} encontrado`;
    return `${count} ${type} encontrados`;
  };

  const getSearchText = () => {
    if (!busqueda) return '';
    return ` para "${busqueda}"`;
  };

  const getMoreDataText = () => {
    if (!hasMoreData) return '';
    return ' (desliza hacia abajo para cargar más)';
  };

  return (
    <div className="results-counter">
        <IonText>
            <p>
                {getCountText()}
                {getSearchText()}
                {getMoreDataText()}
            </p>
        </IonText>
    </div>
  );
};

export default ResultsCounter;