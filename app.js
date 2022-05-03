if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const axios = require("axios");
const express= require('express')
const morgan = require('morgan')
const cors = require("cors");
const createError = require('http-errors')
const { NotFound } = require('http-errors')

require('./helpers/init_mongodb')
// const {verifyAccessToken} = require('./helpers/jwt_helpe')

// const AuthRoute = require('./routes/Auth.route')

const Router = require("./routes/routes")


const app= express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// app.get('/',verifyAccessToken,async(req,res,next)=>{
//     // console.log(req.headers['authorization']);
    
//     res.send('Hello from express')
// })

app.get('/',async(req,res,next)=>{
    // console.log(req.headers['authorization']);
    
    res.send('INDEX AUTH SERVICE AND EMAIL SEND')
})


app.get('/api/verificando',async(req,res,next)=>{
    // console.log(req.headers['authorization']);
    
    res.send('Verificando Email Registrado')
})

// app.use('/auth',AuthRoute)

const { emailMessage, sendEmail } = require('./advanced-email');


app.get("/api/send-email-jobs", async (req, res, next) => {
  console.log('send init');
  const emails = 'rogcolquehuancac@gmail.com';
  const name = 'Roger Colqueh';
  let jobOfferSearch = 'Web';

  const emailReceived = req.query.email;
  
  jobOfferSearch = req.query.trabajo;

  const URL = `http://localhost:3002/api/v1/getJobs?trabajo=${jobOfferSearch}` // /api/v1/getJobs?trabajo=android
  try {
    var config = {
      method: 'get',
      url: URL,
      headers: { }
    };

    const response = await axios(config)

    const responseJobs = await response.data;
    

    if(responseJobs.success==false){
        res.json({success:false,message : "Sin conexion"});
        return
    }
    
    let OfertasTrabajosList = []
    OfertasTrabajosList =responseJobs
    // VALIDAR SI EL USUARIO YA ESTA SUSBSCRITO A RECIBIR NOTITICACIONES
    // POR AHORA AGREGAR UN ESTADO A TABLA USER  isSubcrite
    // REFACTORIAS PAARA USAR CONTROLLADOR 
    // if isSubscrite ==true
    //   message"ya esta susctio = sucess=false
    //   res.json({success:false,message : "Ya esta suscrito"})
    // else
    //   siguer la ruta normal de envio

    const message = emailMessage(emailReceived, name,OfertasTrabajosList.jobs,jobOfferSearch);
    
    const responseSendEmail = sendEmail(message);
    if(responseSendEmail==false){
        res.json({success:false,message : "No se envio correos"})
        return
    }

    res.json({success:true,message : "enviado"});
    


  } catch (error) {
    console.log(error.message);
    // console.error(error);
    res.json({success:false,message : "ocurrio un error"});
  }

});

app.use("/api",Router)


// app.use(async(req,res,next)=>{

//     // next(createError.NotFound('This route doesnt exist'))
//     next(createError.NotFound())
// })

// app.use((err,req,res,next)=>{
//     res.status(err.status || 500)
//     res.send({
//         error:{
//             status: err.status || 500,
//             message:err.message
//         }
//     })
// })


const PORT = process.env.PORT
const HOST = process.env.HOST


app.listen(PORT,function(error){
    if(error) return console.log(error);
   
    console.log(`Servidor corriendo en el Puerto: ${HOST}:${PORT}`);
    console.log(`enviar correos Subscripcion: ${HOST}:${PORT}/api/send-email-jobs`);
});


//https://www.coderdump.net/2018/04/automatic-refresh-api-token-with-retrofit-and-okhttp-authenticator.html