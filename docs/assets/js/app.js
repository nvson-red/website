/* =========================================================
   ZHR GLOBAL — TƯƠNG TÁC CHUNG
   ========================================================= */
(function () {
  "use strict";

  /* --- Hiệu ứng xuất hiện khi cuộn --- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length) {
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

      reveals.forEach(function (el, i) {
        var group = el.closest("[data-reveal-group]");
        if (group) {
          var idx = Array.prototype.indexOf.call(group.querySelectorAll("[data-reveal]"), el);
          el.style.setProperty("--reveal-delay", Math.min(idx, 6) * 70 + "ms");
        }
        io.observe(el);
      });
    }
  }

  /* --- Lọc bài viết theo danh mục --- */
  var filterBar = document.querySelector("[data-filters]");
  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var b = e.target.closest(".filter");
      if (!b) return;
      filterBar.querySelectorAll(".filter").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      var cat = b.dataset.cat;
      var empty = document.querySelector("[data-filter-empty]");
      var shown = 0;
      var scope = document.querySelector("[data-filter-scope]") || document;
      scope.querySelectorAll("[data-cat]").forEach(function (card) {
        var show = cat === "all" || card.dataset.cat === cat;
        card.hidden = !show;
        if (show) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  }

  /* --- Form Talk to Us --- */
  var form = document.getElementById("leadForm");
  if (form) {
    /* Ghi lại nguồn: trang trước + CTA đã bấm + chủ đề */
    var params = new URLSearchParams(window.location.search);
    var intent = params.get("intent");
    if (intent) {
      var pre = form.querySelector('input[name="intent"][value="' + CSS.escape(intent) + '"]');
      if (pre) {
        pre.checked = true;
        pre.closest(".choice").scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    var set = function (name, val) {
      var f = form.querySelector('input[name="' + name + '"]');
      if (f) f.value = val || "";
    };
    set("source_page", params.get("from") || document.referrer || "direct");
    set("source_cta", params.get("cta") || "");
    set("submitted_at", new Date().toISOString());

    form.addEventListener("submit", function (e) {
      var status = document.getElementById("formStatus");
      var endpoint = form.getAttribute("action");

      /* Chưa nối endpoint thật -> không gửi đi, chỉ báo cho người dựng biết */
      if (!endpoint || endpoint.indexOf("REPLACE_WITH") !== -1) {
        e.preventDefault();
        if (status) {
          status.className = "form-status is-err";
          status.textContent = status.dataset.msgSetup;
        }
        return;
      }
      if (status) {
        status.className = "form-status is-ok";
        status.textContent = status.dataset.msgSending;
      }
    });
  }

  /* --- Gắn CTA nguồn vào mọi link dẫn tới form --- */
  document.querySelectorAll('a[href^="talk-to-us.html"]').forEach(function (a) {
    a.addEventListener("click", function () {
      var url = new URL(a.getAttribute("href"), window.location.href);
      if (!url.searchParams.get("cta")) url.searchParams.set("cta", (a.textContent || "").trim().slice(0, 60));
      if (!url.searchParams.get("from")) url.searchParams.set("from", window.location.pathname.split("/").pop() || "index.html");
      a.setAttribute("href", url.pathname.split("/").pop() + url.search + url.hash);
    });
  });
})();

/* =========================================================
   GLOBAL ENTERPRISE POLISH
   Progress bar, card spotlight, back-to-top.
   Không phá vỡ hành vi có sẵn, tôn trọng prefers-reduced-motion.
   ========================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Reading progress bar --- */
  var progress = document.createElement("div");
  progress.className = "progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  var ticking = false;
  function renderProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.transform = "scaleX(" + p.toFixed(4) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(renderProgress); }
  }, { passive: true });
  renderProgress();

  /* --- Spotlight theo con trỏ cho mọi thẻ link --- */
  if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
    Array.prototype.forEach.call(document.querySelectorAll(".card--link"), function (card) {
      card.classList.add("card--spot");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      }, { passive: true });
    });
  }

  /* --- Back to top --- */
  var top = document.createElement("button");
  top.type = "button";
  top.className = "back-top";
  top.setAttribute("aria-label", "Back to top");
  top.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(top);
  top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });
  var onScrollTop = function () { top.classList.toggle("is-visible", window.scrollY > 600); };
  onScrollTop();
  window.addEventListener("scroll", onScrollTop, { passive: true });
})();
