-- init.sql

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    previous_password_hash VARCHAR(255),
    disabled BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE chatroom (
    id SERIAL PRIMARY KEY,
    first_user_id INT NOT NULL,
    second_user_id INT NOT NULL,
    CONSTRAINT fk_first_user
        FOREIGN KEY (first_user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_second_user
        FOREIGN KEY (second_user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

INSERT INTO Users (username, email, full_name, password_hash) VALUES
  ('tttolik', 'rodionov.tolik@gmail.com', 'Rodionov Anatoliy Anatolievich', '$2b$12$sLL78O/b8m2YbBGCsTwluu8MawFQO/IKh1jDo8XuweJOhDcXMkW4y');

