const pool = require("../../config/pool_de_conexao");

const editarPerfilModel = {
    // Função para obter os dados do perfil
    getProfileData: async (idUsuario) => {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    EMAIL_USUARIO AS email_psic, 
                    TEL_PSICOLOGO AS num_psic, 
                    ESPECIALIDADE_PSICOLOGO AS especialidade_psic, 
                    ABORDAGEM_ABRANGENTE_PSICOLOGO AS abordagem_psic, 
                    BIOGRAFIA_PSICOLOGO AS bio_psic 
                FROM USUARIO u
                JOIN PSICOLOGO p ON u.ID_USUARIO = p.ID_USUARIO
                WHERE u.ID_USUARIO = ?`, 
                [idUsuario]
            );
            return rows[0];
        } catch (error) {
            console.log("Erro ao obter dados do perfil:", error);
            return null;
        }
    },

    // Função para atualizar os dados do perfil
    updateProfile: async (data) => {
        try {
            const { EMAIL_USUARIO, TEL_PSICOLOGO, ABORDAGEM_ABRANGENTE_PSICOLOGO, ESPECIALIDADE_PSICOLOGO, BIOGRAFIA_PSICOLOGO, idUsuario } = data;

            // Atualiza o perfil do usuário na tabela USUARIO
            const [usuarioUpdateResult] = await pool.query(
                `UPDATE USUARIO 
                SET EMAIL_USUARIO = ? 
                WHERE ID_USUARIO = ?`, 
                [EMAIL_USUARIO, idUsuario]  // Usando ID_USUARIO para identificar o usuário
            );

            // Atualiza o perfil do psicólogo na tabela PSICOLOGO
            const [psicologoUpdateResult] = await pool.query(
                `UPDATE PSICOLOGO 
                SET TEL_PSICOLOGO = ?, ABORDAGEM_ABRANGENTE_PSICOLOGO = ?, ESPECIALIDADE_PSICOLOGO = ?, BIOGRAFIA_PSICOLOGO = ? 
                WHERE ID_USUARIO = ?`,  // Usando ID_USUARIO na tabela PSICOLOGO
                [TEL_PSICOLOGO, ABORDAGEM_ABRANGENTE_PSICOLOGO, ESPECIALIDADE_PSICOLOGO, BIOGRAFIA_PSICOLOGO, idUsuario] // Passando o ID_USUARIO como referência
            );

            return usuarioUpdateResult.affectedRows > 0 && psicologoUpdateResult.affectedRows > 0;
        } catch (error) {
            console.log("Erro ao atualizar perfil:", error);
            return false;
        }
    }
};

module.exports = editarPerfilModel;