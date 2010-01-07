-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.1.40-community


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema congado
--

CREATE DATABASE IF NOT EXISTS congado;
USE congado;

--
-- Definition of table `criador`
--

DROP TABLE IF EXISTS `criador`;
CREATE TABLE `criador` (
  `id` int(11) NOT NULL,
  `cod` varchar(45) DEFAULT NULL,
  `dsc` varchar(45) DEFAULT NULL,
  `cpf_cnpj` varchar(45) DEFAULT NULL,
  `rg` varchar(45) DEFAULT NULL,
  `fazenda` varchar(45) DEFAULT NULL,
  `XXXXX_CIDADE` varchar(45) DEFAULT NULL,
  `corresp_endereco` varchar(45) DEFAULT NULL,
  `corresp_XXXXX_CIDADE` varchar(45) DEFAULT NULL,
  `corresp_cep` varchar(45) DEFAULT NULL,
  `telefone` varchar(45) DEFAULT NULL,
  `celular` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `criador`
--

/*!40000 ALTER TABLE `criador` DISABLE KEYS */;
/*!40000 ALTER TABLE `criador` ENABLE KEYS */;


--
-- Definition of table `fazenda`
--

DROP TABLE IF EXISTS `fazenda`;
CREATE TABLE `fazenda` (
  `id` int(11) NOT NULL,
  `dsc` varchar(45) DEFAULT NULL,
  `proprietario` varchar(45) DEFAULT NULL,
  `endereco` varchar(45) DEFAULT NULL,
  `XXXXX_CIDADE` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fazenda`
--

/*!40000 ALTER TABLE `fazenda` DISABLE KEYS */;
/*!40000 ALTER TABLE `fazenda` ENABLE KEYS */;


--
-- Definition of table `pelagem`
--

DROP TABLE IF EXISTS `pelagem`;
CREATE TABLE `pelagem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cod` varchar(45) NOT NULL,
  `dsc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cod` (`cod`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pelagem`
--

/*!40000 ALTER TABLE `pelagem` DISABLE KEYS */;
INSERT INTO `pelagem` (`id`,`cod`,`dsc`) VALUES 
 (1,'AM','AMARELA'),
 (2,'BR','BRANCA'),
 (3,'CC','CINZA CLARA'),
 (4,'CZ','CINZA'),
 (5,'PR','PRETA');
/*!40000 ALTER TABLE `pelagem` ENABLE KEYS */;


--
-- Definition of table `raca`
--

DROP TABLE IF EXISTS `raca`;
CREATE TABLE `raca` (
  `id` int(11) NOT NULL,
  `cod` varchar(45) DEFAULT NULL,
  `dsc` varchar(45) DEFAULT NULL,
  `sisbov` varchar(45) DEFAULT NULL,
  `gestacao` varchar(45) DEFAULT NULL,
  `gestacao_min` varchar(45) DEFAULT NULL,
  `gestacao_max` varchar(45) DEFAULT NULL,
  `idade_repro` varchar(45) DEFAULT NULL,
  `peso_repro` varchar(45) DEFAULT NULL,
  `pesof1` varchar(45) DEFAULT NULL,
  `pesof2` varchar(45) DEFAULT NULL,
  `pesof3` varchar(45) DEFAULT NULL,
  `pesof4` varchar(45) DEFAULT NULL,
  `pesof5` varchar(45) DEFAULT NULL,
  `pesom1` varchar(45) DEFAULT NULL,
  `pesom2` varchar(45) DEFAULT NULL,
  `pesom3` varchar(45) DEFAULT NULL,
  `pesom4` varchar(45) DEFAULT NULL,
  `pesom5` varchar(45) DEFAULT NULL,
  `compsanguinea` varchar(45) DEFAULT NULL,
  `grupo` varchar(45) DEFAULT NULL,
  `MANDATORY` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `raca`
--

/*!40000 ALTER TABLE `raca` DISABLE KEYS */;
/*!40000 ALTER TABLE `raca` ENABLE KEYS */;


--
-- Definition of table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `login` varchar(16) NOT NULL,
  `password` varchar(32) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`,`name`,`login`,`password`,`admin`) VALUES 
 (1,'Abner Souza','bacteria_','1956c40fe1e1d897c048a81e6dc84753',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
