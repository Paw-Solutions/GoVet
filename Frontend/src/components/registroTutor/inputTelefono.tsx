import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { IonInput, IonItem, IonText } from '@ionic/react';

import { MaskitoOptions, maskitoTransform } from '@maskito/core';
import { useMaskito } from '@maskito/react';

import '../../styles/registroTutor.css';

interface InputTelefonoProps {
  onPhoneChange: (phone: string) => void;
}

export interface InputTelefonoHandle {
  reset: () => void; // método que el padre podrá llamar
}

const InputTelefono = forwardRef<InputTelefonoHandle, InputTelefonoProps>(
  ({ onPhoneChange }, ref) => {

    const phoneMaskOptions: MaskitoOptions = {
      mask: [
        '+', '5', '6', ' ', '9', ' ',
        /\d/, /\d/, /\d/, /\d/, ' ',
        /\d/, /\d/, /\d/, /\d/,
      ],
    };
    const phoneMask = useMaskito({ options: phoneMaskOptions });

    const [myPhoneNumber, setMyPhoneNumber] = useState(
      maskitoTransform('569 ', phoneMaskOptions)
    );

    const phoneInputRef = useRef<HTMLIonInputElement | null>(null);

    useEffect(() => {
      if (phoneInputRef.current) {
        phoneInputRef.current.getInputElement().then((input) => {
          phoneMask(input);
        });
      }
    }, [phoneMask]);

    // Exponemos método reset al padre
    useImperativeHandle(ref, () => ({
      reset() {
        const defaultValue = maskitoTransform('569 ', phoneMaskOptions);
        setMyPhoneNumber(defaultValue);
        onPhoneChange(''); // limpiamos el valor en el padre
      },
    }));

    const handleInput = (e: CustomEvent) => {
      const value = e.detail.value || '';
      setMyPhoneNumber(value);

      // Eliminar el prefijo "+56" y espacios antes de enviar al padre
      const cleaned = value.replace('+56', '').replace(/\s/g, '');
      onPhoneChange(cleaned);
    };

    return (
      <IonItem>
        <IonInput
          type="tel"
          labelPlacement="stacked"
          fill="outline"
          name="celular"
          ref={phoneInputRef}
          value={myPhoneNumber}
          onIonInput={handleInput}
          placeholder="+56 9 "
        >
          <div slot="label">
            Celular <IonText color="danger">(*)</IonText>
          </div>
        </IonInput>
      </IonItem>
    );
  }
);

export default InputTelefono;
