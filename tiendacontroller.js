const conexion = require("./db")

const completarCompra = async(req, res) =>{
    try {
        const metodo = req.body.metodo
        const total = req.body.total
        var aprobado = 1;

        if (metodo == "Transferencia") {
            aprobado = 0;
        }

        const rut = req.body.rut
        var fecha = new Date()
        fecha = fecha.toISOString()
        const productos = req.body.prods
        const direccion = req.body.direccion

        const query = `INSERT INTO pago VALUES (null, '${metodo}', ${total}, ${aprobado})`

        await conexion.execute(query, async (err, results) => {
            if(err){
                return res.status(400).json({ERROR: "ERROR AL REGISTRAR PAGO"})
            }
            const resultados = results
            
            const query = `insert into pedido (id_pedido, id_pago, rut_cliente, fecha, productos, direccion) values (null, ${resultados.insertId}, '${rut}', '${fecha}', '${JSON.stringify(productos)}', '${direccion}')`
            await conexion.execute(query, (err, results) => {
                if (err) {
                    return res.status(400).json({ERROR: "ERROR AL REGISTRAR PEDIDO", err})
                }
                const resultados = results
                return res.json({MSG: "COMPRA COMPLETADA", resultados})
            })
        })

    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

// Funciones de contador

//Se muestran todos los pagos registrados
const mostrarPagos = async (req, res) => {
    try {
        const query = `SELECT * FROM pago`
        await conexion.execute(query, (err, results)=>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL MOSTRAR PAGOS"})
            }
            const resultados = results
            return res.json({MSG: "PAGOS MOSTRADOS", resultados})
        }) 
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

//Se actualiza el estado de los pagos cuando se aprueban
const actualizarPagos = async (req, res) =>{
    try {
        const id_pago = req.params.id_pago
        const query = `UPDATE pago SET aprobado = 1 WHERE id_pago = ${id_pago}`
        await conexion.execute(query, (err, results)=>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL ACTUALIZAR PAGOS"})
            }
            const resultados = results
            return res.json({MSG: "PAGO ACTUALIZADO", resultados})
        }) 

    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

//Se muestran todos los pedidos realizados
const mostrarEntregas = async (req, res) => {
    try {
        const query = `SELECT * from pedido WHERE despachando = 1`
        await conexion.execute(query, (err, results)=>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL MOSTRAR ENTREGAS"})
            }
            const resultados = results
            return res.json({MSG: "ENTREGA MOSTRADA", resultados})
        }) 
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}


//Actualiza el estado de los pedidos y se valida las entregas
const actualizarEntregas = async (req, res) =>{
    try {
        const id_pedido = req.params.id_pedido
        const query = `UPDATE pedido SET entregado = 1 WHERE id_pedido = ${id_pedido}`
        await conexion.execute(query, (err, results)=>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL ACTUALIZAR ENTREGAS"})
            }
            const resultados = results
            return res.json({MSG: "ENTREGA ACTUALIZADA", resultados})
        }) 
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

// Funciones de vendedor
const getPedidosPendientes = async (req, res) => {
    try {
        const query = `select * from pedido where aprobado_v IS NULL;`
        conexion.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ERROR: "ERROR AL OBTENER PEDIDOS PENDIENTES"})
            }
            const resultados = results
            return res.json({MSG: "PEDIDOS PENDIENTES OBTENIDOS", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

const getPedidosDeBod = async (req, res) => {
    try {
        const query = `select * from pedido where aprobado_v = 1 AND aprobado_bod IS NULL;`
        conexion.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ERROR: "ERROR AL OBTENER PEDIDOS DEL BODEGUERO"})
            }
            const resultados = results
            return res.json({MSG: "PEDIDOS BODEGUERO OBTENIDOS", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

const getPedidosDespacho = async (req, res) => {
    try {
        const query = `select * from pedido where aprobado_v = 1 AND aprobado_bod = 1 AND despachando IS NULL;`
        conexion.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ERROR: "ERROR AL OBTENER PEDIDOS DEL BODEGUERO"})
            }
            const resultados = results
            return res.json({MSG: "PEDIDOS BODEGUERO OBTENIDOS", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

const getPedidosRechazados = async (req, res) => {
    try {
        const query = `select * from pedido where aprobado_v = 0 OR aprobado_bod = 0;`
        conexion.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ERROR: "ERROR AL OBTENER PEDIDOS RECHAZADOS"})
            }
            const resultados = results
            return res.json({MSG: "PEDIDOS BODEGUERO OBTENIDOS", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}


const enviarBodeguero = async (req, res) => {
    try {
        const id_pedido = req.params.id_pedido
        const query = `UPDATE pedido set aprobado_v = 1 WHERE id_pedido = ${id_pedido}`
        conexion.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ERROR: "ERROR AL ENVIAR PEDIDO AL BODEGUERO"})
            }
            const resultados = results
            return res.json({MSG: "PEDIDO ENVIADO EXITOSAMENTE", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

const rechazarPedidoVendedor = async (req, res) => {
    try {
        const id_pedido = req.params.id_pedido
        const query = `UPDATE pedido set aprobado_v = 0 WHERE id_pedido = ${id_pedido}`
        conexion.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ERROR: "ERROR AL RECHAZAR PEDIDO"})
            }
            const resultados = results
            return res.json({MSG: "PEDIDO RECHAZADO", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

const despacharPedido = async (req, res) => {
    try {
        const id_pedido = req.params.id_pedido
        const query = `UPDATE pedido set despachando = 1 WHERE id_pedido = ${id_pedido}`
        conexion.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ERROR: "ERROR AL DESPACHAR PEDIDO"})
            }
            const resultados = results
            return res.json({MSG: "PEDIDO DESPACHANDO AL CLIENTE", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}


//Funciones de Bodeguero
const aceptarPedidoBod = async(req, res) => {
    try {
       const id_pedido = req.params.id_pedido
       const pedido = req.body.ped
       const query = `UPDATE pedido SET aprobado_bod = 1 WHERE id_pedido = ${id_pedido}`
       await conexion.execute(query, (err, results)=>{
        if(err){
            return res.status(400).json({ERROR: "ERROR AL ACTUALIZAR PEDIDOS", err})
        }

        pedido.map(async(i) => {
            const act_prod = `UPDATE producto SET stock = ${i.stock - i.cantidad} WHERE codigo = ${i.codigo}`;
            await conexion.execute(act_prod, (err, results) => {
                if (err) {
                    console.log(err);
                }

                console.log(results);
            })
        })

        const resultados = results

        return res.json({MSG: "PEDIDO ACTUALIZADO", resultados, pedido})
    })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

const rechazarPedidoBod = async(req, res) => {
    try {
        const id_pedido = req.params.id_pedido
        const query = `UPDATE pedido SET aprobado_bod = 0 WHERE id_pedido = ${id_pedido}`
        await conexion.execute(query, (err, results)=>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL ACTUALIZAR PEDIDOS"})
            }
            const resultados = results
            return res.json({MSG: "PEDIDO ACTUALIZADO", resultados})
        })
    } catch (error) {
        
    }
}

//Exportación de funciones
module.exports = {
  completarCompra,
  mostrarPagos,
  mostrarEntregas,
  actualizarPagos,
  actualizarEntregas,
  getPedidosPendientes,
  getPedidosDeBod,
  getPedidosDespacho,
  getPedidosRechazados,
  enviarBodeguero,
  rechazarPedidoVendedor,
  despacharPedido,
  aceptarPedidoBod,
  rechazarPedidoBod
};