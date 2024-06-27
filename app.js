const express = require("express");
var session = require("express-session");
const app = express();
const router = express.Router();
const port = 3000;
const env = require('dotenv').config();

router.get("/", (req, res) => {
  res.send("Rota raiz");
});

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var rotas = require("./app/routes/router");

app.use("/", rotas);

app.use(session({ 
    secret: "leleo",
    resave: false,
    saveUninitialized: false, 
    cookie: { secure: false } 
  }));

app.listen(port, () => {
  console.log(`Servidor aberto na: ${port}\nhttp://localhost:${port}`);
});

module.exports = router;
