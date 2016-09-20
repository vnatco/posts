-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 17, 2016 at 06:53 PM
-- Server version: 5.5.37-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

CREATE TABLE IF NOT EXISTS `category` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `ORDER` int(255) NOT NULL,
  `PROJECT_ID` int(255) NOT NULL,
  `COLOR_ID` int(255) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `IS_VISIBLE` tinyint(4) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `PROJECT_ID` (`PROJECT_ID`),
  KEY `COLOR_ID` (`COLOR_ID`),
  KEY `ORDER` (`ORDER`)
);

CREATE TABLE IF NOT EXISTS `client` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  `IS_VISIBLE` tinyint(4) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
);

INSERT INTO `client` (`ID`, `NAME`, `IS_VISIBLE`, `CREATED_AT`, `UPDATED_AT`) VALUES
(1, 'Main Client', 1, NOW(), NOW());

CREATE TABLE IF NOT EXISTS `color` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  `CLASS` varchar(255) NOT NULL,
  `CLASS_HOVER` varchar(255) NOT NULL,
  `CLASS_ACTIVE` varchar(255) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
);

INSERT INTO `color` (`ID`, `NAME`, `CLASS`, `CLASS_HOVER`, `CLASS_ACTIVE`, `CREATED_AT`, `UPDATED_AT`) VALUES
(1, 'fern', 'fern', '', '', NOW(), NOW()),
(2, 'chateauGreen', 'chateauGreen', '', '', NOW(), NOW()),
(3, 'mountainMeadow', 'mountainMeadow', '', '', NOW(), NOW()),
(4, 'persianGreen', 'persianGreen', '', '', NOW(), NOW()),
(5, 'pictonBlue', 'pictonBlue', '', '', NOW(), NOW()),
(6, 'curiousBlue', 'curiousBlue', '', '', NOW(), NOW()),
(7, 'mariner', 'mariner', '', '', NOW(), NOW()),
(8, 'denim', 'denim', '', '', NOW(), NOW()),
(9, 'wisteria', 'wisteria', '', '', NOW(), NOW()),
(10, 'blueGem', 'blueGem', '', '', NOW(), NOW()),
(11, 'chambray', 'chambray', '', '', NOW(), NOW()),
(12, 'blueWhale', 'blueWhale', '', '', NOW(), NOW()),
(13, 'neonCarrot', 'neonCarrot', '', '', NOW(), NOW()),
(14, 'sun', 'sun', '', '', NOW(), NOW()),
(15, 'terraCotta', 'terraCotta', '', '', NOW(), NOW()),
(16, 'valencia', 'valencia', '', '', NOW(), NOW()),
(17, 'cinnabar', 'cinnabar', '', '', NOW(), NOW()),
(18, 'wellRed', 'wellRed', '', '', NOW(), NOW()),
(19, 'ironGray', 'ironGray', '', '', NOW(), NOW());

CREATE TABLE IF NOT EXISTS `group` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `ORDER` int(255) NOT NULL,
  `CATEGORY_ID` int(255) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `IS_VISIBLE` tinyint(4) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `ORDER` (`ORDER`,`CATEGORY_ID`),
  KEY `CATEGORY_ID` (`CATEGORY_ID`)
);

CREATE TABLE IF NOT EXISTS `post` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `SHARED_ID` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `ORDER` int(255) NOT NULL,
  `GROUP_ID` int(255) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `IS_VISIBLE` tinyint(4) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `ORDER` (`ORDER`,`GROUP_ID`),
  KEY `GROUP_ID` (`GROUP_ID`)
);

CREATE TABLE IF NOT EXISTS `post_field` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `ORDER` int(255) NOT NULL,
  `POST_ID` int(255) NOT NULL,
  `TYPE_ID` int(255) NOT NULL,
  `CONTENT` longtext NOT NULL,
  `META` text NOT NULL,
  `IS_VISIBLE` tinyint(4) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `POST_ID` (`POST_ID`),
  KEY `TYPE_ID` (`TYPE_ID`)
);

CREATE TABLE IF NOT EXISTS `post_field_type` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
);

INSERT INTO `post_field_type` (`ID`, `NAME`, `CREATED_AT`, `UPDATED_AT`) VALUES
(1, 'Text', NOW(), NOW()),
(2, 'Code', NOW(), NOW()),
(3, 'Image', NOW(), NOW());

CREATE TABLE IF NOT EXISTS `project` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `OWNER_ID` int(255) NOT NULL,
  `CLIENT_ID` int(255) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `IS_VISIBLE` tinyint(4) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `CLIENT_ID` (`CLIENT_ID`),
  KEY `OWNER_ID` (`OWNER_ID`)
);

CREATE TABLE IF NOT EXISTS `user` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `LAST_ACCESS_AT` datetime NOT NULL,
  PRIMARY KEY (`ID`)
);

CREATE TABLE IF NOT EXISTS `user_project_access` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `USER_ID` int(255) NOT NULL,
  `PROJECT_ID` int(255) NOT NULL,
  `PERMISSIONS` text NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `USER_ID` (`USER_ID`,`PROJECT_ID`),
  KEY `PROJECT_ID` (`PROJECT_ID`)
);

ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_2` FOREIGN KEY (`COLOR_ID`) REFERENCES `color` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`PROJECT_ID`) REFERENCES `project` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `group`
  ADD CONSTRAINT `group_ibfk_1` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`GROUP_ID`) REFERENCES `group` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `post_field`
  ADD CONSTRAINT `post_field_ibfk_2` FOREIGN KEY (`POST_ID`) REFERENCES `post` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_field_ibfk_3` FOREIGN KEY (`TYPE_ID`) REFERENCES `post_field_type` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`CLIENT_ID`) REFERENCES `client` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_project_access`
  ADD CONSTRAINT `user_project_access_ibfk_2` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_project_access_ibfk_1` FOREIGN KEY (`PROJECT_ID`) REFERENCES `project` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;