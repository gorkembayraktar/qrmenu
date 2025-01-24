-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    nutritional_values JSONB DEFAULT '{
        "calories": 0,
        "protein": 0,
        "fat": 0,
        "carbohydrates": 0
    }',
    is_active BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cloudinary_public_id TEXT
);

-- Create index for faster category lookups
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to products table
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, description, price, image, category_id, nutritional_values)
SELECT 
    'Taze Meyve Suyu',
    'Portakal, elma veya nar suyu seçenekleri',
    25.00,
    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&auto=format&fit=crop&q=60',
    c.id,
    '{
        "calories": 150,
        "protein": 5,
        "fat": 2,
        "carbohydrates": 10
    }'::jsonb
FROM categories c
WHERE c.name = 'İçecekler'
ON CONFLICT DO NOTHING; 