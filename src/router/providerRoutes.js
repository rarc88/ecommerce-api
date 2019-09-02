//Modulos
const express = require('express')

// Middleware
const { verifyToken } = require('../middlewares/authJWT')

//Controladores
const { ProviderController } = require('../controllers/ProviderController')

//Enrutador
const routes = express.Router()
const providerRoutes = express()

routes.get('/', ProviderController.show)
routes.post('/register', ProviderController.register)
routes.get('/:id/detail', ProviderController.detail)
routes.put('/:id/update', ProviderController.update)
routes.delete('/:id/delete', ProviderController.delete)

providerRoutes.use('/providers', verifyToken, routes)

module.exports = {
    providerRoutes
}