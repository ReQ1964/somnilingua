INSERT INTO somnilingua."user" (id, email)
VALUES (1, 'john@example.com');

SELECT setval(
               'somnilingua.user_id_seq',
               (SELECT MAX(id) FROM somnilingua."user")
       );
