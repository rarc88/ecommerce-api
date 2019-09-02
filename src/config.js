const secret = {
    key: 'my-super-secret-key'
}

// Desarrollo Local
const database = {
    host: 'localhost',
    port: 3306,
    database: 'ecommerce',
    user: 'root',
    password: 'mysql12345'
}

// Desarrollo
// const database = {
//     host: 'localhost',
//     port: 3306,
//     database: 'db_pargasys_dev',
//     user: 'root',
//     password: 'LaClaveEsGyp2018'
// }

// Produccion
// const database = {
//     host: 'localhost',
//     port: 3306,
//     database: 'db_pargasys',
//     user: 'root',
//     password: 'LaClaveEsGyp2018'
// }



module.exports = {
    secret,
    database
}