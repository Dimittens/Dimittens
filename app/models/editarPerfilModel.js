var pool = require("../../config/pool_de_conexao");

const PsicologoModel = {
  updateProfile: async (data) => {
    const { email, telefone, fotoPerfil, abordagem, especialidade, biografia, idUsuario } = data;

    const queryUsuario = `
      UPDATE USUARIO
      SET EMAIL_USUARIO = ?
      WHERE ID_USUARIO = ? AND DIFERENCIACAO_USUARIO = 'psicologo';
    `;
    const queryPsicologo = `
      UPDATE PSICOLOGO
      SET TEL_PSICOLOGO = ?, ESPECIALIDADE_PSICOLOGO = ?, ABORDAGEM_ABRANGENTE_PSICOLOGO = ?, BIOGRAFIA_PSICOLOGO = ?
      WHERE ID_USUARIO = ?;
    `;

    // Atualizando a tabela de usuario e de psicologo
    try {
      await db.execute(queryUsuario, [email, idUsuario]);
      await db.execute(queryPsicologo, [telefone, especialidade, abordagem, biografia, idUsuario]);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = PsicologoModel;