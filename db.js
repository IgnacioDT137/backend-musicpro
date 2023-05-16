const mysql = require("mysql2");


// creacion de la conexion a la base de datos
const conexion = mysql.createConnection({
    host: "aws.connect.psdb.cloud",
    user: "20drxkckba91vvm8ljt8",
    password: "pscale_pw_iHOYdXUr7HDwm7HnC9orhMQGbtbhu91v3YvQjhrOhvn",
    database: "musicpro",
    ssl: {
        rejectUnauthorized: false
    }
}) 

module.exports = conexion