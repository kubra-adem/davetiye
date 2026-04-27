# Kübra & Adem — Düğün Davetiyesi

Statik bir web davetiyesi. GitHub Pages üzerinde host edilir, her misafir için kişiye özel URL üretir.

**Canlı:** https://kubra-adem.github.io/davetiye/

## Kişiye özel link nasıl çalışır

Her misafire **`https://kubra-adem.github.io/davetiye/sn.<isim>`** formatında bir link gönderilir. Link açıldığında ilk sayfada misafirin adı **"Sn. Ali Aydın"** şeklinde görünür.

Eşleştirme `guests.json` dosyasından yapılır:

```json
{
  "sn.aliaydin": "Ali Aydın",
  "sn.mehmetyilmaz": "Mehmet Yılmaz",
  "sn.aysefamily": "Ayşe Hanım ve Ailesi"
}
```

`/davetiye/<slug>` gibi pathler GitHub Pages üzerinde `404.html` fallback'i ile servise alınır; bu dosya `index.html` ile aynıdır ve URL'deki slug'ı `guests.json`'dan okur.

### Yedek format
Eğer path tabanlı link bir kanalda sorun çıkarırsa query string formu da çalışır:
`https://kubra-adem.github.io/davetiye/?g=sn.aliaydin`

## Yeni misafir ekleme

1. `guests.json` dosyasını aç.
2. Yeni satır ekle: `"sn.yenikullanici": "Tam Ad",`
3. Commit + push. Birkaç dakika içinde canlı.

Slug kuralları:
- Sadece küçük harf, rakam ve nokta.
- Türkçe karakter kullanma (`ş, ı, ğ` yerine `s, i, g`).
- Boşluk yok.
- Önek olarak `sn.` kullan (zorunlu değil ama tutarlılık için).

## Yerel geliştirme

```bash
# Repo köküne git, sonra:
python -m http.server 8000
# veya
npx serve .
```

Tarayıcıda `http://localhost:8000/?g=sn.aliaydin` aç.

## Müzik

Arka plan müziği `assets/music.mp3` dosyasındadır. Sağ üst köşedeki düğme ile başlatılıp durdurulur. Otomatik çalmaz (mobil tarayıcı kısıtı).

Mevcut parça: **"Solo Acoustic 5"** — Jason Shaw / [Audionautix](https://audionautix.com/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) lisansı ile. Değiştirmek için yeni MP3'ü `assets/music.mp3` olarak commit'le.

## Dosya yapısı

```
davetiye/
├── index.html       # Ana sayfa
├── 404.html         # SPA fallback (path tabanlı linkler için)
├── styles.css       # Stiller
├── app.js           # Slug → isim eşleme
├── guests.json      # Misafir listesi
├── assets/
│   └── favicon.svg
└── README.md
```

## WhatsApp şablonu

```
Sevgili Ali,

Davetiyemizi senin için hazırladık:
https://kubra-adem.github.io/davetiye/sn.aliaydin

Sizi aramızda görmek dileğiyle 🌸
Kübra & Adem
```
