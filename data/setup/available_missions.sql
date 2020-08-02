CREATE TABLE IF NOT EXISTS 'available_missions' (
    mission_id INTEGER NOT NULL,
    sect_id INTEGER NOT NULL,
    PRIMARY KEY(mission_id, sect_id),
    FOREIGN KEY(mission_id) REFERENCES missions(mission_id),
    FOREIGN KEY(sect_id) REFERENCES sects(sect_id)
)