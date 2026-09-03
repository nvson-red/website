/* Kiểm tra key i18n: chạy `node tools/check-i18n.js` từ thư mục gốc.
   Báo key có trong HTML nhưng thiếu bản dịch, và key thừa trong vi.js. */
const fs = require("fs"), path = require("path");
global.window = {};
require(path.join(process.cwd(), "data/vi.js"));
const dict = global.window.VHR_VI || {};

const used = new Set();
const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));

for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(/data-i18n(?:-ph|-aria)?="([^"'+]+)"/g)) used.add(m[1]);
  
}

const missing = [...used].filter(k => !(k in dict)).sort();
const unused  = Object.keys(dict).filter(k => !used.has(k)).sort();

console.log(`Đã dùng: ${used.size} key · Đã dịch: ${Object.keys(dict).length} key`);
if (missing.length) { console.log("\nTHIẾU bản dịch:"); missing.forEach(k => console.log("  -", k)); }
if (unused.length)  { console.log("\nTHỪA trong vi.js (không trang nào dùng):"); unused.forEach(k => console.log("  -", k)); }
if (!missing.length && !unused.length) console.log("\nOK — không thiếu, không thừa.");
process.exit(missing.length ? 1 : 0);
