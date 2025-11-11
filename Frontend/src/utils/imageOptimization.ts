/**
 * Comprime una imagen a un tamaño máximo
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo obtener contexto del canvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Error al comprimir imagen"));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error("Error al cargar imagen"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Error al leer archivo"));
    reader.readAsDataURL(file);
  });
}

/**
 * Convierte File/Blob a base64
 */
export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Carga una imagen de manera lazy con IntersectionObserver
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  threshold: number = 0.1
): void {
  const dataSrc = img.dataset.src;
  if (!dataSrc) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImg = entry.target as HTMLImageElement;
          lazyImg.src = dataSrc;
          lazyImg.classList.add("loaded");
          observer.unobserve(lazyImg);
        }
      });
    },
    { threshold }
  );

  observer.observe(img);
}

/**
 * Genera srcset para responsive images
 */
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", ");
}

/**
 * Valida si un archivo es una imagen
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Obtiene dimensiones de una imagen
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => reject(new Error("Error al cargar imagen"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Error al leer archivo"));
    reader.readAsDataURL(file);
  });
}

/**
 * Redimensiona imagen a dimensiones específicas
 */
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo obtener contexto del canvas"));
          return;
        }

        // Dibujar imagen centrada y recortada si es necesario
        const sourceAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let sx = 0,
          sy = 0,
          sWidth = img.width,
          sHeight = img.height;

        if (sourceAspect > targetAspect) {
          // Imagen más ancha, recortar lados
          sWidth = img.height * targetAspect;
          sx = (img.width - sWidth) / 2;
        } else {
          // Imagen más alta, recortar arriba/abajo
          sHeight = img.width / targetAspect;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(
          img,
          sx,
          sy,
          sWidth,
          sHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Error al redimensionar imagen"));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error("Error al cargar imagen"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Error al leer archivo"));
    reader.readAsDataURL(file);
  });
}
