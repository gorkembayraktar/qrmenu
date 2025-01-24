# QR Menu Yönetim Sistemi

Modern ve kullanıcı dostu bir QR menü yönetim sistemi. Restoranlar için dijital menü oluşturma ve yönetme imkanı sunar.

## Özellikler

- 🎨 Modern ve responsive tasarım
- 📱 Mobil uyumlu arayüz
- 🔒 Güvenli admin paneli
- 📊 Menü yönetimi
- 🖼️ Görsel yükleme ve yönetim
- 💫 Animasyonlu geçişler
- 🌙 Çoklu tema desteği

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd qr-menu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.local` dosyasını oluşturun ve gerekli değişkenleri ekleyin:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Veritabanı migration'larını çalıştırın:
```bash
npm run migrate
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Admin Paneli

Migration işlemi sonrasında aşağıdaki bilgilerle admin paneline giriş yapabilirsiniz:

- **URL**: http://localhost:3000/dashboard/login
- **Email**: admin@admin.com
- **Şifre**: 123456

## Teknolojiler

- [Next.js 14](https://nextjs.org/)
- [React 19](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Cloudinary](https://cloudinary.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Klasör Yapısı

```
src/
├── app/                # Next.js app router
├── components/         # Yeniden kullanılabilir bileşenler
├── contexts/          # React context'leri
├── migrations/        # Veritabanı migration'ları
├── modules/           # Özellik modülleri
├── themes/           # Tema bileşenleri
└── utils/            # Yardımcı fonksiyonlar
```

## Geliştirme

1. Yeni bir özellik eklemek için branch oluşturun:
```bash
git checkout -b feature/yeni-ozellik
```

2. Değişikliklerinizi commit'leyin:
```bash
git commit -m "feat: yeni özellik eklendi"
```

3. Pull request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
