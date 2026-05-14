# Gelişmiş Kişisel Blog & Portfolyo Yönetim Sistemi

Modern web teknolojilerini kullanarak sıfırdan geliştirdiğim, tamamen dinamik, SEO uyumlu ve özelleştirilebilir yönetim paneline sahip kişisel blog ve portfolyo web sitesi.

## 🚀 Proje Hakkında

Bu proje, hem teknik yetkinliklerimi sergileyebileceğim modern bir vitrin hem de içeriklerimi dilediğim gibi yönetebileceğim esnek bir platform ihtiyacından doğdu. Hazır CMS sistemleri (WordPress, Ghost vb.) kullanmak yerine, tamamen kendi ihtiyaçlarıma göre şekillendirdiğim, yüksek performanslı ve modern bir altyapı inşa etmeyi tercih ettim.

## 💻 Kullanılan Teknolojiler

-   **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Vanilla CSS Modules
-   **Backend & Veritabanı:** Next.js API Routes, MongoDB (Mongoose)
-   **İçerik Yönetimi:** Tiptap tabanlı özel Rich Text (Zengin Metin) Editor
-   **Medya Yönetimi:** Cloudinary (Dinamik görsel yükleme ve optimizasyon)
-   **Güvenlik & Oturum:** JSON Web Token (JWT), bcrypt
-   **Markdown & Render:** react-markdown, remark-gfm, rehype-raw

## ✨ Öne Çıkan Özellikler

### 1. Kapsamlı Yönetim Paneli (Admin Dashboard)
Tüm blog yazılarının ve portfolyo projelerinin tek bir noktadan, güvenli bir oturum üzerinden yönetilmesini sağlayan özel bir arayüz geliştirildi. Ziyaretçi istatistikleri ve içerik metrikleri bu panel üzerinden anlık olarak takip edilebiliyor.

### 2. Gelişmiş Zengin Metin Editörü (Tiptap)
İçerik girişlerini kusursuz hale getirmek için **Tiptap** altyapısıyla kendi WYSIWYG editörümü inşa ettim:
-   **Sürükle & Bırak Görsel Yükleme:** Sürükle-bırak veya kopyala-yapıştır ile resim eklendiğinde arka planda anında Cloudinary'ye yüklenir ve içeriğe entegre edilir.
-   **Görsel Boyutlandırma ve Hizalama:** Eklenen görseller, köşe tutamaçları ile serbestçe boyutlandırılabilir ve sayfa içinde sağa/sola/ortaya hizalanabilir.
-   **Canlı Önizleme & Bölünmüş Ekran:** Makaleyi yazarken, canlı sitede nasıl görüneceğini eş zamanlı olarak test etme imkânı sunar (Split View).
-   **Syntax Highlighting:** Kod blokları (`lowlight` entegrasyonu ile) için otomatik sözdizimi renklendirmesi.

### 3. Dinamik Medya ve Optimizasyon (Cloudinary)
Next.js `next/image` bileşeninin gücüyle birleşen Cloudinary entegrasyonu sayesinde, platforma yüklenen tüm fotoğraflar cihaz boyutuna göre dinamik olarak ölçeklendirilir ve sıkıştırılır. (Responsive Images, Lazy Loading).

### 4. SEO ve Performans Önceliği
Proje, arama motorlarında en üst sıralarda yer alması için teknik SEO standartlarına tam uyumlu geliştirildi. Her blog ve proje sayfası dinamik **JSON-LD Schema Markup** üretir ve kusursuz Semantic HTML yapısına sahiptir.

## 🛠️ Teknik Zorluklar ve Çözümler

**Rich Text HTML/Markdown Dönüşümü:**
Tiptap editörü üzerinden üretilen karmaşık yapıdaki içeriklerin (özellikle özel boyutlandırılmış ve hizalanmış resimlerin) Next.js tarafında kusursuz render edilebilmesi büyük bir zorluktu. 
Standart Markdown ayrıştırıcıları, boyut ve renk gibi CSS özelliklerini kaybediyordu. Buna çözüm olarak; editör çıkışını hibrit bir HTML/Markdown yapısına çevirip, okuma sayfalarında `dangerouslySetInnerHTML` ve güvenlik filtrelerini entegre ederek çözdüm. Bu sayede hem eski Markdown içerikler geriye dönük desteklendi hem de yeni, görsel açıdan zengin yazılar kayıpsız render edildi.

---

*Bu proje, full-stack geliştirme, UI/UX tasarımı ve modern mimarilerin bir arada nasıl uyumla çalışabileceğinin en canlı örneğidir.*
