import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * Redirige a /login si el usuario no está autenticado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar spinner mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "var(--background-color)",
        }}
      >
        <IonSpinner
          name="crescent"
          color="primary"
          style={{ width: "48px", height: "48px" }}
        />
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
