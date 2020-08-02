CREATE TABLE IF NOT EXISTS 'adventures' (
    adventure_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    rarity TEXT NOT NULL,
    duration INTEGER NOT NULL,
    PRIMARY KEY(adventure_id)
)