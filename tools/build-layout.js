/* Đồng bộ header, footer và CTA band từ partials/ vào tất cả file .html.
   Chạy: node tools/build-layout.js
   Mọi thay đổi menu/footer/CTA chỉ cần sửa trong partials/, rồi chạy lệnh này. */
const fs = require("fs");

const header = fs.readFileSync("partials/header.html", "utf8").trim();
const footer = fs.readFileSync("partials/footer.html", "utf8").trim();
const ctaTemplate = fs.readFileSync("partials/cta-band.html", "utf8").trim();

/* Cấu hình CTA cho từng trang. h2/lead/btn là nội dung fallback tiếng Anh,
   h2Key/leadKey/btnKey là khóa i18n tương ứng trong data/vi.js, data/ja.js. */
const CTA = {
  "index.html": {
    h2Key: "home.cta.h2", h2: "Planning to Build a Team in Vietnam?",
    leadKey: "home.cta.lead", lead: "Tell us what you are planning. We'll help you understand the talent market, workforce cost and the practical way to build your team.",
    btnKey: "cta.talkExpert", btn: "Talk to a Vietnam HR Expert", href: "talk-to-us.html", dark: " section--dark"
  },
  "solutions.html": {
    h2Key: "sol.cta.h2", h2: "Not sure which solution is right for you?",
    leadKey: "sol.cta.lead", lead: "Describe where you are today. We'll tell you which capability actually moves your plan forward.",
    btnKey: "cta.talkVhr", btn: "Talk to ZHR Global", href: "talk-to-us.html", dark: ""
  },
  "hire-in-vietnam.html": {
    h2Key: "hire.cta.h2", h2: "Tell Us What You Need",
    leadKey: "hire.cta.lead", lead: "Share the roles, team size and expected timeline. We'll come back with a realistic market view.",
    btnKey: "cta.tellUs", btn: "Tell Us Who You Need", href: "talk-to-us.html?intent=hire-talent", dark: ""
  },
  "workforce-intelligence.html": {
    h2Key: "intel.cta.h2", h2: "Need the Answer for Your Own Team?",
    leadKey: "intel.cta.lead", lead: "Insights are general. Your roles, budget and timeline are not. Tell us the specifics and we'll give you a grounded view.",
    btnKey: "cta.benchmark", btn: "Request a Salary Benchmark", href: "talk-to-us.html?intent=salary-benchmark", dark: ""
  },
  "about.html": {
    h2Key: "about.cta.h2", h2: "Planning Your Vietnam Workforce?",
    leadKey: "about.cta.lead", lead: "Tell us the stage you are at and what you need to get right first.",
    btnKey: "cta.talkVhr", btn: "Talk to ZHR Global", href: "talk-to-us.html", dark: ""
  }
};

function renderCta(page) {
  const c = CTA[page];
  if (!c) return "";
  return ctaTemplate
    .replaceAll("{{H2}}", c.h2)
    .replaceAll("{{H2KEY}}", c.h2Key)
    .replaceAll("{{LEAD}}", c.lead)
    .replaceAll("{{LEADKEY}}", c.leadKey)
    .replaceAll("{{BTN}}", c.btn)
    .replaceAll("{{BTNKEY}}", c.btnKey)
    .replaceAll("{{HREF}}", c.href)
    .replaceAll("{{DARK}}", c.dark);
}

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
  const cta = renderCta(f);
  if (cta) s = replaceBlock(s, "CTA", cta);
  fs.writeFileSync(f, s);
  n++;
}
console.log(`Đã đồng bộ header/footer/CTA vào ${n} trang.`);
