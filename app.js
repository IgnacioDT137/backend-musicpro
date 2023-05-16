const express = require("express");
const cors = require("cors");
const router = require("./rutas")

// generación de nuestra aplicación con el framework expressJS
const app = express();

// este middleware hace que la app pueda enviar y recibir JSON's
app.use(express.json());

// este middleware hace que la app pueda ser utilizada por otras externas (peticiones http)
app.use(cors());

// la app ahora reconoce las rutas que creamos
app.use(router)

// app corriendo en el puerto 3001
app.listen(3001, () => {
    console.log("http://localhost:3001");
})