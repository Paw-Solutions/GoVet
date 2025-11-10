# Manual de Usuario

Este Manual describe como usar cada parte de nuestro proyecto y que consideraciones hay que tener en ciertos casos de uso

---

## Aclaracion

Este documento es principalmente del sprint 1, tomando en cuenta que este fue entregado a lo mas tardar el dia 30/09/2025 a nuestra profesora encargada del ramo Taller de Ingenieria de Software, que puede sufrir cambios de aqui a la entrega final.

---

## Componentes de GoVet
Los componentes que conforman a GoVet estan puestos de manera que se pueda realizar un ingreso rapido de estos a una base de datos.

Los componentes serian los siguientes:

0. [Pagina principal](#0-pagina-principal)
1. [Registrar paciente](#1-registrar-paciente)
2. [Registrar Tutor](#2-registrar-tutor)
3. [Busqueda](#3-busqueda)
    - [Busqueda de Pacientes](#busqueda-de-pacientes)
    - [Busqueda de Tutores](#busqueda-de-tutores)
    - [Busqueda de Fichas](#busqueda-de-fichas)
4. [Crear Ficha](#4-crear-ficha)

En cada componente existe una barra lateral que lleva a distintos componentes de manera rapida
entre estos son [Pagina Principal](#0-pagina-principal) al tocar la casa, [Busqueda](#3-busqueda) al tocar la lupa, [Crear Ficha](#4-crear-ficha) al tocar el mas y el calendario actualmente no se encuentra implementado

---

## 0. Pagina Principal

En la pagina principal actual existe una lista con los tutores registrados recientemente en la parte central.

En el lado inferior izquierdo existe un boton (+) que da apertura a los distintos componentes que se mencionan en este documento.


## 1. Registrar Paciente

Dentro del componente **Registrar Paciente** se encuentran varios campos de texto donde se podra rellenar con informacion correspondiente.

Estos campos son:

|Campo|Descripcion|Ejemplo|
|-----|-----------|-------|
|**Nombre**|Nombre del paciente que van a atender. Es un campo **Necesario** de texto, el cual se puede rellenar con cualquier nombre del paciente.| Princesa|
|**Especie**| Especie del paciente que van a atender. Es un campo **Necesario** de texto que se puede autorellenar con razas predispuestas.| Perro|
|**Raza**| Raza del paciente que van a atendre. Es un campo **Necesario** de texto, unicamente rellenable luego de rellenar el de especie y se puede autorellenar con las razas disponibles. | Pitbull|
|**Color**| Color de pelaje o piel del paciente. Es un campo **Necesario** de texto, el cual se puede rellenar con cualquier color o  grupo de colores tenga el paciente. | Blanco y cafe|
|**Sexo**| Sexo del paciente. Es una eleccion **Necesaria** entre M: Macho y H: Hembra.| M|
|**Fecha de nacimiento**|Dia en el que nacio el paciente. Es un campo **Necesario** que puede ser llenado con una fecha en el formato dd-mm-aaaa (d: dia / m: mes / a: año) | 04-09-2025|
|**Esterilizado**| Estado si es que el paciente esta esterilizado **Necesario**.| Si|
|**Codigo Chip**| Codigo del chip de la mascota. Es un campo **Opcional** de numeros que se rellena con la informacion de la mascota | 00009992123|

En la parte inferior esta la parte para poder asignar el tutor a la mascota.

Esta misma tiene una busqueda simple del tutor y en caso de no existir existe un texto marcado **"Registralo"** que abre el [**Registrar Tutor**](#2-registrar-tutor) para ingresar el tutor de manera rapida.

## 2. Registrar Tutor

Dentro del componente **Registrar Tutor** existen varios campos para poder registrar de manera correcta.

Estos campos son:

|Campo|Descripcion|Ejemplo|
|-----|-----------|-------|
|**Nombre**| Nombre del tutor responsable del paciente. Es un campo **Necesario** de texto. | Germán Alejandro |
|**Apellido Paterno**| Apellido paterno del tutor responsable del paciente. Es un campo **Necesario** de texto. | Garmendia|
|**Apellido Materno**| Apellido materno del tutor responsable del paciente. Es un campo **Opcional** de texto.|Aranis|
|**RUT**| Rut del tutor responsable del paciente. Es un campo **Necesario** de numeros y texto, que formatea y solo permite la 'k' en el digito verificador.|17.492.642-5|
|**Direccion**| Direccion del tutor responsable del paciente. Es un campo **Necesario** de texto.| Calle Cana N°123|
|**Celular**| Numero de celular del tutor responsable del paciente. Es un campo **Necesario** de numeros.| **+569** 4872 3718|
|**Region**| Region de la direccion actual del tutor responsable del paciente. Es un campo **Necesario** de texto con una forma de seleccionar la region.| XII Region de Magallanes|
|**Comuna**| Comuna de la direccion actual del tutor responsable del paciente. Es un campo **Necesario** de texto con una forma de seleccionar la comuna. | Torres del paine|
|**Email**| Correo electronico del tutor responsable del paciente. Es un campo **Necesario** de texto. | badboy@yahoo.cl|

## 3. Busqueda

En el apartado de busqueda existen tres apartados distintos, en los cuales se pueden buscar las fichas, los pacientes y a los tutores.

La busqueda que se puede hacer entre estos son distintos, que ahora se van a explicar cada punto:

### Busqueda de pacientes.

La busqueda de pacientes se pueden hacer por su nombre, su tutor *(por nombre)*, su especie y su raza.

En cada uno de los pacientes encontrados van a existir 2 opciones, uno para editar la informacion de este *(el lapiz)* y uno para ver la informacion de este de manera mas detallada *(el ojo)*.

En la edicion se pueden modificar todo tipo de datos, como el nombre, chip, y si esta esterilizado, he incluso cambiar el dueño del paciente

### Busqueda de tutores.

La busqueda de tutores se puede realizar por su nombre, su rut y su correo.

En cada uno de los Tutores encontrados van a existir 2 opciones, uno para editar la informacion de este *(el lapiz)* y uno para ver la informacion de este de manera mas detallada *(el ojo)*.

En la edicion se pueden modificar datos como los celulares, direcciones, y correos

### Busqueda de fichas.

La busqueda de fichas se puede realizar por 

## 4. Crear Ficha

En el componente de **Crear Ficha** existen varios sub-paginas para poder rellenar la informacion de las consultas.


### Primer apartado

Dentro del primer apartado esta la forma de rellenar los datos de la consulta de manera rapida, añadiendo el motivo de consulta y al paciente con su tutor correspondiente.

Estos campos son:

|Campo|Descripcion|Ejemplo|
|-----|-----------|-------|
|**Motivo de consulta**| Campo de texto en el cual se puede explicar el motivo de consulta por el cual el paciente esta asistiendo. Este campo es **Necesario** para poder rellenar una ficha| Atencion mensual del paciente |

En este mismo apartado hay un boton para seleccionar a un paciente, que reutiliza un poco la [Busqueda de pacientes](#busqueda-de-pacientes) que se menciono anteriormente, unicamente incluyendo las formas de buscar y la interfaz que esta posee.

Cuando se selecciona a un paciente, aparece la informacion correspondiente del paciente y su tutor.

### Segundo apartado
En el segundo apartado estan los campos de revision del paciente, en el que posee todos los espacios necesarios para poder realizar una consulta completa.

Estos campos son:
|Campo|Descripcion|Ejemplo|
|-----|-----------|-------|
|**Peso**| Campo numerico en el cual se puede colocar el peso de la paciente en kilogramos. Este campo es **Opcional**.| 10.0|
|**Condicion Corporal**| Campo seleccionable en el cual se puede seleccionar el estado corporal del paciente. Este campo es **Opcional**.| Opcion *"Ideal"*|
|**Estado del pelaje**| Campo seleccionable en el cual se puede seleccionar el estado del pelaje del paciente. Este campo es **Opcional**.| Opcion *"Malo"*|
|**Mucosas**| Campo selecionable en el cual se puede seleccionar el estado de las mucosas del paciente. Este campo es **Opcional**.| Opcion *"Palidas"*|
|**Nodulos linfaticos**| Campo de texto en el cual se puede escribir el estado de los nodulos linfaticos del paciente. Este campo es **Opcional**.|Tamaño: normales (no palpables), pequeños, aumentados o muy aumentados.<br> Forma: ovalados, redondeados o irregulares.<br> Consistencia: blanda, firme o dura.<br> Movilidad: libres al tacto o fijos al tejido.<br> Sensibilidad: sin dolor o dolorosos a la palpación. <br>Simetría: iguales a ambos lados del cuerpo o asimétricos."|

### Tercer apartado
En el tercer y ultimo apartado estan mas campos de revision del paciente y tambien el diagnostico que se le va a dar al paciente y posibles observaciones que pueden surgir durante la consulta.

Entre los campos disponibles, estan los siguientes:

|Campo|Descripcion|Ejemplo|
|-----|-----------|-------|
|**DHT (Deshidratacion, Hidratacion, Temperatura)**| Campo de texto en el cual se puede describir el estado DHT del paciente. Este campo es **Opcional**.| Submandibulares: palpables, 1 cm, firmes, móviles, no dolorosos <br> Preescapulares: no palpables <br> Poplíteos: simétricos, pequeños, blandos |
|**Auscultacion Cardiaca y toracica**|Campo de texto en el cual se puede describir la auscultacion cardiaca y toracica del paciente. Este Campo es **Opcional**.|Ruidos cardíacos rítmicos, frecuencia normal (100 lpm), sin soplos ni arritmias <br> Murmullo vesicular presente y simétrico en ambos hemitórax, sin estertores ni sibilancias |
|**Diagnostico**|Campo de texto en el cual se puede escribir el diagnostico del paciente. Este campo es **Opcional**.| El paciente tiene fiebre de perrera y es necesario dar medicamentos.|
|**Observaciones**|Campo de texto en el cual se pueden añadir observaciones del paciente si es que se ve necesario. Este campo es **Opcional**.| El paciente es muy asustadizo, es necesario tratarlo con cuidado.|

En caso de ser necesario, los apartados 2 y 3 tienen una forma de volver al anterior y en caso de querer guardar la ficha, en el ultimo apartado aparece el boton para guardar.
