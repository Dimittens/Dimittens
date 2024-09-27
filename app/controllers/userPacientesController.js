const paciente = require("../models/pacienteModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPacientesController = {
    // REGRAS DE CADASTRO + MENSAGENS

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
    
        // Se houver erros de validação, retorna ao formulário
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
            res.redirect("/");
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
            if (!errors.isEmpty()) {
                return res.render("pages/index", { pagina: "loginpacientes", errorsList: errors, autenticado: null });
            }

            // ATUALIZAR
            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword
            };

            // ATUALIZAR
            let findUserCPF = await paciente.findUserCPF(dadosForm);
            if (findUserCPF.length === 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, findUserCPF[0].SENHA_USUARIO)) {
               console.log("Logou!")
                return res.redirect("/");
            } else {
                console.log("deu erro no login!!")
                res.render("pages/index", { pagina: "loginpacientes", errorsList: [{ msg: "Credenciais inválidas" }], autenticado: null });
            }
        } catch (e) {
            console.log("Deu erro no logar!!", e);
            res.render("pages/index", { pagina: "loginpacientes", errorsList: [{ msg: "Erro no servidor" }], autenticado: null });
        }
    }





}

module.exports = userPacientesController
