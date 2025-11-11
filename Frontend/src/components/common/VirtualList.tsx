import React, { useRef, useEffect, useState, useCallback } from "react";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

/**
 * Componente de lista virtual para mejorar performance con listas largas
 * Solo renderiza los items visibles en el viewport
 */
export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className = "",
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcular qué items son visibles
  const visibleRange = useCallback(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const { startIndex, endIndex } = visibleRange();
  const visibleItems = items.slice(startIndex, endIndex + 1);

  // Altura total del contenido
  const totalHeight = items.length * itemHeight;

  // Offset del primer item visible
  const offsetY = startIndex * itemHeight;

  // Handle scroll con throttle
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`virtual-list ${className}`}
      style={{
        height: containerHeight,
        overflow: "auto",
        position: "relative",
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook para calcular la altura del contenedor automáticamente
 */
export function useContainerHeight(
  ref: React.RefObject<HTMLElement>,
  defaultHeight: number = 400
): number {
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    // Calcular altura inicial
    updateHeight();

    // Recalcular en resize
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [ref]);

  return height;
}
