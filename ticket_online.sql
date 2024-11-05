-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2024 at 03:49 PM
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
-- Database: `ticket_online`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `password_salt` varchar(255) NOT NULL,
  `roleId` int(11) DEFAULT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `username`, `user_password`, `password_salt`, `roleId`, `statusId`, `createdAt`, `updatedAt`) VALUES
(4, 'admin1@gmail.com', 'admin1', 'hashedPassword123', 'salt123', 1, 1, '2024-10-25 07:34:22', '2024-10-30 09:28:08');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `role_name`, `createdAt`, `updatedAt`) VALUES
(1, 'super admin', '2024-10-25 07:32:28', '2024-10-25 07:32:28');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` int(11) NOT NULL,
  `status_payment` varchar(100) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `status_payment`, `createdAt`, `updatedAt`) VALUES
(1, 'active', '2024-10-25 07:33:32', '2024-10-25 07:36:21'),
(2, 'active', '2024-10-25 07:34:02', '2024-10-25 07:36:21');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `entry_date` datetime NOT NULL DEFAULT current_timestamp(),
  `ticket_count` int(11) NOT NULL,
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
('PRE0edea9fc1730797739994', 'zae', 'mz78987@gmail.com', '085156801583', '2024-11-05 00:00:00', 1, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATySURBVO3BQY4cSQzAQDLR//8y10edCih0jr02FGG/sNYlh7UuOqx10WGtiw5rXXRY66LDWhcd1rrosNZFh7UuOqx10WGtiw5rXXRY66LDWhcd1rrow5dUfqeKn6QyVTxRmSpuUvmdKr5xWOuiw1oXHda66MNlFTepPFGZK', '2024-11-05 09:08:59', '2024-11-05 09:08:59', 'not_used', '2024-11-12 16:10:09'),
('PRE17fdfb121730739958899', 'asep', 'mz8987@gmail.com', '085156801583', '2024-11-05 00:00:00', 1, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATwSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9OohuSaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaCcikZgJyo2YCcqNmAjKpuQEyqbkB8pvUvHFSteikatFJ1aJPl', '2024-11-04 17:05:58', '2024-11-04 17:05:58', 'not_used', '2024-11-12 15:50:10'),
('PREd66b6e101730787641616', 'Budiono Siregar', 'rewatch48@gmail.com', '085156801583', '2024-11-05 00:00:00', 1, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAS4SURBVO3BQY4jRxAEwfAC//9l1xzzVECjk7PSKszwR6qWnFQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYs+eQnIb1LzBJAbNU8AuVHzBJBJzQTkN6l546Rq0UnVopOqRZ8sU7MJyBNAJ', '2024-11-05 06:20:41', '2024-11-05 06:20:41', 'not_used', '2024-11-12 15:52:52'),
('PREdbbcfbf31730783412141', 'zae', 'mz78987@gmail.com', '085156801583', '2024-11-05 00:00:00', 1, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATeSURBVO3BQQ4bRxAEwcoB///ltI59GmCxTdoWKgL/SNWSk6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatEnLwH5JTU3QG7UTEDeUPMGkEnNBOSX1LxxUrXopGrRSdWiT5ap2QTkDTU3a', '2024-11-05 05:10:12', '2024-11-05 05:10:12', 'not_used', '2024-11-12 16:00:04'),
('PREf421bbaa1730817942746', 'Zaedane', 'mz987@gmail.com', '085156801583', '2024-11-11 00:00:00', 2, 'premium', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATLSURBVO3BQY4kRxIEQdNA/f/Lun30U2AT6dUzJE0Ef6RqyUnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXok5eA/CY1TwCZ1ExA3lDzBpBJzQTkN6l546Rq0UnVopOqRZ8sU7MJyDepm', '2024-11-05 14:45:42', '2024-11-05 14:45:42', 'not_used', '2024-11-12 21:46:21'),
('REG6147f9df1730785757898', 'zae', 'mz78987@gmail.com', '085156801583', '2024-11-05 00:00:00', 1, 'reguler', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAT7SURBVO3BQQ4bwREEwcoB///ltI59GmCxTVqyKwL/SNWSk6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatEnLwH5JTUTkEnNG0CeUDMBeULNDZBfUvPGSdWik6pFJ1WLPlmmZhOQJ4BMa', '2024-11-05 05:49:17', '2024-11-05 05:49:17', 'not_used', '2024-11-12 16:04:31'),
('REGaa50548c1730786522551', 'Puput Rahayu', 'puputrahayu1988@gmail.com', '085156801583', '2024-11-05 00:00:00', 1, 'reguler', 'pending', NULL, '2024-11-05 06:02:02', '2024-11-05 06:02:02', 'not_used', '2024-11-06 00:00:00'),
('REGc238728b1730740179109', 'zae', 'mz78987@gmail.com', '08515801583', '2024-11-05 00:00:00', 3, 'reguler', 'pending', NULL, '2024-11-04 17:09:39', '2024-11-04 17:09:39', 'not_used', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `roleId` (`roleId`),
  ADD KEY `statusId` (`statusId`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `admin_ibfk_2` FOREIGN KEY (`statusId`) REFERENCES `status` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
