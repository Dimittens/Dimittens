const paciente = require("../models/pacienteModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPacientesController = {

    cadastrar: async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
    
        const dadosForm = {
            NOME_USUARIO: req.body.username,
            SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
            DT_NASC_USUARIO: req.body.userdate,
            EMAIL_USUARIO: req.body.useremail,
            CPF_USUARIO: req.body.userdocuments,
            DT_CRIACAO_CONTA_USUARIO: new Date()
        };


        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render("pages/index", { pagina: "home", autenticado: null, errorsList: errors, valores: req.body });
        }
    
        try {
            // Verifica se o email já está cadastrado
            const existingEmails = await paciente.findAllEmails();
            if (existingEmails.includes(req.body.useremail)) {
                return res.render("pages/index", {
                    pagina: "home",
                    errorsList: [{ msg: "Email já cadastrado" }],
                    valores: req.body
                });
            }
    
            // Cria o novo usuário
            let create = await paciente.create(dadosForm);

        } catch (error) {
            console.log("Erro ao cadastrar:", error);
            res.render("pages/index", {
                pagina: "home",
                errorsList: [{ msg: "Erro ao cadastrar usuário." }],
                valores: req.body
            });
        }
    },    

    logar: async (req, res) => {
        try {
            const errors = validationResult(req);
            
            console.log("Dados recebidos:", req.body);
    
            if (!errors.isEmpty()) {
                return res.render("pages/index", { pagina: "loginpacientes", errorsList: errors, autenticado: null });
            }
    
            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword
            };
    
            console.log("Dados do formulário:", dadosForm);
    
            let findUserCPF = await paciente.findUserCPF(dadosForm);
            if (findUserCPF.length === 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, findUserCPF[0].SENHA_USUARIO)) {
               console.log("Logou!");
               req.session.autenticado = true;
               return res.redirect("/homelogged");
            } else {
                console.log("Credenciais inválidas");
                return res.render("pages/index", { pagina: "loginpacientes", errorsList: [{ msg: "Credenciais inválidas" }], autenticado: null });
            }
        } catch (e) {
            console.log("Erro no login:", e);
            return res.render("pages/index", { pagina: "loginpacientes", errorsList: [{ msg: "Erro no servidor" }], autenticado: null });
        }
    }
        
}

module.exports = userPacientesController
