const { pool } = require('../database')

const RoleController = {
    show: (req, res) => {
        const response = {
            status: false,
            message: '',
            data: undefined
        }

        pool.query('SELECT id, name FROM roles WHERE status=1')
            .then(result => {
                response.status = true
                response.data = result
                return res.status(200).send(response);
            })
            .catch(err => {
                res.status(500).send({ error: err.message })
            })
    }
}

module.exports = {
    RoleController
}