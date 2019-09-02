const moment = require('moment')
const { pool } = require('../database')
const path = require('path')
const { services: { fileUpload } } = require('../services')

const ItemController = {
    show: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        pool.query(`
            SELECT
                i.id,
                i.code,
                i.name,
                i.available,
                i.price,
                i.status,
                c.name AS category,
                b.name AS brand
            FROM
                items AS i INNER JOIN categories AS c
                    ON i.id_category=c.id
                INNER JOIN brands AS b
                    ON i.id_brand=b.id
            WHERE 
                i.deleted IS NULL
        `)
        .then(result => {
            response.status =true
            response.data = result
            return res.status(200).send(response);
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
    },
    register: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        const { category, brand, code, name, description, measure, size, status } = req.body

        const optionals = {
            columns: '',
            values: '',
            params: []
        }
        let fileName = undefined

        if(req.files) {
            const photo = req.files.photo
            fileName = `${photo.md5}${path.extname(photo.name)}`
            fileUpload('photos/items/', fileName, photo)
            optionals.columns = ', photo'
            optionals.values = ',?'
            optionals.params.push(fileName)
        }

        if(description) {
            optionals.columns += ', description'
            optionals.values += ',?'
            optionals.params.push(description)
        }

        pool.query(
            `INSERT INTO items (id_category, id_brand, code, name, id_measure, size, status ${optionals.columns}) VALUES(?,?,?,?,?,?,?${optionals.values})`,
            [category, brand, code, name, measure, size, status].concat(optionals.params)
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
    detail: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        const {id} = req.params

        pool.query('SELECT id, id_category, id_brand, code, name, description, photo, id_measure, size, status FROM items WHERE id=? AND deleted IS NULL', [id])
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

        const { id } = req.params
        const { category, brand, code, name, description, measure, size, status } = req.body

        const optionals = {
            columns: '',
            params: []
        }
        let fileName = undefined

        if(req.files) {
            const photo = req.files.photo
            fileName = `${photo.md5}${path.extname(photo.name)}`
            fileUpload('photos/profiles/', fileName, photo)
            optionals.columns += ', photo=?'
            optionals.params.push(fileName)
        }

        if(description) {
            optionals.columns += ', description=?'
            optionals.params.push(description)
        }

        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss')

        pool.query(
            `UPDATE items SET id_category=?, id_brand=?, code=?, name=?, id_measure=?, size=?, status=?, updated=? ${optionals.columns} WHERE id=?`,
            [category, brand, code, name, measure, size, status, timestamp].concat(optionals.params).concat([id])
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
    delete: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        const {id} = req.params
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss')

        pool.query(
            `UPDATE items SET updated=?, deleted=? WHERE id=?`,
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
    ItemController
}