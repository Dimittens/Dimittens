const Postagem = require("../models/criarpostagemController");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPacientesController = {
    cadastrar: async (req) => {
        console.log("Função de postagem chamada");

        try {
            const errors = validationResult(req);
            console.log("Erros de validação:", errors.array());

            if (!errors.isEmpty()) {
                return { success: false, errors: errors.array() };
            }
        }
            
            const dadosForm = {
                TITULO_POSTAGEM_PUBLICACOMU: req.body.input-text,
                BLABLABLA: req.body.tipodepost,
                BLABLABLA: req.body.topicodapost,
                BLABLABLA: req.body.escolhacomunidade,
            };


            // Salva a imagem recebida
            const imagemFile = req.files.picture__input; // Supondo que você está usando uma biblioteca para manipular arquivos
            const imagemPath = path.join(__dirname, 'uploads', `${Date.now()}_${imagemFile.name}`);

            // Escreve a imagem no servidor
            fs.writeFileSync(imagemPath, imagemFile.data); // Salva a imagem

            dadosForm.IMAGEM = imagemPath; // Adiciona o caminho da imagem aos dados

            // Aqui você deve chamar a função para salvar a postagem no banco de dados
            const novaPostagem = await Postagem.create(dadosForm);

            return res.status(201).json({ success: true, postagem: novaPostagem });
        } catch (error) {
            console.error("Erro ao criar postagem:", error);
            return res.status(500).json({ success: false, message: "Erro ao criar postagem" });
        }

        }

    