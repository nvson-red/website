/* =========================================================
   NHẬN LEAD TỪ zhr.vn VÀ GHI XUỐNG GOOGLE SHEET
   ---------------------------------------------------------
   CÁCH CÀI
   1. Mở Google Sheet của bạn
   2. Extensions -> Apps Script
   3. Xoá code mẫu, dán toàn bộ file này vào, bấm Save
   4. Deploy -> New deployment -> bánh răng -> Web app
         Description:     ZHR lead endpoint
         Execute as:      Me
         Who has access:  Anyone
   5. Bấm Deploy. Lần đầu Google hỏi quyền:
      Advanced -> Go to ... -> Allow
   6. Chép "Web app URL" (dạng .../exec) dán vào
      docs/data/form-config.js, mục endpoint

   LƯU Ý: mỗi lần sửa file này phải Deploy lại
   (Deploy -> Manage deployments -> bút chì -> Version: New -> Deploy)
   thì thay đổi mới có hiệu lực.
   ========================================================= */

/* Điền email để nhận báo lead mới. Để rỗng nếu không cần. */
var EMAIL_BAO = "";

/* Tên sheet sẽ ghi vào. Script tự tạo nếu chưa có. */
var TEN_SHEET = "Leads";

/* Cột script quản lý. Cột bạn tự thêm hãy đặt về bên phải cột cuối cùng,
   script không đụng tới chúng. Khoá bên trái là name trong talk-to-us.html. */
var COT = [
  ["submitted_at", "Thời điểm"],
  ["intent",       "Nhu cầu"],
  ["name",         "Họ tên"],
  ["company",      "Công ty"],
  ["position",     "Chức danh"],
  ["country",      "Quốc gia"],
  ["email",        "Email"],
  ["phone",        "Điện thoại"],
  ["team_size",    "Quy mô đội"],
  ["timeline",     "Thời điểm cần"],
  ["roles",        "Vị trí cần tuyển"],
  ["message",      "Nội dung"],
  ["source_page",  "Trang nguồn"],
  ["source_cta",   "Nút đã bấm"]
];

function doPost(e) {
  var p = (e && e.parameter) || {};

  /* Ô bẫy spam: bot điền vào ô ẩn này, người thật thì không */
  if (p.company_website) return ok();

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    var sheet = laySheet();
    var dong = COT.map(function (c) {
      var val = p[c[0]] || "";
      /* Chặn công thức: giá trị bắt đầu bằng = + - @ sẽ bị Sheets diễn giải */
      return /^[=+\-@]/.test(val) ? "'" + val : val;
    });
    dong[0] = dong[0] || new Date().toISOString();

    sheet.appendRow(dong);
    baoEmail(p);
  } catch (err) {
    console.error(err);
  } finally {
    lock.releaseLock();
  }

  return ok();
}

/* Mở trực tiếp URL trên trình duyệt sẽ chạy hàm này — dùng để kiểm tra đã deploy đúng chưa */
function doGet() {
  return ContentService
    .createTextOutput("ZHR lead endpoint đang chạy.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function ok() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function laySheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(TEN_SHEET) || ss.insertSheet(TEN_SHEET);

  /* Tạo hàng tiêu đề ở lần chạy đầu tiên */
  if (sheet.getLastRow() === 0) {
    var tieuDe = COT.map(function (c) { return c[1]; });
    sheet.appendRow(tieuDe);
    sheet.getRange(1, 1, 1, tieuDe.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function baoEmail(p) {
  if (!EMAIL_BAO) return;
  var than = COT.map(function (c) {
    return c[1] + ": " + (p[c[0]] || "—");
  }).join("\n");

  MailApp.sendEmail({
    to: EMAIL_BAO,
    subject: "Lead mới từ zhr.vn — " + (p.company || p.name || "không rõ"),
    body: than
  });
}
