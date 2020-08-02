CREATE TABLE IF NOT EXISTS 'active_adventures' (
    adventure_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    started DATE NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY(adventure_id) REFERENCES adventures(adventure_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)