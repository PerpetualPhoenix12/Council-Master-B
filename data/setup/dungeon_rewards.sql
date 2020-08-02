CREATE TABLE IF NOT EXISTS 'dungeon_rewards' (
    dungeon_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY(dungeon_id, item_id),
    FOREIGN KEY(dungeon_id) REFERENCES dungeons(dungeon_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id)
)