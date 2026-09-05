/* =========================================================
   ZHR GLOBAL — HÀNH VI CỦA HEADER (menu mobile, viền khi cuộn, năm)
   Nội dung header/footer nằm ở partials/ và đã được ghi thẳng vào HTML.
   ========================================================= */
(function () {
  "use strict";

  /* --- Nạp sprite icon inline để <use href="#i-..."> hoạt động ổn định ---
     Tham chiếu sprite ngoài (<use href="file.svg#id">) không đáng tin trên
     nhiều trình duyệt; ta fetch icons.svg rồi chèn thẳng vào đầu <body>. */
  (function loadSprite() {
    var existing = document.getElementById("vhr-sprite");
    if (existing) return;
    fetch("assets/img/icons.svg")
      .then(function (r) { return r.ok ? r.text() : null; })
      .then(function (svg) {
        if (!svg) return;
        var holder = document.createElement("div");
        holder.id = "vhr-sprite";
        holder.setAttribute("aria-hidden", "true");
        holder.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
        holder.innerHTML = svg;
        document.body.insertBefore(holder, document.body.firstChild);
      })
      .catch(function () {});
  })();

  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
