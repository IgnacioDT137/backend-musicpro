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

app.set("view engine", "ejs")
app.set("views", "views")
app.set("json spaces", 2)

// app corriendo en el puerto 3001
app.listen(process.env.PORT || 3001, () => {
    console.log("WORKS");
})