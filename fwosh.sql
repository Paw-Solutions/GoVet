-- DROP SCHEMA govet;

CREATE SCHEMA govet AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA govet IS 'standard public schema';
-- govet.dueno definition

-- Drop table

-- DROP TABLE govet.dueno;

CREATE TABLE govet.dueno (
	nombre varchar NULL, -- Nombre del dueño
	telefono int8 NULL, -- Numero telefonico del dueño
	email varchar NULL, -- Correo electronico del dueño
	direccion varchar NULL, -- Direccion del dueño
	rut varchar NOT NULL, -- Rut del dueño
	CONSTRAINT dueno_pk PRIMARY KEY (rut)
);
COMMENT ON TABLE govet.dueno IS 'Dueño de la mascota o persona encargada de la mascota';

-- Column comments

COMMENT ON COLUMN govet.dueno.nombre IS 'Nombre del dueño';
COMMENT ON COLUMN govet.dueno.telefono IS 'Numero telefonico del dueño';
COMMENT ON COLUMN govet.dueno.email IS 'Correo electronico del dueño';
COMMENT ON COLUMN govet.dueno.direccion IS 'Direccion del dueño';
COMMENT ON COLUMN govet.dueno.rut IS 'Rut del dueño';

-- Permissions

ALTER TABLE govet.dueno OWNER TO postgres;
GRANT ALL ON TABLE govet.dueno TO postgres;


-- govet.especie definition

-- Drop table

-- DROP TABLE govet.especie;

CREATE TABLE govet.especie (
	id_especie int8 NOT NULL, -- identificador para asociar un animal
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

ALTER TABLE govet.especie OWNER TO postgres;
GRANT ALL ON TABLE govet.especie TO postgres;


-- govet.tratamiento definition

-- Drop table

-- DROP TABLE govet.tratamiento;

CREATE TABLE govet.tratamiento (
	id_tratamiento int4 NOT NULL,
	nombre varchar NULL,
	descripcion varchar NULL,
	CONSTRAINT tratamiento_pk PRIMARY KEY (id_tratamiento)
);
COMMENT ON TABLE govet.tratamiento IS 'Tratamientos disponibles y/o existentes';

-- Permissions

ALTER TABLE govet.tratamiento OWNER TO postgres;
GRANT ALL ON TABLE govet.tratamiento TO postgres;


-- govet.raza definition

-- Drop table

-- DROP TABLE govet.raza;

CREATE TABLE govet.raza (
	id_raza int8 NOT NULL, -- Identificador de la raza del animal
	nombre varchar NOT NULL, -- nombre de la raza
	id_especie int8 NULL, -- identificador de la especie asociada del animal
	CONSTRAINT raza_pk PRIMARY KEY (id_raza),
	CONSTRAINT raza_especie_fk FOREIGN KEY (id_especie) REFERENCES govet.especie(id_especie)
);
COMMENT ON TABLE govet.raza IS 'Raza del animal al cual fue o esta siendo atendido';

-- Column comments

COMMENT ON COLUMN govet.raza.id_raza IS 'Identificador de la raza del animal';
COMMENT ON COLUMN govet.raza.nombre IS 'nombre de la raza';
COMMENT ON COLUMN govet.raza.id_especie IS 'identificador de la especie asociada del animal';

-- Permissions

ALTER TABLE govet.raza OWNER TO postgres;
GRANT ALL ON TABLE govet.raza TO postgres;


-- govet.mascota definition

-- Drop table

-- DROP TABLE govet.mascota;

CREATE TABLE govet.mascota (
	id_mascota int8 NOT NULL, -- identificador de la mascota
	nombre varchar NULL, -- nombre de la mascota
	color varchar NULL, -- color del pelaje del animal
	sexo bpchar(1) NOT NULL, -- M: Macho¶H: Hembra
	esterelizado bool DEFAULT false NULL, -- V: si la mascota se encuentra esterelizada¶F: si no
	edad int8 NOT NULL, -- Edad de la mascota
	fecha_nacimiento date NOT NULL, -- Fecha de nacimiento de la mascota
	id_raza int8 NOT NULL,
	codigo_chip varchar NULL, -- Codigo del chip de la mascota, en caso de poseerlo
	CONSTRAINT mascota_pk PRIMARY KEY (id_mascota),
	CONSTRAINT mascota_raza_fk FOREIGN KEY (id_raza) REFERENCES govet.raza(id_raza)
);
COMMENT ON TABLE govet.mascota IS 'Datos de la mascota que fue atendida';

-- Column comments

COMMENT ON COLUMN govet.mascota.id_mascota IS 'identificador de la mascota';
COMMENT ON COLUMN govet.mascota.nombre IS 'nombre de la mascota';
COMMENT ON COLUMN govet.mascota.color IS 'color del pelaje del animal';
COMMENT ON COLUMN govet.mascota.sexo IS 'M: Macho
H: Hembra';
COMMENT ON COLUMN govet.mascota.esterelizado IS 'V: si la mascota se encuentra esterelizada
F: si no';
COMMENT ON COLUMN govet.mascota.edad IS 'Edad de la mascota';
COMMENT ON COLUMN govet.mascota.fecha_nacimiento IS 'Fecha de nacimiento de la mascota';
COMMENT ON COLUMN govet.mascota.codigo_chip IS 'Codigo del chip de la mascota, en caso de poseerlo';

-- Permissions

ALTER TABLE govet.mascota OWNER TO postgres;
GRANT ALL ON TABLE govet.mascota TO postgres;


-- govet.consulta definition

-- Drop table

-- DROP TABLE govet.consulta;

CREATE TABLE govet.consulta (
	id_mascota int8 NULL,
	rut varchar NULL,
	diagnostico varchar NULL,
	id_consulta int4 NOT NULL,
	estado_pelaje varchar NULL,
	peso int4 NULL,
	condicion_corporal varchar NULL,
	mucosas varchar NULL,
	dht varchar NULL,
	nodulos_linfaticos varchar NULL,
	"auscultacion_cardiaca-toraxica" varchar NULL,
	observaciones varchar NULL,
	fecha_consulta date NULL,
	CONSTRAINT consulta_pk PRIMARY KEY (id_consulta),
	CONSTRAINT consulta_dueno_fk FOREIGN KEY (rut) REFERENCES govet.dueno(rut),
	CONSTRAINT consulta_mascota_fk FOREIGN KEY (id_mascota) REFERENCES govet.mascota(id_mascota)
);
COMMENT ON TABLE govet.consulta IS 'Consulta en la cual la mascota actualmente se encuentra o una que ya paso';

-- Permissions

ALTER TABLE govet.consulta OWNER TO postgres;
GRANT ALL ON TABLE govet.consulta TO postgres;


-- govet.consulta_tratamiento definition

-- Drop table

-- DROP TABLE govet.consulta_tratamiento;

CREATE TABLE govet.consulta_tratamiento (
	id_aplicacion int4 NOT NULL,
	id_mascota int4 NOT NULL,
	dosis varchar NULL,
	id_consulta int4 NULL,
	id_tratamiento int4 NOT NULL,
	fecha_tratamiento date NULL,
	CONSTRAINT consulta_tratamiento_pk PRIMARY KEY (id_aplicacion),
	CONSTRAINT consulta_tratamiento_consulta_fk FOREIGN KEY (id_consulta) REFERENCES govet.consulta(id_consulta),
	CONSTRAINT consulta_tratamiento_mascota_fk FOREIGN KEY (id_mascota) REFERENCES govet.mascota(id_mascota),
	CONSTRAINT consulta_tratamiento_tratamiento_fk FOREIGN KEY (id_tratamiento) REFERENCES govet.tratamiento(id_tratamiento)
);

-- Permissions

ALTER TABLE govet.consulta_tratamiento OWNER TO postgres;
GRANT ALL ON TABLE govet.consulta_tratamiento TO postgres;


-- govet.dueno_mascota definition

-- Drop table

-- DROP TABLE govet.dueno_mascota;

CREATE TABLE govet.dueno_mascota (
	id_mascota int8 NULL, -- id de la mascota
	fecha date NULL, -- Fecha donde se da a conocer que una persona es dueño de la mascota, principalmente en caso de cambio de dueño
	rut varchar NULL, -- rut del dueño de la mascota
	CONSTRAINT dueno_mascota_dueno_fk FOREIGN KEY (rut) REFERENCES govet.dueno(rut),
	CONSTRAINT dueno_mascota_mascota_fk FOREIGN KEY (id_mascota) REFERENCES govet.mascota(id_mascota)
);

-- Column comments

COMMENT ON COLUMN govet.dueno_mascota.id_mascota IS 'id de la mascota';
COMMENT ON COLUMN govet.dueno_mascota.fecha IS 'Fecha donde se da a conocer que una persona es dueño de la mascota, principalmente en caso de cambio de dueño';
COMMENT ON COLUMN govet.dueno_mascota.rut IS 'rut del dueño de la mascota';

-- Permissions

ALTER TABLE govet.dueno_mascota OWNER TO postgres;
GRANT ALL ON TABLE govet.dueno_mascota TO postgres;




-- Permissions

GRANT ALL ON SCHEMA govet TO pg_database_owner;
GRANT USAGE ON SCHEMA govet TO public;