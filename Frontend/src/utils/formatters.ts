export const formatRegionName = (region: any): string => {
  if (!region) return "";

  // Si ya tiene el formato completo desde el backend (ej: "XIV Región de Los Ríos")
  // simplemente retornarlo
  if (region.name && region.name.includes("Región")) {
    return region.name;
  }

  // Caso legacy: si viene con label separado, formatear
  const label = region.label || region.name;
  const formattedLabel = formatRegionLabel(label);

  // Formato: "XIV Región de Los Ríos"
  return `${region.romanNumber} ${formattedLabel}`;
};

export const formatComunaName = (comunaName: string): string => {
  if (!comunaName) return "";

  // Convertir de "CORRAL" a "Corral"
  return comunaName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatRegionLabel = (label: string): string => {
  if (!label) return "";

  // Convertir "REGIÓN DE LOS RÍOS" a "Región de Los Ríos"
  return label
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
