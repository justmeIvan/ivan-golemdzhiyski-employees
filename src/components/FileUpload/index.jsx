import { useState } from "react";
import "./FileUpload.scss";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const validateFile = (file) => {
    if (file.type !== "text/csv" && !file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file only.");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      // Process file immediately
      console.log("Processing file:", file);
    } else {
      setSelectedFile(null);
      // eslint-disable-next-line no-param-reassign
      event.target.value = "";
    }
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="csv-file" className="upload-area">
        <input
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="file-input"
          data-testid="file-input"
        />

        <div className="upload-content">
          {selectedFile ? (
            <div className="file-selected">
              <h3>{selectedFile.name}</h3>
              <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div className="upload-prompt">
              <h3>Click to select your CSV file</h3>
              <p>Choose a file to upload</p>
            </div>
          )}
        </div>
      </label>

      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
