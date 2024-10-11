const menorModel = require("../models/menorModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

// Função para formatar a data
const formatarData = (data) => {
    return new Date(data).toISOString().split('T')[0]; // Formato yyyy-mm-dd
};

const userMenorController = {
    cadastrar: async (req, res) => {
        console.log("Função de cadastro chamada");
        const errors = validationResult(req);
        console.log("Erros de validação:", errors.array());

        if (!errors.isEmpty()) {
            return res.render("pages/index", {
                pagina: "cadastromenor",
                autenticado: null,
                errorsList: errors.array(),
                valores: req.body
            });
        }

        const dadosForm = {
            NOME_USUARIO: req.body.username,
            SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
            DT_NASC_USUARIO: formatarData(req.body.userdatemenor),  // Formata a data
            CPF_USUARIO: req.body.userdocuments,
            EMAIL_USUARIO: req.body.useremail,
            CPF_RESPONSAVEL: req.body.userresponsaveldocuments,
            NOME_RESPONSAVEL: req.body.usernameresponsavel,
            DT_CRIACAO_CONTA_USUARIO: new Date(),
            DIFERENCIACAO_USUARIO: 'Menor de Idade'
        };

        console.log('Dados recebidos:', dadosForm);

        try {
            const existingEmails = await menorModel.findAllEmails();
            const emailDuplicado = existingEmails.find(email => email === req.body.useremail);

            if (emailDuplicado) {
                console.log('Email duplicado encontrado:', emailDuplicado);
                return res.render("pages/index", {
                    pagina: "cadastromenor",
                    autenticado: null,
                    errorsList: [{ msg: "Email já cadastrado" }],
                    valores: req.body
                });
            }

            await menorModel.create(dadosForm);
            console.log("Usuário Menor de Idade cadastrado com sucesso!!");
            req.session.autenticado = true;

            return { success: true };

        } catch (error) {
            console.log("Erro ao cadastrar menor:", error);
            return res.render("pages/index", {
                pagina: "cadastromenor",
                autenticado: null,
                errorsList: [{ msg: "Erro ao cadastrar usuário." }],
                valores: req.body
            });
        }
    },

    logar: async (req, res) => {
        try {
            console.log("Função de login chamada");
            const errors = validationResult(req);
            console.log("Dados recebidos:", req.body);

            if (!errors.isEmpty()) {
                return { success: false, errorsList: errors.array() };
            }

            const dadosForm = {
                DT_NASC_USUARIO: formatarData(req.body.userdatemenor),  // Formata a data no login também
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword
            };

            console.log("Dados do formulário:", dadosForm);

            let findUserCPF = await menorModel.findUserCPF(dadosForm);
            if (findUserCPF.length === 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, findUserCPF[0].SENHA_USUARIO)) {
                const dataNascFormatadaBanco = formatarData(findUserCPF[0].DT_NASC_USUARIO);
                const dataNascFormatadaForm = formatarData(dadosForm.DT_NASC_USUARIO);

                if (dataNascFormatadaBanco === dataNascFormatadaForm) {
                    console.log("Logou como Menor de Idade!");
                    req.session.autenticado = true;

                    return {
                        success: true,
                        dados: findUserCPF[0]
                    };
                } else {
                    console.log("Data de nascimento não coincide.");
                    return {
                        success: false,
                        errorsList: [{ msg: "Data de nascimento não coincide." }]
                    };
                }
            } else {
                console.log("Credenciais inválidas");
                return {
                    success: false,
                    errors: [{ msg: "Credenciais inválidas" }]
                };
            }
        } catch (e) {
            console.log("Erro no login menor:", e);
            return {
                success: false,
                errors: [{ msg: "Erro no servidor" }]
            };
        }
    }
}

module.exports = userMenorController;
