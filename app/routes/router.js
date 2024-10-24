const express = require("express");
const router = express.Router();
const userPacientesController = require("../controllers/userPacientesController");
const userPsicologosController = require("../controllers/userPsicologosController");
const userMenorController = require("../controllers/userMenorController");
const { salvarEvento, listarEventosUsuario } = require("../controllers/calendarioController");
const { recordAuthenticatedUser, checkAuthenticatedUser } = require("../models/autenticador_middleware");

// ROTA PARA HEADER
router.get('/header', (req, res) => {
  res.render('pages/index', { pagina: "header", autenticado: null });
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

router.post('/cadastropacientes', async (req, res) => {
  try {
    if (res.headersSent) return;
    const resultadoCadastro = await userPacientesController.cadastrar(req);
    if (!resultadoCadastro || res.headersSent) return;

    if (resultadoCadastro.success) {
      return res.redirect('/');
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

// LOGIN PACIENTES
router.get('/loginpacientes', (req, res) => {
  res.render('pages/index', { pagina: "loginpacientes", autenticado: null });
});

// Carregar eventos na sessão ao fazer login
router.post('/loginpacientes', async (req, res) => {
  try {
    const resultadoLogin = await userPacientesController.logar(req);

    if (resultadoLogin && resultadoLogin.success) {
      req.session.autenticado = {
        usuarioNome: resultadoLogin.dados.NOME_USUARIO,
        usuarioId: resultadoLogin.dados.ID_USUARIO,
        tipo: resultadoLogin.dados.DIFERENCIACAO_USUARIO,
      };

      // Carregar eventos na sessão
      const eventos = await listarEventosUsuario(req.session.autenticado.usuarioId);
      req.session.eventos = eventos;

      req.session.save((err) => {
        if (err) {
          console.error("Erro ao salvar sessão:", err);
          return res.status(500).send('Erro ao salvar sessão.');
        }
        return res.redirect('/calendario');
      });
    } else {
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

// Rota para listar eventos armazenados na sessão do Express
router.get('/calendario/listar-sessao', (req, res) => {
  if (req.session.eventos) {
    return res.status(200).json(req.session.eventos);
  } else {
    return res.status(404).json({ message: "Nenhum evento encontrado." });
  }
});

// Rota para salvar evento e armazená-lo na sessão do Express
router.post("/calendario/salvar", checkAuthenticatedUser, async (req, res) => {
  try {
    const resultado = await salvarEvento(req);

    if (resultado.success) {
      // Inicializa o array de eventos na sessão, se não existir
      if (!req.session.eventos) {
        req.session.eventos = [];
      }

      // Adiciona o novo evento na sessão
      req.session.eventos.push(req.body);

      // Salva a sessão atualizada
      req.session.save((err) => {
        if (err) {
          console.error("Erro ao salvar sessão:", err);
          return res.status(500).json({ success: false, message: "Erro ao salvar sessão." });
        }
        return res.status(201).json(resultado);
      });
    } else {
      return res.status(400).json(resultado);
    }
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
    return res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
});

// Rota para editar um evento existente
router.put("/calendario/editar/:id", checkAuthenticatedUser, async (req, res) => {
  try {
    const resultado = await salvarEvento(req, true); // Chamamos a função de salvar com uma flag de edição

    if (resultado.success) {
      // Atualiza o evento na sessão
      const index = req.session.eventos.findIndex(e => e.id === parseInt(req.params.id));
      if (index !== -1) {
        req.session.eventos[index] = { ...req.body, id: parseInt(req.params.id) };
      }

      return res.status(200).json({ success: true, message: "Evento atualizado com sucesso!" });
    } else {
      return res.status(400).json(resultado);
    }
  } catch (error) {
    console.error("Erro ao editar evento:", error);
    return res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
});


// LOGIN PSICÓLOGOS
router.get('/loginpsicologos', (req, res) => {
  res.render('pages/index', { pagina: "loginpsicologos", autenticado: null });
});

router.post('/loginpsicologos', async (req, res) => {
  try {
    const resultadoLogin = await userPsicologosController.logar(req, res);
    if (resultadoLogin.success) {
      req.session.autenticado = {
        usuarioNome: resultadoLogin.dados.NOME_USUARIO,
        tipo: resultadoLogin.dados.DIFERENCIACAO_USUARIO,
      };
      return res.redirect('/homelogged');
    } else {
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

// LOGIN DEPENDENTES
router.get('/logindependentes', (req, res) => {
  res.render('pages/index', { pagina: "logindependentes", autenticado: null });
});

router.post('/logindependentes', async (req, res) => {
  try {
    const resultadoLogin = await userMenorController.logar(req, res);
    if (resultadoLogin.success) {
      req.session.autenticado = {
        usuarioNome: resultadoLogin.dados.NOME_USUARIO,
        tipo: resultadoLogin.dados.DIFERENCIACAO_USUARIO,
      };
      res.redirect('/homelogged');
    } else {
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

// HOME E LOGOUT
router.get('/', (req, res) => {
  console.log('Sessão atual:', req.session);

  const autenticado = req.session.autenticado || false;
  res.render('pages/index', {
    pagina: autenticado ? 'homelogged' : 'home',
    autenticado: req.session.autenticado,
  });
});


router.get('/homelogged', (req, res) => {
  if (req.session.autenticado) {
    res.render('pages/index', {
      pagina: "homelogged",
      autenticado: req.session.autenticado,
      usuarioNome: req.session.autenticado.usuarioNome,
    });
  } else {
    res.redirect('/loginpacientes');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir a sessão:', err);
      return res.status(500).redirect('/');
    }
    res.clearCookie('user_session'); // Limpa o cookie da sessão
    res.redirect('/');
  });
});


// ROTA PARA CALENDÁRIO E CHAT
router.get("/calendario", checkAuthenticatedUser, (req, res) => {
  res.render("pages/index", {
    pagina: "calendario",
    autenticado: req.session.autenticado,
  });
});

router.get("/chat", checkAuthenticatedUser, (req, res) => {
  res.render("pages/index", {
    pagina: "chat",
    autenticado: req.session.autenticado,
  });
});



// ROTAS ESTÁTICAS
const rotasEstaticas = [
  'headerunlogged', 'faq', 'psicologos', 'interesses', 'transtornos',
  'sobrenos', 'perfil-comunidade', 'redirecionamentosuporte', 'comunidade',
  'criarpostagem', 'criarcomunidade', 'carroseltranstornos', 'comentarios',
  'rodape', 'passoapasso', 'passoapassopsico', 'editeseuperfil', 'perfil',
  'consultas', 'atividademensal', 'popuppsicologos'
];

rotasEstaticas.forEach((pagina) => {
  router.get(`/${pagina}`, (req, res) => {
    res.render('pages/index', { pagina, autenticado: null });
  });
});

module.exports = router;
