const Postagem = require('../models/Postagem');
const multer = require('multer');
const path = require('path');

// Configurando o multer para salvar a imagem
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/postagens/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('imagemPostagem');

exports.criarPostagem = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro no upload da imagem.' });
        }

        const { titulo, tipo, topico, idComunidade } = req.body;
        const imagemPostagem = req.file ? req.file.filename : null;
        const idUsuario = req.usuario.id;  // Pega o ID do usuário logado

        Postagem.criarPostagem(idUsuario, titulo, tipo, topico, idComunidade, imagemPostagem)
            .then(() => {
                res.status(200).json({ message: 'Postagem criada com sucesso.' });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Erro ao criar postagem.' });

            });
    });
};
{
    
}