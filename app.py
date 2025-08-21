from flask import Flask, request, jsonify, render_template
import joblib
import os

app = Flask(__name__)

# Load your ML model (if any)
model = None
try:
    if os.path.exists("model.pkl"):
        model = joblib.load("model.pkl")
    else:
        print("Warning: model.pkl not found. Using fallback prediction method.")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Using fallback prediction method.")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/history")
def history():
    return render_template("history.html")

@app.route("/check", methods=["POST"])
def check_url():
    data = request.json
    url = data.get("url")
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    # Example prediction (replace with your real logic)
    if model:
        try:
            prediction = model.predict([[url]])  # Dummy — replace with real features
            result = "Suspicious" if prediction[0] == 1 else "Safe"
        except Exception as e:
            result = "Error in prediction"
    else:
        # Fallback prediction method
        result = "Safe" if "http" in url.lower() else "Suspicious"
    
    return jsonify({"url": url, "result": result})


@app.route("/check-file", methods=["POST"])
def check_file():
    uploaded_file = request.files.get("file")
    if uploaded_file is None or uploaded_file.filename == "":
        return jsonify({"error": "File is required"}), 400

    filename = uploaded_file.filename
    name, ext = os.path.splitext(filename)
    ext = ext.lower().lstrip(".")

    # Read a bounded amount to estimate size safely
    try:
        uploaded_file.stream.seek(0)
    except Exception:
        pass
    content = uploaded_file.read()
    size_bytes = len(content) if content is not None else 0

    # Simple heuristic-based verdict (replace with your model logic)
    suspicious_extensions = {
        "exe", "js", "vbs", "bat", "cmd", "scr", "ps1", "jar", "msi", "apk"
    }
    result = "Safe"
    if ext in suspicious_extensions:
        result = "Suspicious"
    elif size_bytes > 25 * 1024 * 1024:  # >25MB
        result = "Suspicious"

    return jsonify({
        "filename": filename,
        "size_bytes": size_bytes,
        "result": result
    })

if __name__ == "__main__":
    app.run(debug=True)