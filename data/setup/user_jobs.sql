CREATE TABLE IF NOT EXISTS 'user_jobs' (
    job_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    job_xp INTEGER DEFAULT 0,
    PRIMARY KEY(job_id, user_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
    FOREIGN KEY(job_id) REFERENCES jobs(job_id)
)