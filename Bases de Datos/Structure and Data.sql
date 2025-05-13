CREATE DATABASE  IF NOT EXISTS `db19475` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `db19475`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: db19475.public.databaseasp.net    Database: db19475
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.11-MariaDB-log

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
-- Table structure for table `counter_references`
--

DROP TABLE IF EXISTS `counter_references`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counter_references` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `referral_id` int(11) NOT NULL,
  `receiving_staff_id` int(11) NOT NULL,
  `counter_reference_date` date NOT NULL,
  `diagnosis_update` text DEFAULT NULL,
  `treatment_provided` text DEFAULT NULL,
  `recommendations` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `active_status` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `referral_id` (`referral_id`),
  KEY `receiving_staff_id` (`receiving_staff_id`),
  CONSTRAINT `counter_references_ibfk_1` FOREIGN KEY (`referral_id`) REFERENCES `referrals` (`id`),
  CONSTRAINT `counter_references_ibfk_2` FOREIGN KEY (`receiving_staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counter_references`
--

LOCK TABLES `counter_references` WRITE;
/*!40000 ALTER TABLE `counter_references` DISABLE KEYS */;
INSERT INTO `counter_references` VALUES (1,4,8,'2025-04-30','sss','ssss','sss','sss\n[2025-04-30] Paciente transferido de vuelta al hospital original después de completar el tratamiento.','2025-04-30 01:49:29','2025-04-30 01:49:29',1),(2,6,8,'2025-04-30','termino','termino','termino','terminpo\n[2025-04-30] Paciente transferido de vuelta al hospital original después de completar el tratamiento.','2025-04-30 01:57:07','2025-04-30 01:57:07',1),(3,7,8,'2025-04-30','sss','sss','ss','ss\n[2025-04-30] Paciente transferido de vuelta al hospital original después de completar el tratamiento.','2025-04-30 10:17:44','2025-04-30 10:17:44',1);
/*!40000 ALTER TABLE `counter_references` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `network_id` int(11) DEFAULT NULL,
  `municipality_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `network_id` (`network_id`),
  KEY `municipality_id` (`municipality_id`),
  CONSTRAINT `hospitals_ibfk_1` FOREIGN KEY (`network_id`) REFERENCES `networks` (`id`),
  CONSTRAINT `hospitals_ibfk_2` FOREIGN KEY (`municipality_id`) REFERENCES `municipalities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES (1,'Hospital Ayacucho Editado','Av. Ayacucho #999','44000000','nuevo@hospital.com',1,'2025-04-07 21:41:03','2025-04-12 13:36:29',1,1),(2,'Hospital del Niño Manuel Ascencio Villarroel','Calle Baptista esquina Antezana, Cochabamba','44223311','nino@hospital.com',1,'2025-04-07 21:41:03','2025-04-12 13:36:27',1,1),(3,'Hospital Cochabamba Norte','Zona Norte, Av. América, Cochabamba','44998822','norte@hospital.com',1,'2025-04-07 21:41:03','2025-04-12 13:36:25',2,1),(4,'Centro de Salud Sarcobamba','Av. Juan de la Rosa esquina Sarcobamba','44778899','sarcobamba@salud.com',1,'2025-04-07 21:41:03','2025-04-12 15:13:43',3,1),(5,'Hospital México','Av. Petrolera km 5, Cochabamba','44112233','mexico@hospital.com',1,'2025-04-07 21:41:03','2025-04-12 13:36:07',2,3),(6,'Hospital Ayacucho','Av. Ayacucho #456','44556677','ayacucho@hospital.com',1,'2025-04-07 21:48:39','2025-05-12 19:40:34',2,3),(7,'ejemplo','Plaza Tiquipaya, Tiquipaya','2-2332423','joelx654@gmail.com',1,'2025-04-08 02:41:44','2025-04-12 13:36:07',2,3),(8,'example2','dass','3333','hga',1,'2025-04-08 02:53:44','2025-04-12 13:36:07',2,3),(9,'example3','sss','2321123','jhjdahjs@gmail.com',1,'2025-04-08 03:34:26','2025-04-12 13:36:07',2,3),(10,'dfas','asdfas','31234','sjbj@mail.com',1,'2025-04-08 03:39:03','2025-04-12 13:36:07',2,3),(11,'eeee','ddd','23','sdfj@mai.com',1,'2025-04-08 03:42:18','2025-04-12 14:45:33',2,3),(12,'y','y','3','afg@mail.com',0,'2025-04-08 03:46:06','2025-04-12 13:36:07',2,3);
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `municipalities`
--

DROP TABLE IF EXISTS `municipalities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `municipalities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `municipalities`
--

LOCK TABLES `municipalities` WRITE;
/*!40000 ALTER TABLE `municipalities` DISABLE KEYS */;
INSERT INTO `municipalities` VALUES (1,'Cochabamba',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(2,'Sacaba',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(3,'Quillacollo',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(4,'Villa Tunari',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(5,'Colcapirhua',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(6,'Puerto Villarroel',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(7,'Tiquipaya',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(8,'Vinto',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(9,'Sipe Sipe',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(10,'Entre Ríos',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(11,'Cliza',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(12,'Punata',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(13,'Arani',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(14,'Tiraque',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(15,'Mizque',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(16,'Totora',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(17,'Aiquile',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(18,'Shinahota',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(19,'Colomi',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(20,'Capinota',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(21,'Morochata',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(22,'Arbieto',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(23,'Tarata',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(24,'San Benito',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(25,'Toco',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(26,'Tolata',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(27,'Anzaldo',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(28,'Arque',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(29,'Tapacarí',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(30,'Omereque',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(31,'Pocona',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(32,'Vacas',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(33,'Alalay',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(34,'Vila Vila',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(35,'Cuchumuela',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(36,'Villa Rivero',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(37,'Tacopaya',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(38,'Independencia',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(39,'Bolívar',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(40,'Sicaya',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(41,'Santiváñez',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(42,'Pojo',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(43,'Pasorapa',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(44,'Cocapata',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(45,'Tacachi',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(46,'Sacabamba',1,'2025-04-12 13:35:54','2025-04-12 13:35:54'),(47,'Raqaypampa',1,'2025-04-12 13:35:54','2025-04-12 13:35:54');
/*!40000 ALTER TABLE `municipalities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `networks`
--

DROP TABLE IF EXISTS `networks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `networks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `networks`
--

LOCK TABLES `networks` WRITE;
/*!40000 ALTER TABLE `networks` DISABLE KEYS */;
INSERT INTO `networks` VALUES (1,'Red de Salud Norte','RSN',1,'2025-04-12 13:36:01','2025-04-12 13:36:01'),(2,'Red de Salud Sur','RSS',1,'2025-04-12 13:36:01','2025-04-12 13:36:01'),(3,'Red de Salud Est','RSE',1,'2025-04-12 13:36:01','2025-04-12 15:16:54'),(4,'Red de Salud Oeste','RSO',1,'2025-04-12 13:36:01','2025-04-12 13:36:01');
/*!40000 ALTER TABLE `networks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `ci` varchar(20) DEFAULT NULL,
  `birthdate` date NOT NULL,
  `gender` enum('M','F','O') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `diagnosis_date` date DEFAULT NULL,
  `tb_type` enum('Pulmonar','Extrapulmonar') NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ci` (`ci`),
  KEY `hospital_id` (`hospital_id`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,'pruebaaa','prueba','4535','2004-11-20','M','3451235443532','prueba','2025-04-03','Pulmonar',6,1,'2025-04-23 04:56:14','2025-04-28 10:06:12'),(2,'prueba2','twe','4634','2006-07-06','F','586785','rtert','2025-02-13','Extrapulmonar',6,1,'2025-04-23 06:08:17','2025-04-23 06:08:17'),(3,'r','as','sd','2006-07-05','M',NULL,'sdasd','2025-04-18','Pulmonar',3,1,'2025-04-23 09:04:07','2025-04-30 01:49:29'),(4,'ff','fff','5645','2000-03-10','M','2235','Plaza Tiquipaya\nTiquipaya','2025-04-11','Extrapulmonar',6,1,'2025-04-23 09:12:02','2025-04-28 10:06:25'),(5,'Pepa','pig','5235345','2008-02-07','F','2523534','dasdasdas','2025-04-19','Pulmonar',3,1,'2025-04-30 01:52:03','2025-04-30 10:17:44');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referrals`
--

DROP TABLE IF EXISTS `referrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referrals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `referring_staff_id` int(11) NOT NULL,
  `source_hospital_id` int(11) NOT NULL,
  `destination_hospital_id` int(11) NOT NULL,
  `reference_date` date NOT NULL,
  `reason` text NOT NULL,
  `diagnosis` text DEFAULT NULL,
  `clinical_summary` text DEFAULT NULL,
  `urgency_level` enum('Baja','Media','Alta') DEFAULT 'Media',
  `status` enum('Pendiente','Aceptada','Rechazada','Completada') DEFAULT 'Pendiente',
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `active_status` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `referring_staff_id` (`referring_staff_id`),
  KEY `source_hospital_id` (`source_hospital_id`),
  KEY `destination_hospital_id` (`destination_hospital_id`),
  CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `referrals_ibfk_2` FOREIGN KEY (`referring_staff_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `referrals_ibfk_3` FOREIGN KEY (`source_hospital_id`) REFERENCES `hospitals` (`id`),
  CONSTRAINT `referrals_ibfk_4` FOREIGN KEY (`destination_hospital_id`) REFERENCES `hospitals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referrals`
--

LOCK TABLES `referrals` WRITE;
/*!40000 ALTER TABLE `referrals` DISABLE KEYS */;
INSERT INTO `referrals` VALUES (1,1,7,3,6,'2025-04-23','prueba','prueba','prueba','Media','Aceptada','pruebita\n[2025-04-23] Estado cambiado a \"Aceptada\"','2025-04-23 04:59:41','2025-04-23 06:53:42',1),(2,4,7,3,6,'2025-04-23','rerasrsa','asrasr','asras','Alta','Aceptada','sarasra\n[2025-04-23] Estado cambiado a \"Aceptada\"','2025-04-23 09:12:57','2025-04-23 09:14:50',1),(3,3,7,3,6,'2025-04-28','sssss','ssss','sss','Baja','Rechazada','ssssss\n[2025-04-28] Estado cambiado a \"Rechazada\": no puedo','2025-04-28 10:09:08','2025-04-28 10:49:30',1),(4,3,7,3,6,'2025-04-28','sss2','sss2','ss2','Media','Completada','sss2\n[2025-04-28] Estado cambiado a \"Aceptada\": si puedo','2025-04-28 10:55:11','2025-04-30 01:49:29',1),(5,5,7,3,6,'2025-04-30','final','final','final','Media','Pendiente','final','2025-04-30 01:52:56','2025-04-30 01:53:50',0),(6,5,7,3,6,'2025-04-30','final','fin','fin','Alta','Completada','fin\n[2025-04-30] Estado cambiado a \"Aceptada\": okey','2025-04-30 01:55:07','2025-04-30 01:57:07',1),(7,5,7,3,6,'2025-04-30','dd','ddd','ddd','Baja','Completada','ddd\n[2025-04-30] Estado cambiado a \"Aceptada\": si puedo','2025-04-30 02:07:53','2025-04-30 10:17:44',1),(8,3,7,3,6,'2025-04-30','es','es','es','Alta','Pendiente','es','2025-04-30 10:16:35','2025-04-30 10:16:35',1);
/*!40000 ALTER TABLE `referrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','Administrador del sistema con acceso completo',1,'2025-04-12 18:19:48','2025-04-12 18:19:48'),(2,'doctor','Médico con acceso a transferir pacientes',1,'2025-04-12 18:19:48','2025-04-12 18:19:48'),(3,'nurse','Enfermera con acceso a registro de pacientes',1,'2025-04-12 18:19:48','2025-04-12 18:19:48'),(4,'receptionist','Recepcionista con acceso a registro inicial',1,'2025-04-12 18:19:48','2025-04-12 18:19:48'),(5,'sedes_admin','Administrador del SEDES con acceso para gestionar hospitales',1,'2025-04-14 01:14:26','2025-04-14 01:14:26'),(6,'hospital_admin','Administrador de hospital con acceso para gestionar personal',1,'2025-04-14 01:14:26','2025-04-14 01:14:26');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `ci` varchar(20) NOT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `hospital_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ci` (`ci`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `hospital_id` (`hospital_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`),
  CONSTRAINT `staff_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Juan','Perez','12345678','Neumología','70712345','zona sud',1,NULL,1,'2025-04-13 01:38:07','2025-04-14 01:48:35'),(2,'Maria','Rodriguez','87654321','Medicina General','70787654','zona sud',1,NULL,1,'2025-04-13 01:38:09','2025-04-13 02:05:02'),(3,'prueba','prueba','22222','prueba','44778899','Plaza Tiquipaya',5,NULL,1,'2025-04-13 02:03:52','2025-04-13 02:03:52'),(4,'tyyy','yyyy','2321','Cirugia','42','Plaza Tiquipaya',3,NULL,1,'2025-04-14 02:12:21','2025-04-14 11:42:48'),(5,'Joel Israel','Lopez Ticlla','666667777','general','77011976','Plaza Tiquipaya',3,4,1,'2025-04-14 20:17:13','2025-04-14 20:17:13'),(6,'prueba2','prueba2','00999','prueba2','67655','sur',3,NULL,1,'2025-04-14 20:18:36','2025-04-14 20:18:36'),(7,'rrrr','rrrrr','3453434','ggggg','657546745','Nueva',3,5,1,'2025-04-14 20:26:43','2025-04-14 20:26:43'),(8,'juego','juego','7967956','dfzsdf','23421','Plaza Tiquipaya',6,8,1,'2025-04-23 05:44:37','2025-04-23 05:44:37'),(9,'change','change','9398','general','12352399','Plaza Tiquipaya',6,9,1,'2025-05-12 22:23:17','2025-05-12 22:23:17');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `idx_reset_token` (`reset_token`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@sedes.gob.bo','$2b$10$t.CpPSdW6xqq4JP6nXzRoe8i5EIrtJ63d5Pvwcx15O7U4BX2PVZsS',1,NULL,'2025-05-12 19:39:42',1,'2025-04-12 18:43:16','2025-05-12 19:39:42',NULL,NULL),(2,'sedes_admin','sedes@sedes.gob.bo','$2b$10$QEAopleHjesLPOpTZo/QzeNPJ.z.eMz8RVClpIED9F3BaEstHZolG',5,NULL,'2025-04-23 05:06:25',1,'2025-04-14 01:49:39','2025-04-23 05:06:25',NULL,NULL),(3,'eee','prueba2@gmail.com','$2b$10$0u3cRR0tFa2wUn/99TMxtuRP863goGo3XQc5LjKXjZkSUqZlfZHAS',6,3,'2025-04-28 10:01:54',1,'2025-04-14 01:52:08','2025-04-28 10:01:54',NULL,NULL),(4,'jlopezticlla','prueba@gmail.com','$2b$10$hx1gg79EWMctKJuwTn2rb.oJK0WijGXnZH6XjDZIizZlEZUJjuEXC',3,3,'2025-04-14 20:24:45',1,'2025-04-14 20:17:10','2025-04-14 20:24:45',NULL,NULL),(5,'rrrrrr','prueba3@gmail.com','$2b$10$UwvGKyrd4dW/PSp7dECU.e1misHWcSWj/NaT7Vz9xomSUOI69.a8K',2,3,'2025-05-12 22:18:23',1,'2025-04-14 20:26:40','2025-05-12 22:18:23',NULL,NULL),(6,'eee2','prueba4@gmail.com','$2b$10$GC7L4SAagANRa9r0iIIfxe/14sWeJWuypdXvkgziNSkg7Z/dRkcJG',6,1,'2025-04-14 21:53:26',1,'2025-04-14 20:42:03','2025-04-23 05:05:29',NULL,NULL),(7,'adminAyacucho','joelx654@gmail.com','$2b$10$lLUpNOXychP2TJCDfJ2b6u3ei66IF5ylhxltCyEeWfHgBIJocVdya',6,6,'2025-05-12 22:20:23',1,'2025-04-23 05:07:25','2025-05-12 22:20:23',NULL,NULL),(8,'jjuego','prueba5@gmail.com','$2b$10$oPN.CKHebOGMicu1Dz5waeeYjY.QdUROoz/Lnixk7h/MzrZrDs1UW',2,6,'2025-04-30 10:16:59',1,'2025-04-23 05:44:34','2025-05-12 22:22:26',NULL,NULL),(9,'cchange','yajuego69@gmail.com','$2b$10$.I9oSoT6nyEWTuDSec082eS2l0fW/lOofTeieceCQfx7ObaQ6MmD2',2,6,'2025-05-12 22:25:20',1,'2025-05-12 22:23:14','2025-05-12 22:25:20',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-13  0:48:01
