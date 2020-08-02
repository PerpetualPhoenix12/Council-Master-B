CREATE TABLE IF NOT EXISTS 'plans' (
    plan_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    job_id char(2) NOT NULL,
    PRIMARY KEY(plan_id),
    FOREIGN KEY(plan_id) REFERENCES items(item_id),
    FOREIGN KEY(item_id) REFERENCES items(item_id),
    FOREIGN KEY(job_id) REFERENCES jobs(job_id)
)

