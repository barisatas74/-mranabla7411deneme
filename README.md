# Luna Rosa

Premium ic giyim e-ticaret arayuzu — Next.js 15 (App Router) + TypeScript + TailwindCSS.

## Hizli Baslangic

```bash
npm install
cp .env.example .env.local      # degerleri doldurun
npm run dev                     # http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start                   # default port 3000
```

## Ortam Degiskenleri

`.env.example` dosyasini `.env.local` (geliştirme) veya host panelinizdeki environment ayarlarina (production) kopyalayin.

| Degisken | Amac | Zorunlu |
| --- | --- | --- |
| `ADMIN_USERNAME` | Admin paneli kullanici adi | Onerilir |
| `ADMIN_PASSWORD` | Admin paneli parolasi | **Evet** |
| `ADMIN_SESSION_TOKEN` | Cookie imzasi icin rastgele 32+ byte deger | **Evet** |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | WhatsApp butonu telefon numarasi (sadece rakam) | Onerilir |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Footer Instagram linki | Hayir |
| `NEXT_PUBLIC_FACEBOOK_URL` | Footer Facebook linki | Hayir |
| `NEXT_PUBLIC_YOUTUBE_URL` | Footer Youtube linki | Hayir |

> ⚠️ **Onemli:** `ADMIN_PASSWORD` ve `ADMIN_SESSION_TOKEN` doldurulmadiginda admin koruma devre disi kalir ve `/admin` rotasi koruma olmadan acilir. Canliya almadan mutlaka doldurun.

`ADMIN_SESSION_TOKEN` icin guclu bir deger uretmek:

```bash
# Linux/macOS
openssl rand -hex 32

# Node ile (cross-platform)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Admin Paneli

- URL: `/admin-giris` (giris formu) → `/admin` (dashboard)
- Veritabani: **Su an salt-bellek (mock).** Sunucu yeniden baslatildiginda admin'den yapilan urun/siparis/ayar degisiklikleri seed verisine doner. Vitrindeki urun listesi ve calisan akislar tamamen statik `data/products.ts` uzerinden uretilir; bu nedenle son musteri tarafinda her zaman tutarli gorunur.
- Kalici yonetim icin sonraki adim: `lib/services/mock/*` icindeki servisleri Postgres/SQLite gibi bir veritabani + Server Actions kombinasyonuyla degistirmek. README sonundaki "Sonraki Adimlar" bolumune bakin.

## Yayim Kontrol Listesi

1. `.env.local` (veya host environment) doldurulmus.
2. `npm run build` hatasiz tamamlaniyor.
3. `/` ana sayfa, `/products`, `/cart`, `/checkout` akisi calisiyor.
4. `/admin-giris` parolayla `/admin`'e yonlendiriyor; yanlis parolada hata gosteriyor.
5. WhatsApp butonu gercek bir numaraya gidiyor.
6. Footer Hakkimizda ve Iletisim linkleri dolu sayfalara gidiyor.

## Klasor Yapisi

```
app/             Next.js App Router rotalari
  admin/         Admin panel sayfalari (middleware ile korunur)
  admin-giris/   Admin login formu (korumasiz)
  api/admin/     Login/logout API
components/      UI bilesenleri
data/            Statik urun/kategori/admin seed verileri
lib/             Yardimci fonksiyonlar + servis katmani
  services/mock/ Bellek/dosya tabanli admin DB
types/           Paylasimli TypeScript tipleri
middleware.ts    Admin rotalarini koruyan middleware
```

## Sonraki Adimlar (canli e-ticarete gecerken)

1. **Veritabani**: `lib/services/mock/*` servislerini Postgres/MySQL/SQLite ile degistirin. ORM olarak Prisma onerilir. Ayni `ProductService`/`CategoryService` arayuzunu uyguladiginizda admin paneli tek satir degisiklikle gercek DB'ye baglanir.
2. **Odeme entegrasyonu**: `app/checkout/page.tsx` icindeki `handlePlaceOrder` su an siparis kaydetmeden basari ekrani gosteriyor. iyzico / Stripe / PayTR API'leri ile entegre edip server action'a tasimak gerekir.
3. **Bulten / Iletisim formu**: Footer'daki abone formu su an client-side dogrulama yapip onay gosteriyor. Mailchimp/Resend/Brevo gibi bir servise POST eden bir API route ekleyin.
4. **Gercek urun gorselleri**: Tum gorseller Unsplash placeholder. S3/Cloudinary/Vercel Blob'a urun fotograflarini yukleyip `data/products.ts` veya admin paneli uzerinden URL'leri guncelleyin.

