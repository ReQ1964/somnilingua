CREATE TABLE cefr_level
(
    id              BIGSERIAL PRIMARY KEY,
    level           VARCHAR(10)  NOT NULL UNIQUE,
    minutes         INTEGER      NOT NULL,
    words           INTEGER      NOT NULL,
    description_key VARCHAR(255) NOT NULL,
    sort_order      INTEGER      NOT NULL UNIQUE
)

