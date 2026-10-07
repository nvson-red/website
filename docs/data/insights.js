/* =========================================================
   ZHR GLOBAL — DỮ LIỆU HR INSIGHTS
   Thêm bài mới: copy một khối {...} và sửa nội dung.
   Trước khi có CMS, đây là nơi duy nhất cần sửa.
   categories: build | talent | salary | tech | employment | strategy
   ========================================================= */
window.VHR_INSIGHTS = (function () {
  "use strict";

  var CATEGORIES = [
    { id: "all",        label: "All",                     labelVi: "Tất cả",                         labelJa: "すべて" },
    { id: "build",      label: "Build in Vietnam",        labelVi: "Xây dựng tại Việt Nam",          labelJa: "ベトナムでの組織づくり" },
    { id: "talent",     label: "Talent Intelligence",     labelVi: "Dữ liệu nhân tài",               labelJa: "人材インテリジェンス" },
    { id: "salary",     label: "Salary & Workforce Cost", labelVi: "Lương & chi phí nhân sự",        labelJa: "給与・人件費" },
    { id: "tech",       label: "Tech Workforce",          labelVi: "Nhân sự công nghệ",              labelJa: "テック人材" },
    { id: "employment", label: "Employment & HR",         labelVi: "Lao động & nhân sự",             labelJa: "雇用・人事" },
    { id: "strategy",   label: "Workforce Strategy",      labelVi: "Chiến lược nhân sự",             labelJa: "人材戦略" }
  ];

  var ITEMS = [
    {
      slug: "cost-to-build-a-tech-team-in-vietnam",
      url: "insight-tech-team-cost.html",
      category: "salary",
      featured: true,
      title: "What Does It Really Cost to Build a Tech Team in Vietnam?",
      titleVi: "Chi phí thực sự để xây một đội ngũ công nghệ tại Việt Nam là bao nhiêu?",
      titleJa: "ベトナムでテックチームをつくる本当のコストとは？",
      teaser: "Salary is only part of the number. A practical breakdown of total workforce cost for a 10-person engineering team.",
      teaserVi: "Lương chỉ là một phần. Bóc tách chi phí nhân sự tổng thể cho một đội kỹ thuật 10 người.",
      teaserJa: "給与はコストの一部にすぎません。10人のエンジニアチームにかかる総人件費を実務的に分解します。",
      author: "ZHR Global HR Insights",
      date: "2026-02-18",
      readMinutes: 9,
      cover: "01",
      image: "assets/img/insights/insight-salary-cost.jpg"
    },
    {
      slug: "vietnam-tech-salary-guide",
      url: "insight-vietnam-tech-salary.html",
      category: "tech",
      featured: true,
      title: "Vietnam Tech Salary Guide",
      titleVi: "Báo cáo lương ngành công nghệ Việt Nam",
      titleJa: "ベトナムIT人材の給与ガイド",
      teaser: "Compensation ranges by role, seniority and location — and how to read them before you set a budget.",
      teaserVi: "Khoảng lương theo vị trí, cấp bậc và khu vực — và cách đọc dữ liệu trước khi chốt ngân sách.",
      teaserJa: "職種、経験レベル、地域別の報酬レンジと、予算を決める前にデータを読み解く方法を紹介します。",
      author: "ZHR Global HR Insights",
      date: "2026-01-30",
      readMinutes: 12,
      cover: "02",
      image: "assets/img/insights/insight-tech-salary.jpg"
    },
    {
      slug: "first-20-employees-in-vietnam",
      url: "insight-first-20-employees.html",
      category: "build",
      featured: true,
      title: "Your First 20 Employees in Vietnam: What Should the Organization Look Like?",
      titleVi: "20 nhân sự đầu tiên tại Việt Nam: cơ cấu tổ chức nên như thế nào?",
      titleJa: "ベトナムで最初の20人を採用するなら、組織はどう設計すべきか？",
      teaser: "The sequence of roles that keeps an early Vietnam team lean without creating gaps in capability.",
      teaserVi: "Thứ tự tuyển dụng giúp đội ngũ giai đoạn đầu gọn nhẹ mà không thiếu năng lực cốt lõi.",
      teaserJa: "初期のベトナムチームをスリムに保ちながら、必要な能力の不足を防ぐ採用順序を解説します。",
      author: "ZHR Global HR Insights",
      date: "2026-01-12",
      readMinutes: 8,
      cover: "03",
      image: "assets/img/insights/insight-build-vietnam.jpg"
    },
    {
      slug: "hiring-engineers-in-vietnam",
      url: "insight-hiring-engineers-vietnam.html",
      category: "tech",
      featured: false,
      title: "Hiring Engineers in Vietnam: What Actually Moves Acceptance Rates",
      titleVi: "Tuyển kỹ sư tại Việt Nam: điều gì thực sự tăng tỷ lệ nhận offer",
      titleJa: "ベトナムでエンジニアを採用するには？承諾率を本当に高める要素",
      teaser: "Interview speed, role clarity and total rewards matter more than brand recognition.",
      teaserVi: "Tốc độ phỏng vấn, sự rõ ràng của vị trí và tổng đãi ngộ quan trọng hơn độ nhận diện thương hiệu.",
      teaserJa: "面接の速さ、職務内容の明確さ、総合的な報酬は、知名度以上に重要です。",
      author: "ZHR Global HR Insights",
      date: "2025-12-08",
      readMinutes: 7,
      cover: "04",
      image: "assets/img/insights/insight-hiring-engineers.jpg",
      imageCredit: "Mizuno K. / Pexels",
      imageSource: "https://www.pexels.com/photo/man-and-woman-talking-about-programming-12899168/"
    },
    {
      slug: "employment-basics-for-foreign-employers",
      url: "insight-employment-basics.html",
      category: "employment",
      featured: false,
      title: "Employment Basics Foreign Employers Ask About Most",
      titleVi: "Những vấn đề lao động doanh nghiệp nước ngoài hỏi nhiều nhất",
      titleJa: "外国企業からよく寄せられる雇用の基本",
      teaser: "Contracts, probation, social insurance and the operational habits that keep HR clean.",
      teaserVi: "Hợp đồng, thử việc, bảo hiểm xã hội và các thói quen vận hành giữ hồ sơ nhân sự sạch.",
      teaserJa: "契約、試用期間、社会保険、そして人事管理を適切に保つための実務習慣を解説します。",
      author: "ZHR Global HR Insights",
      date: "2025-11-20",
      readMinutes: 10,
      cover: "05",
      image: "assets/img/insights/insight-employment-basics.jpg",
      imageCredit: "Mikhail Nilov / Pexels",
      imageSource: "https://www.pexels.com/photo/two-women-reading-a-document-in-the-office-8101499/"
    },
    {
      slug: "workforce-mix-permanent-remote-fractional",
      url: "insight-workforce-mix.html",
      category: "strategy",
      featured: false,
      title: "Permanent, Remote or Fractional? Choosing Your Workforce Mix",
      titleVi: "Chính thức, remote hay fractional? Chọn cơ cấu nhân sự phù hợp",
      titleJa: "正社員、リモート、それともフラクショナル？人材構成の選び方",
      teaser: "A decision framework for balancing cost, control and speed across a growing Vietnam team.",
      teaserVi: "Khung ra quyết định cân bằng chi phí, khả năng kiểm soát và tốc độ khi mở rộng đội ngũ.",
      teaserJa: "拡大するベトナムチームで、コスト、管理性、スピードのバランスを取るための判断フレームワークです。",
      author: "ZHR Global HR Insights",
      date: "2025-10-29",
      readMinutes: 9,
      cover: "06",
      image: "assets/img/insights/insight-workforce-mix.jpg",
      imageCredit: "Karola G. / Pexels",
      imageSource: "https://www.pexels.com/photo/group-of-people-having-a-discussion-7876895/"
    }
  ];

  function catLabel(id) {
    var lang = document.documentElement.lang === "vi";
    var isJa = document.documentElement.lang === "ja";
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    if (!c) return id;
    return lang ? c.labelVi : isJa ? c.labelJa : c.label;
  }

  function fmtDate(iso) {
    var lang = document.documentElement.lang === "vi" ? "vi-VN" : document.documentElement.lang === "ja" ? "ja-JP" : "en-GB";
    return new Date(iso + "T00:00:00").toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" });
  }

  function cardHTML(it, feature) {
    var vi = document.documentElement.lang === "vi";
    var ja = document.documentElement.lang === "ja";
    var title = vi && it.titleVi ? it.titleVi : ja && it.titleJa ? it.titleJa : it.title;
    var teaser = vi && it.teaserVi ? it.teaserVi : ja && it.teaserJa ? it.teaserJa : it.teaser;
    var readLabel = vi ? "phút" : ja ? "分" : "min";
    return '<a class="insight' + (feature ? " insight--feature" : "") + '" href="' + it.url + '" data-cat="' + it.category + '" data-reveal>' +
      '<span class="insight__cover" aria-hidden="true">' +
        (it.image ? '<img src="' + it.image + '" alt="" width="1600" height="900" loading="lazy"><span hidden>' + it.cover + "</span>" : '<span>' + it.cover + "</span>") +
      "</span>" +
      '<span class="insight__body">' +
        '<span class="insight__cat">' + catLabel(it.category) + "</span>" +
        '<span class="insight__title">' + title + "</span>" +
        '<span class="insight__teaser">' + teaser + "</span>" +
        '<span class="insight__meta"><span>' + it.author + "</span><span>" + fmtDate(it.date) + "</span><span>" + it.readMinutes + " " + readLabel + "</span></span>" +
      "</span></a>";
  }

  function selectItems(limit, opts) {
    var list = ITEMS.slice();
    if (opts.excludeSlug) list = list.filter(function (i) { return i.slug !== opts.excludeSlug; });
    if (opts.featured === true)  list = list.filter(function (i) { return i.featured; });
    if (opts.featured === false) list = list.filter(function (i) { return !i.featured; });
    if (opts.excludeTarget) {
      var other = document.getElementById(opts.excludeTarget);
      if (other) {
        var shown = selectItems(Number(other.dataset.limit) || 0, targetOpts(other)).map(function (i) { return i.slug; });
        list = list.filter(function (i) { return shown.indexOf(i.slug) === -1; });
      }
    }
    return limit ? list.slice(0, limit) : list;
  }

  function targetOpts(t) {
    return {
      excludeSlug: t.dataset.exclude || undefined,
      excludeTarget: t.dataset.excludeTarget || undefined,
      featured: t.dataset.featured === "true" ? true : t.dataset.featured === "false" ? false : undefined,
      feature: t.dataset.feature === "true"
    };
  }

  function renderInto(elId, limit, opts) {
    var el = document.getElementById(elId);
    if (!el) return;
    opts = opts || {};
    var list = selectItems(limit, opts);
    el.innerHTML = list.map(function (i) { return cardHTML(i, opts.feature); }).join("");
    el.querySelectorAll(".insight__cover img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.hidden = true;
        if (img.nextElementSibling) img.nextElementSibling.hidden = false;
      });
    });
    el.querySelectorAll("[data-reveal]").forEach(function (n) { n.classList.add("is-visible"); });
  }

  function renderFilters(elId) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = CATEGORIES.map(function (c, i) {
      return '<button type="button" class="filter" data-cat="' + c.id + '" aria-pressed="' + (i === 0) + '">' +
        (document.documentElement.lang === "vi" ? c.labelVi : document.documentElement.lang === "ja" ? c.labelJa : c.label) + "</button>";
    }).join("");
  }

  /* Vẽ lại khi đổi ngôn ngữ */
  document.addEventListener("vhr:lang", function () {
    document.querySelectorAll("[data-insights-target]").forEach(function (t) {
      renderInto(t.id, Number(t.dataset.limit) || 0, targetOpts(t));
    });
    renderFilters("insightFilters");
  });

  return { ITEMS: ITEMS, CATEGORIES: CATEGORIES, renderInto: renderInto, renderFilters: renderFilters };
})();
