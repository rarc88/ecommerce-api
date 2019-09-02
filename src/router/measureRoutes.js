//Modulos
const express = require('express')

// Middleware
const { verifyToken } = require('../middlewares/authJWT')

//Controladores
const { MeasureController } = require('../controllers/MeasureController')

//Enrutador
const routes = express.Router()
const measureRoutes = express()

routes.get('/', MeasureController.show)
routes.post('/register', MeasureController.register)
routes.get('/:id/detail', MeasureController.detail)
routes.put('/:id/update', MeasureController.update)
routes.delete('/:id/delete', MeasureController.delete)

measureRoutes.use('/measures', verifyToken, routes)

module.exports = {
    measureRoutes
}