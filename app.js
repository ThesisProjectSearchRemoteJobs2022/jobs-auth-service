const express= require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const { NotFound } = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const {verifyAccessToken} = require('./helpers/jwt_helpe')

const AuthRoute = require('./routes/Auth.route')

const app= express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',verifyAccessToken,async(req,res,next)=>{
    // console.log(req.headers['authorization']);
    
    res.send('Hello from express')
})

app.use('/auth',AuthRoute)

app.use(async(req,res,next)=>{

    // next(createError.NotFound('This route doesnt exist'))
    next(createError.NotFound())
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message:err.message
        }
    })
})


const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

//https://www.coderdump.net/2018/04/automatic-refresh-api-token-with-retrofit-and-okhttp-authenticator.html