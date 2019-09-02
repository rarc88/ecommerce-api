//Modulos
const express = require('express')

// Middleware
const { verifyToken } = require('../middlewares/authJWT')

//Controladores
const { AdministratorController } = require('../controllers/administratorController')

//Enrutador
const authRoutes = express.Router()
const routes = express.Router()
const administratorRoutes = express()

authRoutes.post('/signin', AdministratorController.signin)
authRoutes.post('/signup', AdministratorController.signup)
administratorRoutes.use('/auth', authRoutes)

routes.get('/', verifyToken, AdministratorController.show)
routes.get('/:id/detail', verifyToken, AdministratorController.detail)
routes.put('/:id/update', verifyToken, AdministratorController.update)
routes.delete('/:id/delete', verifyToken, AdministratorController.delete)
administratorRoutes.use('/administrators', routes)

module.exports = {
    administratorRoutes
}