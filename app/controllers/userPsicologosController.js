const psicologo = require("../models/psicologoModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const userPsicologosController = {
    cadastrar: async (req, res) => {
        console.log("Função de cadastro chamada");
        console.log("Dados recebidos:", req.body);
        
        const errors = validationResult(req);
        const dadosForm = {
            NOME_USUARIO: req.body.username,
            SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
            EMAIL_USUARIO: req.body.useremail,
            CRP_USUARIO: req.body.usercrp,
            CPF_USUARIO: req.body.userdocuments,
            DT_CRIACAO_CONTA_USUARIO: new Date(),
            DIFERENCIACAO_USUARIO: 'Psicologo'
        };

        // Inicializa valores
        const valores = req.body;

        // Verifica se há erros de validação
        if (!errors.isEmpty()) {
            return res.render("pages/index", { 
                pagina: "cadastropsicologos", 
                errorsList: errors.array(), 
                valores: valores // Passa valores para a view
            });
        }

        try {
            // Verifica se o email já está cadastrado
            const existingEmails = await psicologo.findAllEmails();
            if (existingEmails.includes(req.body.useremail)) {
                return res.render("pages/index", {
                    pagina: "cadastropsicologos",
                    errorsList: [{ msg: "Email já cadastrado" }],
                    valores: valores // Passa valores para a view
                });
            }

            // Verificação para o CRP
            const existingCRPs = await psicologo.findAllCRPs();
            if (existingCRPs.includes(req.body.usercrp)) {
                return res.render("pages/index", {
                    pagina: "cadastropsicologos",
                    errorsList: [{ msg: "CRP já cadastrado" }],
                    valores: valores // Passa valores para a view
                });
            }

            // Criação do psicólogo
            await psicologo.create(dadosForm);
            console.log("Psicólogo cadastrado com sucesso:", dadosForm);

            // Define o estado de autenticação após o cadastro
            req.session.autenticado = true;
            req.session.user = {
                nome: req.body.username,
                tipo: 'Psicologo' // Pode ser útil definir o tipo de usuário
            };

            // Redirecionar para a página home logada
            res.redirect("/homelogged");
        } catch (error) {
            console.log("Erro ao cadastrar psicólogo:", error);
            res.render("pages/index", {
                pagina: "loginpsicologos",
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
                return res.render('page/index', {
                    pagina: "loginpsicologos",
                    errorsList: errors.array(),
                    autenticado: null // Alterado para passar o estado de autenticação
                    });
                }
    
            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                CRP_USUARIO: req.body.usercrp,
                SENHA_USUARIO: req.body.userpassword
            };
    
            console.log("Dados do formulário:", dadosForm);

            // Buscar psicólogo pelo CPF
            let findUserCPF = await psicologo.findUserCPF(dadosForm);
            if (findUserCPF.length > 0) {
                const psicologoData = findUserCPF[0]; // O primeiro resultado

                // Agora buscar pelo CRP para verificar se o CRP está correto
                let findUserCRP = await psicologo.findUserCRP(dadosForm);

                if (findUserCRP.length > 0) {
                    // Verifica se a senha está correta
                    const senhaCorreta = await bcrypt.compare(req.body.userpassword, psicologoData.SENHA_USUARIO);

                    if (senhaCorreta) {
                        // Autenticação bem-sucedida
                        req.session.autenticado = true;
                        req.session.user = {
                            id: psicologoData.id,
                            nome: psicologoData.NOME_USUARIO,
                            tipo: 'Psicologo' // Tipo de usuário
                        };

                        console.log("Psicólogo logado com sucesso:", psicologoData);
                        // Redirecionar para a página home
                        return res.redirect("/homelogged");
                    }
                }
            }

            // Se chegar aqui, falha na autenticação
            res.render("loginpsicologos", { error: 'Usuário ou senha inválidos',});
        } catch (error) {
            console.log("Erro no login:", error);
            res.render('loginpsicologos', { error: 'Erro no login',});
        }
    }
};

module.exports = userPsicologosController;
