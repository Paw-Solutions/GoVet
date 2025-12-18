import { lazy, Suspense, ComponentType } from "react";
import { IonSpinner } from "@ionic/react";

/**
 * Componente de loading para lazy loading
 */
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "var(--background-color)",
    }}
  >
    <IonSpinner name="crescent" color="primary" />
  </div>
);

/**
 * Higher Order Component para lazy loading con fallback
 */
export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <LoadingFallback />
) {
  const LazyComponent = lazy(importFunc);

  return (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Preload de componente lazy
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return importFunc();
}
