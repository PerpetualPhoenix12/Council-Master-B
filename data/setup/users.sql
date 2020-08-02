CREATE TABLE IF NOT EXISTS 'users' (
    user_id TEXT NOT NULL,
    strength INTEGER DEFAULT 100,
    vital_essence INTEGER DEFAULT 200,
    agility INTEGER DEFAULT 50,
    intelligence INTEGER DEFAULT 20,
    spirit_stones INTEGER DEFAULT 0,
    contribution INTEGER DEFAULT 0,
    cultivationVal INTEGER DEFAULT 0,
    last_checked DATE NOT NULL DEFAULT 0,
    tribulations_passed INTEGER DEFAULT 0,
    sect_id INTEGER DEFAULT 0,
    energy INTEGER NOT NULL DEFAULT 100,
    PRIMARY KEY(user_id),
    FOREIGN KEY(sect_id) REFERENCES sects(sect_id)
)