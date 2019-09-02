//Modulos
const express = require('express')

// Middleware
const { verifyToken } = require('../middlewares/authJWT')

//Controladores
const { CategoryController } = require('../controllers/CategoryController')

//Enrutador
const routes = express.Router()
const categoryRoutes = express()

routes.get('/', CategoryController.show)
routes.post('/register', CategoryController.register)
routes.get('/:id/detail', CategoryController.detail)
routes.put('/:id/update', CategoryController.update)
routes.delete('/:id/delete', CategoryController.delete)

categoryRoutes.use('/categories', verifyToken, routes)

module.exports = {
    categoryRoutes
}