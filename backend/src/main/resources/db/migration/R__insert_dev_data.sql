INSERT INTO somnilingua."user" (id, email)
VALUES (1, 'john@example.com')
ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
SELECT setval(
               'somnilingua.user_id_seq',
               (SELECT MAX(id) FROM somnilingua."user")
       );
