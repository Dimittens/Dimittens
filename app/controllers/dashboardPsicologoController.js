// controllers/dashboardPsicologoController.js
const pool = require('../../config/pool_de_conexao');

// Função para marcar um dia como disponível

// Função para retornar os dias disponíveis do banco de dados para o front-end
async function getDiasDisponiveis(req, res) {
    const userId = req.session.autenticado.usuarioId;
  
    try {
      const [rows] = await pool.query(
        `SELECT MES_DIAS, dias_disponiveis FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ?`,
        [userId]
      );
  
      // Mapeia o resultado para o formato necessário no frontend
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

// Função para marcar múltiplos dias como disponíveis
async function marcarDisponivel(req, res) {
    const { days, month } = req.body;
    const userId = req.session.autenticado.usuarioId;
  
    try {
      // Busca entrada para o mesmo usuário e mês
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
  
// Função para remover um dia específico da disponibilidade
async function removerDisponivel(req, res) {
    const { day, month } = req.body;
    const userId = req.session.autenticado.usuarioId;

    try {
        const [userData] = await pool.query(
            `SELECT CRP_USUARIO FROM USUARIO WHERE ID_USUARIO = ? AND DIFERENCIACAO_USUARIO = 'Psicologo'`,
            [userId]
        );
        
        const crp = userData[0]?.CRP_USUARIO;
        
        if (!crp) {
            console.log("Erro: CRP não encontrado para o psicólogo.");
            return res.status(400).json({ success: false, message: "Erro ao obter CRP do psicólogo." });
        }

        const [rows] = await pool.query(
            `SELECT dias_disponiveis FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ? AND CRP_USUARIO = ? AND MES_DIAS = ?`,
            [userId, crp, month]
        );

        if (rows.length > 0) {
            let existingDays = rows[0].dias_disponiveis.split(",");
            existingDays = existingDays.filter(d => d !== String(day));
            const updatedDays = existingDays.join(",");

            if (updatedDays) {
                await pool.query(
                    `UPDATE DASHBOARDPSICOLOGO SET dias_disponiveis = ? WHERE ID_USUARIO = ? AND CRP_USUARIO = ? AND MES_DIAS = ?`,
                    [updatedDays, userId, crp, month]
                );
            } else {
                await pool.query(
                    `DELETE FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ? AND CRP_USUARIO = ? AND MES_DIAS = ?`,
                    [userId, crp, month]
                );
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao remover dia disponível:", error);
        res.status(500).json({ success: false, message: "Erro ao remover dia disponível." });
    }
}

module.exports = {
    marcarDisponivel,
    removerDisponivel,
    getDiasDisponiveis
};
