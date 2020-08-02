CREATE TABLE IF NOT EXISTS 'adventure_rewards' (
    adventure_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY(adventure_id) REFERENCES adventures(adventure_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id)
)