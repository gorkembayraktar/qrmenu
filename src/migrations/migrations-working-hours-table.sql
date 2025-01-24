-- Create working_hours table
CREATE TABLE IF NOT EXISTS working_hours (
    id SERIAL PRIMARY KEY,
    day INTEGER NOT NULL CHECK (day >= 0 AND day <= 6) UNIQUE,
    is_open BOOLEAN NOT NULL DEFAULT true,
    open_time TIME NOT NULL DEFAULT '09:00',
    close_time TIME NOT NULL DEFAULT '22:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on day column
CREATE INDEX IF NOT EXISTS working_hours_day_idx ON working_hours(day);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_working_hours_updated_at
    BEFORE UPDATE ON working_hours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default working hours for each day of the week
INSERT INTO working_hours (day, is_open, open_time, close_time)
VALUES
    (0, true, '09:00', '22:00'), -- Pazartesi
    (1, true, '09:00', '22:00'), -- Salı
    (2, true, '09:00', '22:00'), -- Çarşamba
    (3, true, '09:00', '22:00'), -- Perşembe
    (4, true, '09:00', '22:00'), -- Cuma
    (5, true, '09:00', '22:00'), -- Cumartesi
    (6, true, '09:00', '22:00')  -- Pazar
ON CONFLICT (day) DO UPDATE SET
    is_open = EXCLUDED.is_open,
    open_time = EXCLUDED.open_time,
    close_time = EXCLUDED.close_time;

-- Down Migration
-- DROP TRIGGER IF EXISTS update_working_hours_updated_at ON working_hours;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP TABLE IF EXISTS working_hours; 