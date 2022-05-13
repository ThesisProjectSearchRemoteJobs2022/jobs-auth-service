if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const nodemailer = require("nodemailer");
const crypto =require("crypto");
const User = require("../models/user.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");


const URL_AUTH_SERVICE= process.env.URL_AUTH_SERVICE
const URL_SCRAP= process.env.URL_SCRAPPING_SERVICE
const JOBS_DYNAMIC_TEMPLATE_ID= process.env.JOBS_DYNAMIC_TEMPLATE_ID

const axios = require("axios")
const sendMail = require('@sendgrid/mail');

const message = require("../config/index")

sendMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(email,newUser, uniqueText){
    
    try {
      const { firstname, lastname, email } = newUser; // destructuring
      const fromGmail = process.env.FROM_GMAIL;
      const password = process.env.PASSWORD_GMAIL;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: fromGmail,
          pass: password,
        },
      });

      //   const sender = fromGmail;
      const mailOptions = {
        from: `"No Reply - NodeMailer 👻 -JobsOffers Co" DO-NOT-REPLY${fromGmail}`,
        to: email,
        subject: "JobsOffers Box Nodemailer - Email verification",
        html: `<div style="margin: 20px; padding: 30px; background:#f6f6f6; border:4px solid #f4125f;">
                <h2 style="color:#a0a42; font-family:Oswald ; font-size: 50px; text-align: center;">Thanks for signing up,${firstname}! </h2>
                </br>
                <h2 style="color:#000000; font-style: 20px; text-align:center;">
                Please verify your email address. </h2>
                </br>
                </br>
                <div style="font-family:inherit;text-align:center"><span style="colorf4125f;font-size:18px"><strong>Thank you!</strong></span></div>

                <a style="display: flex;margin: 10px auto; width: fit-content; justify-content: center; color: #000000; 
                text-decoration: none; border-style: solid;
                background-color: #f4125f; padding: 12px 40px 12px 40px;
                border-radius:6px;font-size:16px;text-align:center;"  href=http://localhost:4000/api/verify/${uniqueText} >Verify Email Now</a>

                <h6 style="color: #f4125f; font-size: 12px;text-align: center;">All Rights Reserved Copyright - 2022</h6>
                <h6 style="color: #f4125f; font-size: 12px;text-align: center;"><i>powered by JobsOffers</i> </h6>
                </div>`,
      };
      await transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log("mensaje enviado"); //parametros que se envian al usuario
        }
      });
    } catch (error) {
      console.log("catch error: " + error);
    }
}

const sendEmailSendgrid= async (emailMessage) => {
    try {
      const response = await sendMail.send(emailMessage);
      // console.log(("sendMAIL:",response[0].statusCode));
      const resp = response[0].statusCode == 202 ? true : false;
      return resp;
    } catch (error) {

      console.error("catch sendEmailSendgrid", error.message);
      console.error("catch sendEmailSendgrid", error);
      return false;
    }
  }

const prepareEmailMessageSendGrid = async (
    userEmail,
    userName,
    OfertasTrabajosList,
    jobOfferSearch,
    sandboxMode = false
  ) => {


    return {
      subject: "Someone claimed some swag!",

      from: "NO-REPLY - JoBoardDev Co <rogercolquecalcina@gmail.com>",
      templateId: JOBS_DYNAMIC_TEMPLATE_ID,

      
      personalizations: [
        {
          to: `${userName} <${userEmail}>`,
          dynamic_template_data: {
            subject: `🔔 Notificaremos ofertas laborales de ${jobOfferSearch} `,
            items: OfertasTrabajosList,
            customer_name: userName,
            jobs_search: jobOfferSearch,
          },
        },
      ],
      mail_settings: {
        sandbox_mode: {
          enable: sandboxMode,
        },
      },
    };
  }

  
const  prepareVerifyEmailSendGrid = (userEmail,newUser, verification_token,sandboxMode=false) => {
    const { firstname, lastname, email } = newUser; //

    return {
      to: email,
      from: {
        name: 'NO-REPLY - Jobs Remote Co',
        email: 'rogercolquecalcina@gmail.com',
      },
      
      templateId: process.env.VERIFY_EMAIL_TEMPLATE_ID,
      dynamicTemplateData: {
        customer_name: firstname,
        verification_token:
          process.env.NODE_ENV !== 'prod'
            // ? `http://localhost:3000/auth/${verification_token}`
            ? `${URL_AUTH_SERVICE}/api/verify/${verification_token}`
            : `https://jobs-auth-service.herokuapp.com/api/verify/${verification_token}`,
      },
      mail_settings: {
      sandbox_mode: {
        enable: sandboxMode
      }
    }
    };
  }
const usersControllers = {
  subscribirSeEmail: async (req, res) => {
    //es el controlador que recibe el click del usuario en el email
    // const { uniqueText } = req.params;

    const emailReceived = req.query.email;
    console.log(req.query)
    jobOfferSearch = req.query.trabajo;

    const URL = `${URL_SCRAP}/getJobs?trabajo=${jobOfferSearch}`; // /api/v1/getJobs?trabajo=android

    console.log('url scrap:', URL)
    try {
      const user = await User.findOne({ email: emailReceived });
      if (!user) {
        res.json({
          success: false,
          response: "e-mail no existe",
          message: "e-mail no existe"
        });
        return
      }
      
      if (user.emailVerificado == false) {
        res.json({
          success: false,
          response: "e-mail no verificado, revise el correo enviado a Gmail",
          message: "e-mail no verificado, revise el correo enviado a Gmail"
        });
        return
      }

      if (user.isSubscribeEmail) {
        res.json({
          success: false,
          response: "ya esta susbcrito a "+jobOfferSearch,
          message: "ya esta susbcrito a "+user.subscribeTopic
        });
        
        return
      }

      var config = {
        method: "get",
        url: URL,
        headers: {},
      };

      const response = await axios(config);

      const responseJobs = await response.data;

      if (responseJobs.success == false) {
        res.json({ success: false, message: "Sin conexion" });
        return;
      }

      let OfertasTrabajosList = [];
      OfertasTrabajosList = responseJobs;

      const message = await prepareEmailMessageSendGrid(
        emailReceived,
        "user name",
        OfertasTrabajosList.jobs,
        jobOfferSearch
      );

    //   console.log('BEFORE SEND CONFIG EMAIL: ', JSON.stringify(message))
      const responseSendEmail = await sendEmailSendgrid(message);
      if (responseSendEmail == false) {
        res.json({ success: false, message: "No se envio correos" });
        return;
      }

      user.isSubscribeEmail = true;
      
      user.subscribeTopic = jobOfferSearch;
      
      await user.save();

      res.json({ success: true, message: "Correo Enviado" });

    } catch (error) {
      console.log("catch error Send:",error.message);
      // console.error(error);
      res.json({ success: false, message: "ocurrio un error" });
    }

    

    
  },

  verifyEmail: async (req, res) => {
    //es el controlador que recibe el click del usuario en el email
    const { uniqueText } = req.params;
    const user = await User.findOne({ uniqueText: uniqueText });
    if (user) {
      user.emailVerificado = true;
      await user.save();
      // res.redirect("https://itinerarioapp.herokuapp.com/signin")
      res.redirect(`${URL_AUTH_SERVICE}/api/verificando`);
    } else {
      res.json({
        success: false,
        response: "Su correo electrónico no pudo ser verificado",
      });
    }
  },

  nuevoUsuario: async (req, res) => {
    const { imageUser, firstname, lastname, email, password, from } =
      req.body.NuevoUsuario; // destructuring

    try {
      const usuarioExiste = await User.findOne({ email });
      console.log(req.body);
      if (usuarioExiste) {
        /* Facebook start if */
        if (from !== "SignUp") {
          const passwordHash = bcryptjs.hashSync(password, 10);
          usuarioExiste.imageUser = imageUser;
          usuarioExiste.password = passwordHash;
          usuarioExiste.emailVerificado = true;
          usuarioExiste.from = from;
          usuarioExiste.connected = false;

          usuarioExiste.save();
          res.json({
            success: true,
            response: "Actualizo el inicio de sesion, ahora puedes hacerlo con" + from,
          });
        } else {
          res.json({
            success: false,
            
            response: message.user.EMAIL_TAKEN,
          });
        }
        /* Facebook end if */

        /* Google start if */

        /*   if(google){                
                    const passwordHash = bcryptjs.hashSync(password, 10)
                    usuarioExiste.password= passwordHash;
                    usuarioExiste.emailVerificado= true;
                    usuarioExiste.google= true;
                    usuarioExiste.connected= false;

                    usuarioExiste.save();
                    res.json({success:true, from:"google", response:"Actualizo el singin, ahora lo puedes hacer con google"})                   
                    
                }else{
                    res.json({success:false, from:"SignUp", response:"Este email ya esta en uso, por favor realiza singIN"})                   

                }*/
        /*google end if */
      } /* final de if de usuario existe */ else {
        /* start else del if de usuario existe */
        const emailVerificado = false;
        const uniqueText = crypto.randomBytes(15).toString("hex"); //texto randon de 15 caracteres hexadecimal
        const passwordHash = bcryptjs.hashSync(password, 10);

        const newUser = new User({
          imageUser,
          firstname,
          lastname,
          email,
          password: passwordHash,
          uniqueText, //busca la coincidencia del texto
          emailVerificado,
          connected: false,
          from,
        });
        //console.log(newUser.imageUser);

        /* Facebook start else */

        if (from !== "SignUp") {
          newUser.emailVerificado = true;
          newUser.from = from;
          newUser.connected = false;

          await newUser.save();

          res.json({
            success: true,
            data: { newUser },
            response:
              "Se creo el usuario con" + "" + from,
          });
        } else {
          newUser.emailVerificado = false;
          newUser.from = from;
          newUser.connected = false;

          await newUser.save();
        //   await sendEmail(email, newUser, uniqueText);

            const messagePrepared =  prepareVerifyEmailSendGrid(email, newUser, uniqueText);
          
          const responseSendEmail = await sendEmailSendgrid(messagePrepared);

          if (responseSendEmail == false) {
            res.json({ success: false,response: "e-mail para verficacion no enviado", message: "No se envio correos" });
            return;
          }

          
          res.json({
            success: true,
            response: "Hemos enviado un correo electrónico para verificar su dirección de correo electrónico",
            data: { newUser },
          });
        } /* google end else */

        /* Facebook end else */

        /* Google start else */
        /*  if(google){
                    newUser.emailVerificado= true;
                    newUser.google=true,
                    newUser.connected= false,

                    await newUser.save()

                    res.json({success:true,from:"google", response:"Felicitaciones hemos creado tu usuario con google",data:{newUser}})
                }


                else {
                    newUser.emailVerificado=false
                    newUser.google= false
                    newUser.connected= false
                    await newUser.save()
                    await sendEmail(email, uniqueText)
                    res.json({ success:true, from:"SingUp", response: "We have sent an e-mail to verify your e-mail address" , data:{newUser}})
                } */
      } /* final del else de usuario existe */
    } catch (error) {
      /* final de try */
      console.log("catch error", error)
      res.json({
        success: "falseVAL",
        from: "SingUp",
        response: "Este correo ya esta siendo usado",
        error: error,
      });
    }
  },

  accesoUsuario: async (req, res) => {
    console.log("RECIBIDO ACCESO USUARIO", req.body);
    const { email, password } = req.body.userData;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        res.json({
          success: false,
          from: "controller",
          error: "El nombre de usuario y/o la contraseña son incorrectos",
        });

        return
      }

      if (user.emailVerificado == false) {
        res.json({
          success: false,
          from: "controller",
          error: "Verifica tu correo electrónico Gmail para validarte",
        });
        return
      }

      let passwordCoincide = bcryptjs.compareSync(password, user.password);

      if (passwordCoincide == false) {
        res.json({
          success: false,
          from: "controller",
          error: "El nombre de usuario y/o la contraseña son incorrectos",
        });
        return
      }

      const datosUser = {
        imageUser: user.imageUser,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        id: user._id,
      };
      
      user.connected = true;
      await user.save();

      const token = jwt.sign(
        { ...datosUser },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 60 * 60 * 24 }
      );

      res.json({
        success: true,
        from: "controller",
        response: { token, datosUser },
      });
      

    } catch (error) {
      console.log(error);
      res.json({ success: false, response: null, error: error });
    }
  },

  cerrarCesion: async (req, res) => {
    console.log("RECIBIDO cerrarCesion", req.body);
    const email = req.body.email;
    // console.log(req.body.email);

    const user = await User.findOne({ email });

    /*  user.connected=false */

    await user.save();
    res.json({ success: true, response: "Closed assignment" });
  },

  verificarToken: async (req, res) => {
    if (!req.error) {
      res.json({
        success: true,
        datosUser: {
          imageUser: req.user.imageUser,
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          email: req.user.email,
          id: req.user.id,
        },
        response: "Bienvenido de nuevo " + req.user.firstname,
      });
    } else {
      res.json({ success: false, response: "Inicie sesión de nuevo" });
    }
  },
};


module.exports = usersControllers
