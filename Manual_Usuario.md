# Manual de Usuario

Este Manual describe como usar cada parte de nuestro proyecto y que consideraciones hay que tener en ciertos casos de uso

---

## Aclaracion

Este documento es principalmente del sprint 1, tomando en cuenta que este fue entregado a lo mas tardar el dia 30/09/2025 a nuestra profesora encargada del ramo Taller de Ingenieria de Software, que puede sufrir cambios de aqui a el estado final

---

## Componentes de GoVet
Los componentes que conforman a GoVet estan puestos de manera que se pueda realizar un ingreso rapido de estos a una base de datos.

Los componentes serian los siguientes:

0. [Pagina principal](#0-pagina-principal)
1. [Registrar paciente](#1-registrar-paciente)
2. [Registrar Tutor](#2-registrar-tutor)
---

## 0. Pagina Principal

En la pagina principal .... y ...., pero ...

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
|**Codigo Chip**| Codigo del chip de la mascota. Es un campo **Opcional** de numeros que se rellena con la informacion de la mascota | 00009992123|

Con esta informacion ya es posible registrar a el paciente, actualmente tambien se posee una seccion para poder asignar al paciente con su tutor correspondiente. En el sprint en el que nos encontramos no se va a implementar, pero se tendra que ver internamente.

## 2. Registrar Tutor

Dentro del componente **Registrar Tutor** existen varios campos para poder registrar de manera correcta.

Estos campos son:

|Campo|Descripcion|Ejemplo|
|-----|-----------|-------|
|**Nombre**| Nombre del tutor responsable del paciente. Es un campo **Necesario** de texto. | Germán Alejandro |
|**Apellido Paterno**| Apellido paterno del tutor responsable del paciente. Es un campo **Necesario** de texto. | Garmendia|
|**Apellido Materno**| Apellido materno del tutor responsable del paciente. Es un campo **Opcional** de texto.|Aranis|
|**RUT**| Rut del tutor responsable del paciente. Es un campo **Necesario** de numeros y texto, que formatea y solo permite la 'k' en el digito verificador.|17.492.642-5|
|**Direccion**| Direccion del tutor responsable del paciente. Es un campo **??** de texto.| Calle Cana N°123|
|**Celular**| Numero de celular del tutor responsable del paciente. Es un campo **??** de numeros.| **+569** 4872 3718|
|**Region**| Region de la direccion actual del tutor responsable del paciente. Es un campo **??** de texto.| XII Region de Magallanes|
|**Comuna**| Comuna de la direccion actual del tutor responsable del paciente. Es un campo **??** de texto. | Torres del paine|
|**Email**| Correo electronico del tutor responsable del paciente. Es un campo **??** de texto. | badboy@yahoo.cl|

