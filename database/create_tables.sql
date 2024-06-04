CREATE DATABASE IF NOT EXISTS softmarket;

USE softmarket;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    offer_status BOOLEAN NOT NULL DEFAULT 0
);
