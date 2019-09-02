const moment = require('moment')
const { pool } = require('../database')

const BrandController = {
    show: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        pool.query('SELECT id, name, status FROM brands WHERE deleted IS NULL')
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

        const { name, status } = req.body

        pool.query('INSERT INTO brands (name, status) VALUES(?,?)', [name, status])
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

        pool.query('SELECT id, name, status FROM brands WHERE id=? AND deleted IS NULL', [id])
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
        const {name, status} = req.body

        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss')

        pool.query(
            `UPDATE brands SET name=?, status=?, updated=? WHERE id=?`,
            [name, status, timestamp, id]
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
            `UPDATE brands SET updated=?, deleted=? WHERE id=?`,
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
    BrandController
}