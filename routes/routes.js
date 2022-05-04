const Router = require("express").Router();

const passport = require("../config/passport")



const usersControllers = require ("../controllers/usersControllers")
const{nuevoUsuario, verifyEmail, accesoUsuario, cerrarCesion, verificarToken,subscribirSeEmail} = usersControllers

const validator = require("../controllers/validator");


Router.route("/signup")
.post( validator, nuevoUsuario)

Router.route("/verify/:uniqueText")
.get(verifyEmail)

Router.route("/signIn")
.post(accesoUsuario)

Router.route("/signOut")
.post(cerrarCesion)

Router.route("/signIn")
.post(accesoUsuario)

Router.route("/subscribe-send-email")
.get(subscribirSeEmail)

Router.route("/signInToken")
.get(passport.authenticate("jwt", {session:false}), verificarToken)



module.exports = Router