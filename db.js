const mysql = require("mysql2");


// creacion de la conexion a la base de datos
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "musicpro",
    // Esto es para que la base de datos no nos rechace la conexión
    
}) 

module.exports = conexion