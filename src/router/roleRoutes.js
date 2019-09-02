//Modulos
const express = require('express')

// Middleware
const { verifyToken } = require('../middlewares/authJWT')

//Controladores
const { RoleController } = require('../controllers/roleController')

//Enrutador
const roleRoutes = express.Router()

roleRoutes.get('/roles', verifyToken, RoleController.show)

module.exports = {
    roleRoutes
}