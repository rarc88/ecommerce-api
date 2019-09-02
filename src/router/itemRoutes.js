//Modulos
const express = require('express')

// Middleware
const { verifyToken } = require('../middlewares/authJWT')

//Controladores
const { ItemController } = require('../controllers/ItemController')

//Enrutador
const routes = express.Router()
const itemRoutes = express()

routes.get('/', ItemController.show)
routes.post('/register', ItemController.register)
routes.get('/:id/detail', ItemController.detail)
routes.put('/:id/update', ItemController.update)
routes.delete('/:id/delete', ItemController.delete)

itemRoutes.use('/items', verifyToken, routes)

module.exports = {
    itemRoutes
}