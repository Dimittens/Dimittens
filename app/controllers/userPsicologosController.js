const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const usuarioModel = require("../models/psicologosModel");
var salt = bcrypt.genSaltSync(10);

const userPsicologosController = {

    // Função para cadastrar um novo psicólogo
    cadastrar: async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);

        // Se houver erros de validação, renderiza a página com os erros
        if (!errors.isEmpty()) {
            return res.render("pages/index", {
                pagina: "home",
                errorsList: errors.array(),
                valores: req.body
            });
        }

        const dadosForm = {
            NOME_USUARIO: req.body.nome,
            EMAIL_USUARIO: req.body.email,
            SENHA_USUARIO: req.body.senha,
            DT_NASC_USUARIO: req.body.data_nascimento,
            CPF_USUARIO: req.body.cpf,
            DIFERENCIACAO_USUARIO: req.body.diferenciacao || "Psicologo",   // Valor padrão
            PSICOLOGO_ID_PSICOLOGO: req.body.psicologo_id,
           
        };

        try {
            // Verifica se o email já está cadastrado
            const existingEmails = await psicologosModel.findAllEmail(req.body.email);
            if (existingEmails) {
                return res.render("pages/index", {
                    pagina: "home",
                    errorsList: [{ msg: "Email já cadastrado" }],
                    valores: req.body
                });
            }

            // Cria o novo usuário
            await usuarioModel.create(dadosUsuario);

            res.redirect("/login");  // Redireciona para a página de login após o cadastro
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            res.render("pages/index", {
                pagina: "home",
                errorsList: [{ msg: "Erro ao cadastrar usuário." }],
                valores: req.body
            });
        }
    },

    // Função para realizar o login
    logar: async (req, res) => {
        const errors = validationResult(req);

        // Se houver erros de validação, renderiza a página com os erros
        if (!errors.isEmpty()) {
            return res.render("pages/index", {
                pagina: "login",
                errorsList: errors.array(),
                autenticado: null
            });
        }

        const { email, senha } = req.body;

        try {
            // Busca o usuário pelo email
            const user = await usuarioModel.findByEmail(email);

            if (user && bcrypt.compareSync(senha, user.SENHA_USUARIO)) {
                // Login bem-sucedido
                req.session.autenticado = true;
                req.session.usuarioId = user.ID_USUARIO;
                res.redirect("/homelogged");  // Redireciona para a página de usuários logados
            } else {
                // Credenciais inválidas
                return res.render("pages/index", {
                    pagina: "login",
                    errorsList: [{ msg: "Credenciais inválidas" }],
                    autenticado: null
                });
            }
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            return res.render("pages/index", {
                pagina: "login",
                errorsList: [{ msg: "Erro no servidor" }],
                autenticado: null
            });
        }
    }
};

module.exports = userPsicologosController;
