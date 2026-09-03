/* Đồng bộ header + footer từ partials/ vào tất cả file .html.
   Chạy: node tools/build-layout.js
   Mọi thay đổi menu/footer chỉ cần sửa trong partials/, rồi chạy lệnh này. */
const fs = require("fs");

const header = fs.readFileSync("partials/header.html", "utf8").trim();
const footer = fs.readFileSync("partials/footer.html", "utf8").trim();

function replaceBlock(src, name, content) {
  const re = new RegExp(`<!-- ${name}:START -->[\\s\\S]*?<!-- ${name}:END -->`);
  const block = `<!-- ${name}:START -->\n${content}\n<!-- ${name}:END -->`;
  if (!re.test(src)) throw new Error(`Thiếu marker ${name} trong file`);
  return src.replace(re, block);
}

/* Đánh dấu mục đang xem trên menu */
function markCurrent(html, page) {
  return html.replace(/<a class="nav__link" href="([^"]+)"/g, (m, href) =>
    href === page ? m + ' aria-current="page"' : m);
}

let n = 0;
for (const f of fs.readdirSync(".").filter(x => x.endsWith(".html"))) {
  let s = fs.readFileSync(f, "utf8");
  s = replaceBlock(s, "HEADER", markCurrent(header, f));
  s = replaceBlock(s, "FOOTER", footer);
  fs.writeFileSync(f, s);
  n++;
}
console.log(`Đã đồng bộ header/footer vào ${n} trang.`);
