# Veritabani Kurulumu — MySQL / MariaDB

## 1. Veritabani olusturma (hosting panelinde)

cPanel / Plesk / DirectAdmin'da:

1. **Yeni veritabani olustur** — ornek: `missbella_db`
2. **Yeni kullanici olustur** — guclu sifre belirle
3. Kullaniciyi veritabanina **tum yetkilerle** bagla

Notu kenara al:

```
DB_HOST     = (hostingin verdigi adres — genelde "localhost" veya bir IP)
DB_PORT     = 3306
DB_USER     = ...
DB_PASSWORD = ...
DB_NAME     = missbella_db
```

> Vercel'den hosting'inizdeki MySQL'e baglanacaksaniz **uzaktan baglantiya
> izin verilmis olmasi gerekir** (cPanel > "Remote MySQL" sekmesinden Vercel
> sunucularinin IP'lerini eklemeniz veya `%` ile herhangi bir host'tan
> erisime acmaniz gerekir). Tam liste icin Vercel destegine danisin veya
> yalnizca SSH tunelinden baglayan bir mimariye gecin.

## 2. Sema import etme

phpMyAdmin uzerinden:

1. Sol panelden olusturdugunuz veritabanini secin
2. Ust menuden **Import** sekmesine tiklayin
3. `db/schema.mysql.sql` dosyasini secin
4. **Go** / **Yukle** dugmesine tiklayin

Komut satirindan:

```bash
mysql -h <DB_HOST> -P 3306 -u <DB_USER> -p <DB_NAME> < db/schema.mysql.sql
```

## 3. Vercel env degerlerini doldurma

Vercel Dashboard > Project > Settings > Environment Variables:

```
DB_TYPE      = mysql
DB_HOST      = <hosting MySQL adresi>
DB_PORT      = 3306
DB_USER      = <kullanici>
DB_PASSWORD  = <sifre>
DB_NAME      = <veritabani adi>
DB_SSL       = false        # bazi hostingler true ister
```

Kayitten sonra **Redeploy** edin — admin paneli artik MySQL'e yazar.

## 4. Test

1. `/admin-giris` -> giris yapin
2. **Kategoriler** menusunden bir kategori ekleyin
3. **Urunler** menusunden bir urun ekleyin (gorsel ile)
4. phpMyAdmin'i acin -> tablolarda kayitlarin olusup olusmadigini gorun

Eger gorseller "kayboluyor" gibi gorunuyorsa: bu Vercel'in dosya sisteminin
**ephemeral** olmasindan kaynaklanir (her deploy'da `/public/uploads`
sifirlanir). Cozumler:

- Gorselleri kendi hosting'inizin diskine yazin (FTP relay scripti)
- **Cloudinary** veya **Vercel Blob** gibi harici storage'a baglanin
- Hosting'inizde tam Next.js calistirin (Vercel'i devre disi birakin)

Bu konuda yardim icin mesaj atmaniz yeterli.

## 5. Sema versiyonlama

Ileride yeni sutun/tablo eklenirse `db/migrations/0001-...sql` gibi ayri
dosyalar olusturulup elle calistirilir. Su an migration sistemi yok —
tek dosya import yeterli.
