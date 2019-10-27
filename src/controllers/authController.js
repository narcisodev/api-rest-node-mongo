const express = require('express')
const User = require('../models/user')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//importar a chave de segurança interna da api para a geração do token
const auth_config = require('../config/auth')

function generateToken(params = {}) {
    return jwt.sign({ params }, auth_config.secret, {
        expiresIn: 86400, //tempo de expiração dado em segundos
    })
}

router.post('/register', async (req, res) => {
    const { email } = req.body
    try {

        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' })

        const user = await User.create(req.body)

        //retira a senha para não exibir no retorno
        user.password = undefined

        res.send({ user, token: generateToken({ id: user.id }) })
        
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')

    if (!user)
        return res.status(400).send({ error: 'User not found' })

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Ivalid password' })

    user.password = undefined


    res.send({ user, token: generateToken({ id: user.id }) })

})

//pega a instância app passada no index.js e adiciona a rota criada neste controller
module.exports = app => app.use('/auth', router)