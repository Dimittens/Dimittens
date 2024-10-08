const menor = require("../models/menorModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userMenorController = {
    cadastrar: async (req, res) => {
        const errors = validationResult(req);
        
        // Verifica se há erros de validação
        if (!errors.isEmpty()) {
            return res.render("pages/index", { 
                pagina: "cadastromenor",
                autenticado: null,
                errorsList: errors, 
                valores: req.body
            });
        }
        
        const dadosForm = {
            NOME_USUARIO: req.body.username,
            SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
            DT_NASC_USUARIO: req.body.userdate,
            CPF_USUARIO: req.body.userdocuments,
            EMAIL_USUARIO: req.body.useremail,
            CPF_RESPONSAVEL: req.body.userresponsaveldocuments,
            NOME_RESPONSAVEL: req.body.usernameresponsavel,
            DT_CRIACAO_CONTA_USUARIO: new Date(),
            DIFERENCIACAO_USUARIO: 'Menor de Idade' // Definindo o tipo como 'Menor de Idade'
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
            console.log("Dados recebidos:", dadosForm); // Log dos dados recebidos
            console.log("Usuário Menor de 18 cadastrado com sucesso!!");
            req.session.autenticado = true; // Apenas após a inserção bem-sucedida
            res.redirect("/homelogged");
        
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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("pages/index", {
                    pagina: "logindependentes",
                    errorsList: errors.array(),
                    autenticado: null 
                });
            }
    
            const dadosForm = {
                DT_NASC_USUARIO: req.body.userdate, // A data do formulário
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword
            };
    
            console.log("Dados do formulário:", dadosForm);
    
            let findUser = await menor.findUserCPF(dadosForm); // Altere aqui para o método correto
            if (findUser.length === 1 && bcrypt.compareSync(dadosForm.SENHA_USUARIO, findUser[0].SENHA_USUARIO)) {
                // Comparar a data de nascimento convertendo para o mesmo formato
                const dataNascFormatadaBanco = findUser[0].DT_NASC_USUARIO.toISOString().split('T')[0]; // Converte para 'YYYY-MM-DD'
                const dataNascFormatadaForm = new Date(dadosForm.DT_NASC_USUARIO).toISOString().split('T')[0]; // Também converte o formulário para 'YYYY-MM-DD'
    
                if (dataNascFormatadaBanco === dataNascFormatadaForm) {
                    console.log("Logou como Menor de Idade!");
                    req.session.autenticado = true;
                    return res.redirect("/homelogged");
                } else {
                    console.log("Data de nascimento não coincide.");
                    return res.render("pages/index", { 
                        pagina: "logindependentes", 
                        errorsList: [{ msg: "Data de nascimento não coincide." }], 
                        autenticado: null 
                    });
                }
            } else {
                console.log("Credenciais inválidas");
                return res.render("pages/index", { 
                    pagina: "logindependentes", 
                    errorsList: [{ msg: "Credenciais inválidas" }], 
                    autenticado: null 
                });
            }
        } catch (e) {
            console.log("Erro no login menor:", e);
            return res.render("pages/index", {
                pagina: "logindependentes",
                errorsList: [{ msg: "Erro no servidor" }],
                autenticado: null
            });
        }
    }
    
}

module.exports = userMenorController;
