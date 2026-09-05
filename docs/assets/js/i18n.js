/* =========================================================
   ZHR GLOBAL — SONG NGỮ EN / VI / JA
   - Tiếng Anh là bản gốc, nằm thẳng trong HTML (tốt cho SEO).
   - Tiếng Việt nằm trong data/vi.js, tiếng Nhật trong data/ja.js.
   - Đánh dấu phần cần dịch bằng data-i18n="key" trên thẻ HTML.
     Với placeholder dùng data-i18n-ph, với aria-label dùng data-i18n-aria.
   - Thêm ngôn ngữ mới: tạo data/<code>.js, thêm code vào VALID + DICTS,
     và thêm một <button data-lang="code"> vào partials/header.html.
   ========================================================= */
(function () {
  "use strict";

  var STORE_KEY = "vhr-lang";
  var VALID = { en: true, vi: true, ja: true };

  /* Bộ từ điển: nếu file .js dịch chưa load thì object rỗng và i18n tự dùng lại tiếng Anh. */
  var DICTS = {
    en: {},
    vi: window.VHR_VI || {},
    ja: window.VHR_JA || {}
  };

  function nodes() { return document.querySelectorAll("[data-i18n],[data-i18n-ph],[data-i18n-aria]"); }

  function apply(lang) {
    if (!VALID[lang]) lang = "en";
    var dict = DICTS[lang] || {};
    var isEn = lang === "en";

    nodes().forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (k) {
        if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
        el.innerHTML = !isEn && dict[k] ? dict[k] : el.dataset.en;
      }
      var kp = el.getAttribute("data-i18n-ph");
      if (kp) {
        if (el.dataset.enPh === undefined) el.dataset.enPh = el.getAttribute("placeholder") || "";
        el.setAttribute("placeholder", !isEn && dict[kp] ? dict[kp] : el.dataset.enPh);
      }
      var ka = el.getAttribute("data-i18n-aria");
      if (ka) {
        if (el.dataset.enAria === undefined) el.dataset.enAria = el.getAttribute("aria-label") || "";
        el.setAttribute("aria-label", !isEn && dict[ka] ? dict[ka] : el.dataset.enAria);
      }
    });

    document.documentElement.lang = lang;
    document.querySelectorAll(".lang-switch button, .lang-float button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("vhr:lang", { detail: { lang: lang } }));
  }

  function current() {
    var q = new URLSearchParams(window.location.search).get("lang");
    if (VALID[q]) return q;
    try {
      var s = localStorage.getItem(STORE_KEY);
      if (VALID[s]) return s;
    } catch (e) {}
    return "en";
  }

  window.VHR_I18N = { apply: apply, current: current, dicts: DICTS };

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".lang-switch button, .lang-float button");
    if (b) apply(b.dataset.lang);
  });

  apply(current());
})();
