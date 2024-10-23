const paciente = require("../models/pacienteModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPacientesController = {
    cadastrar: async (req) => {
        console.log("Função de cadastro chamada");

        try {
            const errors = validationResult(req);
            console.log("Erros de validação:", errors.array());

            if (!errors.isEmpty()) {
                return { success: false, errors: errors.array() };
            }

            const dadosForm = {
                NOME_USUARIO: req.body.username,
                SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
                DT_NASC_USUARIO: req.body.userdate,
                EMAIL_USUARIO: req.body.useremail,
                CPF_USUARIO: req.body.userdocuments,
                DT_CRIACAO_CONTA_USUARIO: new Date(),
                DIFERENCIACAO_USUARIO: "Comum",
            };

            const existingEmails = await paciente.findAllEmails();
            const emailDuplicado = existingEmails.find(
                (email) => email === req.body.useremail
            );

            if (emailDuplicado) {
                console.log("Email duplicado encontrado:", emailDuplicado);
                return {
                    success: false,
                    errors: [{ msg: "Email já cadastrado" }],
                };
            }

            const resultado = await paciente.create(dadosForm);
            if (!resultado || !resultado.insertId) {
                throw new Error("Erro ao inserir o novo usuário.");
            }

            console.log("Paciente cadastrado com sucesso!", dadosForm);

            req.session.user = {
                id: resultado.insertId,
                nome: req.body.username,
                email: req.body.useremail,
            };
            console.log("Sessão de usuário criada:", req.session.user);

            return { success: true };
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            return { success: false, errors: [{ msg: "Erro no servidor." }] };
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
