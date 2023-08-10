from flask import Flask, request, jsonify, render_template

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        content = uploaded_file.read().decode('utf-8')
        return jsonify({"content": content})
    return jsonify({"error": "No file uploaded"}), 400

@app.route('/upload_schema', methods=['POST'])
def upload_schema():
    schema_file = request.files['schema']
    if schema_file.filename != '':
        schema_content = schema_file.read().decode('utf-8')
        return jsonify({"schema": schema_content})
    return jsonify({"error": "No schema uploaded"}), 400

if __name__ == "__main__":
    app.run(debug=True)
