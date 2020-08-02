CREATE TABLE IF NOT EXISTS 'sect_items' (
    sect_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(sect_id, item_id),
    FOREIGN KEY(sect_id) REFERENCES sects(sect_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id)
)