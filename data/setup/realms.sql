CREATE TABLE IF NOT EXISTS 'realms' (
    name TEXT NOT NULL,
    increment INTEGER NOT NULL,
    threshold INTEGER NOT NULL,
    realm_id INTEGER NOT NULL,
    stats_threshold INTEGER NOT NULL,
    PRIMARY KEY(name)
)