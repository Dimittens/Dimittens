// controllers/PsicologoController.js
const PsicologoModel = require('../models/editarPerfilModel');

// Função para validar o número de telefone
function validarTelefone(telefone) {
  const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
  return telefoneRegex.test(telefone);
}

// Função para validar o tamanho da biografia
function validarBiografia(biografia) {
  return biografia.length <= 300;
}

const PsicologoController = {
  editarPerfil: async (req, res) => {
    const { emailpsic, tel, abordagem, especialidade, biografiapsic } = req.body;
    const idUsuario = req.session.userId; // Assumindo que o ID do usuário está na sessão

    // Validação dos campos
    if (!validarTelefone(tel)) {
      return res.status(400).json({ error: 'Número de telefone inválido. Use o formato (xx) xxxxx-xxxx' });
    }

    if (!validarBiografia(biografiapsic)) {
      return res.status(400).json({ error: 'A biografia deve ter no máximo 300 caracteres' });
    }

    const data = {
      email: emailpsic,
      telefone: tel,
      abordagem,
      especialidade,
      biografia: biografiapsic,
      idUsuario
    };

    try {
      await PsicologoModel.updateProfile(data);
      res.redirect('/perfil'); // Redireciona para a página de perfil após salvar
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }
};

module.exports = PsicologoController;