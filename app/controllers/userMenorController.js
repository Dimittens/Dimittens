const menor = require("../models/menorModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const userMenorController = {
    cadastrar: async (req, res) => {
        console.log("Função de cadastro chamada");
        const errors = validationResult(req);
        
        // Verifica se há erros de validação
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
            DT_NASC_USUARIO: req.body.userdatemenor,
            CPF_USUARIO: req.body.userdocuments,
            EMAIL_USUARIO: req.body.useremail,
            CPF_RESPONSAVEL: req.body.userresponsaveldocuments,
            NOME_RESPONSAVEL: req.body.usernameresponsavel,
            DT_CRIACAO_CONTA_USUARIO: new Date(),
            DIFERENCIACAO_USUARIO: 'Menor de Idade'
        };

        try {
            const existingEmails = await menor.findAllEmails();
            const emailDuplicado = existingEmails.find(email => email === req.body.useremail);

            // Emitindo log apenas se um email duplicado for encontrado
            if (emailDuplicado) {
                console.log('Email duplicado encontrado:', emailDuplicado);
                return res.render("pages/index", {
                    pagina: "cadastromenor",
                    autenticado: null,
                    errorsList: [{ msg: "Email já cadastrado" }],
                    valores: req.body
                });
            }

            // Criando usuário apenas se não houver emails duplicados
            await menor.create(dadosForm);
            console.log("Dados recebidos:", dadosForm);
            console.log("Usuário Menor de Idade cadastrado com sucesso!!");
            req.session.autenticado = true;
            req.session.user = {
                nome: req.body.username,
                tipo: 'Menor de Idade'
            };
            return { success: true }; // Retorne um objeto de sucesso
        
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
            if (!errors.isEmpty()) {
                return {
                    success: false,
                    errorsList: errors.array()
                };
            }
    
            const dadosForm = {
                DT_NASC_USUARIO: req.body.userdate, 
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword
            };
    
            console.log("Dados do formulário:", dadosForm);
    
            let findUser = await menor.findUserCPF(dadosForm); 
            if (findUser.length === 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, findUser[0].SENHA_USUARIO)) {
                // Comparar a data de nascimento
                const dataNascFormatadaBanco = findUser[0].DT_NASC_USUARIO.toISOString().split('T')[0]; 
                const dataNascFormatadaForm = new Date(dadosForm.DT_NASC_USUARIO).toISOString().split('T')[0]; 
    
                if (dataNascFormatadaBanco === dataNascFormatadaForm) {
                    console.log("Logou como Menor de Idade!");
                    req.session.autenticado = true;
                    req.session.user = {
                        id: findUser[0].id,
                        nome: findUser[0].NOME_USUARIO,
                        tipo: 'Menor de Idade'
                    };
                    return {
                        success: true,
                        dados: findUser[0] // Retorna os dados do usuário
                    }; // Retorne um objeto de sucesso
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
                    errorsList: [{ msg: "Credenciais inválidas" }]
                };
            }
        } catch (e) {
            console.log("Erro no login menor:", e);
            return {
                success: false,
                errorsList: [{ msg: "Erro no servidor" }]
            };
        }
    }    
}

module.exports = userMenorController;
