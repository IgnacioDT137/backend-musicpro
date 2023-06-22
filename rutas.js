const express = require("express");
const userController = require("./userscontroller")
const productoController = require("./productocontroller")
const tiendaController = require("./tiendacontroller")

const router = express.Router();

// RUTAS DE USUARIO
router.get("/", (req, res) => {
    return res.send("Hola")
})
router.get("/testdb", userController.testconexion)
router.post("/login", userController.login)
router.post("/registro", userController.registro)
router.get("/CrudUsuarios/usuarios", userController.getUsuarios)
router.post("/CrudUsuarios/crear", userController.crearUsuario)
router.delete("/CrudUsuarios/eliminar/:rut",userController.eliminarUsuario)
router.put("/CrudUsuarios/actualizar/:rut", userController.editarUsuario)
router.get("/CrudUsuarios/filtrar/:rut", userController.filtrarUsuario)

// RUTAS DE LA TIENDA
router.get("/productos/:id_categoria", productoController.mostrarProductos)
router.get("/productos", productoController.getAllProds)

//RUTAS DE PAGOS
router.post("/pagar", tiendaController.iniciarCompra)
router.get("/commit_pago", tiendaController.completarCompra)
router.get("/pagos", tiendaController.mostrarPagos)
router.put("/aprobar-pago/:id_pago", tiendaController.actualizarPagos)

//RUTAS DE ENTREGAS
router.get("/entregas", tiendaController.mostrarEntregas)
router.put("/confirmar-entrega/:id_pedido", tiendaController.actualizarEntregas)

// funciones del vendedor
router.get("/pedidos-pendientes", tiendaController.getPedidosPendientes)
router.get("/pedidos-de-bod", tiendaController.getPedidosDeBod) //Esta ruta tambien sirve para las funciones de bodeguero
router.get("/pedidos-despachar", tiendaController.getPedidosDespacho)
router.get("/pedidos-rechazados", tiendaController.getPedidosRechazados)
router.put("/pedido-enviar-bod/:id_pedido", tiendaController.enviarBodeguero)
router.put("/pedido-rechazar/:id_pedido", tiendaController.rechazarPedidoVendedor)
router.put("/pedido-despachar/:id_pedido", tiendaController.despacharPedido)

//Funciones del bodeguero
router.put("/pedido-aceptar-bod/:id_pedido", tiendaController.aceptarPedidoBod)
router.put("/pedido-rechazar-bod/:id_pedido", tiendaController.rechazarPedidoBod)




module.exports = router