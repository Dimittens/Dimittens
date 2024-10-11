const paciente = require("../models/pacienteModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPacientesController = {
    cadastrar: async (req, res) => {
        const errors = validationResult(req);
        console.log("Erros de validação:", errors.array());

        // Verifica se há erros de validação
        if (!errors.isEmpty()) {
            return res.render("pages/index", {
                pagina: "cadastropacientes",
                autenticado: null,
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
            DT_CRIACAO_CONTA_USUARIO: new Date(),
            DIFERENCIACAO_USUARIO: 'Comum'
        };

        console.log('Dados recebidos:', dadosForm);

        try {
            // Verifica se o email já está cadastrado
            const existingEmails = await paciente.findAllEmails();
            const emailDuplicado = existingEmails.find(email => email === req.body.useremail);

            // Emitindo log apenas se um email duplicado for encontrado
            if (emailDuplicado) {
                console.log('Email duplicado encontrado:', emailDuplicado);
                return res.render("pages/index", {
                    pagina: "cadastropacientes",
                    autenticado: null,
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
            return { success: true }; // Retorna um objeto indicando sucesso

        } catch (error) {
            console.log("Erro ao cadastrar:", error);
            return res.render("pages/index", {
                pagina: "cadastropacientes",
                autenticado: null,
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
                return {
                    success: false,
                    errors: errors.array(), // Retorna os erros encontrados
                };
            }
    
            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword
            };
    
            console.log("Dados do formulário:", dadosForm);
    
            let findUserCPF = await paciente.findUserCPF(dadosForm);
            if (findUserCPF.length === 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, findUserCPF[0].SENHA_USUARIO)) {
                console.log("Logou como Paciente!!");
    
                return {
                    success: true,
                    dados: findUserCPF[0], // Retorna os dados do usuário
                };
            } else {
                console.log("Credenciais inválidas");
                return {
                    success: false,
                    errors: [{ msg: "Credenciais inválidas" }], // Erro de credenciais
                };
            }
        } catch (e) {
            console.log("Erro no login:", e);
            return {
                success: false,
                errors: [{ msg: "Erro no servidor" }],
            };
        }
    }
};

module.exports = userPacientesController;
