-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default settings if table is empty
INSERT INTO settings (name, value)
SELECT * FROM (
    VALUES
        ('restaurant_name', ''),
        ('restaurant_slogan', ''),
        ('page_title', ''),
        ('phone', ''),
        ('address', ''),
        ('currency', 'TRY'),
        ('language', 'tr'),
        ('logo_url', ''),
        ('favicon_url', ''),
        ('footer_text', ''),
        ('copyright_text', '© 2024. Tüm hakları saklıdır.')
) AS v(name, value)
WHERE NOT EXISTS (SELECT 1 FROM settings); 