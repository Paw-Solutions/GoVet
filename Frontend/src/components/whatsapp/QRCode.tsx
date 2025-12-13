import React from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRCodeProps {
  value: string;
  size?: number;
}

/**
 * Componente QR Code con renderizado local usando qrcode.react
 * Más seguro y confiable que servicios externos
 * No envía datos sensibles a terceros
 */
const QRCode: React.FC<QRCodeProps> = ({ value, size = 280 }) => {
  console.log("[QRCode-Debug] Renderizando QR:", {
    hasValue: !!value,
    valueLength: value?.length,
    size,
  });

  if (!value) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <QRCodeCanvas
        value={value}
        size={size}
        level="M"
        includeMargin={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default QRCode;
