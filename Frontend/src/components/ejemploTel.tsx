import { useState, useRef, useEffect } from 'react';
import { IonCol, IonInput, IonItem, IonList, IonRow, IonText } from '@ionic/react';

import { MaskitoOptions, maskitoTransform } from '@maskito/core';
import { useMaskito } from '@maskito/react';

import '../styles/registroTutor.css';

function Example({ onPhoneChange }: { onPhoneChange: (phone: string) => void }) {
  const phoneMaskOptions: MaskitoOptions = {
    mask: [
      '+', '5', '6', ' ', '9', ' ',
      /\d/, /\d/, /\d/, /\d/, ' ',
      /\d/, /\d/, /\d/, /\d/,
    ],
  };
  const phoneMask = useMaskito({ options: phoneMaskOptions });

  // Estado con el valor inicial formateado
  const [myPhoneNumber, setMyPhoneNumber] = useState(
    maskitoTransform('569 ', phoneMaskOptions)
  );

  // Ref para el input
  const phoneInputRef = useRef<HTMLIonInputElement | null>(null);

  // useEffect para aplicar la máscara cuando el input exista
  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.getInputElement().then((input) => {
        phoneMask(input);
      });
    }
  }, [phoneMask]);

  useEffect(() => {
    onPhoneChange(myPhoneNumber);
  }, [myPhoneNumber, onPhoneChange]);

  return (
    <IonItem>
        <IonInput
            type="tel"
            labelPlacement="stacked"
            fill="outline"
            name="region"
            ref={phoneInputRef}
            value={myPhoneNumber}
            onIonInput={(e) => setMyPhoneNumber(e.detail.value || '')}
            placeholder="+56 9 "
        >
          <div slot="label">
            Teléfono <IonText color="danger">(*)</IonText>
          </div>
        </IonInput>
    </IonItem>
  );
}

export default Example;
