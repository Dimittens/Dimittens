const express = require("express");
const router = express.Router();
const WebSocket = require('ws');
const userPacientesController = require("../controllers/userPacientesController");
const userPsicologosController = require("../controllers/userPsicologosController");
const userMenorController = require("../controllers/userMenorController");
const calendarioController = require("../controllers/calendarioController");
var pool = require("../../config/pool_de_conexao");
const { recordAuthenticatedUser } = require("../models/autenticador_middleware");

// ROTA PARA HEADER
router.get('/header', (req, res) => {
  res.render('pages/index', { pagina: "header", autenticado: null });
});
router.get('/', (req, res) => {
  res.render('pages/index', { pagina: "home", autenticado: null });
});
// CADASTRO PACIENTES
router.get('/cadastropacientes', (req, res) => {
  res.render('pages/index', {
    pagina: "cadastropacientes",
    autenticado: null,
    errorsList: null,
    valores: {
      username: "",
      userdate: "",
      userpassword: "",
      useremail: "",
      userdocuments: ""
    }
  });
});

router.post('/cadastropacientes', async (req, res,) => {
  try {
    // Verifique se o middleware já enviou uma resposta
    if (res.headersSent) return;

    const resultadoCadastro = await userPacientesController.cadastrar(req);

    // Verifique se o controlador já tratou tudo ou se o middleware já enviou uma resposta
    if (!resultadoCadastro || res.headersSent) return;

    if (resultadoCadastro.success) {
      return res.redirect('/homelogged');
    } else {
      return res.render('pages/index', {
        pagina: "cadastropacientes",
        autenticado: null,
        errorsList: resultadoCadastro.errors,
        valores: req.body,
      });
    }
  } catch (error) {
    console.error("Erro no cadastro de pacientes:", error);

    if (!res.headersSent) {
      return res.status(500).render('pages/index', {
        pagina: "cadastropacientes",
        autenticado: null,
        errorsList: [{ msg: "Erro no servidor." }],
        valores: req.body,
      });
    }
  }
});

// ROTA PARA LOGIN PACIENTES
router.get('/loginpacientes', (req, res) => {
  res.render('pages/index', { pagina: "loginpacientes", autenticado: null });
});

router.post('/loginpacientes', async (req, res) => {
  try {
      const resultadoLogin = await userPacientesController.logar(req);

      if (resultadoLogin && resultadoLogin.success) {
          const { dados } = resultadoLogin;

          req.session.autenticado = {
              usuarioNome: dados.NOME_USUARIO,
              usuarioId: dados.ID_USUARIO,
              tipo: dados.DIFERENCIACAO_USUARIO,
          };

          console.log("Sessão após login:", req.session.autenticado);
          return res.redirect('/homelogged'); // GARANTE QUE A EXECUÇÃO SE ENCERRA AQUI
      } else {
          console.log("Erro no login:", resultadoLogin.errors);
          return res.status(401).render('pages/index', {
              pagina: 'loginpacientes',
              errorsList: resultadoLogin.errors || [{ msg: "Erro desconhecido" }],
              autenticado: null,
          });
      }
  } catch (error) {
      console.error("Erro na rota de login:", error);
      return res.status(500).render('pages/index', {
          pagina: 'loginpacientes',
          errorsList: [{ msg: "Erro no servidor" }],
          autenticado: null,
      });
  }
});

// ROTA PARA LOGIN PSICÓLOGOS
router.get('/loginpsicologos', (req, res) => {
  res.render('pages/index', { pagina: "loginpsicologos", autenticado: null });
});

router.post('/loginpsicologos', async (req, res) => {
  try {
    const resultadoLogin = await userPsicologosController.logar(req, res);
    if (resultadoLogin.success) {
      const { NOME_USUARIO, DIFERENCIACAO_USUARIO, ID_USUARIO } = resultadoLogin.dados;

      req.session.autenticado = {
        usuarioNome: NOME_USUARIO,
        usuarioId: ID_USUARIO,
        tipo: DIFERENCIACAO_USUARIO,
      };

      console.log("Sessão após login:", req.session.autenticado);
      return res.redirect('/homelogged');
    } else {
      console.log("Erro no login:", resultadoLogin.errors);
      res.render('pages/index', {
        pagina: 'loginpsicologos',
        errorsList: resultadoLogin.errors || [{ msg: "Credenciais inválidas" }],
        autenticado: null,
      });
    }
  } catch (error) {
    console.error("Erro na rota de login:", error);
    res.status(500).render('pages/index', {
      pagina: 'loginpsicologos',
      errorsList: [{ msg: "Erro no servidor" }],
      autenticado: null,
    });
  }
});

// ROTA PARA LOGIN DEPENDENTES
router.get('/logindependentes', (req, res) => {
  res.render('pages/index', { pagina: "logindependentes", autenticado: null });
});

router.post('/logindependentes', async (req, res) => {
  try {
    const resultadoLogin = await userMenorController.logar(req, res);
    if (resultadoLogin.success) {
      const { NOME_USUARIO, DIFERENCIACAO_USUARIO } = resultadoLogin.dados;

      req.session.autenticado = {
        usuarioNome: NOME_USUARIO,
        tipo: DIFERENCIACAO_USUARIO,
      };

      console.log("Sessão após login:", req.session.autenticado);
      res.redirect('/homelogged');
    } else {
      console.log("Erro no login:", resultadoLogin.errors);
      res.render('pages/index', {
        pagina: 'logindependentes',
        errorsList: resultadoLogin.errors || [{ msg: "Credenciais inválidas" }],
        autenticado: null,
      });
    }
  } catch (error) {
    console.error("Erro na rota de login:", error);
    res.status(500).render('pages/index', {
      pagina: 'logindependentes',
      errorsList: [{ msg: "Erro no servidor" }],
      autenticado: null,
    });
  }
});

// ROTA PARA HOME LOGGED
router.get('/homelogged', (req, res) => {
  if (req.session.autenticado) {
    res.render('pages/index', {
      pagina: "homelogged",
      autenticado: req.session.autenticado,
      usuarioId: req.session.autenticado.usuarioId,
      usuarioNome: req.session.autenticado.usuarioNome,
    });
  } else {
    res.redirect('/loginpacientes');
  }
});

// ROTA PARA LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao destruir a sessão:", err);
      return res.status(500).redirect('/');
    }
    res.redirect('/');
  });
});

router.get("/calendario", checkAuthenticatedUser, (req, res) => {
  res.render("pages/index", {
      pagina: "calendario",
      autenticado: req.session.autenticado,
  });
});

// Rota para salvar o evento no calendário
router.post("/calendario/salvar", checkAuthenticatedUser, async (req, res) => {
  try {
      const resultado = await calendarioController.salvarEvento(req, res);

      if (resultado.success) {
          res.status(201).json(resultado);
      } else {
          res.status(400).json(resultado);
      }
  } catch (error) {
      console.error("Erro na rota de calendário:", error);
      res.status(500).json({
          success: false,
          message: "Erro interno do servidor.",
      });
  }
});
async function verificarPsicologo(req, res, next) {
  const usuarioId = req.session.autenticado.usuarioId;

  try {
      const [result] = await pool.query(`SELECT DIFERENCIACAO_USUARIO FROM usuario WHERE ID_USUARIO = ?`, [usuarioId]);

      if (result.length > 0 && result[0].DIFERENCIACAO_USUARIO === 'Psicologo') {
          next(); // O usuário é um psicólogo, prossegue para a rota
      } else {
          res.status(403).send("Acesso negado. Apenas psicólogos podem acessar este formulário.");
      }
  } catch (error) {
      console.error("Erro ao verificar psicólogo:", error);
      res.status(500).send("Erro ao verificar acesso.");
  }
}
router.get('/formularioconsulta', checkAuthenticatedUser,verificarPsicologo, (req, res) => {
  const psicologoId = req.session.autenticado.usuarioId; // Pega o ID do psicólogo logado
  res.render('pages/index', { pagina: "formularioconsulta", psicologoId }); // Renderiza a view com o ID do psicólogo
});
router.post('/api/agendar-consulta', checkAuthenticatedUser, verificarPsicologo, async (req, res) => {
  const usuarioId = req.session.autenticado.usuarioId; // ID do psicólogo que está criando a consulta
  const { cpfUsuario, dataHoraConsulta, preferenciasRemotas, valorConsulta, tempoConsulta } = req.body;

  try {
      // Busque o ID do usuário pelo CPF
      const [usuario] = await pool.query(`SELECT ID_USUARIO FROM usuario WHERE CPF_USUARIO = ?`, [cpfUsuario]);

      if (usuario.length === 0) {
          return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const idUsuario = usuario[0].ID_USUARIO;

      // Insira a nova consulta na tabela
      await pool.query(`
          INSERT INTO consultas (DATAHORA_CONSULTAS, STATUS_CONSULTAS, PREFERENCIAS_REMOTAS_CONSULTAS, VALOR_CONSULTA, TEMPO_CONSULTA, USUARIO_ID_USUARIO, PSICOLOGO_ID_PSICOLOGO)
          VALUES (?, 'Agendada', ?, ?, ?, ?, ?)`,
          [dataHoraConsulta, preferenciasRemotas, valorConsulta, tempoConsulta, idUsuario, usuarioId]
      );

      res.status(201).json({ message: 'Consulta agendada com sucesso!' });
  } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      res.status(500).json({ error: 'Erro ao agendar a consulta.' });
  }
});
router.post('/enviar-mensagem', async (req, res) => {
  if (!req.session.autenticado) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const { consultaId, conteudo } = req.body;
  const remetenteId = req.session.autenticado.usuarioId;

  try {
      // Verifica se o usuário tem permissão para enviar mensagem nesta consulta
      const [consulta] = await pool.query(`
          SELECT * FROM consultas 
          WHERE ID_CONSULTAS = ? 
          AND (USUARIO_ID_USUARIO = ? OR PSICOLOGO_ID_PSICOLOGO = ?)`,
          [consultaId, remetenteId, remetenteId]
      );

      if (consulta.length === 0) {
          return res.status(403).json({ 
              error: 'Você não tem permissão para enviar mensagens nesta consulta' 
          });
      }

      // Insere a mensagem no banco de dados
      const statusChat = 'online';
      const dataHoraChat = new Date();

      await pool.query(`
          INSERT INTO chat 
          (MENSAGEM_CHAT, DATA_HORA_CHAT, STATUS_CHAT, ID_CONSULTA, ID_REMETENTE) 
          VALUES (?, ?, ?, ?, ?)`,
          [conteudo, dataHoraChat, statusChat, consultaId, remetenteId]
      );

      res.status(200).json({ 
          success: true,
          message: 'Mensagem enviada com sucesso',
          data: {
              mensagem: conteudo,
              dataHora: dataHoraChat,
              remetenteId
          }
      });

  } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// Rota para carregar mensagens de uma consulta
router.get('/carregar-sessoes-chat', async (req, res) => {
  if (!req.session.autenticado) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const usuarioId = req.session.autenticado.usuarioId;

  try {
      // Consulta modificada para retornar informações corretas
      const [sessions] = await pool.query(`
          SELECT DISTINCT
              c.ID_CONSULTAS as consultaId,
              u.NOME_USUARIO as psicologoNome,
              COALESCE(
                  (SELECT MENSAGEM_CHAT 
                  FROM chat 
                  WHERE ID_CONSULTA = c.ID_CONSULTAS 
                  ORDER BY DATA_HORA_CHAT DESC 
                  LIMIT 1), 
                  'Iniciar conversa'
              ) as ultimaMensagem,
              DATE_FORMAT(c.DATAHORA_CONSULTAS, '%d/%m/%Y %H:%i') as ultimaAtualizacao
          FROM consultas c
          JOIN usuario u ON (
              CASE 
                  WHEN c.USUARIO_ID_USUARIO = ? THEN c.PSICOLOGO_ID_PSICOLOGO = u.ID_USUARIO
                  ELSE c.USUARIO_ID_USUARIO = u.ID_USUARIO
              END
          )
          WHERE 
              (c.USUARIO_ID_USUARIO = ? OR c.PSICOLOGO_ID_PSICOLOGO = ?)
              AND c.STATUS_CONSULTAS = 'Agendada'
      `, [usuarioId, usuarioId, usuarioId]);

      res.json(sessions || []);
  } catch (error) {
      console.error('Erro ao carregar sessões de chat:', error);
      res.status(500).json({ error: 'Erro ao carregar sessões de chat' });
  }
});

// Correção da inicialização do WebSocket
// 1. Primeiro, corrija a rota para sessão do chat
router.get('/sessao-chat/:consultaId', checkAuthenticatedUser, async (req, res) => {
  try {
      const consultaId = req.params.consultaId;
      const usuarioId = req.session.autenticado.usuarioId;

      // Verificar se o usuário tem acesso a esta consulta
      const [consulta] = await pool.query(`
          SELECT 
              c.*,
              u.NOME_USUARIO as nome_psicologo,
              u.ID_USUARIO as id_psicologo
          FROM consultas c
          JOIN usuario u ON u.ID_USUARIO = c.PSICOLOGO_ID_PSICOLOGO
          WHERE c.ID_CONSULTAS = ?
          AND (c.USUARIO_ID_USUARIO = ? OR c.PSICOLOGO_ID_PSICOLOGO = ?)
      `, [consultaId, usuarioId, usuarioId]);

      if (consulta.length === 0) {
          return res.status(403).json({ error: 'Acesso não autorizado a esta consulta' });
      }

      // Buscar mensagens da consulta
      const [mensagens] = await pool.query(`
          SELECT 
              c.*,
              u.NOME_USUARIO as nome_remetente
          FROM chat c
          JOIN usuario u ON u.ID_USUARIO = c.ID_REMETENTE
          WHERE c.ID_CONSULTA = ?
          ORDER BY c.DATA_HORA_CHAT ASC
      `, [consultaId]);

      // Preparar dados do psicólogo
      const dadosPsicologo = {
          id: consulta[0].id_psicologo,
          nome: consulta[0].nome_psicologo,
      };

      res.json({
          psicologo: dadosPsicologo,
          mensagens: mensagens.map(msg => ({
              id: msg.ID_CHAT,
              conteudo: msg.MENSAGEM_CHAT,
              dataCriacao: msg.DATA_HORA_CHAT,
              remetenteId: msg.ID_REMETENTE,
              nomeRemetente: msg.nome_remetente
          }))
      });

  } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      res.status(500).json({ error: 'Erro ao carregar dados da sessão' });
  }
});
function verificarAdmin(req, res, next) {
  if (req.session.autenticado && req.session.autenticado.tipo === 'Administrador') {
    return next(); // Usuário é administrador
  }
  res.status(403).send("Acesso negado. Apenas administradores podem acessar esta página.");
}
router.get('/statistics', async (req, res) => {
  try {
    // Total de consultas por status
    const consultasStats = await pool.query(`
      SELECT 
        COUNT(CASE WHEN STATUS_CONSULTAS = 'Realizada' THEN 1 END) as realizadas,
        COUNT(CASE WHEN STATUS_CONSULTAS = 'Agendada' THEN 1 END) as agendadas,
        COUNT(CASE WHEN STATUS_CONSULTAS = 'Cancelada' THEN 1 END) as canceladas,
        COUNT(*) as total
      FROM consultas
      WHERE DATAHORA_CONSULTAS >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    // Média de valor das consultas por psicólogo
    const mediaValores = await pool.query(`
      SELECT 
        p.ID_PSICOLOGO,
        u.NOME_USUARIO,
        AVG(c.VALOR_CONSULTA) as media_valor,
        COUNT(c.ID_CONSULTAS) as total_consultas
      FROM psicologo p
      JOIN usuario u ON p.ID_PSICOLOGO = u.ID_USUARIO
      JOIN consultas c ON p.ID_PSICOLOGO = c.PSICOLOGO_ID_PSICOLOGO
      GROUP BY p.ID_PSICOLOGO
    `);

    res.json({
      consultasStats: consultasStats[0],
      mediaValores
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Rota para banir/desbanir usuário
router.post('/dashboard-monitoramento/banir', checkAuthenticatedUser, verificarAdmin, async (req, res) => {
  const { idUsuario, acao } = req.body;

  try {
    const status = acao === 'banir' ? 'inativo' : 'ativo';
    await pool.query(
      `UPDATE usuario SET DIFERENCIACAO_USUARIO = ? WHERE ID_USUARIO = ?`,
      [status === 'inativo' ? 'Banido' : 'Comum', idUsuario]
    );
    res.redirect('/dashboard-monitoramento');
  } catch (error) {
    console.error("Erro ao banir/desbanir usuário:", error);
    res.status(500).send("Erro ao atualizar status do usuário.");
  }
});

// Rota para monitorar sessões e engajamento

router.get('/chat', async (req, res) => {
  if (!req.session.autenticado) {
      return res.redirect('/loginpacientes');
  }

  try {
      // Debug para verificar os dados da sessão
      console.log('Dados da sessão:', req.session.autenticado);

      // Verifica se temos o ID do usuário
      if (!req.session.autenticado.usuarioId) {
          throw new Error('ID do usuário não encontrado na sessão');
      }

      //const contacts = await Chat.getUserContacts(req.session.autenticado.usuarioId);
      //const activeConsulta = await Chat.getActiveConsulta(req.session.autenticado.usuarioId);
      const contacts = [];
      const user = req.session.autenticado; // Supondo que você tenha um usuário autenticado
      const isPsychologistOrAdmin = user && (user.tipo === 'Psicologo' || user.tipo === 'Admin');

      res.render('pages/index', {
          pagina:'chat',
          user: req.session.autenticado,
          autenticado: req.session.autenticado,
          usuarioId: req.session.autenticado.usuarioId,
          usuarioNome: req.session.autenticado.usuarioNome,
          isPsychologistOrAdmin: isPsychologistOrAdmin,
          contacts: contacts || [] // Garante que sempre teremos um array
          //activeConsulta: activeConsulta
        });
  } catch (error) {
      console.error('Erro completo:', error);
      res.render('pages/index', {
          user: req.session.autenticado,
          pagina:'chat',
          isPsychologistOrAdmin: isPsychologistOrAdmin,
          contacts: [],
          error: 'Erro ao carregar contatos'
      });
  }
});
router.get('/consultas', async (req, res) => {
  try {
    const consultas = await pool.query(`
      SELECT 
        c.*,
        u.NOME_USUARIO as nome_paciente,
        psi.NOME_USUARIO as nome_psicologo,
        psi.CRP_USUARIO
      FROM consultas c
      JOIN usuario u ON c.USUARIO_ID_USUARIO = u.ID_USUARIO
      JOIN usuario psi ON c.PSICOLOGO_ID_PSICOLOGO = psi.ID_USUARIO
      WHERE c.DATAHORA_CONSULTAS >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY c.DATAHORA_CONSULTAS DESC
    `);
    res.json(consultas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const rotasEstaticas = [
  'headerunlogged', 'faq', 'psicologos', 'interesses', 'transtornos', 
  'sobrenos', 'perfil-comunidade', 'redirecionamentosuporte', 'comunidade', 
  'criarpostagem', 'criarcomunidade', 'carroseltranstornos', 'comentarios', 
  'rodape', 'passoapasso', 'passoapassopsico', 'editeseuperfil', 'perfil', 
  'consultas', 'atividademensal', 'popuppsicologos'
];
router.get('/cadastropsicologos', (req, res) => {
  res.render('pages/index', {
    pagina: "cadastropsicologos",
    autenticado: null,
    errorsList: null,
    valores: {
      userID: "",
      username: "",
      useremail: "",
      userpassword: "",
      userdocuments: "",
      crp: "",
    }
  });
});
router.post('/cadastropsicologos', async (req, res) => {
  const resultadoCadastro = await userPsicologosController.cadastrar(req, res);
  if (resultadoCadastro.success) {
    await recordAuthenticatedUser(req, res);
  } else {
    res.render('pages/index', {
      pagina: "cadastropsicologos",
      autenticado: null,
      errorsList: resultadoCadastro.errors,
      valores: req.body
    });
  }
});


// Rota principal do dashboard
router.get('/dashboard-monitoramento', checkAuthenticatedUser, verificarAdmin, async (req, res) => {
  try {
    // Estatísticas gerais
    const stats = await getStats();
    
    // Consultas recentes
    const consultas = await getConsultasRecentes();
    
    // Denúncias recentes
    const denuncias = await getDenunciasRecentes();

    res.render('pages/index', { pagina: "dashboard-monitoramento", stats, consultas, denuncias });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    res.status(500).send('Erro ao carregar dashboard');
  }
});

// Função para obter estatísticas
async function getStats() {
  const hoje = new Date().toISOString().split('T')[0];
  
  const [stats] = await pool.query(`
    SELECT 
      COUNT(CASE WHEN DATE(DATAHORA_CONSULTAS) = ? THEN 1 END) as consultasHoje,
      COUNT(CASE WHEN STATUS_CONSULTAS = 'Realizada' THEN 1 END) * 100.0 / COUNT(*) as taxaComparecimento,
      COUNT(CASE WHEN STATUS_CONSULTAS = 'Cancelada' THEN 1 END) as consultasCanceladas,
      AVG(VALOR_CONSULTA) as mediaValorConsulta
    FROM consultas
    WHERE DATAHORA_CONSULTAS >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  `, [hoje]);

  return stats[0];
}

// Função para obter consultas recentes
async function getConsultasRecentes() {
  const [consultas] = await pool.query(`
    SELECT 
      c.*,
      u.NOME_USUARIO,
      (SELECT NOME_USUARIO FROM usuario WHERE ID_USUARIO = c.PSICOLOGO_ID_PSICOLOGO) as NOME_PSICOLOGO
    FROM consultas c
    JOIN usuario u ON c.USUARIO_ID_USUARIO = u.ID_USUARIO
    ORDER BY c.DATAHORA_CONSULTAS DESC
    LIMIT 10
  `);

  return consultas;
}

// Função para obter denúncias recentes
async function getDenunciasRecentes() {
  const [denuncias] = await pool.query(`
    SELECT 
      d.*,
      u.NOME_USUARIO as NOME_DENUNCIANTE
    FROM denuncia d
    JOIN usuario u ON d.ID_USUARIO = u.ID_USUARIO
    ORDER BY d.DATA_DENUNCIA DESC
    LIMIT 10
  `);

  return denuncias;
}

// Rota para banir usuário
router.post('/api/banir-usuario', async (req, res) => {
  const { idUsuario } = req.body;
  
  try {
    await pool.query(`
      UPDATE usuario 
      SET DIFERENCIACAO_USUARIO = 'Banido'
      WHERE ID_USUARIO = ?
    `, [idUsuario]);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao banir usuário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao banir usuário' 
    });
  }
});

rotasEstaticas.forEach((pagina) => {
  router.get(`/${pagina}`, (req, res) => {
    res.render('pages/index', { pagina, autenticado: null });
  });
});

// EXPORTANDO O ROUTER
module.exports = router;
