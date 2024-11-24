const pool = require("../../config/pool_de_conexao");

const editarPerfilModel = {
    getProfileData: async (idUsuario) => {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    u.EMAIL_USUARIO AS email_psic, 
                    p.TEL_PSICOLOGO AS num_psic, 
                    p.ESPECIALIDADE_PSICOLOGO AS especialidade_psic, 
                    p.ABORDAGEM_ABRANGENTE_PSICOLOGO AS abordagem_psic, 
                    p.BIOGRAFIA_PSICOLOGO AS bio_psic,
                    p.PUBLICO_ALVO_PSICOLOGO AS publico_psic,
                    u.IMAGEM_PERFIL AS imagem_perfil
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
            const { EMAIL_USUARIO, TEL_PSICOLOGO, ABORDAGEM_ABRANGENTE_PSICOLOGO, ESPECIALIDADE_PSICOLOGO, BIOGRAFIA_PSICOLOGO, PUBLICO_ALVO_PSICOLOGO, IMAGEM_PERFIL, idUsuario } = data;

            // Atualiza o e-mail e a imagem na tabela USUARIO
            await pool.query(
                `UPDATE USUARIO 
                SET EMAIL_USUARIO = ?, IMAGEM_PERFIL = ? 
                WHERE ID_USUARIO = ?`, 
                [EMAIL_USUARIO, IMAGEM_PERFIL, idUsuario]
            );

            // Verifica se existe um registro na tabela PSICOLOGO
            const [existingPsicologo] = await pool.query(
                `SELECT ID_USUARIO FROM PSICOLOGO WHERE ID_USUARIO = ?`,
                [idUsuario]
            );

            if (existingPsicologo.length === 0) {
                // Insere os dados na tabela PSICOLOGO, se ainda não existir
                await pool.query(
                    `INSERT INTO PSICOLOGO (ID_USUARIO, TEL_PSICOLOGO, ABORDAGEM_ABRANGENTE_PSICOLOGO, ESPECIALIDADE_PSICOLOGO, BIOGRAFIA_PSICOLOGO, PUBLICO_ALVO_PSICOLOGO)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [idUsuario, TEL_PSICOLOGO, ABORDAGEM_ABRANGENTE_PSICOLOGO, ESPECIALIDADE_PSICOLOGO, BIOGRAFIA_PSICOLOGO, PUBLICO_ALVO_PSICOLOGO]
                );
            } else {
                // Atualiza os dados na tabela PSICOLOGO, se já existir
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
