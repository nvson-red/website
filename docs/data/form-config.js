/* =========================================================
   CẤU HÌNH NƠI NHẬN LEAD TỪ FORM "TALK TO US"
   ---------------------------------------------------------
   Lead được gửi sang một Apps Script, script này ghi thẳng
   xuống Google Sheet của bạn.

   Cách lấy đường dẫn dưới đây:
   1. Mở Google Sheet -> Extensions -> Apps Script
   2. Dán nội dung tools/sheet-endpoint.gs vào
   3. Deploy -> New deployment -> Type: Web app
      - Execute as: Me
      - Who has access: Anyone
   4. Chép "Web app URL" (dạng .../exec) dán vào endpoint

   Khi endpoint còn rỗng, website vẫn chạy bình thường và form
   chỉ báo "chưa cấu hình" thay vì gửi đi.
   ========================================================= */
window.VHR_FORM = {
  /* Ví dụ: "https://script.google.com/macros/s/AKfycbx.../exec" */
  endpoint: "https://script.google.com/macros/s/AKfycbycvsYhqBGkUL5SiUprFYrFzjtbnEcJUGyvubrnUcIzHeyvzOP_kCSac6CAX9ukCLI7vg/exec"
};
