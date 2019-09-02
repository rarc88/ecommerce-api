const mysql = require('promise-mysql-native')
const { database } = require('./config')

mysql.createPool(database)

const pool = mysql.createPool(database)

pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection)
        console.log("DB is connect")
    })
    .catch(err => console.log("Error to connect", err))

module.exports = {
    pool
}