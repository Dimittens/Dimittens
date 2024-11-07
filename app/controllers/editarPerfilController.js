const editarPerfilModel = require("../models/editarPerfilModel");

function validarTelefone(telefone) {
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return telefoneRegex.test(telefone);
}

function validarBiografia(biografia) {
    return biografia.length <= 300;
}

const editarPerfilController = {
    // Renderiza a página de edição de perfil com os dados atuais
    editarPerfilPage: async (req, res) => {
        const idUsuario = req.session?.autenticado?.usuarioId;

        if (!idUsuario) {
            return res.status(400).json({ error: 'Usuário não autenticado' });
        }

        try {
            const valores = await editarPerfilModel.getProfileData(idUsuario);
            res.render("partial/editeseuperfilpsic", { valores });
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            res.status(500).json({ error: 'Erro ao carregar dados do perfil' });
        }
    },

    // Atualiza os dados do perfil quando o formulário for submetido
    editarPerfil: async (req, res) => {
        const { emailpsic, tel, abordagem, especialidade, biografiapsic } = req.body;
        const idUsuario = req.session?.autenticado?.usuarioId;

        if (!idUsuario) {
            return res.status(400).json({ error: 'Usuário não autenticado' });
        }

        // Validação do telefone
        if (!validarTelefone(tel)) {
            return res.status(400).json({ error: 'Número de telefone inválido. Use o formato (xx) xxxxx-xxxx' });
        }

        // Validação da biografia
        if (!validarBiografia(biografiapsic)) {
            return res.status(400).json({ error: 'A biografia deve ter no máximo 300 caracteres' });
        }

        const data = {
            EMAIL_USUARIO: emailpsic,
            TEL_PSICOLOGO: tel,
            ABORDAGEM_ABRANGENTE_PSICOLOGO: abordagem,
            ESPECIALIDADE_PSICOLOGO: especialidade,
            BIOGRAFIA_PSICOLOGO: biografiapsic,
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