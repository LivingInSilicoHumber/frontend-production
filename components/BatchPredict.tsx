"use client";

import React, { useState } from "react";

type Result = {
  smiles: string;
  result: string;
  confidence: number;
  gnn: number;
  rf: number;
};

export default function BatchPredict() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (!file) return;

    const text = await file.text();

    // Split by new line, remove empty lines and trim
    const smilesList = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    const tempResults: Result[] = [];

    for (const smiles of smilesList) {
      try {
        const res = await fetch("http://127.0.0.1:8000/predict", {     
          method: "POST",  
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ smiles }),
        });

        const data = await res.json().catch(() => null);

        tempResults.push({
          smiles,
          result: data.result,
          confidence: data.confidence,
          gnn: data.details.gnn,
          rf: data.details.rf,
        });

      } catch (err) {
        tempResults.push({
          smiles,
          result: "ERROR",
          confidence: 0,
          gnn: 0,
          rf: 0,
        });
      }
    }

    setResults(tempResults);
    setLoading(false);
  };

  const downloadCSV = () => {
    let csv = "smiles,result,confidence,gnn,rf\n";
    results.forEach((r) => {
      csv += `${r.smiles},${r.result},${(r.confidence * 100).toFixed(2)}%,${(r.gnn * 100).toFixed(2)}%,${(r.rf * 100).toFixed(2)}%\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "batch_results.csv";
    a.click();
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="upload-area">
  <label className="upload-btn">
    📁 Choose SMILES File
    <input
      type="file"
      accept=".txt"
      hidden
      onChange={handleFileUpload}
    />
  </label>

  {selectedFile && (
    <span className="file-name">{selectedFile.name}</span>
  )}
</div>


      {loading && <p className="loading-text">Running predictions...</p>}


      {/* Results Section */}
{results.length > 0 && (
  <div className="results-card">

    <div className="table-wrapper">
      <table className="results-table">
        <thead>
          <tr>
            <th>SMILES</th>
            <th>Result</th>
            <th>Confidence</th>
            <th>GNN</th>
            <th>RF</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td className="smiles">{r.smiles}</td>

              <td>
                <span
                  className={`badge ${
                    r.result.toLowerCase().includes("active")
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {r.result}
                </span>
              </td>

              <td>{(r.confidence * 100).toFixed(2)}%</td>
              <td>{(r.gnn * 100).toFixed(2)}%</td>
              <td>{(r.rf * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="download-area">
      <button className="download-btn" onClick={downloadCSV}>
        ⬇ Download CSV
      </button>
    </div>
  </div>
)}

      
      {/* {results.length > 0 && (
        <>
          <table border={1} cellPadding={8} style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>SMILES</th>
                <th>Result</th>
                <th>Confidence</th>
                <th>GNN</th>
                <th>RF</th>

              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.smiles}</td>
                  <td>{r.result}</td>
                  <td>{(r.confidence * 100).toFixed(2)}%</td>
                  <td>{(r.gnn * 100).toFixed(2)}%</td>
                  <td>{(r.rf * 100).toFixed(2)}%</td>

                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={downloadCSV} style={{ marginTop: 15 }}>
            Download CSV
          </button>
        </>
      )} */}
    </div>
  );
}

