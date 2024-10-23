const express = require("express");
const router = express.Router();
const userPacientesController = require("../controllers/userPacientesController");
const userPsicologosController = require("../controllers/userPsicologosController");
const userMenorController = require("../controllers/userMenorController");
const { salvarEvento } = require("../controllers/calendarioController");
const { recordAuthenticatedUser } = require("../models/autenticador_middleware");


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
      const { NOME_USUARIO, DIFERENCIACAO_USUARIO } = resultadoLogin.dados;

      req.session.autenticado = {
        usuarioNome: NOME_USUARIO,
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

// ROTA PARA HOME
router.get('/', (req, res) => {
  res.render('pages/index', { pagina: "home", autenticado: null });
});


// ROTA PARA HOME LOGGED
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

router.get("/chat", checkAuthenticatedUser, (req, res) => {
  res.render("pages/index", {
      pagina: "chat",
      autenticado: req.session.autenticado,
  });
});

// Rota para salvar o evento no calendário
router.post("/calendario/salvar", checkAuthenticatedUser, async (req, res) => {
  try {
      const resultado = await salvarEvento(req);

      if (resultado.success) {
          return res.status(201).json(resultado);  // Finaliza com 'return'
      } else {
          return res.status(400).json(resultado);  // Finaliza com 'return'
      }
  } catch (error) {
      console.error("Erro na rota de calendário:", error);

      if (!res.headersSent) {
          return res.status(500).json({
              success: false,
              message: "Erro interno do servidor.",
          });
      }
  }
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

// EXPORTANDO O ROUTER
module.exports = router;
