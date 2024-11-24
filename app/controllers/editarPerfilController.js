const editarPerfilModel = require("../models/editarPerfilModel");

const editarPerfilController = {
    editarPerfilPage: async (req, res) => {
        const idUsuario = req.session?.autenticado?.usuarioId;

        if (!idUsuario) {
            return res.status(400).json({ error: 'Usuário não autenticado' });
        }

        try {
            const valores = await editarPerfilModel.getProfileData(idUsuario);

            if (!valores) {
                return res.status(404).json({ error: 'Perfil não encontrado' });
            }

            res.render("partial/editeseuperfilpsic", { valores });
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            res.status(500).json({ error: 'Erro ao carregar dados do perfil' });
        }
    },

    editarPerfil: async (req, res) => {
        const { emailpsic, tel, abordagem, especialidade, biografiapsic, publico } = req.body;
        const idUsuario = req.session?.autenticado?.usuarioId;

        if (!idUsuario) {
            return res.status(400).json({ error: 'Usuário não autenticado' });
        }

        let imagemPerfil = null;
        if (req.file) {
            imagemPerfil = `/uploads/${req.file.filename}`;
        }

        const data = {
            EMAIL_USUARIO: emailpsic,
            TEL_USUARIO: tel,
            ABORDAGEM_ABRANGENTE_USUARIO: abordagem,
            ESPECIALIDADE_USUARIO: especialidade,
            BIOGRAFIA_USUARIO: biografiapsic,
            PUBLICO_ALVO_USUARIO: publico,
            IMAGEM_PERFIL: imagemPerfil,
            idUsuario
        };

        try {
            const success = await editarPerfilModel.updateProfile(data);

            if (success) {
                res.redirect('/perfilpsic');
            } else {
                res.status(500).json({ error: 'Erro ao atualizar perfil' });
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            res.status(500).json({ error: 'Erro ao atualizar perfil' });
        }
    }
};

module.exports = editarPerfilController;
