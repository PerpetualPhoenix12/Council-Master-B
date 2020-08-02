CREATE TABLE IF NOT EXISTS 'enchantments' (
    enchantment_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type char(2) NOT NULL,
    value TEXT NOT NULL,
    grade TEXT NOT NULL,
    plan_id INTEGER NOT NILL,
    PRIMARY KEY(enchantment_id),
    FOREIGN KEY(grade) REFERENCES realms(name),
    FOREIGN KEY (plan_id) REFERENCES items(item_id)
)

