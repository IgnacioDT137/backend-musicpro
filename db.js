const mysql = require("mysql2");


// creacion de la conexion a la base de datos
const conexion = mysql.createConnection({
    host: "aws.connect.psdb.cloud",
    user: "20drxkckba91vvm8ljt8",
    password: "pscale_pw_iHOYdXUr7HDwm7HnC9orhMQGbtbhu91v3YvQjhrOhvn",
    database: "musicpro",
    // Esto es para que la base de datos no nos rechace la conexión
    ssl: {
        rejectUnauthorized: false
    }
}) 

module.exports = conexion