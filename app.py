import sqlite3
import re
import html
from pathlib import Path

from flask import Flask, render_template, request
from flask import make_response

app = Flask(__name__)
DATABASE = Path(__file__).with_name("contact_messages.db")


def initialize_database():
    with sqlite3.connect(DATABASE) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


initialize_database()


def apply_security_headers(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    return response


@app.route("/", methods=["GET", "POST"])
def home():
    success = False
    error = ""

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        message = request.form.get("message", "").strip()

        if not name or not email or not message:
            error = "يرجى تعبئة جميع الحقول."
        elif len(name) > 100 or len(email) > 200 or len(message) > 3000:
            error = "أحد الحقول تجاوز الطول المسموح."
        elif not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
            error = "يرجى إدخال بريد إلكتروني صحيح."
        else:
            with sqlite3.connect(DATABASE) as connection:
                connection.execute(
                    "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
                    (name, email, message),
                )
            success = True

    response = make_response(render_template("dashboard.html", success=success, error=error))
    return apply_security_headers(response)


@app.route("/admin/messages")
def admin_messages():
    if request.remote_addr not in ("127.0.0.1", "::1"):
        return "غير مسموح بالوصول إلى هذه الصفحة.", 403

    with sqlite3.connect(DATABASE) as connection:
        connection.row_factory = sqlite3.Row
        messages = connection.execute(
            """
            SELECT id, name, email, message, created_at
            FROM contact_messages
            ORDER BY id DESC
            """
        ).fetchall()

    rows = "".join(
        (
            "<tr>"
            f"<td>{item['id']}</td>"
            f"<td>{html.escape(item['name'])}</td>"
            f"<td>{html.escape(item['email'])}</td>"
            f"<td>{html.escape(item['message'])}</td>"
            f"<td>{html.escape(item['created_at'])}</td>"
            "</tr>"
        )
        for item in messages
    )

    page = f"""
    <!doctype html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>رسائل التواصل</title>
      <style>
        body {{ margin: 0; padding: 32px; background: #f4f7fb; color: #172033; font-family: Arial, sans-serif; }}
        h1 {{ margin-top: 0; }}
        .table-wrap {{ overflow-x: auto; background: #fff; border-radius: 14px; }}
        table {{ width: 100%; border-collapse: collapse; }}
        th, td {{ padding: 14px; border-bottom: 1px solid #e4eaf3; text-align: right; vertical-align: top; }}
        th {{ background: #edf3ff; }}
      </style>
    </head>
    <body>
      <h1>رسائل التواصل</h1>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>الاسم</th><th>البريد</th><th>الرسالة</th><th>التاريخ</th></tr></thead>
          <tbody>{rows or '<tr><td colspan="5">لا توجد رسائل حتى الآن.</td></tr>'}</tbody>
        </table>
      </div>
    </body>
    </html>
    """
    response = make_response(page)
    return apply_security_headers(response)
if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
    