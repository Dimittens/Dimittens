const { validationResult } = require("express-validator");
const paciente = require("./pacienteModel.js");
const bcrypt = require("bcryptjs");

checkAuthenticatedUser = (req, res, next) => {
    if (req.session.autenticado) {
        console.log("Usuário autenticado:", req.session.autenticado);
        var autenticado = req.session.autenticado;
    } else {
        console.log("Usuário não autenticado");
        var autenticado = null;
    }
    next();
}

clearSession = (req, res, next) => {
    req.session.destroy();
    console.log("saiu!")
    next()
}

recordAuthenticatedUser = async (req, res, next) => {
    errors = validationResult(req);
    if (errors.isEmpty()) {
        var dadosForm = {
            CPF_USUARIO: req.body.userdocuments,
            SENHA_USUARIO: req.body.userpassword
        };

        var results = await paciente.findUserCPF(dadosForm);
        var total = Object.keys(results).length;
        
        if (total == 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, results[0].SENHA_USUARIO)) {
            req.session.autenticado = results[0].NOME_USUARIO;
            console.log("LOGADINHO!!!", req.session);
            return res.redirect("/homelogged");
        } else {
            req.session.autenticado = null;
        }
    } else {
        req.session.autenticado = null;
    }
    next();
};

module.exports = {
    checkAuthenticatedUser,
    clearSession,
    recordAuthenticatedUser,
   
}