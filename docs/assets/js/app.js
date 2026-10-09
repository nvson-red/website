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

    /* Lấy câu thông báo theo ngôn ngữ đang chọn, mặc định là bản tiếng Anh trong HTML */
    var t = function (key, fallback) {
      var lang = document.documentElement.lang;
      var dict = lang === "vi" ? window.VHR_VI : lang === "ja" ? window.VHR_JA : null;
      return (dict && dict[key]) || fallback;
    };

    var say = function (status, kind, key, fallback) {
      if (!status) return;
      status.className = "form-status is-" + kind;
      status.textContent = t(key, fallback);
    };

    form.addEventListener("submit", function (e) {
      var status = document.getElementById("formStatus");
      var cfg = window.VHR_FORM;

      /* Ô bẫy spam có chữ -> coi như đã gửi, không gửi đi thật */
      if (form.company_website && form.company_website.value) {
        e.preventDefault();
        say(status, "ok", "form.status.ok", status.dataset.msgOk);
        return;
      }

      /* Gửi sang Apps Script để ghi xuống Google Sheet */
      if (cfg && cfg.endpoint) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }

        say(status, "ok", "form.status.sending", status.dataset.msgSending);
        set("submitted_at", new Date().toISOString());

        /* no-cors: Apps Script không trả header CORS nên không đọc được phản hồi,
           nhưng dữ liệu vẫn ghi xuống Sheet bình thường. */
        fetch(cfg.endpoint, {
          method: "POST",
          mode: "no-cors",
          body: new FormData(form)
        }).then(function () {
          form.reset();
          say(status, "ok", "form.status.ok", status.dataset.msgOk);
        }).catch(function () {
          say(status, "err", "form.status.err", status.dataset.msgErr);
        });
        return;
      }

      /* Chưa nối endpoint thật -> không gửi đi, chỉ báo cho người dựng biết */
      var endpoint = form.getAttribute("action");
      if (!endpoint || endpoint.indexOf("REPLACE_WITH") !== -1) {
        e.preventDefault();
        say(status, "err", "", status.dataset.msgSetup);
        return;
      }
      say(status, "ok", "form.status.sending", status.dataset.msgSending);
    });
  }

  /* --- Gắn CTA nguồn vào mọi link dẫn tới form --- */
  document.querySelectorAll('a[href^="/talk-to-us"]').forEach(function (a) {
    a.addEventListener("click", function () {
      var url = new URL(a.getAttribute("href"), window.location.href);
      if (!url.searchParams.get("cta")) url.searchParams.set("cta", (a.textContent || "").trim().slice(0, 60));
      if (!url.searchParams.get("from")) url.searchParams.set("from", window.location.pathname || "/");
      a.setAttribute("href", url.pathname + url.search + url.hash);
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

  /* --- Nhường chỗ cho đáy trang ---
     Nút ngôn ngữ và nút về đầu trang đều position:fixed nên che mất dòng bản
     quyền và link Chính sách khi cuộn hết. Ẩn cả hai khi dải cuối footer lọt
     vào khung nhìn, hiện lại ngay khi cuộn lên. */
  var footerBottom = document.querySelector(".footer__bottom");
  if (footerBottom && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle("is-at-footer", entries[0].isIntersecting);
    }, { rootMargin: "0px 0px -8px 0px" }).observe(footerBottom);
  }
})();
