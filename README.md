# GoVet

## ¿Que es Govet?
Govet es una aplicación web que permite gestionar los pacientes de una veterinaria particular de forma intuitiva y eficiente. El sistema permite registrar tutores y mascotas, así como generar fichas de consulta, gestionar las horas asignadas a una consulta y enviar recordatorios al cliente mediante mensajes por whatsapp.

## Requerimientos
Para poder hacer funcionar la aplicacion es necesario tener instalado [Docker Desktop](https://www.docker.com/) para hacerlo funcionar tanto en el ambiente de desarrollo como el de despliegue

## Como Ejecutar
Para poder ejecutar todo el codigo, es necesario tener abierto el Docker Desktop y usar
```cmd
docker-compose up --build
```
y luego se necesita ejecutar
```cmd
* docker exec -it govet-backend-1 python /app/rellenar_bd/script_especies.py
* docker exec -it govet-backend-1 python /app/rellenar_bd/script_razas.py   
* docker exec -it govet-backend-1 python /app/rellenar_bd/script_pacientes.py
```
para poder rellenar la base de datos con informacion previa que se entrego y hacer un funcionamiento simple del backend.

En caso de necesitar detener toda la ejecucion y limpiar todo, es necesario hacer
```
docker-compose down -v
```
## ¿Como esta estructurado?
El desarrollo de nuestro proyecto, separamos todo en 3 partes:
- **Frontend:** En la carpeta de Frontend esta todo el codigo de la pagina en si, donde se encuentra la logica de como se ve la pagina y la conexion con la API.
Todo este codigo esta utilizando Ionic React para desarrollar la parte visual y JS para la parte de funcionalidad de botones y la llamada a la API.

- **Backend:** En la carpeta de Backend esta todo el codigo de la API, ademas de el codigo para rellenar la base de datos. Dentro de esta carpeta existen multiples archivos, donde:
    - ***main.py:*** Contiene toda la logica de la API y la conexion de la base de datos.
    - ***models.py & schemas.py:*** Contiene todas las tablas de la base de datos y como se estructuran.
    - ***database.py:*** Contiene la conexion con la base de datos de manera directa.

- **Dbase:** En la carpeta Dbase esta toda la forma de generar la base de datos siguiendo la base de  PostreSQL.