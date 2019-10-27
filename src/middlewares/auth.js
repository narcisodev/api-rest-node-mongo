const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

//parametro next() que possibilita prosseguir para a aplicação caso o token seja válido
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    //verifica se o token foi passado
    if (!authHeader)
        return res.status(401).send({ error: 'No token provided' })

    //formato do token = Bearer iasjdifouu2u309482...
    //verifica se o token está no formato certo
    const parts = authHeader.split(' ')

    //como o token tem apenas duas parte dividas por espaço - aqui verifica se o array parts tem length 2 depois do split
    if (!parts.length === 2)
        return res.status(401).send({ error: 'Token error' })

    //desestruturação para passar os dados do array para a variavel
    const [scheme, token] = parts

    //regex que verifica se tem a palavra Bearer no Inicio da variavel scheme
    if (!(/^Bearer$/i).test(scheme))
        return res.status(401).send({ error: 'Token malformated' })

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid' })
        
        //passar o userId para o req onde qualquer controller que receber o req vai conseguir saber qual o usuario que logou pelo req.userId
        req.userId = decoded.params.id
    

        //prossegue o processo pois tudo está ok
        return next()

    })



}