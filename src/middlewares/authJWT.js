const jwt = require('jsonwebtoken')
const { secret: { key } } = require('../config')

const authJWT = {
    verifyToken: (req, res, next) => {
        let token = req.headers['authorization']
        if (!token) {
            return res.status(403).send({
                auth: false,
                message: 'No hay token proporcionado.'
            })
        }
        jwt.verify(token, key, (err, decoded) => {
            if (err) {
                return res.status(500).send({
                    auth: false,
                    message: 'Error -> ' + err
                })
            }
            req.userId = decoded.userId
            next()
        })
    }
}

module.exports = authJWT