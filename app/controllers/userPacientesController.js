const paciente = require("../models/pacienteModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPacientesController = {
    cadastrar: async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);

        // Verifica se há erros de validação
        if (!errors.isEmpty()) {
            return res.render("pages/index", {
                pagina: "cadastropacientes",
                autenticado: null, // Alterado para passar o estado de autenticação
                errorsList: errors.array(),
                valores: req.body
            });
        }

        const dadosForm = {
            NOME_USUARIO: req.body.username,
            SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
            DT_NASC_USUARIO: req.body.userdate,
            EMAIL_USUARIO: req.body.useremail,
            CPF_USUARIO: req.body.userdocuments,
            DT_CRIACAO_CONTA_USUARIO: new Date()
        };

        try {
            // Verifica se o email já está cadastrado
            const existingEmails = await paciente.findAllEmails();
            if (existingEmails.includes(req.body.useremail)) {
                return res.render("pages/index", {
                    pagina: "cadastropacientes",
                    autenticado: null, // Alterado para passar o estado de autenticação
                    errorsList: [{ msg: "Email já cadastrado" }],
                    valores: req.body
                });
            }

            // Cria o novo usuário
            await paciente.create(dadosForm);
            console.log("Usuário cadastrado com sucesso!");

            // Define o estado de autenticação após o cadastro
            req.session.autenticado = true;

            // Redireciona após o cadastro
            res.redirect("/homelogged"); // Mude para a rota desejada após o cadastro

        } catch (error) {
            console.log("Erro ao cadastrar:", error);
            return res.render("pages/index", {
                pagina: "cadastropacientes",
                autenticado: null, // Alterado para passar o estado de autenticação
                errorsList: [{ msg: "Erro ao cadastrar usuário." }],
                valores: req.body
            });
        }
    },

    logar: async (req, res) => {
        try {
            const errors = validationResult(req);

            console.log("Dados recebidos:", req.body);

            // Verifica se há erros de validação
            if (!errors.isEmpty()) {
                return res.render("pages/index", {
                    pagina: "loginpacientes",
                    errorsList: errors.array(),
                    autenticado: null // Alterado para passar o estado de autenticação
                });
            }

            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword
            };

            console.log("Dados do formulário:", dadosForm);

            let findUserCPF = await paciente.findUserCPF(dadosForm);
            if (findUserCPF.length === 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, findUserCPF[0].SENHA_USUARIO)) {
                console.log("Logou como Paciente!!");
                req.session.autenticado = true; // Define autenticação ao logar
                return res.redirect("/homelogged");
            } else {
                console.log("Credenciais inválidas");
                return res.render("pages/index", {
                    pagina: "loginpacientes",
                    errorsList: [{ msg: "Credenciais inválidas" }],
                    autenticado: null // Alterado para passar o estado de autenticação
                });
            }
        } catch (e) {
            console.log("Erro no login:", e);
            return res.render("pages/index", {
                pagina: "loginpacientes",
                errorsList: [{ msg: "Erro no servidor" }],
                autenticado: null // Alterado para passar o estado de autenticação
            });
        }
    }
};

module.exports = userPacientesController;

