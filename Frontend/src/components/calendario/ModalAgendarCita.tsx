import { useState, useEffect, useCallback } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonChip,
  IonNote,
  IonSpinner,
  useIonToast,
  IonList,
  IonPopover,
} from "@ionic/react";
import {
  closeOutline,
  checkmarkOutline,
  personOutline,
  pawOutline,
} from "ionicons/icons";
import { createEvent, type CalendarEventCreate } from "../../api/calendario";
import { enviarNotificacion } from "../../api/notificacion";
import { obtenerTutoresPaginados, type TutorData } from "../../api/tutores";
import {
  obtenerPacientesPorTutor,
  type PacienteData,
} from "../../api/pacientes";

interface ModalAgendarCitaProps {
  isOpen: boolean;
  onClose: () => void;
  fechaInicial?: Date;
  onCitaCreada: () => void;
}

const ModalAgendarCita: React.FC<ModalAgendarCitaProps> = ({
  isOpen,
  onClose,
  fechaInicial = new Date(),
  onCitaCreada,
}) => {
  const [present] = useIonToast();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);

  // Datos del formulario - Paso 1: Buscar Tutor
  const [busquedaTutor, setBusquedaTutor] = useState("");
  const [tutoresEncontrados, setTutoresEncontrados] = useState<TutorData[]>([]);
  const [buscandoTutores, setBuscandoTutores] = useState(false);
  const [tutorSeleccionado, setTutorSeleccionado] = useState<TutorData | null>(
    null
  );

  // Datos del formulario - Paso 2: Seleccionar Pacientes
  const [pacientesSeleccionados, setPacientesSeleccionados] = useState<
    number[]
  >([]);
  const [pacientesDisponibles, setPacientesDisponibles] = useState<
    PacienteData[]
  >([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(false);

  // Datos del formulario - Paso 3: Fecha y Hora
  const [fechaHora, setFechaHora] = useState(fechaInicial.toISOString());
  const [fechaHoraTermino, setFechaHoraTermino] = useState(
    fechaInicial.toISOString()
  );
  const [ubicacion, setUbicacion] = useState("");
  const [errorDuracion, setErrorDuracion] = useState(false);

  // Datos del formulario - Paso 4: Motivo, Descripción y Notas
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [notas, setNotas] = useState("");
  const [notificacion, setNotificacion] = useState<string>("diaAnterior");
  const [fechaNotificacion, setFechaNotificacion] = useState<Date | null>(null);

  const resetForm = () => {
    setPaso(1);
    setBusquedaTutor("");
    setTutoresEncontrados([]);
    setTutorSeleccionado(null);
    setPacientesSeleccionados([]);
    setPacientesDisponibles([]);
    const fechaDefault = new Date();
    setFechaHora(fechaDefault.toISOString());
    setFechaHoraTermino(fechaDefault.toISOString());
    setUbicacion("");
    setMotivo("");
    setDescripcion("");
    setNotas("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Función para buscar tutores
  const buscarTutores = async (textoBusqueda: string) => {
    setBusquedaTutor(textoBusqueda);

    if (!textoBusqueda.trim()) {
      setTutoresEncontrados([]);
      return;
    }

    setBuscandoTutores(true);
    try {
      const response = await obtenerTutoresPaginados(1, 20, textoBusqueda);
      setTutoresEncontrados(response.tutores);
    } catch (error) {
      console.error("Error buscando tutores:", error);
      present({
        message: "Error al buscar tutores",
        duration: 2000,
        color: "danger",
      });
    } finally {
      setBuscandoTutores(false);
    }
  };

  const seleccionarTutor = (tutor: TutorData) => {
    setTutorSeleccionado(tutor);
    setTutoresEncontrados([]);
    setBusquedaTutor("");
    // Cargar pacientes del tutor seleccionado
    cargarPacientesDeTutor(tutor.rut);
  };

  // Función para cargar pacientes de un tutor
  const cargarPacientesDeTutor = async (rutTutor: string) => {
    setCargandoPacientes(true);
    try {
      const pacientes = await obtenerPacientesPorTutor(rutTutor);
      setPacientesDisponibles(pacientes);

      if (pacientes.length === 0) {
        present({
          message: "Este tutor no tiene pacientes registrados",
          duration: 3000,
          color: "warning",
        });
      }
    } catch (error) {
      console.error("Error cargando pacientes:", error);
      present({
        message: "Error al cargar los pacientes del tutor",
        duration: 2000,
        color: "danger",
      });
      setPacientesDisponibles([]);
    } finally {
      setCargandoPacientes(false);
    }
  };

  const togglePaciente = (id: number) => {
    if (pacientesSeleccionados.includes(id)) {
      setPacientesSeleccionados(pacientesSeleccionados.filter((p) => p !== id));
    } else {
      setPacientesSeleccionados([...pacientesSeleccionados, id]);
    }
  };

  // Pure helper: devuelve la fecha de envío según tipo y la fecha de la cita
  const calcularFechaNotificacion = (tipo: string, fechaHoraIso: string) => {
    if (!fechaHoraIso) return new Date();
    const fecha = new Date(fechaHoraIso);
    if (tipo === "diaAnterior") {
      fecha.setDate(fecha.getDate() - 1);
      return fecha;
    }
    if (tipo === "semanaAntes") {
      fecha.setDate(fecha.getDate() - 7);
      return fecha;
    }
    if (tipo === "minutos") {
      // prueba
      fecha.setMinutes(fecha.getMinutes() - 145);
      // si la fecha resultante ya pasó, devolver ahora para envío inmediato
      if (fecha < new Date()) return new Date();
      return fecha;
    }
    // 'ahora' o cualquier otro caso
    return new Date();
  };

  // Si cambia la fecha o la notificación, se actualiza el estado fechaNotificacion
  const handleNotificacion = useCallback(() => {
    if (!fechaHora) return;
    const fecha = calcularFechaNotificacion(notificacion, fechaHora);
    setFechaNotificacion(fecha);
  }, [notificacion, fechaHora]);

  // Ejecutar la función cuando cambie la selección de notificación o la fecha/hora
  useEffect(() => {
    handleNotificacion();
  }, [handleNotificacion]);

  // Validar duración de la cita (mínimo 30 minutos)
  useEffect(() => {
    if (fechaHora && fechaHoraTermino) {
      const inicio = new Date(fechaHora);
      const termino = new Date(fechaHoraTermino);
      const diferenciaMinutos = (termino.getTime() - inicio.getTime()) / 60000;
      setErrorDuracion(diferenciaMinutos < 30);
    }
  }, [fechaHora, fechaHoraTermino]);

  // Handler para cambio de fecha/hora de inicio
  const handleCambioInicio = (value: string | null | undefined) => {
    if (value) {
      setFechaHora(value);
    }
  };

  const handleSiguiente = () => {
    if (paso === 1 && !tutorSeleccionado) {
      present({
        message: "Debes seleccionar un tutor primero",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    if (paso === 2 && pacientesSeleccionados.length === 0) {
      if (pacientesDisponibles.length === 0) {
        present({
          message: "El tutor no tiene pacientes registrados",
          duration: 3000,
          color: "warning",
        });
      } else {
        present({
          message: "Selecciona al menos un paciente",
          duration: 2000,
          color: "warning",
        });
      }
      return;
    }

    if (paso === 3) {
      // Validar que la hora de término sea después de la hora de inicio
      const inicio = new Date(fechaHora);
      const termino = new Date(fechaHoraTermino);

      if (termino <= inicio) {
        present({
          message: "La hora de término debe ser después de la hora de inicio",
          duration: 2000,
          color: "warning",
        });
        return;
      }
    }

    if (paso === 4) {
      if (!motivo.trim()) {
        present({
          message: "Ingresa el motivo de la cita",
          duration: 2000,
          color: "warning",
        });
        return;
      }
    }

    setPaso(paso + 1);
  };

  const handleAnterior = () => {
    setPaso(paso - 1);
  };
  const isValidEmail = (email: string | undefined | null): boolean => {
    if (!email) return false;

    // Verificar que no sea "NaN", vacío o solo espacios
    if (email === "NaN" || email.trim() === "") return false;

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };
  const handleCrearCita = async () => {
    setLoading(true);
    try {
      // Usar las fechas ISO completas directamente
      const fechaInicio = new Date(fechaHora);
      const fechaTermino = new Date(fechaHoraTermino);

      // Obtener nombres de los pacientes seleccionados
      const nombresPacientes = pacientesDisponibles
        .filter((p) => pacientesSeleccionados.includes(p.id_paciente))
        .map((p) => p.nombre)
        .join(", ");

      // Construir el evento para Google Calendar
      const nuevoEvento: CalendarEventCreate = {
        summary: `${motivo} - ${nombresPacientes}`,
        location: ubicacion || undefined,
        description: descripcion
          ? `${descripcion}\n\nPacientes: ${nombresPacientes}\nTutor: ${
              tutorSeleccionado!.nombre
            } ${tutorSeleccionado!.apellido_paterno}${
              notas ? "\n\nNotas: " + notas : ""
            }`
          : `Pacientes: ${nombresPacientes}\nTutor: ${
              tutorSeleccionado!.nombre
            } ${tutorSeleccionado!.apellido_paterno}${
              notas ? "\n\nNotas: " + notas : ""
            }`,
        start: fechaInicio.toISOString(),
        end: fechaTermino.toISOString(),
        attendees: undefined, //tutorSeleccionado?.email
        //? [{ email: tutorSeleccionado.email }]
        //: undefined,
      };
      console.log(nuevoEvento);
      await createEvent(nuevoEvento);

      present({
        message: "Cita agendada exitosamente",
        duration: 3000,
        color: "success",
        icon: checkmarkOutline,
      });

      try {
        if (tutorSeleccionado?.email) {
          console.log(
            "Enviando notificación al email:",
            tutorSeleccionado.email
          );

          const nombreCompleto = `${tutorSeleccionado.nombre} ${tutorSeleccionado.apellido_paterno}`;
          const cuerpo = `
            <p>Hola ${nombreCompleto},</p>
            <p>Tu cita ha sido agendada.</p>
            <p>Motivo: ${motivo || "(Sin especificar)"}</p>
          `;

          // calcular fecha de envío localmente (no confiar en setState que es asíncrono)
          const fechaEnvioDate = calcularFechaNotificacion(
            notificacion,
            fechaHora
          );
          const fechaEnvioIso = fechaEnvioDate.toISOString();

          // actualizar el estado para mostrar en el resumen si se necesita
          setFechaNotificacion(fechaEnvioDate);

          await enviarNotificacion(
            {
              email: tutorSeleccionado.email,
              asunto: "Confirmación de cita - GoVet",
              cuerpo,
            },
            fechaEnvioIso
          );

          present({
            message: "Correo de confirmación enviado",
            duration: 2200,
            color: "success",
          });
        } else {
          console.log(
            "No hay email de tutor; se omite el envío de notificación."
          );
        }
      } catch (emailError) {
        console.error("Error enviando notificación:", emailError);
        present({
          message: "Cita creada, pero falló el envío del correo",
          duration: 4000,
          color: "warning",
        });
      }

      onCitaCreada();
      handleClose();
    } catch (error) {
      console.error("Error al crear cita:", error);
      present({
        message: "Error al agendar la cita",
        duration: 3000,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPaso1 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <IonIcon icon={personOutline} className="paso-icon" />
        <h3>Buscar Tutor</h3>
        <p>Busca por nombre, RUT o email del tutor</p>
      </div>

      {!tutorSeleccionado ? (
        <>
          <IonItem>
            <IonLabel position="stacked">Buscar Tutor</IonLabel>
            <IonInput
              value={busquedaTutor}
              onIonInput={(e) => buscarTutores(e.detail.value || "")}
              placeholder="Nombre, RUT o email..."
              debounce={500}
            />
          </IonItem>

          {buscandoTutores && (
            <div className="ion-text-center ion-padding">
              <IonSpinner />
            </div>
          )}

          {tutoresEncontrados.length > 0 && (
            <IonList className="tutores-resultados">
              {tutoresEncontrados.map((tutor, index) => (
                <IonItem
                  key={`${tutor.rut}-${index}`}
                  button
                  onClick={() => seleccionarTutor(tutor)}
                >
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel>
                    <h3>
                      {tutor.nombre} {tutor.apellido_paterno}{" "}
                      {tutor.apellido_materno}
                    </h3>
                    <p>RUT: {tutor.rut}</p>
                    {tutor.email && <p>Email: {tutor.email}</p>}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}

          {busquedaTutor &&
            !buscandoTutores &&
            tutoresEncontrados.length === 0 && (
              <IonNote className="ion-padding">
                No se encontraron tutores con "{busquedaTutor}"
              </IonNote>
            )}
        </>
      ) : (
        <div className="tutor-encontrado">
          <IonChip color="success">
            <IonIcon icon={checkmarkOutline} />
            <IonLabel>
              Tutor: {tutorSeleccionado.nombre}{" "}
              {tutorSeleccionado.apellido_paterno}
            </IonLabel>
          </IonChip>
          <div className="tutor-info">
            <IonNote>RUT: {tutorSeleccionado.rut}</IonNote>
            {tutorSeleccionado.email && (
              <IonNote>Email: {tutorSeleccionado.email}</IonNote>
            )}
          </div>
          <IonButton
            fill="clear"
            size="small"
            onClick={() => {
              setTutorSeleccionado(null);
              setPacientesDisponibles([]);
              setPacientesSeleccionados([]);
            }}
          >
            Cambiar tutor
          </IonButton>
        </div>
      )}
    </div>
  );

  const renderPaso2 = () => (
    <div className="paso-content">
      <div className="paso-header">
        <IonIcon icon={pawOutline} className="paso-icon" />
        <h3>Seleccionar Pacientes</h3>
        <p>Elige los pacientes para la cita</p>
      </div>

      {tutorSeleccionado && (
        <IonNote className="ion-padding">
          Pacientes de: {tutorSeleccionado.nombre}{" "}
          {tutorSeleccionado.apellido_paterno}
        </IonNote>
      )}

      {cargandoPacientes ? (
        <div className="ion-text-center ion-padding">
          <IonSpinner />
          <p>Cargando pacientes...</p>
        </div>
      ) : pacientesDisponibles.length === 0 ? (
        <div className="ion-text-center ion-padding">
          <IonNote>
            Este tutor no tiene pacientes registrados. Por favor, registra un
            paciente primero.
          </IonNote>
        </div>
      ) : (
        <div className="pacientes-lista">
          {pacientesDisponibles.map((paciente) => (
            <IonItem
              key={paciente.id_paciente}
              button
              onClick={() => togglePaciente(paciente.id_paciente)}
              className={
                pacientesSeleccionados.includes(paciente.id_paciente)
                  ? "paciente-seleccionado"
                  : ""
              }
            >
              <IonIcon icon={pawOutline} slot="start" />
              <IonLabel>
                <h3>{paciente.nombre}</h3>
                <p style={{ marginTop: "4px", marginBottom: "4px" }}>
                  <strong>Especie:</strong>{" "}
                  {paciente.especie || "No especificada"}
                </p>
                {paciente.raza && (
                  <p style={{ marginTop: "4px", marginBottom: "4px" }}>
                    <strong>Raza:</strong> {paciente.raza}
                  </p>
                )}
                {paciente.sexo && (
                  <p style={{ marginTop: "4px", marginBottom: "4px" }}>
                    <strong>Sexo:</strong> {paciente.sexo}
                  </p>
                )}
              </IonLabel>
              {pacientesSeleccionados.includes(paciente.id_paciente) && (
                <IonIcon icon={checkmarkOutline} slot="end" color="success" />
              )}
            </IonItem>
          ))}
        </div>
      )}

      {pacientesSeleccionados.length > 0 && (
        <IonNote className="mt-3">
          {pacientesSeleccionados.length}{" "}
          {pacientesSeleccionados.length === 1
            ? "paciente seleccionado"
            : "pacientes seleccionados"}
        </IonNote>
      )}
    </div>
  );

  const renderPaso3 = () => {
    // Formatear hora para mostrar en el botón
    const formatearHora = (isoString: string) => {
      const fecha = new Date(isoString);
      return fecha.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    return (
      <div className="paso-content">
        <div className="paso-header">
          <h3>Fecha y Hora de la Cita</h3>
          <p>Define cuándo comienza y termina la cita</p>
        </div>

        <IonItem>
          <IonLabel position="stacked">
            Fecha de la cita <span className="required">*</span>
          </IonLabel>
          <IonDatetime
            value={fechaHora}
            onIonChange={(e) => handleCambioInicio(e.detail.value as string)}
            presentation="date"
            locale="es-CL"
            min={new Date().toISOString()}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            Horario de la cita <span className="required">*</span>
          </IonLabel>
          <div className="time-range-picker">
            <IonButton
              id="popover-time-inicio"
              expand="block"
              fill="outline"
              className="time-button"
            >
              {formatearHora(fechaHora)}
            </IonButton>

            <IonPopover
              trigger="popover-time-inicio"
              dismissOnSelect={false}
              size="auto"
            >
              <IonDatetime
                presentation="time"
                value={fechaHora}
                onIonChange={(e) => {
                  handleCambioInicio(e.detail.value as string);
                }}
                hourCycle="h23"
                locale="es-CL"
                showDefaultButtons={true}
              />
            </IonPopover>

            <span className="range-arrow">→</span>

            <IonButton
              id="popover-time-termino"
              expand="block"
              fill="outline"
              className="time-button"
            >
              {formatearHora(fechaHoraTermino)}
            </IonButton>

            <IonPopover
              trigger="popover-time-termino"
              dismissOnSelect={false}
              size="auto"
            >
              <IonDatetime
                presentation="time"
                value={fechaHoraTermino}
                onIonChange={(e) => {
                  setFechaHoraTermino(e.detail.value as string);
                }}
                hourCycle="h23"
                locale="es-CL"
                showDefaultButtons={true}
              />
            </IonPopover>
          </div>
          {errorDuracion && (
            <IonNote color="danger">
              ⚠️ La cita debe durar al menos 30 minutos
            </IonNote>
          )}
        </IonItem>

        <IonItem className="mt-3">
          <IonLabel position="stacked">Ubicación (opcional)</IonLabel>
          <IonInput
            value={ubicacion}
            onIonInput={(e) => setUbicacion(e.detail.value || "")}
            placeholder="Ej: Consultorio 1, Sala de vacunación..."
          />
        </IonItem>
      </div>
    );
  };

  const renderPaso4 = () => {
    // Calcular fecha y horas formateadas
    const fechaInicio = new Date(fechaHora);
    const fechaTermino = new Date(fechaHoraTermino);

    const fechaFormateada = fechaInicio.toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const horaInicioFormateada = fechaInicio.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const horaTerminoFormateada = fechaTermino.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="paso-content">
        <div className="paso-header">
          <h3>Detalles y Confirmación</h3>
          <p>Completa la información de la cita</p>
        </div>

        <IonItem>
          <IonLabel position="stacked">
            Motivo de la cita <span className="required">*</span>
          </IonLabel>
          <IonInput
            value={motivo}
            onIonInput={(e) => setMotivo(e.detail.value || "")}
            placeholder="Ej: Vacunación, Control, Revisión..."
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Descripción (opcional)</IonLabel>
          <IonTextarea
            value={descripcion}
            onIonInput={(e) => setDescripcion(e.detail.value || "")}
            placeholder="Detalles adicionales sobre la cita..."
            rows={3}
          />
        </IonItem>

        <IonList className="mt-3">
          <IonItem>
            <IonLabel position="stacked">¿Cuándo notificar al tutor?</IonLabel>
            <IonSelect
              aria-label="notificacion"
              placeholder="Selecciona cuándo notificar..."
              value={notificacion}
              onIonChange={(e) => setNotificacion(e.detail.value as string)}
            >
              <IonSelectOption value="diaAnterior">
                Día anterior
              </IonSelectOption>
              <IonSelectOption value="semanaAntes">
                Una semana antes
              </IonSelectOption>
              <IonSelectOption value="ahora">Ahora (test)</IonSelectOption>
              <IonSelectOption value="minutos">
                2h 40min antes (test)
              </IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>

        <IonItem className="mt-3">
          <IonLabel position="stacked">Notas adicionales (opcional)</IonLabel>
          <IonTextarea
            value={notas}
            onIonInput={(e) => setNotas(e.detail.value || "")}
            placeholder="Información adicional sobre la cita..."
            rows={3}
          />
        </IonItem>

        {/* Resumen */}
        <div className="resumen-cita">
          <h4>Resumen de la Cita</h4>
          <div className="resumen-item">
            <strong>Tutor:</strong>{" "}
            {tutorSeleccionado
              ? `${tutorSeleccionado.nombre} ${tutorSeleccionado.apellido_paterno} ${tutorSeleccionado.apellido_materno}`
              : "-"}
            {tutorSeleccionado?.email && ` (${tutorSeleccionado.email})`}
          </div>
          <div className="resumen-item">
            <strong>Pacientes:</strong>{" "}
            {pacientesDisponibles
              .filter((p) => pacientesSeleccionados.includes(p.id_paciente))
              .map((p) => p.nombre)
              .join(", ") || "-"}
          </div>
          <div className="resumen-item">
            <strong>Fecha:</strong> {fechaFormateada}
          </div>
          <div className="resumen-item">
            <strong>Hora de inicio:</strong> {horaInicioFormateada}
          </div>
          <div className="resumen-item">
            <strong>Hora de término:</strong> {horaTerminoFormateada}
          </div>
          {ubicacion && (
            <div className="resumen-item">
              <strong>Ubicación:</strong> {ubicacion}
            </div>
          )}
          <div className="resumen-item">
            <strong>Motivo:</strong> {motivo || "(Por completar)"}
          </div>
          {descripcion && (
            <div className="resumen-item">
              <strong>Descripción:</strong> {descripcion}
            </div>
          )}
          <div className="resumen-item">
            <strong>Notificación:</strong>{" "}
            {notificacion === "diaAnterior"
              ? "Día anterior"
              : notificacion === "semanaAntes"
              ? "Una semana antes"
              : notificacion === "minutos"
              ? "2h 40min antes (test)"
              : notificacion === "ahora"
              ? "Ahora (test)"
              : "-"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agendar Cita - Paso {paso} de 4</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Indicador de pasos */}
        <div className="pasos-indicador">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`paso-punto ${paso >= num ? "activo" : ""} ${
                paso === num ? "actual" : ""
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Contenido del paso actual */}
        {paso === 1 && renderPaso1()}
        {paso === 2 && renderPaso2()}
        {paso === 3 && renderPaso3()}
        {paso === 4 && renderPaso4()}

        {/* Botones de navegación */}
        <div className="modal-botones">
          {paso > 1 && (
            <IonButton
              expand="block"
              fill="outline"
              onClick={handleAnterior}
              disabled={loading}
            >
              Anterior
            </IonButton>
          )}

          {paso < 4 ? (
            <IonButton expand="block" onClick={handleSiguiente}>
              Siguiente
            </IonButton>
          ) : (
            <IonButton
              expand="block"
              onClick={handleCrearCita}
              disabled={loading}
            >
              {loading ? (
                <>
                  <IonSpinner name="crescent" />
                  Agendando...
                </>
              ) : (
                "Confirmar Cita"
              )}
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalAgendarCita;
