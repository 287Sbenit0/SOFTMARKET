-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generaciÃ³n: 04-06-2024 a las 23:01:41
-- VersiÃ³n del servidor: 10.4.32-MariaDB
-- VersiÃ³n de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `softmarket`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `offer_status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `offer_status`, `created_at`, `image_url`) VALUES
(11, 'Product 1', 'Description for product 1', 19.99, 0, '2024-05-26 22:34:11', 'images/product1.jpg'),
(12, 'Product 2', 'Description for product 2', 29.99, 1, '2024-05-26 22:34:11', 'images/product2.jpg'),
(13, 'Product 3', 'Description for product 3', 9.99, 0, '2024-05-26 22:34:11', 'images/product3.jpg'),
(14, 'Product 4', 'Description for product 4', 14.99, 1, '2024-05-26 22:34:11', 'images/product4.jpg'),
(15, 'Product 5', 'Description for product 5', 39.99, 0, '2024-05-26 22:34:11', 'images/product5.jpg'),
(16, 'Product 6', 'Description for product 6', 24.99, 0, '2024-05-26 22:34:11', 'images/product6.jpg'),
(17, 'Product 7', 'Description for product 7', 11.99, 1, '2024-05-26 22:34:11', 'images/product7.jpg'),
(18, 'Product 8', 'Description for product 8', 7.99, 1, '2024-05-26 22:34:11', 'images/product8.jpg'),
(19, 'Product 9', 'Description for product 9', 49.99, 0, '2024-05-26 22:34:11', 'images/product9.jpg'),
(20, 'Product 10', 'Description for product 10', 5.99, 1, '2024-05-26 22:34:11', 'images/product10.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tickets`
--

INSERT INTO `tickets` (`id`, `email`, `message`, `status`, `created_at`) VALUES
(11, 'user1@example.com', 'This is the third support ticket', 'open', '2024-05-26 22:34:20'),
(12, 'user3@example.com', 'This is the fourth support ticket', 'open', '2024-05-26 22:34:20'),
(13, 'user2@example.com', 'This is the fifth support ticket', 'closed', '2024-05-26 22:34:20'),
(14, 'marbegio@gmail.com', 'prueba', 'open', '2024-05-26 23:13:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`) VALUES
(5, 'admin@example.com', '$2a$10$GsVA23WdoT7Vhthyrym2BOmJMcQsZdVNQn8Ty.TjmROwHRkdSEcAK', 'admin'),
(6, 'user@example.com', '$2a$10$IAOJsg5Oc232d/HXSf.Y/.sg473IuthGSD/tBCzt6KXT8AEH5AEkC', 'user');

--
-- Ãndices para tablas volcadas
--

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
