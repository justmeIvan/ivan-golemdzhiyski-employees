import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ResultDisplay from "./components/ResultDisplay";
import "./App.scss";

function App() {
  const [result, setResult] = useState(null);

  const onDataProcessed = (data) => {
    setResult(data);
  };

  return (
    <div className="app-container">
      <h1>Employee Collaboration Finder</h1>
      <FileUpload onDataProcessed={onDataProcessed} />
      <ResultDisplay result={result} />
    </div>
  );
}

export default App;
