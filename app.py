from flask import Flask, request, send_from_directory, jsonify, render_template

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        uploaded_file.save(uploaded_file.filename)
        with open(uploaded_file.filename, 'r') as f:
            content = f.read()
            return jsonify({"content": content})
    return jsonify({"error": "No file uploaded"}), 400

@app.route('/download', methods=['POST'])
def download_file():
    content = request.json.get('content')
    file_name = "saved_file.json"
    
    with open(file_name, 'w') as f:
        f.write(content)
    
    return jsonify({"download_url": file_name})

@app.route('/upload_schema', methods=['POST'])
def upload_schema():
    schema_file = request.files['schema']
    if schema_file.filename != '':
        schema_filename = "current_schema.json"
        schema_file.save(schema_filename)
        with open(schema_filename, 'r') as f:
            content = f.read()
            return jsonify({"schema": content})
    return jsonify({"error": "No schema uploaded"}), 400

if __name__ == "__main__":
    app.run(debug=True)
