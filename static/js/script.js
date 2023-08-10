let ajv = new Ajv();  // The JSON schema validator

let container = document.getElementById("jsoneditor");
let currentSchema = null;  // Holds the uploaded schema

let options = {
    schema: currentSchema,  // Set the schema for validation
    onChange: function () {
        if (editor.validate().length == 0) {  // If no errors
            container.style.border = "";
        } else {
            container.style.border = "1px solid red";
        }
    }
};

let editor = new JSONEditor(container, options);

function upload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        editor.set(JSON.parse(data.content));
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function download() {
    const content = JSON.stringify(editor.get(), null, 2);
    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: content}),
    })
    .then(response => response.json())
    .then(data => {
        const a = document.createElement('a');
        a.href = data.download_url;
        a.download = "saved_file.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function uploadSchema() {
    const schemaInput = document.getElementById('schemaInput');
    const schemaFile = schemaInput.files[0];
    const formData = new FormData();
    formData.append('schema', schemaFile);
    
    fetch('/upload_schema', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        currentSchema = JSON.parse(data.schema);
        editor.setSchema(currentSchema);  // Update the editor's schema
        alert("Schema uploaded successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error uploading schema.");
    });
}
