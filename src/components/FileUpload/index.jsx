import { useState } from "react";
import PropTypes from "prop-types";
import { processCSVToArray } from "../../helpers/csvProcessor";
import "./FileUpload.scss";

function FileUpload({ onDataProcessed }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const validateFile = (file) => {
    if (file.type !== "text/csv" && !file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file only.");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file && validateFile(file)) {
      setSelectedFile(file);
      setIsProcessing(true);

      try {
        await processCSVToArray(file, onDataProcessed);
      } catch (error) {
        setError(`Error processing file: ${error.message}`);
        console.error("Processing error:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setSelectedFile(null);
      event.target.value = "";
    }
  };

  const renderUploadContent = () => {
    if (isProcessing) {
      return (
        <div className="processing">
          <h3>Processing...</h3>
          <p>Reading and parsing CSV file</p>
        </div>
      );
    }

    if (selectedFile) {
      return (
        <div className="file-selected">
          <h3>{selectedFile.name}</h3>
          <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      );
    }

    return (
      <div className="upload-prompt">
        <h3>Click to select your CSV file</h3>
        <p>Choose a file to upload</p>
      </div>
    );
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
          disabled={isProcessing}
        />

        <div className="upload-content">{renderUploadContent()}</div>
      </label>

      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

FileUpload.propTypes = {
  onDataProcessed: PropTypes.func.isRequired,
};

export default FileUpload;
