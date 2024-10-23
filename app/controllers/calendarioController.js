const pool = require("../../config/pool_de_conexao");

// Função para salvar um evento no banco de dados
exports.salvarEvento = async (req) => {
  try {
    const { data, nota, horarioInicio, horarioFim } = req.body;
    const usuarioId = req.session.autenticado.usuarioId; // ID do usuário autenticado

    const query = `
      INSERT INTO CALENDARIO (DATA_CALENDARIO, ANOTACOES_CALENDARIO, HORARIO_INICIO, HORARIO_FIM, ID_USUARIO)
      VALUES (?, ?, ?, ?, ?);
    `;

    const dataCompleta = `${data} ${horarioInicio}`; // Data e hora combinadas

    // Executa a query no banco de dados
    const [result] = await pool.query(query, [
      dataCompleta,
      nota,
      horarioInicio,
      horarioFim,
      usuarioId,
    ]);

    console.log("Evento salvo com sucesso:", result);

    return { 
      success: true, 
      message: "Evento salvo com sucesso!", 
      id: result.insertId 
    };
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
    return { 
      success: false, 
      message: "Erro ao salvar o evento." 
    };
  }
};

// Função para listar os eventos do banco de dados
exports.listarEventos = async (req, res) => {
  try {
    const usuarioId = req.session.autenticado.usuarioId; // ID do usuário autenticado

    const query = `
      SELECT 
        ID_CALENDARIO AS id, 
        DAY(DATA_CALENDARIO) AS day, 
        MONTH(DATA_CALENDARIO) AS month, 
        YEAR(DATA_CALENDARIO) AS year, 
        ANOTACOES_CALENDARIO AS note, 
        CONCAT(HORARIO_INICIO, ' - ', HORARIO_FIM) AS time
      FROM CALENDARIO
      WHERE ID_USUARIO = ?;
    `;

    const [eventos] = await pool.query(query, [usuarioId]);

    res.status(200).json(eventos); // Retorna os eventos como JSON
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    res.status(500).json({ 
      message: "Erro ao listar eventos." 
    });
  }
};
