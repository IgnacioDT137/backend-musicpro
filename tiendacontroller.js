const conexion = require("./db")
const WebpayPlus = require("transbank-sdk").WebpayPlus; // CommonJS
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk"); 

const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));

// Funcion para que el cliente completa su pedido
const iniciarCompra = async(req, res) =>{
    try {
        // Estas variables se obtienen desde el body de la request, el cual es un JSON
        const total = req.body.total
        console.log(total);
        const rut = req.body.rut
        var fecha = new Date()
        fecha = fecha.toISOString()
        const productos = req.body.prods
        const direccion = req.body.direccion

        const response = await tx.create("prueba_musicpro", "prueba_1", parseInt(total), "http://localhost:3001/commit_pago");

        const query = `insert into pedido (id_pedido, id_pago, rut_cliente, fecha, productos, direccion) values (null, '${response.token}', '${rut}', '${fecha}', '${JSON.stringify(productos)}', '${direccion}')`

        await conexion.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ERROR: "ERROR AL PROCESAR PEDIDO"})
            }

            return res.json({pago: response})
        })

        

        // // Validacion de método de pago
        // var aprobado = 1;

        // if (metodo == "Transferencia") {
        //     aprobado = 0;
        // }

        // // campos restantes del pedido
        // const rut = req.body.rut
        // var fecha = new Date()
        // fecha = fecha.toISOString()
        // const productos = req.body.prods
        // const direccion = req.body.direccion

        // const query = `INSERT INTO pago VALUES (null, '${metodo}', ${total}, ${aprobado})`

        // // primero genera un pago para obtener su ID
        // await conexion.execute(query, async (err, results) => {
        //     if(err){
        //         return res.status(400).json({ERROR: "ERROR AL REGISTRAR PAGO"})
        //     }
        //     const resultados = results
            
        //     const query = `insert into pedido (id_pedido, id_pago, rut_cliente, fecha, productos, direccion) values (null, ${resultados.insertId}, '${rut}', '${fecha}', '${JSON.stringify(productos)}', '${direccion}')`
        //     /* Luego de generar el pago, se genera el pedido para que la columna id_pago no esté vacia, 
        //     el id_pago se obtiene de la propiedad insertId del JSON de reslutados de la query anterior */
        //     await conexion.execute(query, (err, results) => {
        //         if (err) {
        //             return res.status(400).json({ERROR: "ERROR AL REGISTRAR PEDIDO", err})
        //         }
        //         const resultados = results
        //         return res.json({MSG: "COMPRA COMPLETADA", resultados})
        //     })
        // })

    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

const completarCompra = async (req, res) => {
    try {
        const token = req.query.token_ws
        await tx.commit(token);

        const response = await tx.status(token)

        const query = `INSERT INTO pago VALUES ('${token}', '${response.payment_type_code}', ${response.amount}, '${response.status}')`

        conexion.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ERROR: "ERROR AL INGRESAR UN PAGO"})
            }
            const resultados = results

            return res.json({resultados, response})
        })

    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

// Funciones de contador

//Se muestran todos los pagos registrados
const mostrarPagos = async (req, res) => {
    try {
        //Se declara una sentencia sql y se guarda en una variable
        const query = `SELECT * FROM pago`

        //Se ejecuta la conexión de base de datos
        await conexion.execute(query, (err, results)=>{

            //Si hay un error mostrará un mensaje 
            if(err){
                return res.status(400).json({ERROR: "ERROR AL MOSTRAR PAGOS"})
            }

            //En caso de no haber ningún error, se mostrarán la lista de pagos realizados
            const resultados = results
            return res.json({MSG: "PAGOS MOSTRADOS", resultados})
        }) 
    } catch (error) {

        //Retornará un mensaje de error
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

//Se actualiza el estado de los pagos cuando se aprueban
const actualizarPagos = async (req, res) =>{
    try {

        //Se declara una variable para guardar datos mediante parámetros
        const id_pago = req.params.id_pago

        //Actualiza el estado de los pagos 
        const query = `UPDATE pago SET aprobado = 1 WHERE id_pago = ${id_pago}`

        //Se ejecuta la query
        await conexion.execute(query, (err, results)=>{

            //
            if(err){
                return res.status(400).json({ERROR: "ERROR AL ACTUALIZAR PAGOS"})
            }
            const resultados = results
            return res.json({MSG: "PAGO ACTUALIZADO", resultados})
        }) 

    } catch (error) {

        //Retornará un mensaje de error
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

//Se muestran todos los pedidos realizados
const mostrarEntregas = async (req, res) => {
    try {
        //Esta variable guarda una sentencia sql para mostrar los pedidos que se están despachando
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
        //Se declara una variable para guardar datos mediante parámetros
        const id_pedido = req.params.id_pedido

        //Se declara una variable que guarda una sentencia sql 
        const query = `UPDATE pedido SET entregado = 1 WHERE id_pedido = ${id_pedido}`

        //Se ejecuta la query
        await conexion.execute(query, (err, results)=>{
            if(err){
                return res.status(400).json({ERROR: "ERROR AL ACTUALIZAR ENTREGAS"})
            }
            const resultados = results
            return res.json({MSG: "ENTREGA ACTUALIZADA", resultados})
        }) 
    } catch (error) {

        //Retornará un mensaje de error 
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

// Funciones de vendedor

// Funcion para obtener los pedidos que han sido realizados recientemente
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

// Funcion para obtener todos los pedidos que estan a la espera de la aprobacion del bodeguero
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

//Funcion para obtener los pedidos que ya están listos para ser despachados
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


// Funcion para obtener los pedidos rechazados y ser enviados al frontend
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

// Funcion para que el vendedor apruebe un pedido y quede a disposición del bodeguero
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

// Funcion para que el vendedor rechace un pedido
const rechazarPedidoVendedor = async (req, res) => {
    try {
        const id_pedido = req.params.id_pedido // obtiene el id_pedido de los parametros de la URL
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

//Funcion del vendedor para despachar el pedido
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

//Funcion para que el bodeguero acepte un pedido
const aceptarPedidoBod = async(req, res) => {
    try {
        //Se generan las variables
       const id_pedido = req.params.id_pedido
       const pedido = req.body.ped
       const query = `UPDATE pedido SET aprobado_bod = 1 WHERE id_pedido = ${id_pedido}`
       //Se genera la conexion a la base de datos
       await conexion.execute(query, (err, results)=>{
        if(err){
            return res.status(400).json({ERROR: "ERROR AL ACTUALIZAR PEDIDOS", err})
        }
        //Se mapean los productos de la base de datos
        pedido.map(async(i) => {
            //Se crea la variable para actualizar el stock de los productos en la BD
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

//Esta funcion es para rechazar los pedidos por parte del bodeguero
const rechazarPedidoBod = async(req, res) => {
    try {
        const id_pedido = req.params.id_pedido // El id_pedido es obtenido directamente desde los parámetros de la ruta
        const query = `UPDATE pedido SET aprobado_bod = 0 WHERE id_pedido = ${id_pedido}`
        await conexion.execute(query, (err, results)=>{            
            if(err){
                return res.status(400).json({ERROR: "ERROR AL ACTUALIZAR PEDIDOS"})
            }
            const resultados = results
            return res.json({MSG: "PEDIDO ACTUALIZADO", resultados})
        })
    } catch (error) {
        return res.status(500).json({ERROR: "ERROR DE SERVIDOR"})
    }
}

//Exportación de funciones
module.exports = {
  iniciarCompra,
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