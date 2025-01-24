-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT false,
    is_pro BOOLEAN DEFAULT false,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default modules
INSERT INTO modules (id, title, description, icon, is_active, is_pro, settings) 
VALUES 
    (
        'whatsapp',
        'WhatsApp Modülü',
        'Müşterilerinizin tek tıkla size WhatsApp üzerinden ulaşmasını sağlayın.',
        'FaWhatsapp',
        false,
        false,
        '{"whatsapp": {"number": "", "message": "Merhaba, menünüz hakkında bilgi almak istiyorum.", "appearance": {"position": "bottom-right", "size": "medium", "margin": 20, "showOnMobile": true, "stackOrder": 1}}}'
    ),
    (
        'social',
        'Sosyal Medya Modülü',
        'Sosyal medya hesaplarınızı menünüze ekleyin ve takipçi sayınızı artırın.',
        'FiShare2',
        false,
        false,
        '{"social": {"accounts": []}}'
    ),
    (
        'wifi',
        'WiFi Modülü',
        'Müşterilerinizin QR kod ile WiFi ağınıza kolayca bağlanmasını sağlayın.',
        'FiWifi',
        false,
        false,
        '{"wifi": {"ssid": "", "password": "", "security": "WPA", "appearance": {"position": "bottom-right", "size": "medium", "margin": 20, "showOnMobile": true, "stackOrder": 3}}}'
    )
ON CONFLICT (id) DO NOTHING; 