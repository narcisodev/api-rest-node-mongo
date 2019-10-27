const express = require('express')
const body_parser = require('body-parser')

const app = express()

//entender requisições em json
app.use(body_parser.json())

//entender parâmetros passados pela url
app.use(body_parser.urlencoded({ extended: false }))

//(app) - passa a instância do express para o authController
require('./controllers/authController')(app)

require('./controllers/projectController')(app)

//roda app na porta 3000
app.listen(3000) 
