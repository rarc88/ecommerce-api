const jwt = require('jsonwebtoken')
const { secret: { key } } = require('../config')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { resolve } = require('path')
const fs = require('fs-extra')

const services = {
    // decodedToken: (req, res) => {
    //     try {
    //         const token = req.headers['authorization']
    //         return jwt.decode(token)
    //     } catch (err) {
    //         return res.status(500).send({
    //             auth: false,
    //             message: 'Fallo en la autenticación. Error -> ' + err
    //         });
    //     }
    // },
    createToken: (id) => {
        const dataToken = {
            userId: id,
            iat:  moment().unix(),
            exp: moment().add(1, 'year').unix()
        }
        return jwt.sign(dataToken, key)
    },
    fileUpload: (directory, fileName, file) => {
        const path = resolve(`./src/files/${directory}`)
        return fs.ensureDir(path)
            .then(() => {
                file.mv(`${path}/${fileName}`, error => {
                    if(error) return false
                    return true
                })
            })
            .catch(error => {
                console.log(error)
            })
    },
    encryptPassword: (password) => bcrypt.hashSync(password, 10),
    comparePassword: (password1, password2) => bcrypt.compareSync(password1, password2)
}

module.exports = { services }