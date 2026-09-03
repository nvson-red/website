/* =========================================================
   VHR ONE — SONG NGỮ EN / VI
   - Tiếng Anh là bản gốc, nằm thẳng trong HTML (tốt cho SEO).
   - Tiếng Việt nằm trong data/vi.js theo cặp key: "bản dịch".
   - Đánh dấu phần cần dịch bằng data-i18n="key" trên thẻ HTML.
     Với placeholder dùng data-i18n-ph, với aria-label dùng data-i18n-aria.
   ========================================================= */
(function () {
  "use strict";

  var STORE_KEY = "vhr-lang";
  var dict = window.VHR_VI || {};

  function nodes() { return document.querySelectorAll("[data-i18n],[data-i18n-ph],[data-i18n-aria]"); }

  function apply(lang) {
    var vi = lang === "vi";
    nodes().forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (k) {
        if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
        el.innerHTML = vi && dict[k] ? dict[k] : el.dataset.en;
      }
      var kp = el.getAttribute("data-i18n-ph");
      if (kp) {
        if (el.dataset.enPh === undefined) el.dataset.enPh = el.getAttribute("placeholder") || "";
        el.setAttribute("placeholder", vi && dict[kp] ? dict[kp] : el.dataset.enPh);
      }
      var ka = el.getAttribute("data-i18n-aria");
      if (ka) {
        if (el.dataset.enAria === undefined) el.dataset.enAria = el.getAttribute("aria-label") || "";
        el.setAttribute("aria-label", vi && dict[ka] ? dict[ka] : el.dataset.enAria);
      }
    });

    document.documentElement.lang = vi ? "vi" : "en";
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("vhr:lang", { detail: { lang: lang } }));
  }

  function current() {
    /* Ưu tiên ?lang=vi trên URL, sau đó tới lựa chọn đã lưu */
    var q = new URLSearchParams(window.location.search).get("lang");
    if (q === "vi" || q === "en") return q;
    try { return localStorage.getItem(STORE_KEY) || "en"; } catch (e) { return "en"; }
  }

  window.VHR_I18N = { apply: apply, current: current, dict: dict };

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".lang-switch button");
    if (b) apply(b.dataset.lang);
  });

  apply(current());
})();
