const conexion = require("./db")
const md5 = require("md5")

//Se crea y se testea la conexión a la base de datos
const testconexion = (req, res) => {
    try {
        const query = "SELECT * FROM usuarios";
        conexion.query(query, (err, results, fields) => {
            res.json({msg: "conexion correcta"})
        })
    } catch (error) {
        res.json(error)
    }
}

//Función del registro de usuarios
const registro = async(req, res) =>{
    try {

        // obtiene los datos para el registro del body de la request (JSON)
        const rut = req.body.rut
        const nombre = req.body.nombre
        const apellido = req.body.apellido
        const email = req.body.email
        const pwd = md5(req.body.pwd) // hashea la contraseña con el algoritmo MD5 (no es muy robusto pero era el más rápido de implementar)
        
        const query = `insert into usuarios VALUES (null, '${rut}', '${nombre}', '${apellido}', '${email}', '${pwd}', 0)`
        await conexion.execute(query, (err, results) => {

            if (err) { // esto se ejecuta si hay un error en la query a la base de datos
                return res.status(400).json({ERROR: "ERROR AL REGISTRAR"})
            }
            
            const resultados = results
            return res.json({MSG: "Usuario registrado", resultados})
            
        })

    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DEL SERVIDOR"})
    }
}

//Función para el inicio de sesión de los usuarios
const login = async(req, res) => {
    try {

        // obtiene los datos para el login desde el body de la request (JSON)
        const email = req.body.email
        const pwd = md5(req.body.pwd)
        const query = `select * from usuarios where email = '${email}' and pwd = '${pwd}';`

        await conexion.execute(query, (err, results, fields) => {
            if (results.length != 1) {
                return res.status(400).json({ERROR: "USUARIO NO ENCONTRADO"})
            }

            // genera algunas variables que serán utilizadas para validar inicio de sesión y permisos de usuarios en el frontend
            const usuario = results[0]
            const tipo = usuario.tipo_usuario
            const nombre = usuario.nombre + " " + usuario.apellido
            const rut = usuario.rut
            const email = usuario.email
            
            return res.json({MSG: "USUARIO ENCONTRADO", rut, nombre, email, tipo})
        })                
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

//Función para insertar usuarios en el crud (Hace lo mismo que el registro de usuario, pero aqui incluye el tipo de usuario)
const crearUsuario = async(req, res) => {
    try {
        const rut = req.body.rut
        const nombre = req.body.nombre
        const apellido = req.body.apellido
        const email = req.body.email
        const pwd = md5(req.body.pwd)
        const tipo_usuario = req.body.tipo_usuario
        
        const query = `insert into usuarios VALUES(null, '${rut}', '${nombre}', '${apellido}', '${email}', '${pwd}', '${tipo_usuario}')`
        await conexion.execute(query, (err, results) =>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL REGISTRAR USUARIO"})
            }
            const resultados = results
            return res.json({MSG: "USUARIO REGISTRADO", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }

}

//Función para eliminar un usuario del crud
const eliminarUsuario = async(req,res) => {
    try {
        const rut = req.params.rut
        const query = `DELETE FROM usuarios where rut = '${rut}'`
        await conexion.execute(query, (err, results) =>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL ELIMINAR USUARIO"})
            }
            const resultados = results
            return res.json({MSG: "USUARIO ELIMINADO", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

//Función para editar usuarios del crud
const editarUsuario = async(req, res) => {
    try {
        const rut = req.params.rut
        const datosNuevos = req.body
        const query = `UPDATE usuarios SET rut = '${datosNuevos.rut}', nombre = '${datosNuevos.nombre}', 
        apellido = '${datosNuevos.apellido}', email = '${datosNuevos.email}', pwd =  '${datosNuevos.pwd}', tipo_usuario =  ${datosNuevos.tipo_usuario} where rut = '${rut}'`
        await conexion.execute(query, (err, results) =>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL EDITAR USUARIO"})
            }
            const resultados = results
            return res.json({MSG: "USUARIO EDITADO", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

//Se listan todos los usuarios registrados en el crud (vendedor, contador, bodeguero) 
const getUsuarios = async(req, res) => {
    try {
        const query = "SELECT * FROM usuarios WHERE tipo_usuario != 0"
        await conexion.execute(query, (err, results) =>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL MOSTRAR USUARIOS"})
            }
            const resultados = results
            return res.json({MSG: "USUARIOS MOSTRADOS", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}


//Filtrar usuarios por su rut para válidar sus datos
const filtrarUsuario = async(req, res) => {
    try {
        const rut = req.params.rut
        const query = `SELECT * FROM usuarios WHERE rut = '${rut}'`
        await conexion.execute(query, (err, results) =>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL FILTRAR USUARIO"})
            }
            const resultados = results[0]
            return res.json({MSG: "USUARIO ENCONTRADO", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

//Exportación de funciones
module.exports = {testconexion, registro, login, crearUsuario, editarUsuario, getUsuarios, eliminarUsuario, filtrarUsuario}