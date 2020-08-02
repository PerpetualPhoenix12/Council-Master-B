CREATE TABLE IF NOT EXISTS 'active_missions' (
    mission_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY(mission_id, user_id),
    FOREIGN KEY(mission_id) REFERENCES missions(mission_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)