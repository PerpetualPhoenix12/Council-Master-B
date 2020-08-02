CREATE TABLE IF NOT EXISTS 'mission_requirements' (
    mission_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY(mission_id, item_id),
    FOREIGN KEY(mission_id) REFERENCES missions(mission_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id)
)