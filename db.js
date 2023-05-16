const mysql = require("mysql2");


// creacion de la conexion a la base de datos
const conexion = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "musicpro"
}) 

module.exports = conexion