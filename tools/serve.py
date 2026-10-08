#!/usr/bin/env python3
"""Server xem thử tại máy, mô phỏng đúng cách GitHub Pages phục vụ file.

Khác với `python3 -m http.server`, server này hiểu URL không có đuôi .html:
  /solutions  ->  solutions.html
  /           ->  index.html
Nhờ vậy bản xem ở máy giống hệt bản chạy trên zhr.vn.

Chạy:  python3 tools/serve.py [port]
"""

import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

GOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs")


class PagesHandler(SimpleHTTPRequestHandler):
    """Thêm .html khi đường dẫn không có đuôi, giống GitHub Pages."""

    def translate_path(self, path):
        duong_dan = super().translate_path(path)
        if os.path.isdir(duong_dan) or os.path.exists(duong_dan):
            return duong_dan
        kem_html = duong_dan + ".html"
        return kem_html if os.path.exists(kem_html) else duong_dan

    def end_headers(self):
        """Tắt cache để sửa file xong tải lại là thấy ngay."""
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "404" in (fmt % args):
            super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(PagesHandler, directory=os.path.normpath(GOC))
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
        print("Đang chạy tại http://localhost:%d  (Ctrl+C để dừng)" % port)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
