const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')

//initialization
const app = express()
app.use(fileUpload())

//settings
app.set('port', process.env.PORT || 3000)

//Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/profiles', express.static(__dirname + '/files/photos/profiles'))
app.use('/items', express.static(__dirname + '/files/photos/items'))

//Configurando cabeceras y CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //* cambiar por la url  cuando se despliegue al servidor
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next()
});

app.get('/api/status', (req, res) => {
    return res.status(200).send({ status: 'OK' })
})

const { administratorRoutes } = require('./router/administratorRoutes')
app.use('/api', administratorRoutes)
const { roleRoutes } = require('./router/roleRoutes')
app.use('/api', roleRoutes)
const { brandRoutes } = require('./router/brandRoutes')
app.use('/api', brandRoutes)
const { measureRoutes } = require('./router/measureRoutes')
app.use('/api', measureRoutes)
const { categoryRoutes } = require('./router/categoryRoutes')
app.use('/api', categoryRoutes)
const { providerRoutes } = require('./router/providerRoutes')
app.use('/api', providerRoutes)
const { itemRoutes } = require('./router/itemRoutes')
app.use('/api', itemRoutes)

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`)
});