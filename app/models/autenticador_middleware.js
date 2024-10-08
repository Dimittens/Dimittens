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
            SENHA_USUARIO: req.body.userpassword,
            CRP_PSICOLOGO: req.body.usercrp, // Só será enviado no caso de psicólogos
            DATA_NASC_USUARIO: req.body.userdob // Só será enviado no caso de pacientes menores
        };

        // Busca pelo usuário através do CPF
        var results = await paciente.findUserCPF(dadosForm);
        var total = Object.keys(results).length;

        if (total == 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, results[0].SENHA_USUARIO)) {
            // Verificando se o login é de Psicólogo
            if (results[0].DIFERENCIACAO_USUARIO === 'Psicologo') {
                // Verificar CRP
                if (results[0].CRP_PSICOLOGO === dadosForm.CRP_PSICOLOGO) {
                    req.session.autenticado = { psico: results[0].NOME_USUARIO };
                    console.log("Psicólogo logado:", req.session.autenticado);
                } else {
                    req.session.autenticado = null;
                    console.log("CRP incorreto.");
                }
            }
            // Verificando se o login é de Paciente Menor de Idade
            else if (results[0].DIFERENCIACAO_USUARIO === 'Menor de Idade') {
                // Verificar data de nascimento
                if (results[0].DT_NASC_USUARIO === dadosForm.DATA_NASC_USUARIO) {
                    req.session.autenticado = { menor: results[0].NOME_USUARIO };
                    console.log("Paciente menor de idade logado:", req.session.autenticado);
                } else {
                    req.session.autenticado = null;
                    console.log("Data de nascimento incorreta.");
                }
            }
            // Login de paciente comum
            else {
                req.session.autenticado = { paciente: results[0].NOME_USUARIO };
                console.log("Paciente logado:", req.session.autenticado);
            }
            return res.redirect("/homelogged");
        } else {
            req.session.autenticado = null;
            console.log("Login falhou: senha ou CPF incorretos.");
        }
    } else {
        req.session.autenticado = null;
        console.log("Erros de validação:", errors.array());
    }
    
    next();
};


module.exports = {
    checkAuthenticatedUser,
    clearSession,
    recordAuthenticatedUser,
}




