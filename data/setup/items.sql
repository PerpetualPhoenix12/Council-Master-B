CREATE TABLE IF NOT EXISTS 'items' (
    item_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    type TEXT NOT NULL,
    grade TEXT NOT NULL,
    rarity TEXT NOT NULL,
    strength INTEGER DEFAULT 0,
    agility INTEGER DEFAULT 0,
    vital_essence INTEGER DEFAULT 0,
    intelligence INTEGER DEFAULT 0,
    value INTEGER,
    description TEXT,
    PRIMARY KEY(item_id),
    FOREIGN KEY(grade) REFERENCES realms(name),
    FOREIGN KEY(type) REFERENCES item_types(type_id)
)