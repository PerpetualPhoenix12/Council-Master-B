CREATE TABLE IF NOT EXISTS 'active_dungeons' (
    dungeon_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    started DATE NOT NULL,
    PRIMARY KEY(dungeon_id, user_id),
    FOREIGN KEY(dungeon_id) REFERENCES dungeons(dungeon_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)