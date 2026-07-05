USE bb_xchange;

-- =====================================
-- USERS
-- =====================================
INSERT INTO
    users (username, email, password_hash, city, bio)
VALUES
    (
        'peter',
        'peter@test.hu',
        '$2b$10$9ysfKzC5uf5A9eItyPO6COpQ9cnuiQO8nLxfGSQv9LIrF4Zw03um.',
        'Budapest',
        'Fantasy és társasjáték rajongó.'
    ),
    (
        'anna',
        'anna@test.hu',
        '$2b$10$9ysfKzC5uf5A9eItyPO6COpQ9cnuiQO8nLxfGSQv9LIrF4Zw03um.',
        'Szeged',
        'Könyvek és kooperatív játékok.'
    ),
    (
        'balazs',
        'balazs@test.hu',
        '$2b$10$9ysfKzC5uf5A9eItyPO6COpQ9cnuiQO8nLxfGSQv9LIrF4Zw03um.',
        'Debrecen',
        'Sci-Fi gyűjtő.'
    ),
    (
        'zsofi',
        'zsofi@test.hu',
        '$2b$10$9ysfKzC5uf5A9eItyPO6COpQ9cnuiQO8nLxfGSQv9LIrF4Zw03um.',
        'Pécs',
        'Imádom a fantasy könyveket.'
    ),
    (
        'gabor',
        'gabor@test.hu',
        '$2b$10$9ysfKzC5uf5A9eItyPO6COpQ9cnuiQO8nLxfGSQv9LIrF4Zw03um.',
        'Győr',
        'Stratégiai társasjáték fanatikus.'
    ),
    (
        'eszter',
        'eszter@test.hu',
        '$2b$10$9ysfKzC5uf5A9eItyPO6COpQ9cnuiQO8nLxfGSQv9LIrF4Zw03um.',
        'Miskolc',
        'Krimi és thriller rajongó.'
    ),
    (
        'marton',
        'marton@test.hu',
        '$2b$10$9ysfKzC5uf5A9eItyPO6COpQ9cnuiQO8nLxfGSQv9LIrF4Zw03um.',
        'Sopron',
        'Party játékok és sci-fi.'
    ),
    (
        'lili',
        'lili@test.hu',
        '$2b$10$9ysfKzC5uf5A9eItyPO6COpQ9cnuiQO8nLxfGSQv9LIrF4Zw03um.',
        'Kecskemét',
        'Kalandregények és kártyajátékok.'
    );

-- =====================================
-- USER INTERESTS
-- =====================================
INSERT INTO
    user_interests
VALUES
    (1, 1),
    (1, 11),
    (2, 2),
    (2, 12),
    (3, 2),
    (3, 14),
    (4, 1),
    (4, 8),
    (5, 11),
    (5, 12),
    (6, 4),
    (6, 5),
    (7, 2),
    (7, 13),
    (8, 8),
    (8, 14);

-- =====================================
-- ITEMS
-- =====================================
INSERT INTO
    items (
        owner_id,
        type,
        title,
        description,
        item_condition,
        status
    )
VALUES
    (
        1,
        'book',
        'The Hobbit',
        'Keményfedeles kiadás.',
        'excellent',
        'active'
    ),
    (
        1,
        'book',
        'The Lord of the Rings',
        'Trilógia egyben.',
        'good',
        'active'
    ),
    (
        2,
        'book',
        'Dune',
        'Szép állapotban.',
        'excellent',
        'active'
    ),
    (
        2,
        'boardgame',
        'Catan',
        'Magyar kiadás.',
        'good',
        'active'
    ),
    (
        3,
        'book',
        '1984',
        'Olvasott példány.',
        'used',
        'active'
    ),
    (
        3,
        'boardgame',
        'Terraforming Mars',
        'Minden alkatrész megvan.',
        'excellent',
        'active'
    ),
    (
        4,
        'book',
        'Harry Potter and the Philosopher''s Stone',
        'Angol nyelvű.',
        'good',
        'active'
    ),
    (
        4,
        'boardgame',
        'Pandemic',
        'Keveset használt.',
        'excellent',
        'active'
    ),
    (
        5,
        'boardgame',
        'Brass Birmingham',
        'Gyűjtői állapot.',
        'excellent',
        'active'
    ),
    (
        5,
        'boardgame',
        'Root',
        'Magyar szabályokkal.',
        'good',
        'active'
    ),
    (
        6,
        'book',
        'The Shining',
        'Stephen King klasszikus.',
        'good',
        'active'
    ),
    (
        6,
        'book',
        'Dracula',
        'Keményfedeles.',
        'excellent',
        'active'
    ),
    (
        7,
        'boardgame',
        '7 Wonders',
        'Jó állapotú.',
        'good',
        'active'
    ),
    (
        7,
        'boardgame',
        'Ticket to Ride',
        'Családi kedvenc.',
        'excellent',
        'active'
    ),
    (
        8,
        'book',
        'Metro 2033',
        'Puha kötés.',
        'used',
        'active'
    ),
    (
        8,
        'book',
        'The Martian',
        'Egyszer olvasott.',
        'excellent',
        'active'
    );

-- =====================================
-- BOOK DETAILS
-- =====================================
INSERT INTO
    book_details
VALUES
    (
        1,
        'J. R. R. Tolkien',
        'Fantasy',
        310,
        1937,
        '9780261103344'
    ),
    (
        2,
        'J. R. R. Tolkien',
        'Fantasy',
        1178,
        1955,
        '9780261102385'
    ),
    (
        3,
        'Frank Herbert',
        'Sci-Fi',
        604,
        1965,
        '9780441172719'
    ),
    (
        5,
        'George Orwell',
        'Sci-Fi',
        328,
        1949,
        '9780451524935'
    ),
    (
        7,
        'J. K. Rowling',
        'Fantasy',
        332,
        1997,
        '9780747532699'
    ),
    (
        11,
        'Stephen King',
        'Horror',
        447,
        1977,
        '9780307743657'
    ),
    (
        12,
        'Bram Stoker',
        'Horror',
        418,
        1897,
        '9780141439846'
    ),
    (
        15,
        'Dmitry Glukhovsky',
        'Sci-Fi',
        460,
        2005,
        '9780575086258'
    ),
    (
        16,
        'Andy Weir',
        'Sci-Fi',
        384,
        2011,
        '9780804139021'
    );

-- =====================================
-- BOARDGAME DETAILS
-- =====================================
INSERT INTO
    boardgame_details
VALUES
    (4, 'Stratégiai', 3, 4, 10, 90),
    (6, 'Stratégiai', 1, 5, 12, 120),
    (8, 'Kooperatív', 2, 4, 8, 60),
    (9, 'Stratégiai', 2, 4, 14, 150),
    (10, 'Stratégiai', 2, 4, 10, 90),
    (13, 'Kártyajáték', 2, 7, 10, 45),
    (14, 'Családi', 2, 5, 8, 60);

-- =====================================
-- TRADE OFFERS
-- =====================================
INSERT INTO
    trade_offers (requester_id, target_item_id, status)
VALUES
    (2, 1, 'pending'),
    (3, 2, 'accepted'),
    (4, 3, 'completed'),
    (5, 5, 'rejected'),
    (6, 7, 'cancelled'),
    (7, 11, 'revoked');

-- =====================================
-- OFFER ITEMS
-- =====================================
INSERT INTO
    offer_items (offer_id, item_id)
VALUES
    (1, 3),
    (2, 6),
    (3, 8),
    (4, 9),
    (5, 10),
    (6, 14);

-- =====================================
-- MESSAGES
-- =====================================
INSERT INTO
    messages (offer_id, sender_id, receiver_id, content)
VALUES
    (1, 2, 1, 'Szia! Érdekelne a Hobbit.'),
    (1, 1, 2, 'Szia! Még megvan.'),
    (1, 2, 1, 'Budapesten át tudjuk venni?'),
    (2, 3, 1, 'Szia! Érdekelne a Gyűrűk Ura.'),
    (2, 1, 3, 'Persze, beszéljünk róla.'),
    (NULL, 1, 2, 'Van még más könyved is?'),
    (NULL, 2, 1, 'Igen, nézd meg a profilomat.');

-- =====================================
-- NOTIFICATIONS
-- =====================================
INSERT INTO
    notifications (user_id, type, message, link)
VALUES
    (
        1,
        'new_offer',
        'Új ajánlatod érkezett.',
        '/offers/received'
    ),
    (
        3,
        'offer_accepted',
        'Elfogadták az ajánlatodat.',
        '/offers'
    ),
    (
        4,
        'offer_completed',
        'A csere sikeresen lezárult.',
        '/offers'
    ),
    (
        1,
        'message',
        'Új üzeneted érkezett.',
        '/messages'
    );