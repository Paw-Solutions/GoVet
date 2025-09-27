export const formatRegionName = (region: any): string => {
  if (!region) return "";

  // Formatear el label: "REGIÓN DE LOS RÍOS" -> "Región de Los Ríos"
  const formattedLabel = formatRegionLabel(region.label);

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
