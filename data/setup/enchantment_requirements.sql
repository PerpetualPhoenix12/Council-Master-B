CREATE TABLE IF NOT EXISTS 'enchantment_requirements' (
    enchantment_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY(enchantment_id, item_id),
    FOREIGN KEY(enchantment_id) REFERENCES enchantments(enchantment_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id)
)