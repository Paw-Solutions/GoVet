import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import '../../styles/ver.css';

interface PageHeaderProps {
  title: string;
  onRefresh?: () => void;
  loading?: boolean;
  showMenuButton?: boolean;
  showRefreshButton?: boolean;
  subtitle?: string;
  color?: string;
  translucent?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onRefresh,
  loading = false,
  showMenuButton = true,
  showRefreshButton = true,
  subtitle,
  color,
  translucent = true,
}) => {
  return (
    <IonHeader translucent={translucent}>
      <IonToolbar color={color}>
        {showMenuButton && (
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        )}
        
        <IonTitle>
          {title}
          {subtitle && (
            <div style={{ fontSize: '0.8em', opacity: 0.7, fontWeight: 'normal' }}>
              {subtitle}
            </div>
          )}
        </IonTitle>
        
        {showRefreshButton && onRefresh && (
          <IonButtons slot="end">
            <IonButton 
              onClick={onRefresh}
              disabled={loading}
              fill="clear"
            >
              <IonIcon 
                icon={refreshOutline} 
                className={loading ? 'rotating' : ''}
              />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;