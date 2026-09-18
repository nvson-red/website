/* Kiểm tra key i18n cho tất cả ngôn ngữ.
   Chạy: node tools/check-i18n.js
   Báo mỗi ngôn ngữ: key có trong HTML nhưng thiếu bản dịch, và key thừa trong file dịch. */
const fs = require("fs"), path = require("path"), vm = require("vm");

const LANGS = [
  { code: "vi", file: "data/vi.js", global: "VHR_VI" },
  { code: "ja", file: "data/ja.js", global: "VHR_JA" }
];

let allOk = true;

const insightContext = {
  window: {},
  document: { addEventListener: function () {} }
};
vm.runInNewContext(fs.readFileSync(path.join(process.cwd(), "data/insights.js"), "utf8"), insightContext);
const insights = insightContext.window.VHR_INSIGHTS;

for (const category of insights.CATEGORIES) {
  for (const field of ["labelVi", "labelJa"]) {
    if (!category[field]) {
      console.log(`THIẾU bản dịch động: category ${category.id}.${field}`);
      allOk = false;
    }
  }
}

for (const item of insights.ITEMS) {
  if (!insights.CATEGORIES.some(category => category.id === item.category)) {
    console.log(`CATEGORY không hợp lệ: ${item.slug}.${item.category}`);
    allOk = false;
  }
  for (const field of ["titleVi", "titleJa", "teaserVi", "teaserJa"]) {
    if (!item[field]) {
      console.log(`THIẾU bản dịch động: ${item.slug}.${field}`);
      allOk = false;
    }
  }
}

/* Thu thập key đã dùng trong HTML */
const used = new Set();
for (const f of fs.readdirSync(".").filter(x => x.endsWith(".html"))) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(/data-i18n(?:-ph|-aria)?="([^"'+]+)"/g)) used.add(m[1]);
}

for (const L of LANGS) {
  global.window = {};
  delete require.cache[require.resolve(path.join(process.cwd(), L.file))];
  require(path.join(process.cwd(), L.file));
  const dict = global.window[L.global] || {};

  const missing = [...used].filter(k => !(k in dict)).sort();
  const unused  = Object.keys(dict).filter(k => !used.has(k)).sort();

  console.log(`\n== ${L.code.toUpperCase()} ==  đã dùng: ${used.size} · đã dịch: ${Object.keys(dict).length}`);
  if (missing.length) { console.log("THIẾU bản dịch:"); missing.forEach(k => console.log("  -", k)); allOk = false; }
  if (unused.length)  { console.log("THỪA (không trang nào dùng):"); unused.forEach(k => console.log("  -", k)); allOk = false; }
  if (!missing.length && !unused.length) console.log("OK — không thiếu, không thừa.");
}
process.exit(allOk ? 0 : 1);
