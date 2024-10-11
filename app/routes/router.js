var express = require("express");
var router = express.Router();
const userPacientesController = require("../controllers/userPacientesController");
const userPsicologosController = require("../controllers/userPsicologosController");
const userMenorController = require("../controllers/userMenorController");
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

router.post('/cadastropacientes', async (req, res) => {
  const resultadoCadastro = await userPacientesController.cadastrar(req, res);
  if (resultadoCadastro.success) {
    await recordAuthenticatedUser(req, res);
  } else {
    res.render('pages/index', {
      pagina: "cadastropacientes",
      autenticado: null,
      errorsList: resultadoCadastro.errors,
      valores: req.body
    });
  }
});

// ROTA PARA HEADER UNLOGGED
router.get('/headerunlogged', (req, res) => {
  res.render('pages/index', { pagina: "headerunlogged", autenticado: null });
});

// ROTA PARA PSICOLOGOS
router.get('/psicologos', (req, res) => {
  res.render('pages/index', { pagina: "psicologos", autenticado: null });
});


// ROTA PARA INTERESSES
router.get('/interesses', (req, res) => {
  res.render('pages/index', { pagina: "interesses", autenticado: null });
});

// ROTA PARA TRANSTORNOS
router.get('/transtornos', (req, res) => {
  res.render('pages/index', { pagina: "transtornos", autenticado: null });
});

// ROTA PARA SOBRE NÓS
router.get('/sobrenos', (req, res) => {
  res.render('pages/index', { pagina: "sobrenos", autenticado: null });
});

// ROTA PARA REDIRECIONAMENTO DO SUPORTE
router.get('/redirecionamentosuporte', (req, res) => {
  res.render('pages/index', { pagina: "redirecionamentosuporte", autenticado: null });
});

// ROTA PARA CRIAR POSTAGEM
router.get('/criarpostagem', (req, res) => {
  res.render('pages/index', { pagina: "criarpostagem", autenticado: null });
});

// ROTA PARA CRIAR COMUNIDADE
router.get('/criarcomunidade', (req, res) => {
  res.render('pages/index', { pagina: "criarcomunidade", autenticado: null });
});

// ROTA PARA CARROSEL DE TRANSTORNOS
router.get('/carroseltranstornos', (req, res) => {
  res.render('pages/index', { pagina: "carroseltranstornos", autenticado: null });
});

// ROTA PARA HOME LOGGED
router.get('/homelogged', (req, res) => {
  if (req.session.autenticado) {
    res.render('pages/index', {
      pagina: "homelogged",
      autenticado: req.session.autenticado,
      usuarioNome: req.session.autenticado.usuarioNome
    });
  } else {
    res.redirect('/loginpacientes');
  }
});

// ROTA PARA HOME
router.get('/', (req, res) => {
  res.render('pages/index', { pagina: "home", autenticado: null });
});

// ROTA PARA PRECISA DE AJUDA
router.get('/precisadeajuda', (req, res) => {
  res.render('pages/index', { pagina: "precisadeajuda", autenticado: null });
});

// CADASTRO MENOR
router.get('/cadastromenor', (req, res) => {
  res.render('pages/index', {
    pagina: "cadastromenor",
    autenticado: null,
    errorsList: null,
    valores: {
      username: "",
      useremail: "",
      userpassword: "",
      userdocuments: "",
      cpfResponsavel: "",
      nomeResponsavel: "",
    }
  });
});

router.post('/cadastromenor', async (req, res) => {
  const resultadoCadastro = await userMenorController.cadastrar(req, res);
  if (resultadoCadastro.success) {
    await recordAuthenticatedUser(req, res);
  } else {
    res.render('pages/index', {
      pagina: "cadastromenor",
      autenticado: null,
      errorsList: resultadoCadastro.errors,
      valores: req.body
    });
  }
});

// COMENTÁRIOS
router.get('/comentarios', (req, res) => {
  res.render('pages/index', { pagina: "comentarios", autenticado: null });
});

// RODAPÉ
router.get('/rodape', (req, res) => {
  res.render('pages/index', { pagina: "rodape", autenticado: null });
});

// CARROSEL TRANSTORNOS
router.get('/carroseltranstornos', (req, res) => {
  res.render('pages/index', { pagina: "carrosel-transtornos", autenticado: null });
});

// PASSO A PASSO
router.get('/passoapasso', (req, res) => {
  res.render('pages/index', { pagina: "passoapasso", autenticado: null });
});

// PASSO A PASSO PSICÓLOGOS
router.get('/passoapassopsico', (req, res) => {
  res.render('pages/index', { pagina: "passoapassopsico", autenticado: null });
});

// Edite seu Perfil
router.get('/editeseuperfil', (req, res) => {
  res.render('pages/index', { pagina: "editeseuperfil", autenticado: null });
});

// Perfil
router.get('/perfil', (req, res) => {
  res.render('pages/index', { pagina: "perfil", autenticado: null });
});

// Consultas
router.get('/consultas', (req, res) => {
  res.render('pages/index', { pagina: "consultas", autenticado: null });
});

// ATIVIDADE MENSAL
router.get('/atividademensal', (req, res) => {
  res.render('pages/index', { pagina: "atividademensal", autenticado: null });
});

// Calendário
router.get('/calendario', (req, res) => {
  if (req.session.autenticado) {
    res.render('pages/index', { pagina: "calendario", autenticado: req.session.autenticado });
  } else {
    res.redirect('/loginpacientes');
  }
});

// Pop-Up Psicólogos
router.get('/popuppsicologos', (req, res) => {
  res.render('pages/index', { pagina: "popuppsicologos", autenticado: null });
});

// CADASTRO PSICÓLOGOS
router.get('/cadastropsicologos', (req, res) => {
  res.render('pages/index', {
    pagina: "cadastropsicologos",
    autenticado: null,
    errorsList: null,
    valores: {
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

// LOGIN PSICÓLOGOS
router.get('/loginpsicologos', (req, res) => {
  res.render('pages/index', { pagina: "loginpsicologos", autenticado: null });
});

router.post('/loginpsicologos', async (req, res) => {
  // Chamada da função de login
  const resultadoLogin = await userPsicologosController.logar(req, res);

  // Verifique se o login foi bem-sucedido
  if (resultadoLogin.success) {
    req.session.autenticado = {
      usuarioNome: resultadoLogin.dados.NOME_USUARIO, // Captura o nome do usuário
      tipo: resultadoLogin.dados.DIFERENCIACAO_USUARIO // Adicione o tipo de usuário se disponível
    };

    res.redirect('/homelogged'); // Redireciona após o login
  } else {
    // Se não foi bem-sucedido, trate os erros
    const erros = resultadoLogin.errors; // Aqui você pode exibir as mensagens de erro
    console.log(erros); // Exibe os erros no console
    return res.render("pages/index", {
      pagina: "loginpsicologos",
      errorsList: erros || [], // Exibe erros se existirem
      autenticado: null // Isso pode ser útil para a sua lógica de front-end
    });
  }
});

// LOGIN PACIENTES
router.get('/loginpacientes', (req, res) => {
  res.render('pages/index', { pagina: "loginpacientes", autenticado: null });
});

router.post('/loginpacientes', async (req, res) => {
  const resultadoLogin = await userPacientesController.logar(req, res);

  if (resultadoLogin.success) {
    req.session.autenticado = {
      usuarioNome: resultadoLogin.dados.NOME_USUARIO,
      tipo: resultadoLogin.dados.DIFERENCIACAO_USUARIO
    };

    res.redirect('/homelogged');
  } else {
    res.render('pages/index', {
      pagina: "loginpacientes",
      autenticado: null,
      errorsList: resultadoLogin.errors || [],
    });
  }
});

// LOGIN MENOR
router.get('/logindependentes', (req, res) => {
  res.render('pages/index', { pagina: "logindependentes", autenticado: null });
});

router.post('/logindependentes', async (req, res) => {
  const resultadoLogin = await userMenorController.logar(req, res);

  if (resultadoLogin.success) {
    req.session.autenticado = {
      usuarioNome: resultadoLogin.dados.NOME_USUARIO,
      tipo: resultadoLogin.dados.DIFERENCIACAO_USUARIO
    };

    res.redirect('/homelogged');
  } else {
    res.render('pages/index', {
      pagina: "logindependentes",
      autenticado: null,
      errorsList: resultadoLogin.errors || [],
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// EXPORTANDO O ROUTER
module.exports = router;
