const joi = require("joi")
const { nuevoUsuario } = require("./usersControllers")

const validator = (req,res,next)=>{ 
    console.log(req.body.NuevoUsuario) 
const Schema=joi.object({
    imageUser:joi.string().required(),
    
    firstname:joi.string().max(40).min(3).trim().pattern(new RegExp("[a-zA-Z]")).required().messages({
        "string.min":"El nombre debe contener al menos 3 caracteres",
        "string.empty":"El campo no puede estar vacío"
    }),
    lastname:joi.string().max(20).min(3).trim().pattern(new RegExp("[a-zA-Z]")).required().messages({

        "string.min":"Last El nombre debe contener al menos 3 caracteres",
        "string.empty":"El campo no puede estar vacío"
    }),
    email:joi.string().email({minDomainSegments:2}).required().messages({
        "string.email":"Formato de correo inválido"
    }),
    password:joi.string().max(30).min(6).pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/).required().messages({
        "string.pattern.base":"La contraseña debe contener al menos una mayúscula, una minúscula y un número.",
        "string.min":"La contraseña debe contener al menos 6 caracteres alfanuméricos",
        "string.max":"La contraseña no debe exceder los 30 caracteres alfanuméricos"
    }),  
   /*  google:joi.boolean(), */
    from: joi.string()



})
const validation = Schema.validate(req.body.NuevoUsuario,{abortEarly:false})

if(validation.error){
    // return res.json({success:"falseVAL", response:validation})  
    const errorsList = [...validation.error.details]
    const errorsListMessages = errorsList.map(error=> error.message)
    return res.json({success:"falseVAL", response:errorsListMessages})  
}
next()
}
module.exports = validator
