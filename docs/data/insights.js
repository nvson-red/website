/* =========================================================
   VHR ONE — DỮ LIỆU WORKFORCE INTELLIGENCE
   Thêm bài mới: copy một khối {...} và sửa nội dung.
   Trước khi có CMS, đây là nơi duy nhất cần sửa.
   categories: build | talent | salary | tech | employment | strategy
   ========================================================= */
window.VHR_INSIGHTS = (function () {
  "use strict";

  var CATEGORIES = [
    { id: "all",        label: "All",                     labelVi: "Tất cả" },
    { id: "build",      label: "Build in Vietnam",        labelVi: "Xây dựng tại Việt Nam" },
    { id: "talent",     label: "Talent Intelligence",     labelVi: "Dữ liệu nhân tài" },
    { id: "salary",     label: "Salary & Workforce Cost", labelVi: "Lương & chi phí nhân sự" },
    { id: "tech",       label: "Tech Workforce",          labelVi: "Nhân sự công nghệ" },
    { id: "employment", label: "Employment & HR",         labelVi: "Lao động & nhân sự" },
    { id: "strategy",   label: "Workforce Strategy",      labelVi: "Chiến lược nhân sự" }
  ];

  var ITEMS = [
    {
      slug: "cost-to-build-a-tech-team-in-vietnam",
      url: "insight-tech-team-cost.html",
      category: "salary",
      featured: true,
      title: "What Does It Really Cost to Build a Tech Team in Vietnam?",
      titleVi: "Chi phí thực sự để xây một đội ngũ công nghệ tại Việt Nam là bao nhiêu?",
      teaser: "Salary is only part of the number. A practical breakdown of total workforce cost for a 10-person engineering team.",
      teaserVi: "Lương chỉ là một phần. Bóc tách chi phí nhân sự tổng thể cho một đội kỹ thuật 10 người.",
      author: "VHR One Workforce Intelligence",
      date: "2026-02-18",
      readMinutes: 9,
      cover: "01"
    },
    {
      slug: "vietnam-tech-salary-guide",
      url: "insight-tech-team-cost.html",
      category: "salary",
      featured: true,
      title: "Vietnam Tech Salary Guide",
      titleVi: "Báo cáo lương ngành công nghệ Việt Nam",
      teaser: "Compensation ranges by role, seniority and location — and how to read them before you set a budget.",
      teaserVi: "Khoảng lương theo vị trí, cấp bậc và khu vực — và cách đọc dữ liệu trước khi chốt ngân sách.",
      author: "VHR One Workforce Intelligence",
      date: "2026-01-30",
      readMinutes: 12,
      cover: "02"
    },
    {
      slug: "first-20-employees-in-vietnam",
      url: "insight-tech-team-cost.html",
      category: "build",
      featured: true,
      title: "Your First 20 Employees in Vietnam: What Should the Organization Look Like?",
      titleVi: "20 nhân sự đầu tiên tại Việt Nam: cơ cấu tổ chức nên như thế nào?",
      teaser: "The sequence of roles that keeps an early Vietnam team lean without creating gaps in capability.",
      teaserVi: "Thứ tự tuyển dụng giúp đội ngũ giai đoạn đầu gọn nhẹ mà không thiếu năng lực cốt lõi.",
      author: "VHR One Workforce Intelligence",
      date: "2026-01-12",
      readMinutes: 8,
      cover: "03"
    },
    {
      slug: "hiring-engineers-in-vietnam",
      url: "insight-tech-team-cost.html",
      category: "tech",
      featured: false,
      title: "Hiring Engineers in Vietnam: What Actually Moves Acceptance Rates",
      titleVi: "Tuyển kỹ sư tại Việt Nam: điều gì thực sự tăng tỷ lệ nhận offer",
      teaser: "Interview speed, role clarity and total rewards matter more than brand recognition.",
      teaserVi: "Tốc độ phỏng vấn, sự rõ ràng của vị trí và tổng đãi ngộ quan trọng hơn độ nhận diện thương hiệu.",
      author: "VHR One Workforce Intelligence",
      date: "2025-12-08",
      readMinutes: 7,
      cover: "04"
    },
    {
      slug: "employment-basics-for-foreign-employers",
      url: "insight-tech-team-cost.html",
      category: "employment",
      featured: false,
      title: "Employment Basics Foreign Employers Ask About Most",
      titleVi: "Những vấn đề lao động doanh nghiệp nước ngoài hỏi nhiều nhất",
      teaser: "Contracts, probation, social insurance and the operational habits that keep HR clean.",
      teaserVi: "Hợp đồng, thử việc, bảo hiểm xã hội và các thói quen vận hành giữ hồ sơ nhân sự sạch.",
      author: "VHR One Workforce Intelligence",
      date: "2025-11-20",
      readMinutes: 10,
      cover: "05"
    },
    {
      slug: "workforce-mix-permanent-remote-fractional",
      url: "insight-tech-team-cost.html",
      category: "strategy",
      featured: false,
      title: "Permanent, Remote or Fractional? Choosing Your Workforce Mix",
      titleVi: "Chính thức, remote hay fractional? Chọn cơ cấu nhân sự phù hợp",
      teaser: "A decision framework for balancing cost, control and speed across a growing Vietnam team.",
      teaserVi: "Khung ra quyết định cân bằng chi phí, khả năng kiểm soát và tốc độ khi mở rộng đội ngũ.",
      author: "VHR One Workforce Intelligence",
      date: "2025-10-29",
      readMinutes: 9,
      cover: "06"
    }
  ];

  function catLabel(id) {
    var lang = document.documentElement.lang === "vi";
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    if (!c) return id;
    return lang ? c.labelVi : c.label;
  }

  function fmtDate(iso) {
    var lang = document.documentElement.lang === "vi" ? "vi-VN" : "en-GB";
    return new Date(iso + "T00:00:00").toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" });
  }

  function cardHTML(it, feature) {
    var vi = document.documentElement.lang === "vi";
    var title = vi && it.titleVi ? it.titleVi : it.title;
    var teaser = vi && it.teaserVi ? it.teaserVi : it.teaser;
    return '<a class="insight' + (feature ? " insight--feature" : "") + '" href="' + it.url + '" data-cat="' + it.category + '" data-reveal>' +
      '<span class="insight__cover" aria-hidden="true"><span>' + it.cover + "</span></span>" +
      '<span class="insight__body">' +
        '<span class="insight__cat">' + catLabel(it.category) + "</span>" +
        '<span class="insight__title">' + title + "</span>" +
        '<span class="insight__teaser">' + teaser + "</span>" +
        '<span class="insight__meta"><span>' + it.author + "</span><span>" + fmtDate(it.date) + "</span><span>" + it.readMinutes + " min</span></span>" +
      "</span></a>";
  }

  function renderInto(elId, limit, opts) {
    var el = document.getElementById(elId);
    if (!el) return;
    opts = opts || {};
    var list = ITEMS.slice();
    if (opts.featured === true)  list = list.filter(function (i) { return i.featured; });
    if (opts.featured === false) list = list.filter(function (i) { return !i.featured; });
    if (limit) list = list.slice(0, limit);
    el.innerHTML = list.map(function (i) { return cardHTML(i, opts.feature); }).join("");
    el.querySelectorAll("[data-reveal]").forEach(function (n) { n.classList.add("is-visible"); });
  }

  function renderFilters(elId) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = CATEGORIES.map(function (c, i) {
      return '<button type="button" class="filter" data-cat="' + c.id + '" aria-pressed="' + (i === 0) + '">' +
        (document.documentElement.lang === "vi" ? c.labelVi : c.label) + "</button>";
    }).join("");
  }

  /* Vẽ lại khi đổi ngôn ngữ */
  document.addEventListener("vhr:lang", function () {
    document.querySelectorAll("[data-insights-target]").forEach(function (t) {
      renderInto(t.id, Number(t.dataset.limit) || 0, {
        featured: t.dataset.featured === "true" ? true : t.dataset.featured === "false" ? false : undefined,
        feature: t.dataset.feature === "true"
      });
    });
    renderFilters("insightFilters");
  });

  return { ITEMS: ITEMS, CATEGORIES: CATEGORIES, renderInto: renderInto, renderFilters: renderFilters };
})();
