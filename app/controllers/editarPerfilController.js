const editarPerfilModel = require("../models/editarPerfilModel");

const editarPerfilController = {
    editarPerfilPage: async (req, res) => {
        const idUsuario = req.session?.autenticado?.usuarioId;

        if (!idUsuario) {
            return res.status(400).json({ error: 'Usuário não autenticado' });
        }

        try {
            const valores = await editarPerfilModel.getProfileData(idUsuario);
            
            // Verifica se a consulta retornou resultados
            if (!valores) {
                return res.status(404).json({ error: 'Perfil não encontrado' });
            }

            console.log("Dados do perfil:", valores);  // Verifique os dados no console
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

        const data = {
            EMAIL_USUARIO: emailpsic,
            TEL_PSICOLOGO: tel,
            ABORDAGEM_ABRANGENTE_PSICOLOGO: abordagem,
            ESPECIALIDADE_PSICOLOGO: especialidade,
            BIOGRAFIA_PSICOLOGO: biografiapsic,
            PUBLICO_ALVO_PSICOLOGO: publico,
            idUsuario
        };

        try {
            const success = await editarPerfilModel.updateProfile(data);

            if (success) {
                res.redirect("/perfilpsic");
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
