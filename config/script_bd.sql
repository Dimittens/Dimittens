CREATE DATABASE  IF NOT EXISTS `b7nmairb8dsvar1ji739` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `b7nmairb8dsvar1ji739`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: hv-mtl2-020.clvrcld.net    Database: b7nmairb8dsvar1ji739
-- ------------------------------------------------------
-- Server version	8.0.36-28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AGENDAMENTO`
--

DROP TABLE IF EXISTS `AGENDAMENTO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AGENDAMENTO` (
  `idAGENDAMENTO` int NOT NULL AUTO_INCREMENT,
  `USUARIO_ID_USUARIO` int NOT NULL,
  `PSICOLOGO_ID_PSICOLOGO` int NOT NULL,
  PRIMARY KEY (`idAGENDAMENTO`),
  KEY `fk_AGENDAMENTO_USUARIO1_idx` (`USUARIO_ID_USUARIO`),
  KEY `fk_AGENDAMENTO_PSICOLOGO1_idx` (`PSICOLOGO_ID_PSICOLOGO`),
  CONSTRAINT `fk_AGENDAMENTO_PSICOLOGO1` FOREIGN KEY (`PSICOLOGO_ID_PSICOLOGO`) REFERENCES `PSICOLOGO` (`ID_PSICOLOGO`),
  CONSTRAINT `fk_AGENDAMENTO_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `USUARIO` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AGENDAMENTO`
--

LOCK TABLES `AGENDAMENTO` WRITE;
/*!40000 ALTER TABLE `AGENDAMENTO` DISABLE KEYS */;
/*!40000 ALTER TABLE `AGENDAMENTO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ASSINATURA`
--

DROP TABLE IF EXISTS `ASSINATURA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ASSINATURA` (
  `idASSINATURA` int NOT NULL AUTO_INCREMENT,
  `PLANOS_ID_PLANOS` int NOT NULL,
  `USUARIO_ID_USUARIO` int NOT NULL,
  PRIMARY KEY (`idASSINATURA`),
  KEY `fk_ASSINATURA_PLANOS1_idx` (`PLANOS_ID_PLANOS`),
  KEY `fk_ASSINATURA_USUARIO1_idx` (`USUARIO_ID_USUARIO`),
  CONSTRAINT `fk_ASSINATURA_PLANOS1` FOREIGN KEY (`PLANOS_ID_PLANOS`) REFERENCES `PLANOS` (`ID_PLANOS`),
  CONSTRAINT `fk_ASSINATURA_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `USUARIO` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ASSINATURA`
--

LOCK TABLES `ASSINATURA` WRITE;
/*!40000 ALTER TABLE `ASSINATURA` DISABLE KEYS */;
/*!40000 ALTER TABLE `ASSINATURA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AVALIACOES`
--

DROP TABLE IF EXISTS `AVALIACOES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AVALIACOES` (
  `ID_AVALIACOES` int NOT NULL AUTO_INCREMENT,
  `REVIEW_CONSULTA_AVALIACOES` mediumtext,
  `MEDIA_ESTRELAS_AVALIACOES` float DEFAULT NULL,
  `AVALIACAO_ESTRELAS` int DEFAULT NULL,
  `CONSULTAS_ID_CONSULTAS` int NOT NULL,
  PRIMARY KEY (`ID_AVALIACOES`),
  KEY `fk_AVALIACOES_CONSULTAS1_idx` (`CONSULTAS_ID_CONSULTAS`),
  CONSTRAINT `fk_AVALIACOES_CONSULTAS1` FOREIGN KEY (`CONSULTAS_ID_CONSULTAS`) REFERENCES `CONSULTAS` (`ID_CONSULTAS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AVALIACOES`
--

LOCK TABLES `AVALIACOES` WRITE;
/*!40000 ALTER TABLE `AVALIACOES` DISABLE KEYS */;
/*!40000 ALTER TABLE `AVALIACOES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CALENDARIO`
--

DROP TABLE IF EXISTS `CALENDARIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CALENDARIO` (
  `DATA_CALENDARIO` datetime NOT NULL,
  `ANOTACOES_CALENDARIO` mediumtext NOT NULL,
  `ID_USUARIO` int NOT NULL,
  `HORARIO_INICIO` time NOT NULL,
  `HORARIO_FIM` time NOT NULL,
  `ID_EVENTO` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ID_EVENTO`),
  KEY `fk_CALENDARIO_USUARIO` (`ID_USUARIO`),
  CONSTRAINT `fk_CALENDARIO_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `USUARIO` (`ID_USUARIO`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CALENDARIO`
--

LOCK TABLES `CALENDARIO` WRITE;
/*!40000 ALTER TABLE `CALENDARIO` DISABLE KEYS */;
INSERT INTO `CALENDARIO` VALUES ('2024-10-30 12:00:00','teste 2',53,'12:00:00','13:00:00',5),('2024-10-30 10:00:00','teste horas',53,'10:00:00','22:00:00',10),('2024-10-30 11:59:00','teste dois horas',53,'11:59:00','12:00:00',11),('2024-10-31 14:00:00','Ler livros',54,'14:00:00','15:30:00',19),('2024-10-30 14:00:00','teste scroll',53,'14:00:00','15:00:00',23),('2024-10-30 14:00:00','teste scroll',53,'14:00:00','23:00:00',24),('2024-10-30 12:00:00','teste scroll',53,'12:00:00','13:00:00',25),('2024-10-30 14:00:00','teste scroll',53,'14:00:00','14:15:00',26),('2024-10-30 22:00:00','teste',53,'22:00:00','23:00:00',28);
/*!40000 ALTER TABLE `CALENDARIO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CHAT`
--

DROP TABLE IF EXISTS `CHAT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CHAT` (
  `ID_CHAT` int NOT NULL,
  `MENSAGEM_CHAT` longtext NOT NULL,
  `DATA_HORA_CHAT` datetime NOT NULL,
  `STATUS_CHAT` enum('Online','Offline') NOT NULL,
  `MIDIA_CHAT` mediumblob,
  `DOCUMENTOS_CHAT` mediumblob,
  PRIMARY KEY (`ID_CHAT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CHAT`
--

LOCK TABLES `CHAT` WRITE;
/*!40000 ALTER TABLE `CHAT` DISABLE KEYS */;
/*!40000 ALTER TABLE `CHAT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `COMENTARIO`
--

DROP TABLE IF EXISTS `COMENTARIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COMENTARIO` (
  `ID_COMENTARIO` int NOT NULL AUTO_INCREMENT,
  `DATA_COMENTARIO` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CURTIDAS_POSITIVAS_COMENTARIO` int NOT NULL,
  `CURTIDAS_NEGATIVAS_COMENTARIO` int NOT NULL,
  `TEXTO_COMENTARIO` mediumtext NOT NULL,
  `STATUS_COMENTARIO` enum('normal','destaque','revisão') NOT NULL,
  `RESULTADO_ENQUETE` decimal(5,2) NOT NULL,
  `PUBLICACAO COMUNIDADE_ID_PUBLICACOMU` int NOT NULL,
  PRIMARY KEY (`ID_COMENTARIO`),
  KEY `fk_COMENTARIO_PUBLICACAO COMUNIDADE1_idx` (`PUBLICACAO COMUNIDADE_ID_PUBLICACOMU`),
  CONSTRAINT `fk_COMENTARIO_PUBLICACAO COMUNIDADE1` FOREIGN KEY (`PUBLICACAO COMUNIDADE_ID_PUBLICACOMU`) REFERENCES `PUBLICACAO COMUNIDADE` (`ID_PUBLICACOMU`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COMENTARIO`
--

LOCK TABLES `COMENTARIO` WRITE;
/*!40000 ALTER TABLE `COMENTARIO` DISABLE KEYS */;
/*!40000 ALTER TABLE `COMENTARIO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CONSULTAS`
--

DROP TABLE IF EXISTS `CONSULTAS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CONSULTAS` (
  `ID_CONSULTAS` int NOT NULL AUTO_INCREMENT,
  `DATAHORA_CONSULTAS` datetime NOT NULL,
  `STATUS_CONSULTAS` enum('Agendada','Realizada','Cancelada') NOT NULL,
  `PREFERENCIAS_REMOTAS_CONSULTAS` enum('Chat','Videochamada') NOT NULL,
  `ANOTACOES_CONSULTAS` mediumtext NOT NULL,
  `VALOR_CONSULTA` decimal(10,2) NOT NULL,
  `TEMPO_CONSULTA` varchar(20) NOT NULL,
  `PSICOLOGO_ID_PSICOLOGO` int NOT NULL,
  `ID_USUARIO` int NOT NULL,
  PRIMARY KEY (`ID_CONSULTAS`),
  KEY `fk_CONSULTAS_PSICOLOGO1_idx` (`PSICOLOGO_ID_PSICOLOGO`),
  KEY `fk_CONSULTA_USUARIO` (`ID_USUARIO`),
  CONSTRAINT `fk_CONSULTA_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `USUARIO` (`ID_USUARIO`),
  CONSTRAINT `fk_CONSULTAS_PSICOLOGO1` FOREIGN KEY (`PSICOLOGO_ID_PSICOLOGO`) REFERENCES `PSICOLOGO` (`ID_PSICOLOGO`),
  CONSTRAINT `fk_CONSULTAS_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `USUARIO` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CONSULTAS`
--

LOCK TABLES `CONSULTAS` WRITE;
/*!40000 ALTER TABLE `CONSULTAS` DISABLE KEYS */;
/*!40000 ALTER TABLE `CONSULTAS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DASHBOARDPSICOLOGO`
--

DROP TABLE IF EXISTS `DASHBOARDPSICOLOGO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DASHBOARDPSICOLOGO` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int DEFAULT NULL,
  `CRP_USUARIO` varchar(50) DEFAULT NULL,
  `dias_disponiveis` varchar(255) DEFAULT NULL,
  `MES_DIAS` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ID_USUARIO` (`ID_USUARIO`),
  KEY `CRP_USUARIO` (`CRP_USUARIO`),
  CONSTRAINT `DASHBOARDPSICOLOGO_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `USUARIO` (`ID_USUARIO`),
  CONSTRAINT `DASHBOARDPSICOLOGO_ibfk_2` FOREIGN KEY (`CRP_USUARIO`) REFERENCES `USUARIO` (`CRP_USUARIO`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DASHBOARDPSICOLOGO`
--

LOCK TABLES `DASHBOARDPSICOLOGO` WRITE;
/*!40000 ALTER TABLE `DASHBOARDPSICOLOGO` DISABLE KEYS */;
INSERT INTO `DASHBOARDPSICOLOGO` VALUES (49,57,NULL,'13,14,15,16,6,7,8,9',11);
/*!40000 ALTER TABLE `DASHBOARDPSICOLOGO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FORMA DE PAGAMENTO`
--

DROP TABLE IF EXISTS `FORMA DE PAGAMENTO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FORMA DE PAGAMENTO` (
  `ID_FORMAPAGTO` int NOT NULL AUTO_INCREMENT,
  `PIX_EMAIL_FORMAPAGTO` varchar(100) NOT NULL,
  `PIX_CPF_FORMAPAGTO` varchar(14) NOT NULL,
  `PIX_CHAVE_ALEATORIA_FORMAPAGTO` varbinary(32) NOT NULL,
  `PIX_CELULAR_FORMAPAGTO` varchar(14) NOT NULL,
  `TOKEN_CARTAO_FORMAPAGTO` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_FORMAPAGTO`),
  UNIQUE KEY `PIX_CPF_FORMAPAGTO_UNIQUE` (`PIX_CPF_FORMAPAGTO`),
  UNIQUE KEY `PIX_EMAIL_FORMAPAGTO_UNIQUE` (`PIX_EMAIL_FORMAPAGTO`),
  UNIQUE KEY `PIX_CHAVE_ALEATORIA_FORMAPAGTO_UNIQUE` (`PIX_CHAVE_ALEATORIA_FORMAPAGTO`),
  UNIQUE KEY `PIX_CELULAR_FORMAPAGTO_UNIQUE` (`PIX_CELULAR_FORMAPAGTO`),
  UNIQUE KEY `TOKEN_CARTAO_FORMAPAGTO_UNIQUE` (`TOKEN_CARTAO_FORMAPAGTO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FORMA DE PAGAMENTO`
--

LOCK TABLES `FORMA DE PAGAMENTO` WRITE;
/*!40000 ALTER TABLE `FORMA DE PAGAMENTO` DISABLE KEYS */;
/*!40000 ALTER TABLE `FORMA DE PAGAMENTO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PAGAMENTO_PLANOS`
--

DROP TABLE IF EXISTS `PAGAMENTO_PLANOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PAGAMENTO_PLANOS` (
  `ID_PAGAMENTOPLANOS` int NOT NULL,
  `STATUS_PAGAMENTOPLANOS` enum('Pago, Não Pago, Pendente') NOT NULL,
  `VALOR_PAGO_PAGAMENTOPLANOS` decimal(10,0) NOT NULL,
  `DATA_PAGAMENTO_PAGAMENTOPLANOS` datetime NOT NULL,
  `PLANOS_ID_PLANOS` int NOT NULL,
  `CUPOM_PLANOS` enum('usado','não usado','expirado') NOT NULL,
  `FORMA DE PAGAMENTO_ID_FORMAPAGTO` int NOT NULL,
  PRIMARY KEY (`ID_PAGAMENTOPLANOS`,`FORMA DE PAGAMENTO_ID_FORMAPAGTO`),
  KEY `fk_PAGAMENTO_PLANOS_PLANOS1_idx` (`PLANOS_ID_PLANOS`),
  KEY `fk_PAGAMENTO_PLANOS_FORMA DE PAGAMENTO1_idx` (`FORMA DE PAGAMENTO_ID_FORMAPAGTO`),
  CONSTRAINT `fk_PAGAMENTO_PLANOS_FORMA DE PAGAMENTO1` FOREIGN KEY (`FORMA DE PAGAMENTO_ID_FORMAPAGTO`) REFERENCES `FORMA DE PAGAMENTO` (`ID_FORMAPAGTO`),
  CONSTRAINT `fk_PAGAMENTO_PLANOS_PLANOS1` FOREIGN KEY (`PLANOS_ID_PLANOS`) REFERENCES `PLANOS` (`ID_PLANOS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PAGAMENTO_PLANOS`
--

LOCK TABLES `PAGAMENTO_PLANOS` WRITE;
/*!40000 ALTER TABLE `PAGAMENTO_PLANOS` DISABLE KEYS */;
/*!40000 ALTER TABLE `PAGAMENTO_PLANOS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PLANOS`
--

DROP TABLE IF EXISTS `PLANOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PLANOS` (
  `ID_PLANOS` int NOT NULL AUTO_INCREMENT,
  `PERIODOS_PLANOS` enum('Mensal','Trimestral','Semestral','Anual') NOT NULL,
  `DATA_PLANOS` datetime NOT NULL,
  `STATUS_PLANOS` enum('Ativa','Inativa') NOT NULL,
  PRIMARY KEY (`ID_PLANOS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PLANOS`
--

LOCK TABLES `PLANOS` WRITE;
/*!40000 ALTER TABLE `PLANOS` DISABLE KEYS */;
/*!40000 ALTER TABLE `PLANOS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PSICOLOGO`
--

DROP TABLE IF EXISTS `PSICOLOGO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PSICOLOGO` (
  `ID_PSICOLOGO` int NOT NULL,
  `ESPECIALIDADE_PSICOLOGO` enum('Terapia Comportamental / Modificação de Comportamento','Terapia Cognitiva / Avaliação Cognitiva','Psicoterapia Humanista / Terapia Centrada na Pessoa','Psicanálise Clássica / Psicoterapia Psicanalítica','Terapia Gestalt / Formação em Psicologia Gestalt','Psicologia do Desenvolvimento / Avaliação do Desenvolvimento Infantil','Psicologia Comunitária / Consultoria em Dinâmica de Grupo','Intervenções de Psicologia Positiva / Coaching de Vida','TCC para Transtornos de Ansiedade / TCC para Depressão','Terapia Familiar Sistêmica / Mediação Familiar','Avaliação e Intervenção no Desenvolvimento Infantil / Psicologia Educacional','Psicologia Transcultural / Consultoria Cultural','Avaliação Neuropsicológica / Reabilitação Neuropsicológica','Avaliação de Competência Legal / Consultoria em Casos Judiciais','Intervenções em Saúde Mental / Promoção de Saúde e Bem-Estar') NOT NULL,
  `PUBLICO_ALVO_PSICOLOGO` enum('Adulto','Criança','Idoso') NOT NULL,
  `BIOGRAFIA_PSICOLOGO` mediumtext NOT NULL,
  `DISPONIBILIDADE_HORARIO_PSICOLOGO` date NOT NULL,
  `VALOR_CONSULTA_PSICOLOGO` decimal(10,2) NOT NULL,
  `TOPICOS_ABRANGENTES_PSICOLOGO` varchar(200) NOT NULL,
  `ABORDAGEM_ABRANGENTE_PSICOLOGO` enum('Psicologia Comportamental','Psicologia Cognitiva','Psicologia Humanista','Psicanálise','Psicologia Gestalt','Psicologia Evolutiva','Psicologia Social','Psicologia Positiva','Terapia Cognitivo-Comportamental (TCC)','Psicologia Sistêmica','Psicologia do Desenvolvimento','Psicologia Cultural','Neuropsicologia','Psicologia Forense','Psicologia da Saúde') NOT NULL,
  `PERMISSAO_ANOTACAO_USUARIO_PSICOLOGO` enum('Autorizado, Recusado') NOT NULL,
  `TEL_PSICOLOGO` varchar(15) DEFAULT NULL,
  `ID_USUARIO` int DEFAULT NULL,
  PRIMARY KEY (`ID_PSICOLOGO`),
  KEY `FK_USUARIO` (`ID_USUARIO`),
  CONSTRAINT `FK_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `USUARIO` (`ID_USUARIO`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PSICOLOGO`
--

LOCK TABLES `PSICOLOGO` WRITE;
/*!40000 ALTER TABLE `PSICOLOGO` DISABLE KEYS */;
/*!40000 ALTER TABLE `PSICOLOGO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PUBLICACAO COMUNIDADE`
--

DROP TABLE IF EXISTS `PUBLICACAO COMUNIDADE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PUBLICACAO COMUNIDADE` (
  `ID_PUBLICACOMU` int NOT NULL AUTO_INCREMENT,
  `ARQUIVOS_DIVERSOS_PUBLICACOMU` mediumblob NOT NULL,
  `DATA_PUBLICACAO_PUBLICACOMU` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CURTIDAS_POSITIVAS_PUBLICACOMU` int NOT NULL DEFAULT '0',
  `CURTIDAS_NEGATIVAS_PUBLICACOMU` int NOT NULL DEFAULT '0',
  `TOPICOS_POSTAGEM_PUBLICACOMU` varchar(200) NOT NULL,
  `IMAGENS_POSTAGEM_PUBLICACOMU` mediumblob NOT NULL,
  `IMAGENS_COMUNIDADE_PUBLICACOMU` mediumblob NOT NULL,
  `DATA_POSTAGEM_PUBLICACOMU` datetime NOT NULL,
  `LISTA_MODIFICACOES_PUBLICACOMU` varchar(250) DEFAULT NULL,
  `NOME_COMUNIDADE_PUBLICACOMU` varchar(100) NOT NULL,
  `BIOGRAFIA_COMUNIDADE_PUBLICACOMU` mediumtext NOT NULL,
  `ABORDAGEM_COMUNIDADE_PUBLICACOMU` enum(' Psicanálise, Humanista') NOT NULL,
  `TITULO_POSTAGEM_PUBLICACOMU` varchar(100) NOT NULL,
  `COMUNIDADES_DISPONIVEIS_POSTAGEM_PUBLICACOMU` longtext NOT NULL,
  `USUARIO_ID_USUARIO` int NOT NULL,
  PRIMARY KEY (`ID_PUBLICACOMU`),
  KEY `fk_PUBLICACAO COMUNIDADE_USUARIO1_idx` (`USUARIO_ID_USUARIO`),
  CONSTRAINT `fk_PUBLICACAO COMUNIDADE_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `USUARIO` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PUBLICACAO COMUNIDADE`
--

LOCK TABLES `PUBLICACAO COMUNIDADE` WRITE;
/*!40000 ALTER TABLE `PUBLICACAO COMUNIDADE` DISABLE KEYS */;
/*!40000 ALTER TABLE `PUBLICACAO COMUNIDADE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USUARIO`
--

DROP TABLE IF EXISTS `USUARIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIO` (
  `ID_USUARIO` int NOT NULL AUTO_INCREMENT,
  `NOME_USUARIO` varchar(100) NOT NULL,
  `EMAIL_USUARIO` varchar(100) NOT NULL,
  `SENHA_USUARIO` char(60) NOT NULL,
  `DT_NASC_USUARIO` date NOT NULL,
  `DT_CRIACAO_CONTA_USUARIO` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CPF_USUARIO` varchar(14) NOT NULL,
  `DIFERENCIACAO_USUARIO` enum('Comum','Psicologo','Menor de Idade','Administrador') NOT NULL,
  `USUARIO_ADMINISTRADOR_ID_USUARIO_ADM` int DEFAULT NULL,
  `CRP_USUARIO` varchar(9) DEFAULT NULL,
  `CPF_RESPONSAVEL` varchar(14) DEFAULT NULL,
  `NOME_RESPONSAVEL` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  UNIQUE KEY `email` (`EMAIL_USUARIO`),
  UNIQUE KEY `CPF_USUARIO_UNIQUE` (`CPF_USUARIO`),
  UNIQUE KEY `CRP_USUARIO` (`CRP_USUARIO`),
  UNIQUE KEY `CPF_RESPONSAVEL` (`CPF_RESPONSAVEL`),
  KEY `fk_USUARIO_USUARIO_ADMINISTRADOR1_idx` (`USUARIO_ADMINISTRADOR_ID_USUARIO_ADM`),
  CONSTRAINT `fk_USUARIO_USUARIO_ADMINISTRADOR1` FOREIGN KEY (`USUARIO_ADMINISTRADOR_ID_USUARIO_ADM`) REFERENCES `USUARIO_ADMINISTRADOR` (`ID_USUARIO_ADM`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIO`
--

LOCK TABLES `USUARIO` WRITE;
/*!40000 ALTER TABLE `USUARIO` DISABLE KEYS */;
INSERT INTO `USUARIO` VALUES (53,'Juan Riquelme','juan@gmail.com','$2a$10$E8H8IOR3BaIw02rRhNohweZarKlgBIuvG9F8oPgxdwwvKwVzrm7VC','2001-03-02','2024-10-27 19:44:22','383.234.950-25','Comum',NULL,NULL,NULL,NULL),(54,'Fernando Oliveira','fernando@gmail.com','$2a$10$Iu5PG61ZKSWZwzEEXpvQ.O2lGXTzc20rj4KXjB7HkaVAX0TvC5Xgy','2004-12-11','2024-10-27 22:51:17','263.927.630-15','Comum',NULL,NULL,NULL,NULL),(55,'Hiago Augusto Pereira','hiago@gmail.com','$2a$10$5OzmxIUSvcldicVvcrSP7.o6sE96qevN1KbnDASiSuEFEV9FIyeyK','2006-07-09','2024-10-29 08:51:14','237.317.410-32','Comum',NULL,NULL,NULL,NULL),(56,'505.342.768-22','cat@gmail.com','$2a$10$YeV3D/BvSeCEZw2CaWoPV.eMtTyO2u00hXJ3eZlGRGpvAgKaXsEv.','2006-10-09','2024-10-29 09:00:04','505.342.768-22','Comum',NULL,NULL,NULL,NULL),(57,'Karina','karina@gmail.com','$2a$10$rzEt3kCwRIre0avWu0aYCeUjI9nZ.bXU46V.549OtzhyBg396njhu','2001-03-02','2024-10-31 19:05:31','524.861.400-77','Psicologo',NULL,'06/192150',NULL,NULL),(63,'Pedro Viana Santos','pepaooo@gmail.com','$2a$10$HGfHcCStldqxszcUpF.W/OF4KqIpTF.CkQAWSGT4Fg4VO/6C7/mU2','2000-08-01','2024-11-07 11:21:19','565.830.338-95','Psicologo',NULL,'71/824444',NULL,NULL);
/*!40000 ALTER TABLE `USUARIO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USUARIO_ADMINISTRADOR`
--

DROP TABLE IF EXISTS `USUARIO_ADMINISTRADOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIO_ADMINISTRADOR` (
  `ID_USUARIO_ADM` int NOT NULL,
  `INFORMACOES_DENUNCIAS_USUARIO_ADM` varchar(100) NOT NULL,
  `STATUS_DENUNCIAS_USUARIO_ADM` enum('pendente','resolvida','rejeitada') NOT NULL,
  `VALOR_CUPONS_USUARIO_ADM` decimal(5,2) NOT NULL,
  `STATUS_CUPONS_USUARIO_ADM` enum('ativo','inativo') NOT NULL,
  `STATUS_ASSINATURAS_CLIENTES_USUARIO_ADM` enum('Pago','Não Pago','Pendente') NOT NULL,
  `DURACAO_ASSINATURAS_CLIENTES_USUARIO_ADM` enum('semanal','mensal','anual') NOT NULL,
  `USUARIO_ID_USUARIO` int NOT NULL,
  PRIMARY KEY (`ID_USUARIO_ADM`),
  KEY `fk_USUARIO_ADMINISTRADOR_USUARIO1_idx` (`USUARIO_ID_USUARIO`),
  CONSTRAINT `fk_USUARIO_ADMINISTRADOR_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `USUARIO` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIO_ADMINISTRADOR`
--

LOCK TABLES `USUARIO_ADMINISTRADOR` WRITE;
/*!40000 ALTER TABLE `USUARIO_ADMINISTRADOR` DISABLE KEYS */;
/*!40000 ALTER TABLE `USUARIO_ADMINISTRADOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('KaGjCNBOBoVqvcbd-yo-ZRI5o14RBLBl',1730993788,'{\"cookie\":{\"originalMaxAge\":1800000,\"expires\":\"2024-11-07T15:06:16.965Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"autenticado\":{\"usuarioNome\":\"Pedro Viana Santos\",\"usuarioId\":63,\"tipo\":\"Psicologo\"}}'),('rX1693QG-n-3ecYF1MyWz26YZzgPOQQ2',1730993516,'{\"cookie\":{\"originalMaxAge\":1800000,\"expires\":\"2024-11-07T15:07:25.203Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"autenticado\":{\"usuarioNome\":\"Karina\",\"usuarioId\":57,\"tipo\":\"Psicologo\"}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'b7nmairb8dsvar1ji739'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-07 12:09:31
