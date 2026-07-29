# 📚 Basit Kütüphane Takip Sistemi

Modern ve kullanıcı dostu arayüze sahip, **HTML5**, **CSS3** ve **Vanilla JavaScript** kullanılarak geliştirilmiş web tabanlı bir kütüphane yönetim uygulamasıdır. Tarayıcınızın `localStorage` özelliğini kullanarak verilerin kalıcı olmasını sağlar.

<img width="1273" height="902" alt="Screenshot 2026-07-29 140749" src="https://github.com/user-attachments/assets/e0a24f2c-5c08-42cd-ace5-c7cf8271ee75" />

## 🚀 Özellikler

* **Kitap Yönetimi:** Kitap ekleme, düzenleme, silme ve tüm kayıtları tek tuşla temizleme.
* **Ödünç Takibi:** Kitapları "Kütüphanede" veya "Ödünç Verildi" olarak durumlandırma ve yönetme.
* **Canlı Arama & Filtreleme:** Kitap veya yazar adına göre anlık arama, kategori ve duruma göre filtreleme.
* **Gelişmiş Sıralama:** Eklenme sırasına, ada göre (A-Z, Z-A) ve sayfa sayısına göre (artan, azalan) sıralama (ana dizi bozulmadan).
* **Canlı Sayaçlar:** Toplam, kütüphanedeki, ödünç verilen ve filtrelenen kitap sayılarını anlık takip etme.
* **Örnek Veri:** Tek tıklamayla sisteme hızlıca örnek kitaplar ekleyebilme.
* **Kalıcı Bellek (`localStorage`):** Sayfa yenilendiğinde verilerin kaybolmaması.
* **Güçlü Validasyon:** Boş alan kontrolü, minimum karakter sınırları ve sayfa sayısı aralık kontrolü (1-5000).

## 📁 Proje Dosya Yapısı

Proje aynı klasör içerisinde bulunan şu üç temel dosyadan oluşur:

```text
📦 basit-kutuphane-sistemi
 ┣ 📜 index.html    # Arayüz ve HTML yapılandırması
 ┣ 📜 style.css     # Tasarım ve stiller
 ┗ 📜 script.js     # Uygulama mantığı ve işlevler
