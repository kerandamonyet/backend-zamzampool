-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2024 at 07:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tiket_online`
--

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `entry_date` date NOT NULL DEFAULT current_timestamp(),
  `ticket_count` int(5) NOT NULL,
  `ticket_type` enum('premium','reguler') NOT NULL,
  `payment_status` enum('pending','completed') DEFAULT 'pending',
  `barcode` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_request_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `isUsed` enum('used','not_used','expired') DEFAULT 'not_used',
  `expired_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `name`, `email`, `phone`, `entry_date`, `ticket_count`, `ticket_type`, `payment_status`, `barcode`, `created_at`, `last_request_time`, `isUsed`, `expired_date`) VALUES
('PRE0a7de8fa1729608174543', 'Jae', 'mz78987@gmail.com', '08123456789', '2024-10-15', 2, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATwSURBVO3BQY4kRxIEQdNA/f/LunOjnwJIpFdzmmsi+EeqlpxULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLPnkJyE9SMwG5UXMD5A01bwCZ1ExAfpKaN06qFp1ULTqpWvTJMjWbgLwB5', '2024-10-22 14:42:54', '2024-10-22 14:42:54', 'used', '2024-10-25 00:00:00'),
('PRE1671ec811729611577211', 'Puput', 'mz78987@gmail.com', '08123456789', '2024-10-25', 2, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOcSURBVO3BMa5bSQADweZA979yrwMHjAYQnvRtL1gVf2Hmt8NMOcyUw0w5zJTDTDnMlMNMOcyUw0w5zJTDTDnMlMNMOcyUw0x58VASfpJKS8KNyicloancJOEnqTxxmCmHmXKYKS8+TOWTkvBJSbhRaUloKk+ofFISPukwU', '2024-10-22 15:39:37', '2024-10-22 15:39:37', 'used', '2024-10-28 00:00:00'),
('PRE25c2a7751729610031528', 'Puput', 'mz78987@gmail.com', '08123456789', '2024-10-25', 2, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAN6SURBVO3BQa5bRwADweZA979yxwsvuBpAeNKP47Aq/sLMb4eZcpgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgph5ny4qEk/CSVmyTcqDyRhKZyk4SfpPLEYaYcZsphprz4MJVPSsI7VFoS/iQqn5SETzrMlMNMO', '2024-10-22 15:13:51', '2024-10-22 15:13:51', 'used', '2024-10-28 00:00:00'),
('PRE7cf13a281729608510866', 'Jae', 'mz78987@gmail.com', '08123456789', '2024-10-15', 2, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAS/SURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9GqSsyaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaCcik5gkgT6iZgLyh5gbIb1LzxknVopOqRSdViz5ZpmYTkBs1N', '2024-10-22 14:48:30', '2024-10-22 14:48:30', 'expired', '2024-10-18 00:00:00'),
('PREda38e1101729609214829', 'Jae', 'mz78987@gmail.com', '08123456789', '2024-10-15', 2, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAONSURBVO3BQY7kRgADwWSh///l9Bx84EmAIPXYu2BE/MHMvw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlw0NJ+E0qLQlXVFoSmkpLwhMqLQm/SeWJw0w5zJTDTPnwMpU3JeGKSkvCHUloKt+k8qYkv', '2024-10-22 15:00:14', '2024-10-22 15:00:14', 'used', '2024-11-14 00:00:00'),
('PREe7535d341729777742697', 'Asep', 'mz78987@gmail.com', '08123456789', '2024-10-25', 2, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAASZSURBVO3BQW4kRxAEwfDC/P/LLh7zVFCjk1yuFGb4JVVLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkWfvATkJ6mZgDyh5gbIjZoJyBtqboD8JDVvnFQtOqladFK16JNlajYBuVEzA', '2024-10-24 13:49:02', '2024-10-24 13:49:02', 'used', '2024-10-28 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
