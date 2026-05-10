# 🖼️ Vercel + Hosting (FTP) Görsel Depolama Kurulumu

Vercel kod çalıştırır, **görseller hosting'in disk'ine FTP ile yazılır**.
Site ziyaretçileri görselleri doğrudan hosting'in web sunucusundan görür
(Vercel üzerinden geçmez).

---

## 🧩 Mimari

```
ZIYARETCI                   ADMIN
    │                          │
    │ siteyi gor               │ urun ekle (gorsel yukle)
    ↓                          ↓
┌──────────────────────────────────────┐
│  VERCEL  (missbellalingree.com)      │
│  • Next.js                           │
│  • /api/admin/upload                 │
│      ↓ Sharp ile WebP'e cevirir      │
│      ↓ basic-ftp ile yukler          │
└──────────────────────────────────────┘
                ↓ FTP (port 21 / 990)
┌──────────────────────────────────────┐
│  HOSTING                             │
│  /public_html/uploads/products/*.webp│
│       (ya da kendi yapinca)          │
└──────────────────────────────────────┘
                ↓ HTTP
        cdn.missbellalingree.com
        veya hostinginsubdomain.com
```

---

## 📋 Adım Adım Kurulum

### 1) Hosting'de FTP kullanıcısı oluştur

cPanel'de:
1. **FTP Accounts** ikonuna gir
2. **Add FTP Account**:
   - **Login:** `uploads` (veya istediğin)
   - **Password:** güçlü bir şifre üret
   - **Directory:** `public_html/uploads` (otomatik oluşur)
   - **Quota:** Unlimited
3. **Create FTP Account**

Notunu al:
```
FTP_HOST     = ftp.missbellalingree.com  (veya cPanel ana sayfasında "FTP Hostname")
FTP_USER     = uploads@missbellalingree.com  (cPanel formatı genelde böyle)
FTP_PASSWORD = ...
FTP_BASE_PATH = /public_html/uploads
```

### 2) `uploads` klasörünü web'den erişilebilir kıl

Hosting'de FTP ile bağlan ve `public_html/uploads` klasörünün varlığından
emin ol. Yoksa elle oluştur:
```
public_html/
└── uploads/
    ├── products/
    └── categories/
```

Ya da boş bırak — ilk yüklemede otomatik oluşturulur.

### 3) Public URL'i belirle

Görsellerin internetten erişilebilir olması için bir URL gerek.

#### 🅰️ Seçenek A — Alt domain (önerilen, en temiz)

Vercel ana domain'i (`missbellalingree.com`) tutuyor. Görseller için
**alt domain** açıyoruz:

1. Domain panelinden (Natro/GoDaddy vb.) DNS kayıtlarına gir
2. Yeni A record ekle:
   ```
   Tip:   A
   İsim:  cdn        (yani cdn.missbellalingree.com olur)
   Değer: <hosting'in IP adresi>
   ```
   Hosting IP'sini cPanel ana sayfasında "Shared IP Address" altında bulursun.
3. cPanel'de **Domains** → **Create Subdomain** → `cdn`
   - Document Root: `public_html/uploads`
4. SSL için cPanel **SSL/TLS Status** → cdn subdomain için "Run AutoSSL"
5. Test: `https://cdn.missbellalingree.com/products/` → 403 ya da boş klasör listesi olmalı (bağlantı çalışıyor demek)

Sonuç:
```
FTP_PUBLIC_URL = https://cdn.missbellalingree.com
```

> Yukarıda `FTP_BASE_PATH=/public_html/uploads` ve subdomain kökü
> aynı klasörü gösteriyor → görseller `https://cdn.missbellalingree.com/products/x.webp`
> olarak yayınlanır.

#### 🅱️ Seçenek B — Hosting'in geçici/farklı bir domain'i

Hosting bazen ücretsiz alt domain verir (ör: `kullaniciadi.hostingadi.com`):
```
FTP_PUBLIC_URL = https://kullaniciadi.hostingadi.com/uploads
```
Çalışır ama profesyonel görünmez.

### 4) Vercel'e env değişkenlerini gir

Vercel Dashboard → Project → **Settings** → **Environment Variables**
(Production/Preview/Development hepsini işaretle):

```
STORAGE_DRIVER  = ftp
FTP_HOST        = ftp.missbellalingree.com
FTP_PORT        = 21
FTP_USER        = uploads@missbellalingree.com
FTP_PASSWORD    = <FTP şifresi>
FTP_SECURE      = false
FTP_BASE_PATH   = /public_html/uploads
FTP_PUBLIC_URL  = https://cdn.missbellalingree.com
```

### 5) `next.config.js` remotePatterns kontrol

Public URL'in domain'i `next.config.js` içindeki `remotePatterns`'da
listelenmeli (zaten ekli — gerekirse `cdn.missbellalingree.com` olduğundan
emin ol). Yeni bir subdomain eklediysen oraya da satır ekle.

### 6) Vercel Redeploy

Env değişkenleri eklendikten sonra:
- Vercel → **Deployments** → en üstteki deploy → `...` → **Redeploy**

### 7) Test

1. `https://www.missbellalingree.com/admin-giris` → giriş
2. **Ürünler** → Yeni ürün → görsel sürükle-bırak
3. Yükleme tamamlanınca:
   - ✅ Toast bildirimi "Görsel yüklendi"
   - ✅ DB'de `products.images` kolonunda `https://cdn.missbellalingree.com/products/xxx.webp` URL'i
   - ✅ FTP ile bağlanıp `public_html/uploads/products/` klasörünü açtığında WebP dosyaları
   - ✅ URL'i tarayıcıda aç → görsel açılmalı
4. Ürünü sil → FTP klasöründen dosyaların kaybolduğunu kontrol et

---

## 🚨 Sorun Giderme

### "ETIMEDOUT" / "ECONNREFUSED"
- FTP_HOST yanlış (IP'yi de dene)
- Hosting firewall'u Vercel IP'lerini engelliyor
  → Hosting destekten "uzaktan FTP açık olsun" iste

### "530 Login authentication failed"
- FTP_USER formatı yanlış (cPanel'de genelde `kullanici@domain.com`)
- Şifrede özel karakter olduğunda Vercel arayüzünde escape sorunu olabilir
  → Şifreyi yenileyip alfanumerik yap

### Görsel yükleniyor ama tarayıcıda 403/404
- Subdomain'in DNS yayılması bekle (5-30 dk)
- Document Root'un `/public_html/uploads` olduğundan emin ol
- cPanel'de subdomain'e SSL atandı mı?

### Görsel yükleniyor ama "Invalid src prop" hatası
- `next.config.js` → `remotePatterns`'a domain'i eklemeyi unuttun
- Eklediysen Vercel Redeploy gerekli

### Yavaş yükleme
- FTP zaten yavaş bir protokoldür. Her upload yeni bağlantı açar.
- Çok yoğun trafik için Cloudinary / S3 düşün

---

## 🔒 Güvenlik notları

- FTP_PASSWORD'u **asla** koda commit etme (sadece Vercel env'de)
- FTP kullanıcısı **sadece `public_html/uploads/`** klasörüne yazsın (Add FTP Account'ta Directory bunu kısıtlar)
- FTP yerine **FTPS** (SFTP değil) destekli hosting varsa `FTP_SECURE=true` yap
- Ana hosting cPanel kullanıcının FTP bilgilerini kullanma — ayrı kısıtlı bir kullanıcı oluştur

---

## 📁 Dosya yapısı (kodda)

```
lib/storage/
  types.ts        ← StorageDriver arayüzü
  index.ts        ← Driver router (env'e göre seçer)
  local.ts        ← Lokal disk implementasyonu
  ftp.ts          ← FTP implementasyonu (basic-ftp)

lib/uploads.ts    ← Sharp ile WebP'e çevirir, getStorage() ile kaydeder

app/api/admin/upload/route.ts            ← POST endpoint
app/api/admin/upload/delete/route.ts     ← DELETE endpoint
```

Yeni bir storage tipi eklemek (S3, Cloudinary vb.) istersen `lib/storage/`
altına yeni bir dosya açıp `StorageDriver` arayüzünü uygula, sonra
`lib/storage/index.ts` içinde router'a ekle. 5 dakika sürer.
