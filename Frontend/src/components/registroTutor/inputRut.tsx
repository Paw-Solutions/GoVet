import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { IonInput, IonItem, IonText } from "@ionic/react";
import { MaskitoOptions, maskitoTransform } from "@maskito/core";
import { useMaskito } from "@maskito/react";

interface InputRutProps {
  onRutChange: (rut: string) => void;
  initialValue?: string; // nuevo prop para valor inicial
  readonly?: boolean; // nuevo prop para hacer el campo readonly
}

export interface InputRutHandle {
  reset: () => void; // método que el padre podrá llamar
  setValue: (value: string) => void; // nuevo método para establecer valor
}

const InputRut = forwardRef<InputRutHandle, InputRutProps>(
  ({ onRutChange, initialValue, readonly = false }, ref) => {
    const rutMaskOptions: MaskitoOptions = {
      mask: [
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /[\dKk]/,
      ],
    };
    const rutMask = useMaskito({ options: rutMaskOptions });

    const formatRutWithMask = (rut: string) => {
      if (!rut || rut.trim() === "") return "";
      // Limpiar el RUT de cualquier formato previo
      const cleanRut = rut.replace(/[^0-9Kk]/g, "");
      return maskitoTransform(cleanRut, rutMaskOptions);
    };

    const [myRut, setMyRut] = useState(formatRutWithMask(initialValue || ""));
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
        setMyRut("");
        onRutChange("");
      },
      setValue(value: string) {
        const formatted = formatRutWithMask(value);
        setMyRut(formatted);
        onRutChange(formatted);
      },
    }));

    // Efecto para actualizar cuando cambia initialValue
    useEffect(() => {
      if (initialValue !== undefined) {
        const formatted = formatRutWithMask(initialValue);
        setMyRut(formatted);
      }
    }, [initialValue]);

    const handleInput = (e: CustomEvent) => {
      const value = e.detail.value || "";
      setMyRut(value);
      onRutChange(value);
    };

    const handleBlur = () => {
      let cleanRut = myRut.replace(/[^0-9Kk]/g, "");
      if (cleanRut.length === 8) {
        cleanRut = "0" + cleanRut;
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
          readonly={readonly}
        >
          <div slot="label">
            RUT <IonText color="danger">(*)</IonText>
          </div>
        </IonInput>
      </IonItem>
    );
  }
);

export default InputRut;
