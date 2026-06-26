INSERT INTO
    interests (name)
VALUES
    ('Fantasy'),
    ('Sci-Fi'),
    ('Horror'),
    ('Thriller'),
    ('Krimi'),
    ('Romantikus'),
    ('Történelmi'),
    ('Kaland'),
    ('Életrajz'),
    ('Ismeretterjesztő'),
    ('Stratégiai társasjátékok'),
    ('Kooperatív játékok'),
    ('Party játékok'),
    ('Kártyajátékok');

INSERT INTO
    users (username, email, password_hash, city, bio)
VALUES
    (
        'peter',
        'peter@test.hu',
        'seed_password_hash',
        'Budapest',
        'Fantasy és társasjáték rajongó.'
    ),
    (
        'anna',
        'anna@test.hu',
        'seed_password_hash',
        'Szeged',
        'Könyvek és kooperatív játékok.'
    ),
    (
        'balazs',
        'balazs@test.hu',
        'seed_password_hash',
        'Debrecen',
        'Sci-Fi gyűjtő.'  
    );

INSERT INTO
    user_interests (user_id, interest_id)
VALUES
    (1, 1),
    (1, 11),
    (2, 2),
    (2, 12),
    (3, 2),
    (3, 13);