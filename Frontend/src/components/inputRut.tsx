import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { IonInput, IonItem, IonText } from '@ionic/react';
import { MaskitoOptions, maskitoTransform } from '@maskito/core';
import { useMaskito } from '@maskito/react';

interface InputRutProps {
  onRutChange: (rut: string) => void;
}

export interface InputRutHandle {
  reset: () => void; // método que el padre podrá llamar
}

const InputRut = forwardRef<InputRutHandle, InputRutProps>(({ onRutChange }, ref) => {
  const rutMaskOptions: MaskitoOptions = {
    mask: [
      /\d/, /\d/, '.',
      /\d/, /\d/, /\d/, '.',
      /\d/, /\d/, /\d/, '-', /\d/,
    ],
  };
  const rutMask = useMaskito({ options: rutMaskOptions });

  const [myRut, setMyRut] = useState('');
  const rutInputRef = useRef<HTMLIonInputElement | null>(null);

  useEffect(() => {
    if (rutInputRef.current) {
      rutInputRef.current.getInputElement().then((input) => {
        rutMask(input);
      });
    }
  }, [rutMask]);

  // Exponemos métodos al padre
  useImperativeHandle(ref, () => ({
    reset() {
      setMyRut('');
      onRutChange('');
    },
  }));

  const handleInput = (e: CustomEvent) => {
    const value = e.detail.value || '';
    setMyRut(value);
    onRutChange(value);
  };

  const handleBlur = () => {
    let cleanRut = myRut.replace(/\D/g, '');
    if (cleanRut.length === 8) {
      cleanRut = '0' + cleanRut;
      const formattedRut = maskitoTransform(cleanRut, rutMaskOptions);
      setMyRut(formattedRut);
      onRutChange(formattedRut);
    }
  };

  return (
    <IonItem>
      <IonInput
        type="text"
        labelPlacement="stacked"
        fill="outline"
        name="rut"
        ref={rutInputRef}
        value={myRut}
        onIonInput={handleInput}
        onIonBlur={handleBlur}
        placeholder="12.345.678-9"
      >
        <div slot="label">
          RUT <IonText color="danger">(*)</IonText>
        </div>
      </IonInput>
    </IonItem>
  );
});

export default InputRut;
