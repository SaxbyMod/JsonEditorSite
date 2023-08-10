let ajv = new Ajv();  // The JSON schema validator

let container = document.getElementById("jsoneditor");
let currentSchema = null;  // Holds the uploaded schema

let options = {
    schema: currentSchema,
    onChange: function () {
        if (editor.validate().length == 0) {
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
    const content = editor.get();
    const blob = new Blob([JSON.stringify(content, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
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
        editor.setSchema(currentSchema);

        let currentJSON = editor.get();
        for (let property in currentSchema.properties) {
            if (!currentJSON.hasOwnProperty(property)) {
                currentJSON[property] = null;
            }
        }
        editor.set(currentJSON);

        alert("Schema uploaded and missing fields added successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error uploading schema.");
    });
}
