# 🛡 PhishGuard

> *An intelligent phishing detection tool* to check if a URL or file is *Safe* or *Suspicious* in real-time.

PhishGuard is a lightweight yet powerful web app built with *Flask (Python)* on the backend and a *modern interactive frontend* (HTML, CSS, JS).
It helps users identify *phishing websites & malicious files* with just one click.

---

## ✨ Features

✅ Real-time URL scanning (Safe / Suspicious)
✅ File scanning with extension & size checks
✅ History tracking (stores recent checks in browser)
✅ Export history as CSV
✅ Clean dark UI with *3D effects & animations*
✅ Safety tips & FAQs for users

---

## 🏗 Folder Structure

PhishGuard/
│── app.py # Flask backend server
│── model.pkl # (Optional) ML model for phishing detection
│
├── templates/ # HTML files (Frontend pages)
│ ├── base.html # Common layout template
│ ├── index.html # Home page (URL/File checker)
│ ├── about.html # About page with FAQs & safety tips
│ └── history.html # History page (recent checks)
│
├── static/ # Static files (CSS, JS, images)
│ ├── style.css # Main styling with dark theme & 3D effects
│ └── script.js # Animations, API calls, tilt effects
│
└── README.md # Project documentation (this file)
