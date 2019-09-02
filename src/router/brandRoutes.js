//Modulos
const express = require('express')

// Middleware
const { verifyToken } = require('../middlewares/authJWT')

//Controladores
const { BrandController } = require('../controllers/brandController')

//Enrutador
const routes = express.Router()
const brandRoutes = express()

routes.get('/', BrandController.show)
routes.post('/register', BrandController.register)
routes.get('/:id/detail', BrandController.detail)
routes.put('/:id/update', BrandController.update)
routes.delete('/:id/delete', BrandController.delete)

brandRoutes.use('/brands', verifyToken, routes)

module.exports = {
    brandRoutes
}