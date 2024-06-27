const { validationResult } = require("express-validator");
const paciente = require("./pacienteModel.js");
const bcrypt = require("bcryptjs");

checkAuthenticatedUser = (req, res, next) => {
    if(req.session.autenticado){
        var autenticado = req.session.autenticado;
    }else{
        var autenticado = null;
    }
    next();
}

clearSession = (req, res, next) => { // Declaração de uma função chamada 
    req.session.destroy(); // Remove todos os dados associados ao usuario. Usa a funcao da biblioteca nodejs "Destroy()"
    console.log("saiu!")
    next() // Chama a próxima função middleware na cadeia de execução.
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
      
        // Verificação bem-sucedida do login
        if (total == 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, results[0].SENHA_USUARIO)) {
             autenticado = results[0].NOME_USUARIO; // Definir o nome de usuário como autenticado
            console.log("LOGADINHO!!!")
        } else {
             autenticado = null;
        }

    } else {
        req.session.autenticado = null;
    }

    next();
}

module.exports = {
    checkAuthenticatedUser,
    clearSession,
    recordAuthenticatedUser,
   
}