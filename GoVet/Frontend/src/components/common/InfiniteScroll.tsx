import React from 'react';
import {
  IonInfiniteScroll as IonInfiniteScrollComponent,
  IonInfiniteScrollContent,
} from '@ionic/react';
import '../../styles/ver.css';

interface InfiniteScrollProps {
  onLoadMore: (event: CustomEvent) => Promise<void>;
  disabled: boolean;
  loadingText: string;
  threshold?: string;
  loadingSpinner?: 'bubbles' | 'circles' | 'circular' | 'crescent' | 'dots' | 'lines' | 'lines-small';
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  disabled,
  loadingText,
  threshold = "100px",
  loadingSpinner = "bubbles"
}) => {
  return (
    <IonInfiniteScrollComponent
      onIonInfinite={onLoadMore}
      threshold={threshold}
      disabled={disabled}
    >
      <IonInfiniteScrollContent
        loadingSpinner={loadingSpinner}
        loadingText={loadingText}
      />
    </IonInfiniteScrollComponent>
  );
};

export default InfiniteScroll;