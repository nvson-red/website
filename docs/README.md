# ZHR One — Website MVP

Static site: HTML + CSS + JavaScript thuần. Không cần build tool, không cần Node để chạy.
Mở `index.html` bằng trình duyệt là xem được ngay.

---

## 1. Cấu trúc thư mục

```
docs/
├── index.html                     Trang chủ
├── solutions.html                 Giải pháp
├── hire-in-vietnam.html           Tuyển dụng tại Việt Nam
├── why-zhr-one.html               Vì sao chọn ZHR One
├── workforce-intelligence.html    Danh sách bài chuyên môn
├── insight-tech-team-cost.html    Mẫu trang bài viết chi tiết
├── about.html                     Về chúng tôi
├── talk-to-us.html                Form thu lead
├── privacy.html                   Chính sách bảo mật + điều khoản
│
├── partials/
│   ├── header.html                Menu chung — sửa 1 lần, đồng bộ mọi trang
│   └── footer.html                Footer chung
│
├── assets/css/
│   ├── tokens.css                 MÀU, FONT, KHOẢNG CÁCH — sửa thương hiệu ở đây
│   ├── base.css                   Reset + typography + layout nền
│   ├── components.css             Nút, thẻ, form, menu, card bài viết
│   └── sections.css               Hero, banner, process, bài viết
│
├── assets/js/
│   ├── ui.js                      Menu mobile, viền header khi cuộn
│   ├── i18n.js                    Bộ máy chuyển EN/VI
│   └── app.js                     Hiệu ứng cuộn, lọc bài, xử lý form
│
├── data/
│   ├── vi.js                      Bản dịch tiếng Việt
│   ├── ja.js                      Bản dịch tiếng Nhật
│   └── insights.js                DANH SÁCH BÀI WORKFORCE INTELLIGENCE
│
└── tools/
    ├── build-layout.js            Đồng bộ header/footer vào mọi trang
    └── check-i18n.js              Kiểm tra thiếu/thừa bản dịch
```

---

## 2. Sửa nội dung thế nào

### Sửa chữ trên trang
Mở file `.html` tương ứng và sửa trực tiếp. Tiếng Anh là bản gốc nằm trong HTML, tiếng
Việt nằm trong `data/vi.js`, tiếng Nhật nằm trong `data/ja.js`. Ba file cùng bộ key
(hiện 322 key). Người xem chọn ngôn ngữ bằng ba nút EN/VI/日本語 ở header, hoặc thêm
`?lang=vi` / `?lang=ja` vào URL.

Ví dụ trong `index.html`:
```html
<h1 data-i18n="home.hero.h1">Build the Right Team in Vietnam.</h1>
```
Sửa phần chữ tiếng Anh ngay tại đây. Muốn đổi tiếng Việt thì mở `data/vi.js`, muốn đổi tiếng Nhật thì mở `data/ja.js`;
tìm key `home.hero.h1` và sửa chuỗi tương ứng.

Quy tắc: **mỗi đoạn chữ có `data-i18n="key"` đều có một dòng cùng key trong `data/vi.js`.**
Xóa key trong `vi.js` thì trang sẽ hiển thị lại bản tiếng Anh.

Kiểm tra còn thiếu bản dịch nào không:
```bash
node tools/check-i18n.js
```

### Sửa menu hoặc footer
Sửa `partials/header.html` hoặc `partials/footer.html`, rồi chạy:
```bash
node tools/build-layout.js
```
Lệnh này ghi header/footer mới vào cả 9 trang và tự đánh dấu mục đang xem.

### Đổi màu, font, khoảng cách
Toàn bộ nằm trong `assets/css/tokens.css`. Đổi `--c-accent` là đổi màu nhấn cả site.

### Thay icon dịch vụ
Toàn bộ icon nằm trong `assets/img/icons.svg` dưới dạng sprite. Mỗi icon là một `<g id="i-tên">`
với stroke 1.5, dùng `currentColor` để đổi màu theo hover.
Trên trang, icon được nhúng qua `<use href="assets/img/icons.svg#i-tên"/>`.
Đổi icon của một card: tìm `href="assets/img/icons.svg#i-cũ"` trong file HTML và sửa thành id mới.

### Thay logo khách hàng trên trust bar
Phần trust bar ở `index.html` (ngay sau section "What Brings You to Vietnam") hiện dùng
tên placeholder. Thay bằng ảnh SVG/PNG thật của khách hàng: đổi thẻ `<span class="trust__logo">…</span>`
thành `<img class="trust__logo" src="assets/img/logo-khach.svg" alt="Tên khách hàng">`.

### Thêm bài Workforce Intelligence
Mở `data/insights.js`, copy một khối `{ ... }` trong mảng `ITEMS` và sửa nội dung.
Bài mới tự xuất hiện ở trang chủ, trang danh sách và phần bài liên quan.

Trang chi tiết bài viết: copy `insight-tech-team-cost.html` thành file mới, sửa nội dung,
rồi trỏ `url` của bài trong `insights.js` sang file đó.

---

## 3. Nối form vào email

Hiện `talk-to-us.html` có `action="REPLACE_WITH_YOUR_FORM_ENDPOINT"`.
Khi chưa cấu hình, form không gửi đi mà hiện cảnh báo.

Chọn một trong ba cách:

**Formspree** (nhanh nhất, có bản miễn phí)
1. Tạo form tại formspree.io, lấy endpoint dạng `https://formspree.io/f/xxxxxxx`
2. Dán vào thuộc tính `action` của thẻ `<form id="leadForm">`

**Google Apps Script + Google Sheet** (miễn phí, dữ liệu về Sheet của bạn)
1. Tạo Google Sheet, vào Extensions → Apps Script
2. Viết `doPost(e)` ghi `e.parameter` xuống Sheet và gửi `MailApp.sendEmail`
3. Deploy as Web App, quyền "Anyone", dán URL vào `action`

**API nội bộ** — dán URL endpoint của bạn vào `action`.

Form đã tự động gửi kèm: `source_page`, `source_cta`, `submitted_at`, và ô bẫy spam ẩn
`company_website` (nếu ô này có giá trị thì đó là bot, hãy loại ở phía server).

---

## 4. Chạy thử tại máy

```bash
python3 -m http.server 4321
```
Rồi mở http://localhost:4321

Thử tiếng Việt nhanh: thêm `?lang=vi` vào URL, ví dụ `http://localhost:4321/?lang=vi`

---

## 5. Publish

### Netlify (khuyến nghị, kéo thả)
1. Vào app.netlify.com → Add new site → Deploy manually
2. Kéo cả thư mục `docs` vào ô upload
3. Site chạy ngay, sau đó gắn tên miền riêng trong Domain settings

### Cloudflare Pages / GitHub Pages
Đẩy thư mục này lên một repo, chọn deploy from branch, thư mục gốc là `/`.

### Google Sites
Google Sites không nhận HTML/CSS toàn trang. Chỉ có hai cách dùng tạm:
- Nhúng site qua khối **Embed → By URL** sau khi đã publish ở Netlify. Cách này giữ nguyên
  thiết kế nhưng nội dung nằm trong iframe nên Google không index tốt.
- Chép thủ công từng đoạn chữ vào các khối có sẵn của Google Sites. Mất gần hết thiết kế.

Khuyến nghị: publish thật ở Netlify hoặc Cloudflare Pages, dùng Google Sites làm trang
nội bộ nếu cần.

---

## 6. Trước khi lên production

- [ ] Thay `zhrone.com` trong thẻ `<link rel="canonical">`, `og:url` của 9 trang, trong
      `robots.txt` và `sitemap.xml` bằng tên miền thật
- [ ] Thay số liệu placeholder ở `hire-in-vietnam.html` (mục Why Vietnam) bằng số có nguồn
- [ ] Thay bảng chi phí và mục Sources trong `insight-tech-team-cost.html`
- [ ] Nối endpoint form và gửi thử một lead
- [ ] Thay `hello@zhrone.com` và link LinkedIn bằng thông tin thật
- [ ] Nhờ pháp chế duyệt `privacy.html`
- [ ] Gắn Google Analytics 4 và Search Console, khai báo sitemap
- [ ] Thay logo SVG trong `partials/header.html`, `partials/footer.html` và
      `assets/img/favicon.svg` bằng logo chính thức

---

## 7. Chưa làm trong MVP (theo đúng tài liệu)

Job board · Candidate login · Client portal · Public talent database · AI matching ·
Payment · Marketplace · Salary calculator phức tạp · CMS quản trị bài viết.

CMS: hiện bài viết quản lý bằng `data/insights.js`. Khi cần admin tự đăng bài không qua dev,
bước tiếp theo là gắn một headless CMS (Decap CMS chạy được ngay trên site tĩnh này, hoặc
Sanity / Contentful) mà không phải dựng lại giao diện.
