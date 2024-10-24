const pool = require("../../config/pool_de_conexao");

// Função para salvar evento no banco de dados
exports.salvarEvento = async (req, isEdit = false) => {
  try {
    const { day, month, year, nota, horarioInicio, horarioFim } = req.body;
    const usuarioId = req.session.autenticado.usuarioId;
    const dataCompleta = `${year}-${month}-${day} ${horarioInicio}`;

    let query;
    let params;

    if (isEdit) {
      const { id } = req.params; // ID do evento a ser editado
      query = `
        UPDATE CALENDARIO 
        SET DATA_CALENDARIO = ?, 
            ANOTACOES_CALENDARIO = ?, 
            HORARIO_INICIO = ?, 
            HORARIO_FIM = ?
        WHERE ID_CALENDARIO = ? AND ID_USUARIO = ?;
      `;
      params = [dataCompleta, nota, horarioInicio, horarioFim, id, usuarioId];
    } else {
      query = `
        INSERT INTO CALENDARIO (DATA_CALENDARIO, ANOTACOES_CALENDARIO, HORARIO_INICIO, HORARIO_FIM, ID_USUARIO)
        VALUES (?, ?, ?, ?, ?);
      `;
      params = [dataCompleta, nota, horarioInicio, horarioFim, usuarioId];
    }

    await pool.query(query, params);
    return { success: true, message: isEdit ? "Evento atualizado com sucesso!" : "Evento salvo com sucesso!" };
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
    return { success: false, message: "Erro ao salvar evento." };
  }
};

// Função para listar eventos do usuário autenticado
exports.listarEventosUsuario = async (usuarioId) => {
  try {
    const query = `
      SELECT 
        DAY(DATA_CALENDARIO) AS day, 
        MONTH(DATA_CALENDARIO) AS month, 
        YEAR(DATA_CALENDARIO) AS year, 
        ANOTACOES_CALENDARIO AS nota, 
        HORARIO_INICIO AS horarioInicio, 
        HORARIO_FIM AS horarioFim
      FROM CALENDARIO 
      WHERE ID_USUARIO = ?;
    `;
    const [eventos] = await pool.query(query, [usuarioId]);
    return eventos;
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    return [];
  }
};
