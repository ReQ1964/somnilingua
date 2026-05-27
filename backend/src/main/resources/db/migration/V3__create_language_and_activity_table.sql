CREATE TABLE language
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL UNIQUE,
    code       VARCHAR(10)  NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_language
(
    id                 BIGSERIAL PRIMARY KEY,
    daily_goal_minutes INT,

    fk_user_id         BIGINT NOT NULL,
    FOREIGN KEY (fk_user_id)
        REFERENCES "user" (id)
        ON DELETE CASCADE,

    fk_language_id     BIGINT NOT NULL,
    FOREIGN KEY (fk_language_id)
        REFERENCES language (id)
        ON DELETE CASCADE,

    UNIQUE (fk_language_id, fk_user_id),
    created_at         TIMESTAMP DEFAULT NOW(),
    modified_at        TIMESTAMP
);

create table activity
(
    id                  BIGSERIAL PRIMARY KEY,
    type                VARCHAR(32) NOT NULL,
    fk_user_language_id BIGINT      NOT NULL,
    FOREIGN KEY (fk_user_language_id)
        REFERENCES user_language (id),
    CONSTRAINT chk_activity_type CHECK ( type IN
                                         ('WATCHING', 'LISTENING', 'READING', 'SPEAKING', 'WRITING', 'STUDYING',
                                          'OTHER') ),
    minutes             INT         NOT NULL CHECK (minutes > 0),
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT NOW(),
    modified_at         TIMESTAMP
)