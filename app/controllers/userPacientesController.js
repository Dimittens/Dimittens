const paciente = require("../models/pacienteModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPacientesController = {
    cadastrar: async (req, res) => {
        console.log("Função de cadastro chamada");

        try {
            // Validação dos dados
            const errors = validationResult(req);
            console.log("Erros de validação:", errors.array());

            if (!errors.isEmpty()) {
                return res.render("pages/index", {
                    pagina: "cadastropacientes",
                    autenticado: null,
                    errorsList: errors.array(),
                    valores: req.body,
                });
            }

            // Monta os dados do formulário
            const dadosForm = {
                NOME_USUARIO: req.body.username,
                SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
                DT_NASC_USUARIO: req.body.userdate,
                EMAIL_USUARIO: req.body.useremail,
                CPF_USUARIO: req.body.userdocuments,
                DT_CRIACAO_CONTA_USUARIO: new Date(),
                DIFERENCIACAO_USUARIO: "Comum",
            };

            // Verifica se o email já está cadastrado
            const existingEmails = await paciente.findAllEmails();
            const emailDuplicado = existingEmails.find(
                (email) => email === req.body.useremail
            );

            if (emailDuplicado) {
                console.log("Email duplicado encontrado:", emailDuplicado);
                return res.render("pages/index", {
                    pagina: "cadastropacientes",
                    autenticado: null,
                    errorsList: [{ msg: "Email já cadastrado" }],
                    valores: req.body,
                });
            }

            // Criação do novo usuário
            const novoUsuario = await paciente.create(dadosForm);
            console.log("Paciente cadastrado com sucesso!", novoUsuario);

            // Renderiza a página de sucesso ou redireciona
            return res.render("pages/index", {
                pagina: "cadastropacientes",
                autenticado: null,
                successMessage: "Usuário cadastrado com sucesso!",
                valores: {},
            });

        } catch (error) {
            console.error("Erro ao cadastrar:", error);

            // Em caso de erro, renderiza a página com mensagem de erro
            return res.render("pages/index", {
                pagina: "cadastropacientes",
                autenticado: null,
                errorsList: [{ msg: "Erro ao cadastrar usuário." }],
                valores: req.body,
            });
        }
    },

    logar: async (req) => {
        try {
            console.log("Função de login chamada");

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return { success: false, errors: errors.array() };
            }

            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword,
            };

            const findUserCPF = await paciente.findUserCPF(dadosForm);
            console.log("Resultado da busca por CPF:", findUserCPF);

            if (findUserCPF.length === 1) {
                const usuario = findUserCPF[0];
                const senhaValida = await bcrypt.compare(
                    dadosForm.SENHA_USUARIO,
                    usuario.SENHA_USUARIO
                );

                if (senhaValida) {
                    console.log("Paciente logado com sucesso!");

                    return {
                        success: true,
                        dados: {
                            NOME_USUARIO: usuario.NOME_USUARIO,
                            ID_USUARIO: usuario.ID_USUARIO,
                            DIFERENCIACAO_USUARIO: usuario.DIFERENCIACAO_USUARIO,
                        },
                    };
                } else {
                    console.log("Senha incorreta.");
                    return {
                        success: false,
                        errors: [{ msg: "Credenciais inválidas" }],
                    };
                }
            } else {
                console.log("Usuário não encontrado.");
                return {
                    success: false,
                    errors: [{ msg: "Usuário não encontrado" }],
                };
            }
        } catch (error) {
            console.error("Erro no login:", error);
            return { success: false, errors: [{ msg: "Erro no servidor" }] };
        }
    },
};

module.exports = userPacientesController;
