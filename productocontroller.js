const conexion = require("./db")


// esta funcion se encarga de obtener los productos filtrados por categoria
const mostrarProductos = async(req,res) => {
    try {

        // obtiene el id_categoria desde la URL
        const categoria = req.params.id_categoria
        const query = `SELECT * FROM producto where id_categoria = ${categoria}`
        await conexion.execute(query, (err, results)=>{
            if(err){ // esto se ejecuta si hay un error en la query a la base de datos
                return res.status(400).json({ERROR: "ERROR AL MOSTRAR PRODUCTOS"})
            }
            const resultados = results
            return res.json({MSG: "PRODUCTOS MOSTRADOS", resultados})
        }) 
    
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

// esta funcion se encarga de obtener todos los productos para que puedan ser vistos por el vendedor
const getAllProds = async(req,res) => {
    try {
        const query = `SELECT * FROM producto`
        await conexion.execute(query, (err, results)=>{
            if(err){ // esto se ejecuta si hay un error en la query a la base de datos
                return res.status(400).json({ERROR: "ERROR AL OBTENER PRODUCTOS"})
            }
            const resultados = results
            return res.json({MSG: "PRODUCTOS LISTOS", resultados})
        }) 
    
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

module.exports = {mostrarProductos, getAllProds}