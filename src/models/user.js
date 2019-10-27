const mongoose = require('../database/index')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true //grava tudo com letras minusculas
    },
    password: {
        type: String,
        required: false,
        select: false //quando buscarmos os dados no banco não vai vim a senha
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//executa antes de salvar o Usuário - por isso pre('save', ...)
UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

module.exports = mongoose.model('User', UserSchema)

