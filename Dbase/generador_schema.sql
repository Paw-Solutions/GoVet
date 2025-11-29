-- DROP SCHEMA govet;
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'govet'
   ) THEN
      CREATE DATABASE govet;
   END IF;
END
$$;

CREATE SCHEMA govet AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA govet IS 'standard public schema';

-- DROP SEQUENCE govet.consulta_id_consulta_seq;

CREATE SEQUENCE govet.consulta_id_consulta_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.consulta_id_consulta_seq OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.consulta_id_consulta_seq TO pawsolutions;

-- DROP SEQUENCE govet.consulta_id_consulta_seq1;

CREATE SEQUENCE govet.consulta_id_consulta_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.consulta_id_consulta_seq1 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.consulta_id_consulta_seq1 TO pawsolutions;

-- DROP SEQUENCE govet.consulta_id_consulta_seq2;

CREATE SEQUENCE govet.consulta_id_consulta_seq2
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.consulta_id_consulta_seq2 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.consulta_id_consulta_seq2 TO pawsolutions;

-- DROP SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq;

CREATE SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq TO pawsolutions;

-- DROP SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq1;

CREATE SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq1 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq1 TO pawsolutions;

-- DROP SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq2;

CREATE SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq2
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq2 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.consulta_tratamiento_id_aplicacion_seq2 TO pawsolutions;

-- DROP SEQUENCE govet.especie_id_especie_seq;

CREATE SEQUENCE govet.especie_id_especie_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.especie_id_especie_seq OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.especie_id_especie_seq TO pawsolutions;

-- DROP SEQUENCE govet.especie_id_especie_seq1;

CREATE SEQUENCE govet.especie_id_especie_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.especie_id_especie_seq1 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.especie_id_especie_seq1 TO pawsolutions;

-- DROP SEQUENCE govet.especie_id_especie_seq2;

CREATE SEQUENCE govet.especie_id_especie_seq2
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.especie_id_especie_seq2 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.especie_id_especie_seq2 TO pawsolutions;

-- DROP SEQUENCE govet.mascota_id_mascota_seq;

CREATE SEQUENCE govet.mascota_id_mascota_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.mascota_id_mascota_seq OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.mascota_id_mascota_seq TO pawsolutions;

-- DROP SEQUENCE govet.raza_id_raza_seq;

CREATE SEQUENCE govet.raza_id_raza_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.raza_id_raza_seq OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.raza_id_raza_seq TO pawsolutions;

-- DROP SEQUENCE govet.raza_id_raza_seq1;

CREATE SEQUENCE govet.raza_id_raza_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.raza_id_raza_seq1 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.raza_id_raza_seq1 TO pawsolutions;

-- DROP SEQUENCE govet.raza_id_raza_seq2;

CREATE SEQUENCE govet.raza_id_raza_seq2
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.raza_id_raza_seq2 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.raza_id_raza_seq2 TO pawsolutions;

-- DROP SEQUENCE govet.receta_medica_id_receta_seq;

CREATE SEQUENCE govet.receta_medica_id_receta_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.receta_medica_id_receta_seq OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.receta_medica_id_receta_seq TO pawsolutions;

-- DROP SEQUENCE govet.tratamiento_id_tratamiento_seq;

CREATE SEQUENCE govet.tratamiento_id_tratamiento_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.tratamiento_id_tratamiento_seq OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.tratamiento_id_tratamiento_seq TO pawsolutions;

-- DROP SEQUENCE govet.tratamiento_id_tratamiento_seq1;

CREATE SEQUENCE govet.tratamiento_id_tratamiento_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.tratamiento_id_tratamiento_seq1 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.tratamiento_id_tratamiento_seq1 TO pawsolutions;

-- DROP SEQUENCE govet.tratamiento_id_tratamiento_seq2;

CREATE SEQUENCE govet.tratamiento_id_tratamiento_seq2
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE govet.tratamiento_id_tratamiento_seq2 OWNER TO pawsolutions;
GRANT ALL ON SEQUENCE govet.tratamiento_id_tratamiento_seq2 TO pawsolutions;
-- govet.especie definition

-- Drop table

-- DROP TABLE govet.especie;

CREATE TABLE govet.especie (
	id_especie bigserial NOT NULL, -- identificador para asociar un animal
	nombre_cientifico varchar NOT NULL, -- nombre cientifico que posee el animal
	nombre_comun varchar NOT NULL, -- Nombre comun que se utiliza para reconocer el animal
	CONSTRAINT especie_pk PRIMARY KEY (id_especie)
);
COMMENT ON TABLE govet.especie IS 'Especie del animal al cual esta siendo tratado';

-- Column comments

COMMENT ON COLUMN govet.especie.id_especie IS 'identificador para asociar un animal';
COMMENT ON COLUMN govet.especie.nombre_cientifico IS 'nombre cientifico que posee el animal';
COMMENT ON COLUMN govet.especie.nombre_comun IS 'Nombre comun que se utiliza para reconocer el animal';

-- Permissions

ALTER TABLE govet.especie OWNER TO pawsolutions;
GRANT ALL ON TABLE govet.especie TO pawsolutions;


-- govet.tratamiento definition

-- Drop table

-- DROP TABLE govet.tratamiento;

CREATE TABLE govet.tratamiento (
	id_tratamiento serial4 NOT NULL,
	nombre varchar NOT NULL,
	descripcion varchar NULL,
	tipo_tratamiento varchar NOT NULL, -- tipo del tratamiento, puede ser vacuna, antiparasitario, u otro
	CONSTRAINT tratamiento_pk PRIMARY KEY (id_tratamiento)
);
COMMENT ON TABLE govet.tratamiento IS 'Tratamientos disponibles y/o existentes';

-- Column comments

COMMENT ON COLUMN govet.tratamiento.tipo_tratamiento IS 'tipo del tratamiento, puede ser vacuna, antiparasitario, u otro';

-- Permissions

ALTER TABLE govet.tratamiento OWNER TO pawsolutions;
GRANT ALL ON TABLE govet.tratamiento TO pawsolutions;


-- govet.tutor definition

-- Drop table

-- DROP TABLE govet.tutor;

CREATE TABLE govet.tutor (
	nombre varchar NOT NULL, -- Nombre del tutor
	telefono int8 NULL, -- Numero telefonico del tutor
	email varchar NULL, -- Correo electronico del tutor
	direccion varchar NULL, -- Direccion del tutor
	rut varchar NOT NULL, -- Rut del tutor
	celular int8 NULL, -- Numero Celular del tutor
	celular2 int8 NULL, -- Numero Celular 2 del tutor
	apellido_paterno varchar NULL, -- Apellido paterno del Tutor
	apellido_materno varchar NULL, -- Apellido materno del tutor
	comuna varchar NULL, -- Comuna del tutor
	region varchar NULL, -- Region del tutor
	observacion varchar NULL, -- Observacion/notas que considerar sobre un tutor
	telefono2 int8 NULL, -- Numero telefonico 2 del tutor
	CONSTRAINT dueno_pk PRIMARY KEY (rut)
);
COMMENT ON TABLE govet.tutor IS 'Tutor de la mascota o persona encargada de la mascota';

-- Column comments

COMMENT ON COLUMN govet.tutor.nombre IS 'Nombre del tutor';
COMMENT ON COLUMN govet.tutor.telefono IS 'Numero telefonico del tutor';
COMMENT ON COLUMN govet.tutor.email IS 'Correo electronico del tutor';
COMMENT ON COLUMN govet.tutor.direccion IS 'Direccion del tutor';
COMMENT ON COLUMN govet.tutor.rut IS 'Rut del tutor';
COMMENT ON COLUMN govet.tutor.celular IS 'Numero Celular del tutor';
COMMENT ON COLUMN govet.tutor.celular2 IS 'Numero Celular 2 del tutor';
COMMENT ON COLUMN govet.tutor.apellido_paterno IS 'Apellido paterno del Tutor';
COMMENT ON COLUMN govet.tutor.apellido_materno IS 'Apellido materno del tutor';
COMMENT ON COLUMN govet.tutor.comuna IS 'Comuna del tutor';
COMMENT ON COLUMN govet.tutor.region IS 'Region del tutor';
COMMENT ON COLUMN govet.tutor.observacion IS 'Observacion/notas que considerar sobre un tutor';
COMMENT ON COLUMN govet.tutor.telefono2 IS 'Numero telefonico 2 del tutor';

-- Permissions

ALTER TABLE govet.tutor OWNER TO pawsolutions;
GRANT ALL ON TABLE govet.tutor TO pawsolutions;


-- govet.raza definition

-- Drop table

-- DROP TABLE govet.raza;

CREATE TABLE govet.raza (
	id_raza bigserial NOT NULL, -- Identificador de la raza del animal
	nombre varchar NOT NULL, -- nombre de la raza
	id_especie int8 NOT NULL, -- identificador de la especie asociada del animal
	CONSTRAINT raza_pk PRIMARY KEY (id_raza),
	CONSTRAINT raza_especie_fk FOREIGN KEY (id_especie) REFERENCES govet.especie(id_especie)
);
COMMENT ON TABLE govet.raza IS 'Raza del animal al cual fue o esta siendo atendido';

-- Column comments

COMMENT ON COLUMN govet.raza.id_raza IS 'Identificador de la raza del animal';
COMMENT ON COLUMN govet.raza.nombre IS 'nombre de la raza';
COMMENT ON COLUMN govet.raza.id_especie IS 'identificador de la especie asociada del animal';

-- Permissions

ALTER TABLE govet.raza OWNER TO pawsolutions;
GRANT ALL ON TABLE govet.raza TO pawsolutions;


-- govet.paciente definition

-- Drop table

-- DROP TABLE govet.paciente;

CREATE TABLE govet.paciente (
	id_paciente int8 DEFAULT nextval('govet.mascota_id_mascota_seq'::regclass) NOT NULL, -- identificador de la mascota
	nombre varchar NOT NULL, -- nombre de la mascota
	color varchar NOT NULL, -- color del pelaje del animal
	sexo bpchar(1) NOT NULL, -- M: Macho¶H: Hembra
	esterilizado bool DEFAULT false NULL, -- V: si la mascota se encuentra esterelizada¶F: si no
	fecha_nacimiento date NOT NULL, -- Fecha de nacimiento de la mascota
	id_raza int8 NOT NULL,
	codigo_chip varchar NULL, -- Codigo del chip de la mascota, en caso de poseerlo
	CONSTRAINT mascota_pk PRIMARY KEY (id_paciente),
	CONSTRAINT mascota_raza_fk FOREIGN KEY (id_raza) REFERENCES govet.raza(id_raza)
);
COMMENT ON TABLE govet.paciente IS 'Datos de la mascota que fue atendida';

-- Column comments

COMMENT ON COLUMN govet.paciente.id_paciente IS 'identificador de la mascota';
COMMENT ON COLUMN govet.paciente.nombre IS 'nombre de la mascota';
COMMENT ON COLUMN govet.paciente.color IS 'color del pelaje del animal';
COMMENT ON COLUMN govet.paciente.sexo IS 'M: Macho
H: Hembra';
COMMENT ON COLUMN govet.paciente.esterilizado IS 'V: si la mascota se encuentra esterelizada
F: si no';
COMMENT ON COLUMN govet.paciente.fecha_nacimiento IS 'Fecha de nacimiento de la mascota';
COMMENT ON COLUMN govet.paciente.codigo_chip IS 'Codigo del chip de la mascota, en caso de poseerlo';

-- Permissions

ALTER TABLE govet.paciente OWNER TO pawsolutions;
GRANT ALL ON TABLE govet.paciente TO pawsolutions;


-- govet.tutor_paciente definition

-- Drop table

-- DROP TABLE govet.tutor_paciente;

CREATE TABLE govet.tutor_paciente (
	id_paciente int8 NULL, -- id de la mascota
	fecha date NULL, -- Fecha donde se da a conocer que una persona es dueño de la mascota, principalmente en caso de cambio de dueño
	rut varchar NULL, -- rut del dueño de la mascota
	CONSTRAINT dueno_mascota_dueno_fk FOREIGN KEY (rut) REFERENCES govet.tutor(rut),
	CONSTRAINT dueno_mascota_mascota_fk FOREIGN KEY (id_paciente) REFERENCES govet.paciente(id_paciente)
);

-- Column comments

COMMENT ON COLUMN govet.tutor_paciente.id_paciente IS 'id de la mascota';
COMMENT ON COLUMN govet.tutor_paciente.fecha IS 'Fecha donde se da a conocer que una persona es dueño de la mascota, principalmente en caso de cambio de dueño';
COMMENT ON COLUMN govet.tutor_paciente.rut IS 'rut del dueño de la mascota';

-- Permissions

ALTER TABLE govet.tutor_paciente OWNER TO pawsolutions;
GRANT ALL ON TABLE govet.tutor_paciente TO pawsolutions;


-- govet.consulta definition

-- Drop table

-- DROP TABLE govet.consulta;

CREATE TABLE govet.consulta (
	id_paciente int8 NOT NULL,
	rut varchar NOT NULL,
	diagnostico varchar NULL,
	id_consulta bigserial NOT NULL,
	estado_pelaje varchar NULL,
	peso float8 NULL,
	condicion_corporal varchar NULL,
	mucosas varchar NULL,
	dht int8 NULL,
	nodulos_linfaticos varchar NULL,
	"auscultacion_cardiaca-toraxica" varchar NULL,
	observaciones varchar NULL,
	fecha_consulta date NULL,
	motivo varchar NULL,
	tllc float4 NULL, -- tiempo de llenado capilar en segundos
	estado_piel varchar NULL, -- estado de la piel del paciente
	frecuencia_respiratoria float4 NULL, -- frecuencia respiratoria del paciente
	frecuencia_cardiaca float4 NULL, -- frecuencia cardiaca del paciente
	examen_clinico varchar NULL, -- examen clinico del paciente
	prediagnostico varchar NULL,
	pronostico varchar NULL,
	indicaciones_generales varchar NULL,
	temperatura float4 NULL, -- temperatura del animal en celcius
	CONSTRAINT consulta_pk PRIMARY KEY (id_consulta),
	CONSTRAINT consulta_dueno_fk FOREIGN KEY (rut) REFERENCES govet.tutor(rut),
	CONSTRAINT consulta_mascota_fk FOREIGN KEY (id_paciente) REFERENCES govet.paciente(id_paciente)
);
COMMENT ON TABLE govet.consulta IS 'Consulta en la cual la mascota actualmente se encuentra o una que ya paso';

-- Column comments

COMMENT ON COLUMN govet.consulta.tllc IS 'tiempo de llenado capilar en segundos';
COMMENT ON COLUMN govet.consulta.estado_piel IS 'estado de la piel del paciente';
COMMENT ON COLUMN govet.consulta.frecuencia_respiratoria IS 'frecuencia respiratoria del paciente';
COMMENT ON COLUMN govet.consulta.frecuencia_cardiaca IS 'frecuencia cardiaca del paciente';
COMMENT ON COLUMN govet.consulta.examen_clinico IS 'examen clinico del paciente';
COMMENT ON COLUMN govet.consulta.temperatura IS 'temperatura del animal en celcius';

-- Permissions

ALTER TABLE govet.consulta OWNER TO pawsolutions;
GRANT ALL ON TABLE govet.consulta TO pawsolutions;


-- govet.consulta_tratamiento definition

-- Drop table

-- DROP TABLE govet.consulta_tratamiento;

CREATE TABLE govet.consulta_tratamiento (
	id_aplicacion bigserial NOT NULL,
	id_paciente int4 NOT NULL,
	dosis varchar NULL,
	id_consulta int4 NULL,
	id_tratamiento int4 NOT NULL,
	fecha_tratamiento date NULL,
	marca varchar NULL, -- marca del producto si el tratamiento fue una vacuna o antiparasitario, null si no fue estos
	proxima_dosis date NULL, -- fecha de la siguiente dosis si el tratamiento fue algo como vacuna o antiparasitario
	numero_serial varchar NULL, -- numero serial del producto si el tratamiento fue una vacuna o antiparasitario
	CONSTRAINT consulta_tratamiento_pk PRIMARY KEY (id_aplicacion),
	CONSTRAINT consulta_tratamiento_consulta_fk FOREIGN KEY (id_consulta) REFERENCES govet.consulta(id_consulta),
	CONSTRAINT consulta_tratamiento_mascota_fk FOREIGN KEY (id_paciente) REFERENCES govet.paciente(id_paciente),
	CONSTRAINT consulta_tratamiento_tratamiento_fk FOREIGN KEY (id_tratamiento) REFERENCES govet.tratamiento(id_tratamiento)
);

-- Column comments

COMMENT ON COLUMN govet.consulta_tratamiento.marca IS 'marca del producto si el tratamiento fue una vacuna o antiparasitario, null si no fue estos';
COMMENT ON COLUMN govet.consulta_tratamiento.proxima_dosis IS 'fecha de la siguiente dosis si el tratamiento fue algo como vacuna o antiparasitario';
COMMENT ON COLUMN govet.consulta_tratamiento.numero_serial IS 'numero serial del producto si el tratamiento fue una vacuna o antiparasitario';

-- Permissions

ALTER TABLE govet.consulta_tratamiento OWNER TO pawsolutions;
GRANT ALL ON TABLE govet.consulta_tratamiento TO pawsolutions;


-- govet.receta_medica definition

-- Drop table

-- DROP TABLE govet.receta_medica;

CREATE TABLE govet.receta_medica (
	medicamento varchar NOT NULL,
	dosis varchar NOT NULL, -- dosis del medicamento, puede ser algo como 2 tabletas o 8 ml
	frecuencia int4 NOT NULL, -- cada cuanto tiepo hay que dar el medicamento, en horas
	duracion int4 NOT NULL, -- por cuanto tiempo hay que dar medicamento, en dias
	numero_serie varchar NULL,
	id_receta bigserial NOT NULL,
	id_consulta int8 NOT NULL, -- consulta a la que se asocia esta receta
	CONSTRAINT receta_medica_pk PRIMARY KEY (id_receta),
	CONSTRAINT receta_medica_consulta_fk FOREIGN KEY (id_consulta) REFERENCES govet.consulta(id_consulta)
);

-- Column comments

COMMENT ON COLUMN govet.receta_medica.dosis IS 'dosis del medicamento, puede ser algo como 2 tabletas o 8 ml';
COMMENT ON COLUMN govet.receta_medica.frecuencia IS 'cada cuanto tiepo hay que dar el medicamento, en horas';
COMMENT ON COLUMN govet.receta_medica.duracion IS 'por cuanto tiempo hay que dar medicamento, en dias';
COMMENT ON COLUMN govet.receta_medica.id_consulta IS 'consulta a la que se asocia esta receta';

-- Permissions

ALTER TABLE govet.receta_medica OWNER TO pawsolutions;
GRANT ALL ON TABLE govet.receta_medica TO pawsolutions;




-- Permissions

GRANT ALL ON SCHEMA govet TO pg_database_owner;
GRANT USAGE ON SCHEMA govet TO public;