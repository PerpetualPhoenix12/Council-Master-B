CREATE TABLE IF NOT EXISTS 'user_enchantments' (
    user_id INTEGER NOT NULL,
    enchantment_id INTEGER NOT NULL,
    PRIMARY KEY(user_id, enchantment_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(enchantment_id) REFERENCES enchantments(enchantment_id)
)