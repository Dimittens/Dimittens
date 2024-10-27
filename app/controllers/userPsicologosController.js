const psicologo = require("../models/psicologoModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPsicologosController = {
    cadastrar: async (req, res) => {
        console.log("Função de cadastro chamada");

        const errors = validationResult(req);
        console.log("Erros de validação:", errors.array());

        if (!errors.isEmpty()) {
            return res.render("pages/index", {
                pagina: "cadastropsicologos",
                autenticado: null,
                errorsList: errors.array(),
                valores: req.body
            });
        }

        const dadosForm = {
            NOME_USUARIO: req.body.username,
            SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
            EMAIL_USUARIO: req.body.useremail,
            DT_NASC_USUARIO: req.body.userdate,
            CRP_USUARIO: req.body.usercrp,
            CPF_USUARIO: req.body.userdocuments,
            DT_CRIACAO_CONTA_USUARIO: new Date(),
            DIFERENCIACAO_USUARIO: "Psicologo"
        };

        try {
            const existingUsers = await psicologo.findUserCPF(dadosForm);
            if (existingUsers.length > 0) {
                console.log("CPF duplicado encontrado:", req.body.userdocuments);
                return res.render("pages/index", {
                    pagina: "cadastropsicologos",
                    errorsList: [{ msg: "CPF já cadastrado." }],
                    valores: req.body
                });
            }

            const existingEmails = await psicologo.findAllEmails();
            const emailDuplicado = existingEmails.find(
                email => email === req.body.useremail
            );

            if (emailDuplicado) {
                console.log("Email duplicado encontrado:", emailDuplicado);
                return res.render("pages/index", {
                    pagina: "cadastropsicologos",
                    autenticado: null,
                    errorsList: [{ msg: "Email já cadastrado." }],
                    valores: req.body
                });
            }

            const existingCRPs = await psicologo.findAllCRPs();
            if (existingCRPs.includes(req.body.usercrp)) {
                console.log("CRP duplicado encontrado:", req.body.usercrp);
                return res.render("pages/index", {
                    pagina: "cadastropsicologos",
                    errorsList: [{ msg: "CRP já cadastrado." }],
                    valores: req.body
                });
            }

            const resultado = await psicologo.create(dadosForm);
            console.log("Psicólogo cadastrado com sucesso:", dadosForm);

            // Configura a sessão de autenticação
            req.session.autenticado = {
                usuarioNome: req.body.username,
                usuarioId: resultado.insertId,
                UsuarioCRP: req.body.usercrp,
                tipo: "Psicologo"
            };
            console.log("Sessão de usuário criada:", req.session.autenticado);

            return { success: true };
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
    logar: async (req) => {
        try {
            const errors = validationResult(req); // Validação inicial
            let errorsList = {};
    
            // Acumular todos os erros de validação inicial
            if (!errors.isEmpty()) {
                errors.array().forEach((error) => {
                    errorsList[error.param] = error.msg;
                });
            }
    
            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                CRP_USUARIO: req.body.usercrp,
                SENHA_USUARIO: req.body.userpassword,
            };
    
            const findUserCPF = await psicologo.findUserCPF(dadosForm);
    
            // Verificação do CPF (mesmo se já houver erros)
            if (findUserCPF.length !== 1) {
                errorsList.userdocuments = 'CPF não encontrado.';
            } else {
                const psicologoData = findUserCPF[0];
    
                // Verificação do CRP
                if (psicologoData.CRP_USUARIO !== req.body.usercrp) {
                    errorsList.usercrp = 'CRP incorreto.';
                }
    
                // Verificação da senha
                const senhaCorreta = await bcrypt.compare(
                    req.body.userpassword,
                    psicologoData.SENHA_USUARIO
                );
    
                if (!senhaCorreta) {
                    errorsList.userpassword = 'Senha incorreta.';
                }
            }
    
            // Retorna todos os erros encontrados
            if (Object.keys(errorsList).length > 0) {
                console.log('Erros encontrados:', errorsList); // Log dos erros
                return { success: false, errors: errorsList };
            }
    
            // Se não houver erros, retorna sucesso
            return { success: true, dados: findUserCPF[0] };
    
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, errors: { geral: 'Erro no servidor.' } };
        }
    }
};

module.exports = userPsicologosController;
