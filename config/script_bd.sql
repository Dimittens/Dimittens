
USE b94votm47hggreb5kvpz;

-- Table: Usuarios
CREATE TABLE IF NOT EXISTS `b94votm47hggreb5kvpz`.`USUARIO` (
  `ID_USUARIO` INT NOT NULL AUTO_INCREMENT,
  `NOME_USUARIO` VARCHAR(100) NOT NULL,
  `EMAIL_USUARIO` VARCHAR(100) NOT NULL,
  `SENHA_USUARIO` CHAR(60) NOT NULL,
  `DT_NASC_USUARIO` DATE NOT NULL,
  `DT_CRIACAO_CONTA_USUARIO` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CPF_USUARIO` VARCHAR(14) NOT NULL,
  `DIFERENCIACAO_USUARIO` ENUM('Comum', 'Menor de Idade') NOT NULL,
  `PSICOLOGO_ID_PSICOLOGO` INT NOT NULL,
  `PUBLICACAO_COMUNIDADE_ID_PUBLICACOMU` INT NOT NULL,
  `CALENDARIO_ID_CALENDARIO` INT NOT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  UNIQUE INDEX `email` (`EMAIL_USUARIO` ASC) VISIBLE,
  INDEX `fk_USUARIO_PSICOLOGO_idx` (`PSICOLOGO_ID_PSICOLOGO` ASC) VISIBLE,
  INDEX `fk_USUARIO_PUBLICACAO_COMUNIDADE1_idx` (`PUBLICACAO_COMUNIDADE_ID_PUBLICACOMU` ASC) VISIBLE,
  INDEX `fk_USUARIO_CALENDARIO1_idx` (`CALENDARIO_ID_CALENDARIO` ASC) VISIBLE,
  CONSTRAINT `fk_USUARIO_PSICOLOGO`
    FOREIGN KEY (`PSICOLOGO_ID_PSICOLOGO`)
    REFERENCES `b94votm47hggreb5kvpz`.`PSICOLOGO` (`ID_PSICOLOGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_USUARIO_PUBLICACAO_COMUNIDADE1`
    FOREIGN KEY (`PUBLICACAO_COMUNIDADE_ID_PUBLICACOMU`)
    REFERENCES `b94votm47hggreb5kvpz`.`PUBLICACAO_COMUNIDADE` (`ID_PUBLICACOMU`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_USUARIO_CALENDARIO1`
    FOREIGN KEY (`CALENDARIO_ID_CALENDARIO`)
    REFERENCES `b94votm47hggreb5kvpz`.`CALENDARIO` (`ID_CALENDARIO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- Table: Psicologos
CREATE TABLE psicologos (
  prof_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  especialidade VARCHAR(255),
  CRP_CRM VARCHAR(50),
  biografia TEXT,
  horarios_disponiveis TEXT,
  preco_consulta DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES usuarios(user_id)
);

-- Table: Consultas
CREATE TABLE consultas (
  consulta_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  prof_id INT,
  data_hora DATETIME,
  status ENUM('Agendada', 'Realizada', 'Cancelada'),
  plataforma ENUM('Video', 'Chat', 'Presencial'),
  anotacoes TEXT,
  FOREIGN KEY (user_id) REFERENCES usuarios(user_id),
  FOREIGN KEY (prof_id) REFERENCES psicologos(prof_id)
);

-- Table: Chats
CREATE TABLE chats (
  chat_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  prof_id INT,
  data_inicio DATETIME,
  data_fim DATETIME,
  mensagens ENUM('Texto', 'Audio', 'Video'),
  FOREIGN KEY (user_id) REFERENCES usuarios(user_id),
  FOREIGN KEY (prof_id) REFERENCES psicologos(prof_id)
);

-- Table: Mensagens
CREATE TABLE mensagens (
  mensagem_id INT PRIMARY KEY AUTO_INCREMENT,
  chat_id INT,
  remetente_id INT,
  conteudo TEXT,
  tipo_mensagem ENUM('Texto', 'Audio', 'Imagem'),
  data_envio DATETIME,
  FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
  FOREIGN KEY (remetente_id) REFERENCES usuarios(user_id)
);

-- Table: Postagens na Comunidade
CREATE TABLE postagens (
  post_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  conteudo TEXT,
  data_postagem DATETIME DEFAULT CURRENT_TIMESTAMP,
  likes INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES usuarios(user_id)
);

-- Table: Comentarios nas Postagens
CREATE TABLE comentarios (
  comentario_id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT,
  user_id INT,
  conteudo TEXT,
  data_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES postagens(post_id),
  FOREIGN KEY (user_id) REFERENCES usuarios(user_id)
);

-- Table: Planos
CREATE TABLE planos (
  assinatura_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  plano ENUM('Mensal', 'Trimestral', 'Semestral', 'Anual'),
  data_inicio DATE,
  data_fim DATE,
  status ENUM('Ativa', 'Inativa'),
  FOREIGN KEY (user_id) REFERENCES usuarios(user_id)
);

-- Table: Calendario
CREATE TABLE calendario (
  registro_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  data DATE,
  humor INT CHECK (humor BETWEEN 1 AND 10),
  notas TEXT,
  FOREIGN KEY (user_id) REFERENCES usuarios(user_id)
);

-- Table: Pagamentos
CREATE TABLE pagamentos (
  pagamento_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  consulta_id INT,
  valor DECIMAL(10, 2),
  data_pagamento DATE,
  metodo_pagamento ENUM('Cartao de Credito', 'Boleto', 'PayPal'),
  status ENUM('Pago', 'Pendente', 'Cancelado'),
  FOREIGN KEY (user_id) REFERENCES usuarios(user_id),
  FOREIGN KEY (consulta_id) REFERENCES consultas(consulta_id)
);
