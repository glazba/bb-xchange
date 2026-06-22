DROP DATABASE IF EXISTS bb_xchange;

CREATE DATABASE bb_xchange CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bb_xchange;

CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        city VARCHAR(100),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    interests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );

CREATE TABLE
    user_interests (
        user_id INT NOT NULL,
        interest_id INT NOT NULL,
        PRIMARY KEY (user_id, interest_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (interest_id) REFERENCES interests (id) ON DELETE CASCADE
    );

INSERT INTO
    interests (name)
VALUES
    ('fantasy'),
    ('Sci-Fi'),
    ('Horror'),
    ('Thriller'),
    ('Krimi'),
    ('Romantikus'),
    ('Történelmi'),
    ('Kaland'),
    ('Stratégiai társasjátékok'),
    ('Kooperatív társasjátékok'),
    ('Party játékok'),
    ('Kártyajátékok'),
    ('Táblajátékok');

USE bb_xchange;

CREATE TABLE
    items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        type ENUM ('book', 'boardgame') NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        item_condition ENUM ('new', 'excellent', 'good', 'used', 'damaged') NOT NULL,
        status ENUM ('active', 'traded') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT current_timestamp,
        updated_at TIMESTAMP DEFAULT current_timestamp ON UPDATE current_timestamp,
        CONSTRAINT fk_items_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
    );

CREATE TABLE
    item_images (
        id INT auto_increment PRIMARY KEY,
        item_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        is_cover BOOLEAN DEFAULT FALSE,
        created_at timestamp DEFAULT current_timestamp,
        constraint fk_item_images_item foreign key (item_id) REFERENCES items (id) ON DELETE CASCADE
    );

CREATE TABLE
    book_details (
        item_id INT PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        page_count INT,
        published_year INT,
        isbn VARCHAR(50),
        constraint fk_book_item foreign key (item_id) REFERENCES items (id) ON DELETE CASCADE
    );

CREATE TABLE
    boardgame_details (
        item_id INT PRIMARY KEY,
        genre VARCHAR(100) NOT NULL,
        min_players INT NOT NULL,
        max_players INT NOT NULL,
        recommended_age INT NOT NULL,
        playtime INT,
        CONSTRAINT chk_players CHECK (min_players <= max_players),
        CONSTRAINT fk_boardgame_item FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
    );