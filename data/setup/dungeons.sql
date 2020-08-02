CREATE TABLE IF NOT EXISTS 'dungeons' (
    dungeon_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    grade TEXT NOT NULL,
    tier TEXT NOT NULL,
    threshold INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    PRIMARY KEY(dungeon_id),
    FOREIGN KEY(grade) REFERENCES realms(name)
)