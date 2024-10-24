-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: terau
-- ------------------------------------------------------
-- Server version	8.0.35

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
-- Table structure for table `agendamento`
--

DROP TABLE IF EXISTS `agendamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agendamento` (
  `idAGENDAMENTO` int NOT NULL AUTO_INCREMENT,
  `USUARIO_ID_USUARIO` int NOT NULL,
  `PSICOLOGO_ID_PSICOLOGO` int NOT NULL,
  PRIMARY KEY (`idAGENDAMENTO`),
  KEY `fk_AGENDAMENTO_USUARIO1_idx` (`USUARIO_ID_USUARIO`),
  KEY `fk_AGENDAMENTO_PSICOLOGO1_idx` (`PSICOLOGO_ID_PSICOLOGO`),
  CONSTRAINT `fk_AGENDAMENTO_PSICOLOGO1` FOREIGN KEY (`PSICOLOGO_ID_PSICOLOGO`) REFERENCES `psicologo` (`ID_PSICOLOGO`),
  CONSTRAINT `fk_AGENDAMENTO_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agendamento`
--

LOCK TABLES `agendamento` WRITE;
/*!40000 ALTER TABLE `agendamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `agendamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assinatura`
--

DROP TABLE IF EXISTS `assinatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assinatura` (
  `idASSINATURA` int NOT NULL AUTO_INCREMENT,
  `PLANOS_ID_PLANOS` int NOT NULL,
  `USUARIO_ID_USUARIO` int NOT NULL,
  PRIMARY KEY (`idASSINATURA`),
  KEY `fk_ASSINATURA_PLANOS1_idx` (`PLANOS_ID_PLANOS`),
  KEY `fk_ASSINATURA_USUARIO1_idx` (`USUARIO_ID_USUARIO`),
  CONSTRAINT `fk_ASSINATURA_PLANOS1` FOREIGN KEY (`PLANOS_ID_PLANOS`) REFERENCES `planos` (`ID_PLANOS`),
  CONSTRAINT `fk_ASSINATURA_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assinatura`
--

LOCK TABLES `assinatura` WRITE;
/*!40000 ALTER TABLE `assinatura` DISABLE KEYS */;
/*!40000 ALTER TABLE `assinatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacoes`
--

DROP TABLE IF EXISTS `avaliacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacoes` (
  `ID_AVALIACOES` int NOT NULL AUTO_INCREMENT,
  `REVIEW_CONSULTA_AVALIACOES` mediumtext,
  `MEDIA_ESTRELAS_AVALIACOES` float DEFAULT NULL,
  `AVALIACAO_ESTRELAS` int DEFAULT NULL,
  `CONSULTAS_ID_CONSULTAS` int NOT NULL,
  PRIMARY KEY (`ID_AVALIACOES`),
  KEY `fk_AVALIACOES_CONSULTAS1_idx` (`CONSULTAS_ID_CONSULTAS`),
  CONSTRAINT `fk_AVALIACOES_CONSULTAS1` FOREIGN KEY (`CONSULTAS_ID_CONSULTAS`) REFERENCES `consultas` (`ID_CONSULTAS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacoes`
--

LOCK TABLES `avaliacoes` WRITE;
/*!40000 ALTER TABLE `avaliacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendario`
--

DROP TABLE IF EXISTS `calendario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendario` (
  `ID_CALENDARIO` int NOT NULL AUTO_INCREMENT,
  `DATA_CALENDARIO` datetime NOT NULL,
  `ANOTACOES_CALENDARIO` mediumtext NOT NULL,
  `PSICOLOGO_ID_PSICOLOGO` int NOT NULL,
  `USUARIO_ID_USUARIO` int NOT NULL,
  PRIMARY KEY (`ID_CALENDARIO`),
  KEY `fk_CALENDARIO_PSICOLOGO1_idx` (`PSICOLOGO_ID_PSICOLOGO`),
  KEY `fk_CALENDARIO_USUARIO1_idx` (`USUARIO_ID_USUARIO`),
  CONSTRAINT `fk_CALENDARIO_PSICOLOGO1` FOREIGN KEY (`PSICOLOGO_ID_PSICOLOGO`) REFERENCES `psicologo` (`ID_PSICOLOGO`),
  CONSTRAINT `fk_CALENDARIO_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendario`
--

LOCK TABLES `calendario` WRITE;
/*!40000 ALTER TABLE `calendario` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `id_chat` int NOT NULL AUTO_INCREMENT,
  `MENSAGEM_CHAT` longtext NOT NULL,
  `DATA_HORA_CHAT` datetime NOT NULL,
  `STATUS_CHAT` enum('Online','Offline') NOT NULL,
  `MIDIA_CHAT` mediumblob,
  `DOCUMENTOS_CHAT` mediumblob,
  `ID_CONSULTA` int DEFAULT NULL,
  `ID_REMETENTE` int DEFAULT NULL,
  PRIMARY KEY (`id_chat`),
  KEY `ID_CONSULTA` (`ID_CONSULTA`),
  KEY `ID_REMETENTE` (`ID_REMETENTE`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`ID_CONSULTA`) REFERENCES `consultas` (`ID_CONSULTAS`),
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`ID_REMETENTE`) REFERENCES `usuario` (`ID_USUARIO`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,'teste','2024-10-23 04:43:53','Online',NULL,NULL,NULL,NULL),(2,'teste2','2024-10-23 04:49:25','Online',NULL,NULL,NULL,NULL),(3,'enviando um teste','2024-10-23 12:39:48','Online',NULL,NULL,2,7),(4,'teste enviado','2024-10-23 12:42:07','Online',NULL,NULL,2,7),(5,'um unico teste','2024-10-23 12:42:54','Online',NULL,NULL,2,7),(6,'outro teste','2024-10-23 13:24:03','Online',NULL,NULL,2,7),(7,'pq não funciona','2024-10-23 13:24:43','Online',NULL,NULL,2,7),(8,'teste','2024-10-23 13:32:53','Online',NULL,NULL,2,7),(9,'hahaha','2024-10-23 13:32:57','Online',NULL,NULL,2,7),(10,'de fato','2024-10-23 13:33:19','Online',NULL,NULL,2,3),(11,'hahahah','2024-10-23 13:33:22','Online',NULL,NULL,2,3),(12,'ddd','2024-10-23 13:33:26','Online',NULL,NULL,2,3),(13,'r','2024-10-23 14:06:28','Online',NULL,NULL,2,7),(14,'teste','2024-10-23 16:50:21','Online',NULL,NULL,2,3),(15,'novamente','2024-10-23 16:50:57','Online',NULL,NULL,2,3),(16,'envie','2024-10-23 17:01:00','Online',NULL,NULL,2,3),(17,'mais uamv','2024-10-23 17:06:25','Online',NULL,NULL,2,7),(18,'testando','2024-10-23 17:07:46','Online',NULL,NULL,2,3),(19,'teste','2024-10-23 17:22:21','Online',NULL,NULL,2,7),(20,'teste','2024-10-23 18:11:44','Online',NULL,NULL,2,7),(21,'teste','2024-10-23 18:11:51','Online',NULL,NULL,2,3),(22,'um teste','2024-10-23 19:58:52','Online',NULL,NULL,2,3),(23,'somente um teste','2024-10-23 19:59:23','Online',NULL,NULL,2,3),(24,'teste','2024-10-23 19:59:34','Online',NULL,NULL,2,3),(25,'mais um teste','2024-10-23 19:59:42','Online',NULL,NULL,2,7),(26,'teste','2024-10-23 20:00:54','Online',NULL,NULL,2,7),(27,'hm..','2024-10-23 20:02:02','Online',NULL,NULL,2,3),(28,'teste','2024-10-23 20:03:45','Online',NULL,NULL,2,3),(29,'teste','2024-10-23 22:02:14','Online',NULL,NULL,2,7),(30,'teste','2024-10-23 22:02:45','Online',NULL,NULL,2,7),(31,'dssdsd','2024-10-23 22:02:47','Online',NULL,NULL,2,7),(32,'teste','2024-10-23 22:03:19','Online',NULL,NULL,2,7),(33,'teste','2024-10-23 22:10:53','Online',NULL,NULL,2,7),(34,'caralho','2024-10-23 22:10:57','Online',NULL,NULL,2,7),(35,'teste','2024-10-23 22:15:21','Online',NULL,NULL,2,7),(36,'ddd','2024-10-23 22:15:47','Online',NULL,NULL,2,7),(37,'ddddd','2024-10-23 22:15:56','Online',NULL,NULL,2,7),(38,'test','2024-10-23 22:16:05','Online',NULL,NULL,2,7),(39,'test','2024-10-23 22:18:38','Online',NULL,NULL,2,7),(40,'vemk','2024-10-23 22:18:56','Online',NULL,NULL,2,3),(41,'teste','2024-10-23 22:23:27','Online',NULL,NULL,2,7),(42,'deu certo não kkkk','2024-10-23 22:23:57','Online',NULL,NULL,2,3),(43,'vk','2024-10-23 22:26:22','Online',NULL,NULL,2,7),(44,'hahahaha porra','2024-10-23 22:26:35','Online',NULL,NULL,2,3),(45,'v','2024-10-23 22:26:55','Online',NULL,NULL,2,7),(46,'teste','2024-10-23 22:28:14','Online',NULL,NULL,2,7),(47,'mais uma vez','2024-10-23 22:28:22','Online',NULL,NULL,2,3),(48,'zoado isso','2024-10-23 22:39:13','Online',NULL,NULL,2,7),(49,'verdade','2024-10-23 22:39:20','Online',NULL,NULL,2,3),(50,'queria ver isso','2024-10-23 22:40:53','Online',NULL,NULL,2,7),(51,'provavelmente e sse navegador','2024-10-23 22:41:05','Online',NULL,NULL,2,3),(52,'essa merda','2024-10-23 22:41:58','Online',NULL,NULL,2,3),(53,'não faz sentido','2024-10-23 22:42:05','Online',NULL,NULL,2,7),(54,'vamos ver agora','2024-10-23 22:43:23','Online',NULL,NULL,2,3),(55,'hum...','2024-10-23 22:43:29','Online',NULL,NULL,2,7),(56,'essa merda não exibe dinamicamente nao sei pq','2024-10-23 22:43:52','Online',NULL,NULL,2,7),(57,'vamos ver agora','2024-10-23 22:47:48','Online',NULL,NULL,2,7),(58,'não exibe kkkk','2024-10-23 22:47:58','Online',NULL,NULL,2,3),(59,'ddd','2024-10-23 22:48:34','Online',NULL,NULL,2,3),(60,'fff','2024-10-23 22:52:28','Online',NULL,NULL,2,3),(61,'ss','2024-10-23 22:53:51','Online',NULL,NULL,2,3),(62,'ddd','2024-10-23 22:53:55','Online',NULL,NULL,2,7),(63,'aa','2024-10-23 22:54:02','Online',NULL,NULL,2,7),(64,'teste','2024-10-23 22:59:30','Online',NULL,NULL,2,7),(65,'teste','2024-10-23 22:59:49','Online',NULL,NULL,2,3),(66,'teste','2024-10-23 23:00:33','Online',NULL,NULL,2,7),(67,'teste','2024-10-23 23:00:39','Online',NULL,NULL,2,3),(68,'sss','2024-10-23 23:00:45','Online',NULL,NULL,2,7),(69,'haha','2024-10-23 23:00:52','Online',NULL,NULL,2,3),(70,'teste','2024-10-23 23:01:36','Online',NULL,NULL,2,3),(71,'fff','2024-10-23 23:01:41','Online',NULL,NULL,2,7),(72,'teste','2024-10-23 23:01:54','Online',NULL,NULL,2,7),(73,'ddd','2024-10-23 23:08:32','Online',NULL,NULL,2,3),(74,'aaa','2024-10-23 23:08:38','Online',NULL,NULL,2,7),(75,'boa','2024-10-23 23:15:48','Online',NULL,NULL,2,7),(76,'gostei','2024-10-23 23:15:58','Online',NULL,NULL,2,3),(77,'interessante','2024-10-23 23:16:25','Online',NULL,NULL,2,7),(78,'verdade','2024-10-23 23:16:32','Online',NULL,NULL,2,3),(79,'teste','2024-10-23 23:35:22','Online',NULL,NULL,2,3),(80,'ola','2024-10-24 03:31:56','Online',NULL,NULL,2,7),(81,'oi','2024-10-24 03:32:02','Online',NULL,NULL,2,3),(82,'teste','2024-10-24 05:02:44','Online',NULL,NULL,4,7),(83,'teste','2024-10-24 05:18:33','Online',NULL,_binary '1729757900992-161191253-IMG-20230322-WA0003.jpg',4,7);
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentario` (
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
  CONSTRAINT `fk_COMENTARIO_PUBLICACAO COMUNIDADE1` FOREIGN KEY (`PUBLICACAO COMUNIDADE_ID_PUBLICACOMU`) REFERENCES `publicacao comunidade` (`ID_PUBLICACOMU`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentario`
--

LOCK TABLES `comentario` WRITE;
/*!40000 ALTER TABLE `comentario` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultas`
--

DROP TABLE IF EXISTS `consultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas` (
  `ID_CONSULTAS` int NOT NULL AUTO_INCREMENT,
  `DATAHORA_CONSULTAS` datetime NOT NULL,
  `STATUS_CONSULTAS` enum('Agendada','Realizada','Cancelada') NOT NULL,
  `PREFERENCIAS_REMOTAS_CONSULTAS` enum('Chat','Videochamada') NOT NULL,
  `ANOTACOES_CONSULTAS` mediumtext NOT NULL,
  `VALOR_CONSULTA` decimal(10,2) NOT NULL,
  `TEMPO_CONSULTA` varchar(20) NOT NULL,
  `USUARIO_ID_USUARIO` int NOT NULL,
  `PSICOLOGO_ID_PSICOLOGO` int NOT NULL,
  PRIMARY KEY (`ID_CONSULTAS`),
  KEY `fk_CONSULTAS_USUARIO1_idx` (`USUARIO_ID_USUARIO`),
  KEY `fk_CONSULTAS_PSICOLOGO1_idx` (`PSICOLOGO_ID_PSICOLOGO`),
  CONSTRAINT `fk_CONSULTAS_PSICOLOGO1` FOREIGN KEY (`PSICOLOGO_ID_PSICOLOGO`) REFERENCES `psicologo` (`ID_PSICOLOGO`),
  CONSTRAINT `fk_CONSULTAS_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultas`
--

LOCK TABLES `consultas` WRITE;
/*!40000 ALTER TABLE `consultas` DISABLE KEYS */;
INSERT INTO `consultas` VALUES (2,'2024-11-24 07:28:00','Agendada','Chat','Somente um teste',100.00,'60',3,7),(4,'2024-11-25 20:00:00','Agendada','Chat','',2000.00,'32',6,7);
/*!40000 ALTER TABLE `consultas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denuncia`
--

DROP TABLE IF EXISTS `denuncia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denuncia` (
  `ID_DENUNCIA` int NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int DEFAULT NULL,
  `NOME_DENUNCIADO` varchar(100) NOT NULL,
  `TEXTO_DENUNCIA` text NOT NULL,
  `NOME_DENUNCIANTE` varchar(100) NOT NULL,
  `DATA_DENUNCIA` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_DENUNCIA`),
  KEY `ID_USUARIO` (`ID_USUARIO`),
  CONSTRAINT `denuncia_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denuncia`
--

LOCK TABLES `denuncia` WRITE;
/*!40000 ALTER TABLE `denuncia` DISABLE KEYS */;
INSERT INTO `denuncia` VALUES (1,3,'Carlos Roberto','teste','{{ nome_usuario }}','2024-10-23 04:58:43'),(2,3,'tester','um teste npro banido','CarlosRoGuerra!','2024-10-23 05:13:57');
/*!40000 ALTER TABLE `denuncia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forma de pagamento`
--

DROP TABLE IF EXISTS `forma de pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forma de pagamento` (
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
-- Dumping data for table `forma de pagamento`
--

LOCK TABLES `forma de pagamento` WRITE;
/*!40000 ALTER TABLE `forma de pagamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `forma de pagamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagamento_planos`
--

DROP TABLE IF EXISTS `pagamento_planos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamento_planos` (
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
  CONSTRAINT `fk_PAGAMENTO_PLANOS_FORMA DE PAGAMENTO1` FOREIGN KEY (`FORMA DE PAGAMENTO_ID_FORMAPAGTO`) REFERENCES `forma de pagamento` (`ID_FORMAPAGTO`),
  CONSTRAINT `fk_PAGAMENTO_PLANOS_PLANOS1` FOREIGN KEY (`PLANOS_ID_PLANOS`) REFERENCES `planos` (`ID_PLANOS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamento_planos`
--

LOCK TABLES `pagamento_planos` WRITE;
/*!40000 ALTER TABLE `pagamento_planos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagamento_planos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planos`
--

DROP TABLE IF EXISTS `planos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planos` (
  `ID_PLANOS` int NOT NULL AUTO_INCREMENT,
  `PERIODOS_PLANOS` enum('Mensal','Trimestral','Semestral','Anual') NOT NULL,
  `DATA_PLANOS` datetime NOT NULL,
  `STATUS_PLANOS` enum('Ativa','Inativa') NOT NULL,
  PRIMARY KEY (`ID_PLANOS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planos`
--

LOCK TABLES `planos` WRITE;
/*!40000 ALTER TABLE `planos` DISABLE KEYS */;
/*!40000 ALTER TABLE `planos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `psicologo`
--

DROP TABLE IF EXISTS `psicologo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psicologo` (
  `ID_PSICOLOGO` int NOT NULL,
  `ESPECIALIDADE_PSICOLOGO` varchar(100) NOT NULL,
  `PUBLICO_ALVO_PSICOLOGO` enum('Adulto','Criança','Idoso') NOT NULL,
  `BIOGRAFIA_PSICOLOGO` mediumtext NOT NULL,
  `DISPONIBILIDADE_HORARIO_PSICOLOGO` date NOT NULL,
  `VALOR_CONSULTA_PSICOLOGO` decimal(10,2) NOT NULL,
  `TOPICOS_ABRANGENTES_PSICOLOGO` varchar(200) NOT NULL,
  `ABORDAGEM_ABRANGENTE_PSICOLOGO` enum('Psicanálise','Humanista','Comportamental') DEFAULT NULL,
  `PERMISSAO_ANOTACAO_USUARIO_PSICOLOGO` enum('Autorizado','Recusado') DEFAULT NULL,
  PRIMARY KEY (`ID_PSICOLOGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `psicologo`
--

LOCK TABLES `psicologo` WRITE;
/*!40000 ALTER TABLE `psicologo` DISABLE KEYS */;
INSERT INTO `psicologo` VALUES (7,'Psicologia Clínica','Adulto','Psicólogo com 5 anos de experiência em terapia cognitivo-comportamental.','2024-10-23',150.00,'Ansiedade, Depressão, Terapia de Casal','Psicanálise','Autorizado');
/*!40000 ALTER TABLE `psicologo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicacao comunidade`
--

DROP TABLE IF EXISTS `publicacao comunidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicacao comunidade` (
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
  CONSTRAINT `fk_PUBLICACAO COMUNIDADE_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicacao comunidade`
--

LOCK TABLES `publicacao comunidade` WRITE;
/*!40000 ALTER TABLE `publicacao comunidade` DISABLE KEYS */;
/*!40000 ALTER TABLE `publicacao comunidade` ENABLE KEYS */;
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
INSERT INTO `sessions` VALUES ('eCe1s1e8RGJptL0WTCaECYhOpQCBIQOA',1729838709,'{\"cookie\":{\"originalMaxAge\":86399999,\"expires\":\"2024-10-25T01:39:58.009Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"autenticado\":{\"usuarioNome\":\"CarlosRoGuerra\",\"usuarioId\":3,\"tipo\":\"Administrador\"},\"user\":{\"userNome\":\"testepsi\",\"tipo\":\"Psicologo\"}}'),('elWjEgi25Gc-2kYHanucF2iQSUQpJPJI',1729844318,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2024-10-25T01:40:16.807Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"autenticado\":{\"usuarioNome\":\"testepsi\",\"usuarioId\":7,\"tipo\":\"Psicologo\"},\"user\":{\"userNome\":\"testepsi\",\"tipo\":\"Psicologo\"}}'),('hu0RQvStavAS_Lh9w3JCqOyohTMMf8IX',1729822672,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2024-10-25T02:17:49.203Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"autenticado\":{\"usuarioNome\":\"tester22\",\"usuarioId\":6,\"tipo\":\"Comum\"}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `ID_USUARIO` int NOT NULL AUTO_INCREMENT,
  `NOME_USUARIO` varchar(100) NOT NULL,
  `EMAIL_USUARIO` varchar(100) NOT NULL,
  `SENHA_USUARIO` char(60) NOT NULL,
  `DT_NASC_USUARIO` date NOT NULL,
  `DT_CRIACAO_CONTA_USUARIO` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CPF_USUARIO` varchar(14) NOT NULL,
  `CRP_USUARIO` varchar(9) DEFAULT NULL,
  `DIFERENCIACAO_USUARIO` enum('Comum','Psicologo','Menor de Idade','Administrador','Banido') DEFAULT NULL,
  `USUARIO_ADMINISTRADOR_ID_USUARIO_ADM` int DEFAULT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  UNIQUE KEY `email` (`EMAIL_USUARIO`),
  UNIQUE KEY `CPF_USUARIO_UNIQUE` (`CPF_USUARIO`),
  UNIQUE KEY `CRP_USUARIO` (`CRP_USUARIO`),
  KEY `fk_USUARIO_USUARIO_ADMINISTRADOR1_idx` (`USUARIO_ADMINISTRADOR_ID_USUARIO_ADM`),
  CONSTRAINT `fk_USUARIO_USUARIO_ADMINISTRADOR1` FOREIGN KEY (`USUARIO_ADMINISTRADOR_ID_USUARIO_ADM`) REFERENCES `usuario_administrador` (`ID_USUARIO_ADM`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (3,'CarlosRoGuerra','crrobg@gmail.com','$2a$10$vqT4A8P94fQjza9hlhfAEeqgQmDOMpLsj/I0vMHrUYnfjlYaeN1Q6','1992-02-23','2024-10-22 21:09:34','159.648.027-02',NULL,'Banido',NULL),(4,'tester','teste@teste.com','$2a$10$oa6ukObE8bls4sC2hLyuT.xXgpaKzW7oobIKUYX27frQRj6MCI1DO','1992-02-23','2024-10-22 21:23:49','159.648.028-01',NULL,'Banido',NULL),(5,'tester212','tester2@gtester.com','$2a$10$FHi31uymgpCAxqk.a53DYubUS1fr/aEDD9hPGI38c4We.aNfsf4vy','1992-02-23','2024-10-22 22:31:50','159.647.024-05',NULL,'Comum',NULL),(6,'tester22','tester@testerd.com','$2a$10$HbAv.ArlWfn.kenSetGMEOyPp/vaeUE4VZcKSavVgQ/aQ9b16Gw6.','1992-02-23','2024-10-22 22:37:49','158.975.256-47',NULL,'Comum',NULL),(7,'testepsi','testerpsi@teste.com','$2a$10$WR5Plawzv6i8wm9VAbd.ee2aRs3SAabKy4WafCYIWkqvhAhK0EpX2','1992-02-23','2024-10-23 03:16:25','123.456.789-09','12/345','Psicologo',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_administrador`
--

DROP TABLE IF EXISTS `usuario_administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_administrador` (
  `ID_USUARIO_ADM` int NOT NULL,
  `INFORMACOES_DENUNCIAS_USUARIO_ADM` varchar(100) NOT NULL,
  `STATUS_DENUNCIAS_USUARIO_ADM` enum('pendente','resolvida','rejeitada') NOT NULL,
  `VALOR_CUPONS_USUARIO_ADM` decimal(5,2) NOT NULL,
  `STATUS_CUPONS_USUARIO_ADM` enum('ativo','inativo') NOT NULL,
  `STATUS_ASSINATURAS_CLIENTES_USUARIO_ADM` enum('Pago','Não Pago','Pendente') NOT NULL,
  `DURACAO_ASSINATURAS_CLIENTES_USUARIO_ADM` enum('semanal','mensal','anual') NOT NULL,
  `USUARIO_ID_USUARIO` int NOT NULL,
  `USUARIO_ID_DENUNCIADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_USUARIO_ADM`),
  KEY `fk_USUARIO_ADMINISTRADOR_USUARIO1_idx` (`USUARIO_ID_USUARIO`),
  CONSTRAINT `fk_USUARIO_ADMINISTRADOR_USUARIO1` FOREIGN KEY (`USUARIO_ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_administrador`
--

LOCK TABLES `usuario_administrador` WRITE;
/*!40000 ALTER TABLE `usuario_administrador` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_administrador` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-24  5:21:23
