CREATE TABLE IF NOT EXISTS 'item_requirements' (
    item_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY(item_id, material_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id),
    FOREIGN KEY(material_id) REFERENCES items(item_id)
)