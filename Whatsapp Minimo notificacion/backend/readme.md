## Cosas a considerar

Aqui esta lo minimo minimo

Para hacer que funcione, se tiene que instalar
```bash
npm install express @whiskeysockets/baileys qrcode-terminal
```
en la parte de backend unicamente

**Cuidado de hacer push con el node_module**


## Cosas que implementar

No se bien como implementar todo esto, pero de alguna forma hay que hacer que esto corra unicamente de manera interna y que no se pueda ver en linea por cosas de seguridad.

Hay que implementar que se envie de forma automatica (node-schedule podria ser una opcion).

Tambien hay que hacer que esto funcione por detras junto con todo.

Y por ultimo, hay una cosa que se crea que es algo de autorizacion, eso tiene que añadirse al volumen para que no se elimine al reinciar los contenedores (esta en whatsapp.js linea 8-9)