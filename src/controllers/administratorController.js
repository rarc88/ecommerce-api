const moment = require('moment')
const path = require('path')

const { services: { createToken, fileUpload, encryptPassword, comparePassword } } = require('../services')
const { pool } = require('../database')

const AdministratorController = {
    signin: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        const { email, password } = req.body

        pool.query(
            'SELECT * FROM administrators WHERE email=?',
            [email]
        )
        .then(result => {
            if (!result.length) {
                response.message = 'El correo ingresado no se encuentra registrado.'
                return res.status(404).send(response)
            }
            if (!result[0].status || result[0].deleted) {
                response.message = 'Usuario inhabilitado.'
                return res.status(403).send(response)
            }
            const passwordIsValid = comparePassword(password, result[0].password)
            if (!passwordIsValid) {
                response.message = 'Clave invalida.'
                return res.status(401).send(response)
            }
            response.status = true
            response.data = {
                token: createToken(result[0].id),
                userId: result[0].id,
                userName: result[0].name
            }
            return res.status(200).send(response)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
    },
    signup: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        const { name, email, password, role, status } = req.body

        const optionals = {
            columns: '',
            values: '',
            params: []
        }
        let encryptedPassword = undefined
        let fileName = undefined

        if(password) {
            encryptedPassword = encryptPassword(password)
        }

        if(req.files) {
            const photo = req.files.photo
            fileName = `${photo.md5}${path.extname(photo.name)}`
            fileUpload('photos/profiles/', fileName, photo)
            optionals.columns = ', photo'
            optionals.values = ',?'
            optionals.params.push(fileName)
        }

        pool.query('SELECT * FROM administrators WHERE email=?', [email])
        .then(result => {
            if(!result.length) {
                pool.query(
                    `INSERT INTO administrators (name, email, password, id_role, status ${optionals.columns}) VALUES(?,?,?,?,?${optionals.values})`,
                    [name, email, encryptedPassword, role, status].concat(optionals.params)
                )
                .then(result => {
                    response.status = true
                    return res.status(200).send(response)
                })
            } else {
                response.message = 'Estos datos fueron registrado anteriormente.'
                return res.status(409).send(response)
            }
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
    },
    show: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        pool.query('SELECT a.id, a.name, a.email, r.name AS role, a.status FROM administrators AS a INNER JOIN roles AS r ON a.id_role=r.id WHERE a.deleted IS NULL')
        .then(result => {
            response.status =true
            response.data = result
            return res.status(200).send(response)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
    },
    detail: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        const {id} = req.params

        pool.query('SELECT id, name, email, photo, id_role, status FROM administrators WHERE id=? AND deleted IS NULL', [id])
        .then(result => {
            response.status =true
            response.data = result
            return res.status(200).send(response)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
    },
    update: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        const {id} = req.params
        const {name, email, password, role, status} = req.body

        const optionals = {
            columns: '',
            params: []
        }
        let encryptedPassword = undefined
        let fileName = undefined

        if(password) {
            encryptedPassword = encryptPassword(password)
            optionals.columns += ', password=?'
            optionals.params.push(encryptedPassword)
        }

        if(req.files) {
            const photo = req.files.photo
            fileName = `${photo.md5}${path.extname(photo.name)}`
            fileUpload('photos/profiles/', fileName, photo)
            optionals.columns += ', photo=?'
            optionals.params.push(fileName)
        }

        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss')

        pool.query(
            `UPDATE administrators SET name=?, email=?, id_role=?, status=?, updated=? ${optionals.columns} WHERE id=?`,
            [name, email, role, status, timestamp].concat(optionals.params).concat([id])
        )
        .then(result => {
            response.status =true
            response.data = result
            return res.status(200).send(response);
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
    },
    delete: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        const {id} = req.params
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss')

        pool.query(
            `UPDATE administrators SET updated=?, deleted=? WHERE id=?`,
            [timestamp, timestamp, id]
        )
        .then(result => {
            response.status =true
            response.data = result
            return res.status(200).send(response)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
    },
}

module.exports = {
    AdministratorController
}