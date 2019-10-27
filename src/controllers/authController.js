const express = require('express')
const User = require('../models/user')
const router = express.Router()

router.post('/register', async (req, res) => {
    const { email } = req.body
    try {

        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' })

        const user = await User.create(req.body)

        //retira a senha para não exibir no retorno
        user.password = undefined

        return res.send(user)
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' })
    }
})

//pega a instância app passada no index.js e adiciona a rota criada neste controller
module.exports = app => app.use('/auth', router)