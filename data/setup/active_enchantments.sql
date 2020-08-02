CREATE TABLE IF NOT EXISTS 'active_enchantments' (
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    enchantment_id INTEGER NOT NULL,
    PRIMARY KEY(user_id, item_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id),
    FOREIGN KEY(enchantment_id) REFERENCES enchantments(enchantment_id)
)