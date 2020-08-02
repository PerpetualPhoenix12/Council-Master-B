CREATE TABLE IF NOT EXISTS 'user_craft' (
    item_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    job_id char(2) NOT NULL,
    PRIMARY KEY(item_id, user_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(job_id) REFERENCES jobs(job_id)
)