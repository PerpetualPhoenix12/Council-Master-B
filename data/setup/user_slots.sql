CREATE TABLE IF NOT EXISTS 'user_slots' (
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    slot_id char(2) NOT NULL,
    PRIMARY KEY(user_id, slot_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    FOREIGN KEY(slot_id) REFERENCES slots(slot_id)
)