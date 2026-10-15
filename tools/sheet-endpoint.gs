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

/* Dấu hiệu nhận dạng bản code. Mở Web app URL trên trình duyệt sẽ thấy dòng này,
   nhờ đó biết Google đang chạy bản nào — rất hữu ích khi nghi deploy chưa ăn. */
var PHIEN_BAN = "2026-10-15-b";

/* Điền email để nhận báo lead mới. Để rỗng nếu không cần. */
var EMAIL_BAO = "solution@zhr.vn";

/* Tên sheet (tab) sẽ ghi vào. Script tự tạo nếu chưa có. */
var TEN_SHEET = "Leads";

/* Để rỗng nếu script được mở từ chính Sheet (Extensions -> Apps Script).
   Nếu gặp lỗi "You do not have permission to call
   SpreadsheetApp.getActiveSpreadsheet", hãy dán ID của Sheet vào đây.
   ID nằm giữa /d/ và /edit trên thanh địa chỉ:
   docs.google.com/spreadsheets/d/<<<ID NẰM Ở ĐÂY>>>/edit */
var SHEET_ID = "";

/* Cột script quản lý: [khoá, tiêu đề hiện trên Sheet, độ rộng cột tính bằng px].
   Khoá bên trái là name trong talk-to-us.html — đổi khoá là mất dữ liệu cột đó.
   Tiêu đề và độ rộng thì sửa thoải mái. Đổi thứ tự dòng là đổi thứ tự cột.
   Cột bạn tự thêm hãy đặt về bên phải cột cuối cùng, script không đụng tới chúng. */
var COT = [
  ["submitted_at", "Thời điểm",      140],
  ["intent",       "Nhu cầu",        120],
  ["name",         "Họ tên",         170],
  ["company",      "Công ty",        200],
  ["position",     "Chức danh",      150],
  ["country",      "Quốc gia",       110],
  ["email",        "Email",          220],
  ["phone",        "Điện thoại",     130],
  ["team_size",    "Quy mô đội",     110],
  ["timeline",     "Thời điểm cần",  130],
  ["roles",        "Vị trí cần tuyển", 200],
  ["message",      "Nội dung",       380],
  ["source_page",  "Trang nguồn",    150],
  ["source_cta",   "Nút đã bấm",     130]
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
    dong[0] = gioVN(p.submitted_at);

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
  var tin = [
    "ZHR lead endpoint đang chạy.",
    "Phiên bản code: " + PHIEN_BAN,
    "Mail báo: " + (EMAIL_BAO || "(đang tắt)"),
    "Tab ghi vào: " + TEN_SHEET
  ].join("\n");

  return ContentService
    .createTextOutput(tin)
    .setMimeType(ContentService.MimeType.TEXT);
}

function ok() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Mở đúng file Sheet: theo ID nếu có khai báo, không thì lấy file đang gắn script */
function layFile() {
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      "Script không gắn với Sheet nào. Hãy điền SHEET_ID ở đầu file."
    );
  }
  return ss;
}

function laySheet() {
  var ss = layFile();
  var sheet = ss.getSheetByName(TEN_SHEET) || ss.insertSheet(TEN_SHEET);

  /* Tạo hàng tiêu đề ở lần chạy đầu tiên */
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COT.map(function (c) { return c[1]; }));
    dinhDang(sheet);
  }
  return sheet;
}

/* Trang trí bảng. Chạy lại được bất cứ lúc nào — chọn hàm này rồi bấm Run
   nếu muốn áp định dạng cho sheet đang có sẵn dữ liệu. */
function dinhDang(sheet) {
  sheet = sheet || layFile().getSheetByName(TEN_SHEET);
  if (!sheet) return;

  var soCot = COT.length;

  /* Hàng tiêu đề: nền đậm, chữ trắng, đứng yên khi cuộn */
  sheet.getRange(1, 1, 1, soCot)
    .setFontWeight("bold")
    .setFontColor("#ffffff")
    .setBackground("#1f3864")
    .setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);

  /* Độ rộng từng cột theo khai báo trong COT */
  COT.forEach(function (c, i) { sheet.setColumnWidth(i + 1, c[2]); });

  /* Toàn bảng: canh trên, xuống dòng gọn, không để số bị hiểu sai */
  var het = sheet.getMaxRows() - 1;
  if (het > 0) {
    var than = sheet.getRange(2, 1, het, soCot);
    than.setVerticalAlignment("top").setFontSize(10);
    than.setNumberFormat("@");          /* giữ nguyên chữ, không tự đổi kiểu */
    than.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  }

  /* Riêng cột Nội dung thì cho xuống dòng để đọc được cả đoạn */
  var iND = chiSoCot("message");
  if (iND > 0 && het > 0) {
    sheet.getRange(2, iND, het, 1)
      .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  }

  /* Kẻ sọc xen kẽ cho dễ dò hàng */
  var dai = sheet.getRange(1, 1, sheet.getMaxRows(), soCot);
  dai.getBandings().forEach(function (b) { b.remove(); });
  dai.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
}

function chiSoCot(khoa) {
  for (var i = 0; i < COT.length; i++) if (COT[i][0] === khoa) return i + 1;
  return 0;
}

/* Đổi mốc thời gian sang giờ Việt Nam cho dễ đọc */
function gioVN(iso) {
  var d = iso ? new Date(iso) : new Date();
  if (isNaN(d.getTime())) d = new Date();
  return Utilities.formatDate(d, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm");
}

function baoEmail(p) {
  if (!EMAIL_BAO) return;
  p = p || {};
  var than = COT.map(function (c) {
    return c[1] + ": " + (p[c[0]] || "—");
  }).join("\n");

  MailApp.sendEmail({
    to: EMAIL_BAO,
    subject: "Lead mới từ zhr.vn — " + (p.company || p.name || "không rõ"),
    body: than
  });
}

/* =========================================================
   KIỂM TRA ĐƯỜNG GỬI MAIL
   Chọn hàm này trong ô dropdown của Apps Script rồi bấm Run.
   Không cần Deploy — chạy thẳng code vừa Save.
   Đọc kết quả ở "Nhật ký thực thi" phía dưới.
   ========================================================= */
function kiemTraMail() {
  /* Kiểm tra quyền vào Sheet trước, vì đây là chỗ hay hỏng nhất */
  try {
    var ss = layFile();
    console.log("Vào được Sheet: " + ss.getName());
    console.log("Tab '" + TEN_SHEET + "': " +
      (ss.getSheetByName(TEN_SHEET) ? "có" : "CHƯA CÓ"));
  } catch (err) {
    console.log("KHÔNG vào được Sheet — " + err.message);
    console.log("Cách sửa: bấm Run một lần nữa và bấm Allow ở hộp xin quyền,");
    console.log("hoặc điền SHEET_ID ở đầu file rồi chạy lại.");
  }

  console.log("EMAIL_BAO = '" + EMAIL_BAO + "'");
  console.log("Tài khoản chạy script: " + Session.getEffectiveUser().getEmail());
  console.log("Quota mail còn lại hôm nay: " + MailApp.getRemainingDailyQuota());

  if (!EMAIL_BAO) {
    console.log("KẾT LUẬN: EMAIL_BAO đang rỗng nên script không gửi mail.");
    return;
  }

  MailApp.sendEmail({
    to: EMAIL_BAO,
    subject: "ZHR test mail — " + new Date().toISOString(),
    body: "Đọc được thư này nghĩa là đường gửi mail đã thông."
  });
  console.log("Đã gọi sendEmail tới " + EMAIL_BAO + " mà không có lỗi.");
  console.log("Quota sau khi gửi: " + MailApp.getRemainingDailyQuota());
}
