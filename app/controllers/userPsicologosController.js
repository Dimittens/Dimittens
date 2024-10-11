const psicologo = require("../models/psicologoModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPsicologosController = {
    cadastrar: async (req, res) => {
        console.log("Função de cadastro chamada");
        
        const errors = validationResult(req);
        console.log("Erros de validação:", errors.array());

        // Verifica se há erros de validação
        if (!errors.isEmpty()) {
            return res.render("pages/index", { 
                pagina: "cadastropsicologos",
                autenticado: null,
                errorsList: errors.array(), 
                valores: req.body // Passa valores para a view
            });
        }

        const dadosForm = {
            NOME_USUARIO: req.body.username,
            SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
            EMAIL_USUARIO: req.body.useremail,
            CRP_USUARIO: req.body.usercrp,
            CPF_USUARIO: req.body.userdocuments,
            DT_CRIACAO_CONTA_USUARIO: new Date(),
            DIFERENCIACAO_USUARIO: 'Psicologo'
        };

        console.log("Dados recebidos:", dadosForm);

        try {
            // Verifica se o CPF já está cadastrado
            const existingUsers = await psicologo.findUserCPF(dadosForm);
            if (existingUsers.length > 0) {
                console.log('CPF duplicado encontrado:', req.body.userdocuments);
                return res.render("pages/index", {
                    pagina: "cadastropsicologos",
                    errorsList: [{ msg: "CPF já cadastrado." }],
                    valores: req.body // Passa valores para a view
                });
            }

            // Verifica se o email já está cadastrado
            const existingEmails = await psicologo.findAllEmails();
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


            // Verificação para o CRP
            const existingCRPs = await psicologo.findAllCRPs();
            if (existingCRPs.includes(req.body.usercrp)) {
                console.log('CRP duplicado encontrado:', req.body.usercrp);
                return res.render("pages/index", {
                    pagina: "cadastropsicologos",
                    errorsList: [{ msg: "CRP já cadastrado." }],
                    valores: req.body // Passa valores para a view
                });
            }

            // Criação do psicólogo
            await psicologo.create(dadosForm);
            console.log("Psicólogo cadastrado com sucesso:", dadosForm);

            // Define o estado de autenticação após o cadastro
            req.session.autenticado = true;

            // Redirecionar após o cadastro
            return {
                 success: true,
            }; // Retorne um objeto de sucesso
        } catch (error) {
            console.log("Erro ao cadastrar psicólogo:", error);
            return res.render("pages/index", {
                pagina: "cadastropsicologos",
                autenticado: null,
                errorsList: [{ msg: "Erro ao cadastrar psicólogo." }],
                valores: req.body
            });
        }
    },

    logar: async (req, res) => {
        try {
            console.log("Função de login chamada");

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
                CRP_USUARIO: req.body.usercrp,
                SENHA_USUARIO: req.body.userpassword
            };

            console.log("Dados do formulário:", dadosForm);

            // Buscar psicólogo pelo CPF
            let findUserCPF = await psicologo.findUserCPF(dadosForm);
            if (findUserCPF.length === 1) {
                const psicologoData = findUserCPF[0]; // O primeiro resultado

                // Verifica se a senha está correta
                const senhaCorreta = await bcrypt.compare(req.body.userpassword, psicologoData.SENHA_USUARIO);

                if (senhaCorreta) {
                    // Autenticação bem-sucedida
                    req.session.autenticado = true;
                    req.session.user = {
                        id: psicologoData.id,
                        userNome: psicologoData.NOME_USUARIO,
                        tipo: 'Psicologo' // Tipo de usuário
                    };

                    console.log("Psicólogo logado com sucesso:", psicologoData);
                    return { 
                        success: true,
                        dados: findUserCPF[0],
                     }; // Retorne um objeto de sucesso
                }
            }

            // Se chegar aqui, falha na autenticação
            console.log("Credenciais inválidas");
            return {
                success: false,
                errors: [{ msg: "Usuário ou senha inválidos" }], // Erro de credenciais
            };
        } catch (error) {
            console.log("Erro no login:", error);
            return {
                success: false,
                errors: [{ msg: "Erro no servidor" }],
            };
        }
    }
};

module.exports = userPsicologosController;
