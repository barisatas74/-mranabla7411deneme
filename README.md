# Miss Bella

Premium iç giyim e-ticaret sitesi — **Next.js 15** (App Router) + **TypeScript** + **TailwindCSS**.

Marka: Miss Bella · Tema: Fuşya pembesi · Stil: Modern editorial + glassmorphism + scroll reveal

---

## 🚀 Hızlı Başlangıç

```bash
npm install
cp .env.example .env.local      # değerleri doldurun
npm run dev                     # http://localhost:3000
```

## 📦 Production Build

```bash
npm run build
npm run start                   # default port 3000
```

## 🔍 Kontroller

```bash
npm run lint        # ESLint
npx tsc --noEmit    # TypeScript
```

---

## 🌍 Ortam Değişkenleri

`.env.example` dosyasını `.env.local` (geliştirme) veya host panelinizdeki environment ayarlarına (production) kopyalayın.

### Zorunlu (yayına çıkmadan önce)

| Değişken | Amaç |
| --- | --- |
| `ADMIN_USERNAME` | Admin paneli kullanıcı adı |
| `ADMIN_PASSWORD` | Admin paneli parolası |
| `ADMIN_SESSION_TOKEN` | Cookie imzası için rastgele 32+ byte hex |
| `USER_SESSION_SECRET` | Üye oturumları için ayrı rastgele 32+ byte hex |
| `NEXT_PUBLIC_SITE_URL` | Production domain (sitemap, OG, canonical için) |

### İletişim & Sosyal Medya (opsiyonel — boş ise gizlenir)

| Değişken | Amaç |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Sağ alttaki WhatsApp butonu (sadece rakam) |
| `NEXT_PUBLIC_SUPPORT_PHONE` | İletişim sayfası telefon |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | İletişim sayfası e-posta |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Footer Instagram |
| `NEXT_PUBLIC_FACEBOOK_URL` | Footer Facebook |
| `NEXT_PUBLIC_YOUTUBE_URL` | Footer Youtube |

> ⚠️ **Önemli:** `ADMIN_PASSWORD`, `ADMIN_SESSION_TOKEN` ve `USER_SESSION_SECRET` yayına çıkmadan önce mutlaka doldurulmalı.

`ADMIN_SESSION_TOKEN` ve `USER_SESSION_SECRET` için güçlü değer üretmek:

```bash
# Linux/macOS
openssl rand -hex 32

# Node ile
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🛠️ Admin Paneli

- URL: `/admin-giris` (giriş formu) → `/admin` (dashboard)
- Modüller: Ürünler, Kategoriler, Siparişler, Site Ayarları
- **Veritabanı:** Şu an salt-bellek (mock). Vercel free tier'da deploy yenilendiğinde sıfırlanır. Kalıcı kullanım için host kurulumunda `lib/services/mock/*` servislerini gerçek bir DB'ye (Postgres / Supabase / SQLite) bağlamak gerekir.

---

## 📄 Sayfalar

### Müşteriye yönelik
- `/` — Anasayfa (Hero + Coming Soon + BrandStory + TrustBadges)
- `/products` — Ürün kataloğu (filtre, sıralama, arama)
- `/products/[slug]` — Ürün detay
- `/cart` — Sepet
- `/checkout` — Sipariş tamamlama (3 adımlı)
- `/favorilerim` — Favori ürünler (localStorage)

### Bilgi sayfaları
- `/hakkimizda` — Marka hikayesi
- `/iletisim` — İletişim formu + bilgileri
- `/musteri-hizmetleri` — Yardım merkezi
- `/sss` — Sıkça sorulan sorular (kategorize)
- `/beden-tablosu` — Sütyen/külot/gece bedenleri + ölçü rehberi
- `/kargo-teslimat` — Teslimat bilgileri

### Yasal
- `/kvkk` — KVKK Aydınlatma Metni
- `/gizlilik` — Gizlilik Politikası
- `/iade-politikasi` — İade ve Değişim
- `/mesafeli-satis` — Mesafeli Satış Sözleşmesi

### Sistem
- `/admin/*` — Admin paneli (middleware korumalı)
- `/admin-giris` — Admin login
- `/api/admin/login` · `/api/admin/logout` — Auth API
- `/sitemap.xml` · `/robots.txt` — SEO
- `/manifest.webmanifest` — PWA
- `/opengraph-image` · `/icon` · `/apple-icon` — Dinamik görseller

---

## 🎨 Marka Sistemi

- **Tema:** Fuşya pembesi (`#ee2a8b`) ana renk, gradient yazılar, glassmorphism kartlar
- **Tipografi:** Cormorant Garamond (display) + Inter (body)
- **Animasyonlar:** Reveal (scroll-triggered), micro-interactions, btn shine, prefers-reduced-motion saygısı
- **Bileşenler:** `components/` altında, tematik gruplama (`admin/`, `cart/`, `products/`, `feedback/`, `forms/`)

---

## 🗂️ Klasör Yapısı

```
app/                    Next.js App Router rotaları
  admin/                Admin panel sayfaları (middleware korumalı)
  admin-giris/          Admin login formu
  api/admin/            Login/logout API rotaları
  [legal pages]/        KVKK, Gizlilik, İade, Mesafeli Satış
  [info pages]/         Hakkımızda, İletişim, SSS, Beden Tablosu, Kargo, Müşteri Hizmetleri
  opengraph-image.tsx   Dinamik OG image üretici
  icon.tsx              Favicon üretici
  manifest.ts           PWA manifest
  sitemap.ts            Sitemap üretici
  robots.ts             Robots.txt
components/             UI bileşenleri
  admin/                Admin paneli bileşenleri
  cart/                 Sepet bileşenleri
  products/             Ürün listesi & detay bileşenleri
data/                   Statik veri (products, categories, admin seed)
lib/                    Yardımcı fonksiyonlar
  site.ts               Marka & SEO sabitleri (tek nokta)
  schema.ts             Schema.org JSON-LD üreticileri
  validation.ts         Form validasyon (TC kimlik, telefon mask, IBAN)
  email-templates.ts    Sipariş onay & hoşgeldin HTML mail şablonları
  services/             Servis katmanı (mock → gerçek DB)
types/                  TypeScript tipleri
middleware.ts           Admin rotalarını koruyan middleware
next.config.js          CSP + security headers + image optimization
```

---

## ✅ Yayım Öncesi Kontrol Listesi

- [ ] `.env.local` (veya host environment) doldurulmuş
- [ ] `npm run build` hatasız tamamlanıyor
- [ ] `npm run lint` 0 uyarı
- [ ] `/` anasayfa yükleniyor
- [ ] `/products` boşsa "Yakında" gösteriyor
- [ ] `/admin-giris` parolayla `/admin`'e yönlendiriyor
- [ ] `/sitemap.xml` ve `/robots.txt` doğru domain ile görünüyor
- [ ] `/opengraph-image` 1200×630 PNG üretiyor
- [ ] WhatsApp env boş ise buton görünmüyor (boşken görünmemeli)
- [ ] Footer'da sosyal medya env'leri boş ise ikonlar görünmüyor
- [ ] Mobil görünüm test edildi

---

## 🚦 Sonraki Adımlar (canlıya alırken)

### 1. Domain & SSL
- Domain: `missbellalingree.com`
- Vercel'e custom domain ekle → DNS yönlendirmesi → SSL otomatik

### 2. Veritabanı
- **MySQL / MariaDB** desteklidir (hosting sağlayıcısının verdiği)
- Şema dosyası: `db/schema.mysql.sql` — phpMyAdmin'den import
- `.env` içinde `DB_TYPE=mysql` ve `DB_HOST/DB_USER/...` değerlerini doldurun
- Doldurulduğunda mock yerine otomatik MySQL devreye girer

### 3. Görsel Storage
- **Supabase Storage** (DB ile aynı sağlayıcı) veya **Cloudinary** önerisi
- Admin'den ürün eklerken upload

### 4. Ödeme Entegrasyonu
- TR için: **iyzico** veya **PayTR**
- Yurt dışı için: **Stripe**
- `app/checkout/page.tsx` `handlePlaceOrder` fonksiyonunu API route'a bağla

### 5. E-posta Gönderimi
- **Resend** önerilen (3000 ücretsiz e-posta/ay)
- `lib/email-templates.ts` HTML şablonları hazır
- Sipariş onay + bülten + admin bildirim

### 6. Bülten Entegrasyonu
- Footer formu → Mailchimp / Brevo / ConvertKit

### 7. Analytics & Hata İzleme
- **Vercel Analytics** (1 tıkla aktif)
- **Sentry** (ücretsiz tier — error tracking)
- Google Analytics 4 (opsiyonel)

### 8. Şirket Bilgileri
KVKK, Mesafeli Satış ve İletişim sayfalarındaki italic placeholder alanlar:
- Şirket tam unvanı, adresi
- Vergi dairesi & VKN
- MERSIS numarası
- Müşteri hizmetleri telefonu

---

## 📜 Lisans

Tüm hakları saklıdır © Miss Bella
