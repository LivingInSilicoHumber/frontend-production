"use client";

import React, { useState } from "react";
import { toast } from "sonner";

// Backend'den gelen veri yapısı
type APIResponse = {
    smiles: string;
    result: string;
    confidence: number;
    details: {
        gnn: number;
        rf: number;
        mol_weight?: number;
        logp?: number;
    };
};

interface BatchPredictProps {
    apiBaseUrl?: string;
}

export default function BatchPredict({ apiBaseUrl }: BatchPredictProps) {
    const [results, setResults] = useState<APIResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const BASE_URL = apiBaseUrl || "https://chem-prediction-api-ca.azurewebsites.net";

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;

        setFileName(file.name);
        setLoading(true);
        setResults([]);

        try {
            const text = await file.text();

            const smilesList = text
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter((s) => s.length > 1);

            if (smilesList.length === 0) {
                toast.error("Dosya boş veya format hatalı.");
                setLoading(false);
                return;
            }

            const res = await fetch(`${BASE_URL}/predict/batch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ smiles_list: smilesList }),
            });

            if (!res.ok) {
                throw new Error("API isteği başarısız oldu.");
            }

            const data: APIResponse[] = await res.json();
            setResults(data);
            toast.success(`${data.length} molekül başarıyla analiz edildi!`);
        } catch (err) {
            console.error(err);
            toast.error("Bir hata oluştu. API bağlantısını kontrol edin.");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    const downloadCSV = () => {
        if (results.length === 0) return;

        let csv = "SMILES,Result,Confidence,GNN_Prob,RF_Prob\n";
        results.forEach((r) => {
            const safeSmiles = r.smiles.includes(",") ? `"${r.smiles}"` : r.smiles;
            const gnnVal = r.details.gnn !== undefined ? (r.details.gnn * 100).toFixed(2) : "0.00";
            const rfVal = r.details.rf !== undefined ? (r.details.rf * 100).toFixed(2) : "0.00";

            csv += `${safeSmiles},${r.result},${(r.confidence * 100).toFixed(2)}%,${gnnVal}%,${rfVal}%\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "prediction_results.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
            <div className="flex flex-col items-center justify-center gap-3">
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                    <span>📁 Upload SMILES File (.txt/.csv)</span>
                    <input type="file" accept=".txt,.csv" hidden onChange={handleFileUpload} disabled={loading} />
                </label>

                {fileName && <span className="text-sm text-slate-600">Selected: {fileName}</span>}

                {loading && (
                    <div className="flex items-center gap-2 text-blue-600 animate-pulse">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing compounds...</span>
                    </div>
                )}
            </div>

            {results.length > 0 && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-slate-800">Results ({results.length})</h3>
                        <button
                            onClick={downloadCSV}
                            className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-black transition-colors"
                        >
                            ⬇ Download CSV
                        </button>
                    </div>

                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 shadow-sm bg-white">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">SMILES</th>
                                    <th className="px-4 py-3">Result</th>
                                    <th className="px-4 py-3">Conf.</th>
                                    <th className="px-4 py-3">GNN</th>
                                    <th className="px-4 py-3">RF</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {results.map((r, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-2 font-mono text-xs text-slate-600 truncate max-w-[150px]" title={r.smiles}>
                                            {r.smiles}
                                        </td>
                                        {/* ✅ DÜZELTME BURADA: startsWith("INACTIVE") kullanıyoruz */}
                                        <td className="px-4 py-2">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    r.result.startsWith("INACTIVE")
                                                        ? "bg-red-100 text-red-800" // INACTIVE ise Kırmızı
                                                        : "bg-green-100 text-green-800" // ACTIVE ise Yeşil
                                                }`}
                                            >
                                                {r.result}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-slate-700">{(r.confidence * 100).toFixed(1)}%</td>
                                        <td className="px-4 py-2 text-slate-500">
                                            {r.details.gnn !== undefined ? (r.details.gnn * 100).toFixed(1) : "N/A"}%
                                        </td>
                                        <td className="px-4 py-2 text-slate-500">
                                            {r.details.rf !== undefined ? (r.details.rf * 100).toFixed(1) : "N/A"}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
