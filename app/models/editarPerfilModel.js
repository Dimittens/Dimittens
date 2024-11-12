const pool = require("../../config/pool_de_conexao");

const editarPerfilModel = {
    getProfileData: async (idUsuario) => {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    EMAIL_USUARIO AS email_psic, 
                    TEL_PSICOLOGO AS num_psic, 
                    ESPECIALIDADE_PSICOLOGO AS especialidade_psic, 
                    ABORDAGEM_ABRANGENTE_PSICOLOGO AS abordagem_psic, 
                    BIOGRAFIA_PSICOLOGO AS bio_psic,
                    PUBLICO_ALVO_PSICOLOGO AS publico_psic
                FROM USUARIO u
                LEFT JOIN PSICOLOGO p ON u.ID_USUARIO = p.ID_USUARIO
                WHERE u.ID_USUARIO = ?`, 
                [idUsuario]
            );
            return rows[0];
        } catch (error) {
            console.log("Erro ao obter dados do perfil:", error);
            return null;
        }
    },

    updateProfile: async (data) => {
        try {
            const { EMAIL_USUARIO, TEL_PSICOLOGO, ABORDAGEM_ABRANGENTE_PSICOLOGO, ESPECIALIDADE_PSICOLOGO, BIOGRAFIA_PSICOLOGO, PUBLICO_ALVO_PSICOLOGO, idUsuario } = data;

            await pool.query(
                `UPDATE USUARIO SET EMAIL_USUARIO = ? WHERE ID_USUARIO = ?`, 
                [EMAIL_USUARIO, idUsuario]
            );

            const [existingPsicologo] = await pool.query(
                `SELECT ID_USUARIO FROM PSICOLOGO WHERE ID_USUARIO = ?`,
                [idUsuario]
            );

            if (existingPsicologo.length === 0) {
                await pool.query(
                    `INSERT INTO PSICOLOGO (ID_USUARIO, TEL_PSICOLOGO, ABORDAGEM_ABRANGENTE_PSICOLOGO, ESPECIALIDADE_PSICOLOGO, BIOGRAFIA_PSICOLOGO, PUBLICO_ALVO_PSICOLOGO)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [idUsuario, TEL_PSICOLOGO, ABORDAGEM_ABRANGENTE_PSICOLOGO, ESPECIALIDADE_PSICOLOGO, BIOGRAFIA_PSICOLOGO, PUBLICO_ALVO_PSICOLOGO]
                );
                
            } else {
                await pool.query(
                    `UPDATE PSICOLOGO 
                    SET TEL_PSICOLOGO = ?, ABORDAGEM_ABRANGENTE_PSICOLOGO = ?, ESPECIALIDADE_PSICOLOGO = ?, BIOGRAFIA_PSICOLOGO = ?, PUBLICO_ALVO_PSICOLOGO = ?
                    WHERE ID_USUARIO = ?`,
                    [TEL_PSICOLOGO, ABORDAGEM_ABRANGENTE_PSICOLOGO, ESPECIALIDADE_PSICOLOGO, BIOGRAFIA_PSICOLOGO, PUBLICO_ALVO_PSICOLOGO, idUsuario]
                );
            }

            return true;
        } catch (error) {
            console.log("Erro ao atualizar perfil:", error);
            return false;
        }
    }
};

module.exports = editarPerfilModel;