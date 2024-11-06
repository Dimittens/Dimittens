const pool = require('../../config/pool_de_conexao');

async function getDiasDisponiveis(req, res) {
    const userId = req.session.autenticado.usuarioId;

    try {
        const [rows] = await pool.query(
            `SELECT MES_DIAS, dias_disponiveis FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ?`,
            [userId]
        );

        const diasDisponiveis = rows.map(row => ({
            mes: row.MES_DIAS,
            dias: row.dias_disponiveis ? row.dias_disponiveis.split(",").map(Number) : []
        }));

        res.json({ success: true, diasDisponiveis });
    } catch (error) {
        console.error("Erro ao buscar dias disponíveis:", error);
        res.status(500).json({ success: false, message: "Erro ao buscar dias disponíveis." });
    }
}

async function marcarDisponivel(req, res) {
    const { days, month } = req.body;
    const userId = req.session.autenticado.usuarioId;

    try {
        const [rows] = await pool.query(
            `SELECT id, dias_disponiveis FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ? AND MES_DIAS = ?`,
            [userId, month]
        );

        if (rows.length > 0) {
            let existingDays = rows[0].dias_disponiveis ? rows[0].dias_disponiveis.split(",") : [];
            const updatedDays = [...new Set([...existingDays, ...days])].join(",");

            await pool.query(
                `UPDATE DASHBOARDPSICOLOGO SET dias_disponiveis = ? WHERE id = ?`,
                [updatedDays, rows[0].id]
            );
            console.log(`Dias ${days.join(", ")} adicionados aos dias disponíveis para o usuário ${userId} no mês ${month}.`);
        } else {
            await pool.query(
                `INSERT INTO DASHBOARDPSICOLOGO (ID_USUARIO, MES_DIAS, dias_disponiveis) VALUES (?, ?, ?)`,
                [userId, month, days.join(",")]
            );
            console.log(`Novo registro criado para o usuário ${userId} com os dias ${days.join(", ")} no mês ${month}.`);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao marcar dias disponíveis:", error);
        res.status(500).json({ success: false, message: "Erro ao marcar dias disponíveis." });
    }
}

// Controller - Função para remover dias específicos
async function removerDisponiveis(req, res) {
  const { days, month } = req.body;
  const userId = req.session.autenticado.usuarioId;

  try {
    // Busca os dias existentes para o mês
    const [rows] = await pool.query(
      `SELECT dias_disponiveis FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ? AND MES_DIAS = ?`,
      [userId, month]
    );

    if (rows.length > 0) {
      let existingDays = rows[0].dias_disponiveis.split(",").map(Number);

      // Remove os dias selecionados
      existingDays = existingDays.filter(d => !days.includes(d));

      const updatedDays = existingDays.join(","); // Recria a lista de dias restantes

      // Atualiza a coluna ou apaga o registro se não restar nenhum dia
      if (updatedDays) {
        await pool.query(
          `UPDATE DASHBOARDPSICOLOGO SET dias_disponiveis = ? WHERE ID_USUARIO = ? AND MES_DIAS = ?`,
          [updatedDays, userId, month]
        );
      } else {
        await pool.query(
          `DELETE FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ? AND MES_DIAS = ?`,
          [userId, month]
        );
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover dias disponíveis:", error);
    res.status(500).json({ success: false, message: "Erro ao remover dias disponíveis." });
  }
}
module.exports = {
    marcarDisponivel,
    removerDisponiveis,
    getDiasDisponiveis
};
