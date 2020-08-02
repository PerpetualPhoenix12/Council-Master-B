CREATE TABLE IF NOT EXISTS 'inventory' (
    item_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id),
    PRIMARY KEY(item_id, user_id)
)