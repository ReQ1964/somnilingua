INSERT INTO cefr_level (level,
                        minutes,
                        words,
                        description_key,
                        sort_order)
VALUES ('A0', 0, 0, 'level.a0', 0),
       ('A1', 3000, 500, 'level.a1', 1),
       ('A2', 9000, 1200, 'level.a2', 2),
       ('B1', 24000, 2500, 'level.b1', 3),
       ('B2', 54000, 5000, 'level.b2', 4),
       ('C1', 108000, 10000, 'level.c1', 5),
       ('C2', 180000, 16000, 'level.c2', 6)
ON CONFLICT (level)
    DO UPDATE SET minutes         = EXCLUDED.minutes,
                  words           = EXCLUDED.words,
                  description_key = EXCLUDED.description_key,
                  sort_order      = EXCLUDED.sort_order;