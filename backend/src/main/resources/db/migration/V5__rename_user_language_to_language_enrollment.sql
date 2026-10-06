ALTER TABLE user_language
    RENAME TO language_enrollment;

ALTER SEQUENCE user_language_id_seq
    RENAME TO language_enrollment_id_seq;

ALTER TABLE language_enrollment
    RENAME CONSTRAINT user_language_pkey TO language_enrollment_pkey;

ALTER TABLE language_enrollment
    RENAME CONSTRAINT user_language_fk_user_id_fkey TO language_enrollment_fk_user_id_fkey;

ALTER TABLE language_enrollment
    RENAME CONSTRAINT user_language_fk_language_id_fkey TO language_enrollment_fk_language_id_fkey;

ALTER TABLE language_enrollment
    RENAME CONSTRAINT user_language_fk_language_id_fk_user_id_key TO language_enrollment_fk_language_id_fk_user_id_key;

ALTER TABLE activity
    RENAME COLUMN fk_user_language_id TO fk_language_enrollment_id;

ALTER TABLE activity
    RENAME CONSTRAINT activity_fk_user_language_id_fkey TO activity_fk_language_enrollment_id_fkey;
