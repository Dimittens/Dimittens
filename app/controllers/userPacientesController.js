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
                SENHA_USUARIO: req.body.userpassword,
            };
    
            console.log("Dados do formulário:", dadosForm);
    
            // Busca o usuário pelo CPF
            const findUserCPF = await paciente.findUserCPF(dadosForm);
            console.log("Resultado da busca por CPF:", findUserCPF);
    
            if (findUserCPF.length === 1) {
                const senhaHash = findUserCPF[0].SENHA_USUARIO;
                const senhaValida = await bcrypt.compare(dadosForm.SENHA_USUARIO, senhaHash); // Comparação assíncrona
    
                if (senhaValida) {
                    console.log("Login bem-sucedido!");
    
                    // Define a sessão do usuário
                    req.session.autenticado = {
                        usuarioNome: findUserCPF[0].NOME_USUARIO,
                        usuarioId: findUserCPF[0].ID_USUARIO,
                    };
    
                    // Redireciona para a página inicial logada
                    return res.redirect("/homelogged");
                } else {
                    console.log("Senha incorreta.");
                    return res.render("pages/index", {
                        pagina: "loginpacientes",
                        autenticado: null,
                        errorsList: [{ msg: "Credenciais inválidas" }],
                    });
                }
            } else {
                console.log("Usuário não encontrado.");
                return res.render("pages/index", {
                    pagina: "loginpacientes",
                    autenticado: null,
                    errorsList: [{ msg: "Credenciais inválidas" }],
                });
            }
        } catch (error) {
            console.error("Erro no login:", error);
            return res.render("pages/index", {
                pagina: "loginpacientes",
                autenticado: null,
                errorsList: [{ msg: "Erro no servidor" }],
            });
        }
    }    
};

module.exports = userPacientesController;
