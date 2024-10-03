const pool = require("../../config/pool_de_conexao");
const bcrypt = require("bcryptjs");

const usuarioModel = {
  
    // Função para criar um novo usuário
    create: async (dadosUsuario) => {
        try {
            // Hash da senha
            const salt = bcrypt.genSaltSync(10);
            dadosUsuario.SENHA_USUARIO = bcrypt.hashSync(dadosUsuario.SENHA_USUARIO, salt);

            const [results] = await pool.query(
                "INSERT INTO USUARIO SET ?", [dadosUsuario]
            );
            return results;
        } catch (error) {
            console.error("Erro ao criar usuário", error);
            throw error;
        }
    },

    // Função para encontrar um usuário pelo email
    findAllEmail: async (email) => {
        try {
            const [results] = await pool.query(
                "SELECT * FROM USUARIO WHERE EMAIL_USUARIO = ?", [email]
            );
            return results.length ? results[0] : null;
        } catch (error) {
            console.error("Erro ao buscar o email do usuário", error);
            throw error;
        }
    }
};

module.exports = psicologosModel;
