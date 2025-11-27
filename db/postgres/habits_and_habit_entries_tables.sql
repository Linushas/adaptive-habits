CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT null,
    description TEXT,
    target_value INTEGER DEFAULT 1,
    unit VARCHAR(50),
    frequency VARCHAR(20) DEFAULT 'daily',
    completion_prompt TEXT
);

CREATE TABLE habit_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    value INTEGER,
    notes TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, log_date)
);
