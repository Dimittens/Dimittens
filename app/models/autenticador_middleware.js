const { validationResult } = require("express-validator");
const paciente = require("./pacienteModel.js");
const bcrypt = require("bcryptjs");

// Middleware para verificar se o usuário está autenticado
checkAuthenticatedUser = (req, res, next) => {
    if (req.session && req.session.autenticado) {
      console.log("Usuário autenticado:", req.session.autenticado);
      res.locals.usuarioNome = req.session.autenticado.usuarioNome; // Disponibiliza o nome do usuário para as views
      next(); // Permite continuar para a rota desejada
    } else {
      console.log("Usuário não autenticado.");
      res.locals.usuarioNome = null; // Garante que não tenha dados de usuário nas views
      return res.redirect("/loginpacientes"); // Redireciona para a página de login
    }
  };
  

// Middleware para limpar a sessão
clearSession = (req, res, next) => {
    console.log("Sessão antes de limpar:", req.session); // Log do estado da sessão
    req.session.destroy();
    console.log("Usuário saiu!");
};

// Middleware para registrar o usuário autenticado
const recordAuthenticatedUser = async (req, res, next) => {
    console.log("Entrou no middleware de registro do usuário");
    const errors = validationResult(req);
    console.log("Erros de validação:", errors.array());

    if (errors.isEmpty()) { 
        var dadosForm = {
            CPF_USUARIO: req.body.userdocuments,
            SENHA_USUARIO: req.body.userpassword,
            CRP_PSICOLOGO: req.body.usercrp,
            DATA_NASC_USUARIO: req.body.userdatemenor
        };

        // Busca pelo usuário através do CPF
        var results = await paciente.findUserCPF(dadosForm);
        console.log("Resultados da busca:", results);

        // Verificando se nenhum resultado foi encontrado
        if (!results || results.length === 0) {
            console.log("Nenhum usuário encontrado com o CPF fornecido.");
        }

        var total = Object.keys(results).length;

        if (total === 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, results[0].SENHA_USUARIO)) {
            // Definindo o nome do usuário
            const usuarioNome = results[0].NOME_USUARIO;
            console.log("Nome do usuário encontrado:", usuarioNome);

            // Armazenando informações do usuário na sessão
            req.session.autenticado = {
                usuarioNome: usuarioNome,
                usuarioId: resultadoLogin.dados.ID_USUARIO,
                tipo: results[0].DIFERENCIACAO_USUARIO
            };

            console.log("Sessão após login:", req.session.autenticado);
            return res.redirect("/homelogged");
        } else {
            req.session.autenticado = null;
            console.log("Login falhou: senha ou CPF incorretos.");
        }
    } else {
        req.session.autenticado = null;
        console.log("Erros de validação:", errors.array());
    }
};

// Exportando os middlewares
module.exports = {
    checkAuthenticatedUser,
    clearSession,
    recordAuthenticatedUser,
};
