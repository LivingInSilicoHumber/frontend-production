"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MolecularBackground } from "@/components/molecular-background";
import { MoleculeIcon } from "@/components/molecule-icon";
import { SmilesInput } from "@/components/smiles-input";
import { ResultModal } from "@/components/result-modal";
import BatchPredict from "@/components/BatchPredict";
import Navbar from "@/components/Navbar";

// ✨ YENİ ABİMİZ (Canlı API Adresi)
const API_BASE_URL = "https://chem-prediction-api-ca.azurewebsites.net";

// Simple SMILES validation - checks for common patterns
function validateSmiles(smiles: string): boolean {
    if (!smiles || smiles.length < 2) return false;

    const validPattern = /^[A-Za-z0-9@+\-\[\]\(\)\\\/=#%.*]+$/;
    if (!validPattern.test(smiles)) return false;

    const brackets = { "(": ")", "[": "]" };
    const stack: string[] = [];

    for (const char of smiles) {
        if (char in brackets) {
            stack.push(brackets[char as keyof typeof brackets]);
        } else if ([")", "]"].includes(char)) {
            if (stack.pop() !== char) return false;
        }
    }

    return stack.length === 0;
}

export default function TBDrugDiscoveryPage() {
    const [smilesInput, setSmilesInput] = useState("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        isActive: boolean;
        confidence: number;
        gnnAccuracy: number;
        rfAccuracy: number;
        smiles: string;
    } | null>(null);

    const [moleculeImageUrl, setMoleculeImageUrl] = useState<string | null>(null);

    const handleInputChange = useCallback((value: string) => {
        setSmilesInput(value);
        if (value.length > 0) setIsValid(validateSmiles(value));
        else setIsValid(null);
    }, []);

    const handleAnalyze = useCallback(async () => {
        if (!isValid) {
            toast.error("Invalid SMILES detected", {
                description: "Please enter a valid molecular structure.",
                duration: 3000,
            });
            return;
        }

        // 🖼️ GÖRSEL URL GÜNCELLEMESİ
        // Backend'de '/molecule-image' endpoint'i varsa buradan çeker
        setMoleculeImageUrl(`${API_BASE_URL}/molecule-image?smiles=${encodeURIComponent(smilesInput)}`);

        setIsAnalyzing(true);
        setShowModal(true);
        setIsLoading(true);

        try {
            // 🚀 API URL GÜNCELLEMESİ (Azure'a istek atar)
            const res = await fetch(`${API_BASE_URL}/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ smiles: smilesInput }),
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.statusText}`);
            }

            const data = await res.json();

            setResult({
                isActive: data.result === "Active", // Backend'den dönen veriye göre uyarlandı
                confidence: data.confidence,
                gnnAccuracy: data.details.gnn_prediction || 0, // Backend key isimlerine dikkat
                rfAccuracy: data.details.rf_prediction || 0,
                smiles: smilesInput,
            });
        } catch (error) {
            console.error("Prediction failed:", error);
            toast.error("Analysis failed", {
                description: "Could not connect to the API. Please try again.",
                duration: 3000,
            });
            setShowModal(false);
        } finally {
            setIsLoading(false);
            setIsAnalyzing(false);
        }
    }, [isValid, smilesInput]);

    const handleReset = useCallback(() => {
        setSmilesInput("");
        setIsValid(null);
        setResult(null);
        setMoleculeImageUrl(null);
    }, []);

    const handleNewAnalysis = useCallback(() => {
        setShowModal(false);
        setResult(null);
        setSmilesInput("");
        setIsValid(null);
        setMoleculeImageUrl(null);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    return (
        <main className="relative min-h-screen overflow-hidden bg-background">
            <Navbar />
            <MolecularBackground />

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-2xl"
                >
                    <div className="bg-card border border-border rounded-3xl shadow-xl p-8 md:p-10">
                        <div className="text-center mb-8">
                            <motion.h1
                                className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Graph Neural Network for Tuberculosis Drug Screening
                            </motion.h1>
                            <motion.p
                                className="text-muted-foreground text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                AI-powered compound efficacy prediction
                            </motion.p>

                            <motion.div
                                className="flex justify-center mt-6"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                            >
                                <MoleculeIcon />
                            </motion.div>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <SmilesInput
                                value={smilesInput}
                                onChange={handleInputChange}
                                onAnalyze={handleAnalyze}
                                onReset={handleReset}
                                isValid={isValid}
                                isAnalyzing={isAnalyzing}
                            />

                            <div className="mt-8 border-t pt-6">
                                <h2 className="text-lg font-semibold mb-3 text-center">Batch Prediction (Upload SMILES File)</h2>

                                <BatchPredict />
                            </div>
                        </motion.div>

                        {moleculeImageUrl && (
                            <div className="mt-6 flex justify-center">
                                <div className="bg-card border border-border rounded-xl p-4">
                                    <p className="text-center text-sm text-muted-foreground mb-2">2D Molecular Structure</p>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={moleculeImageUrl}
                                        alt="Molecule structure"
                                        className="max-w-full rounded-md border"
                                        onError={(e) => {
                                            // Eğer backend'de resim endpointi yoksa kullanıcıya çaktırmadan gizleyelim
                                            e.currentTarget.style.display = "none";
                                            toast.error("Molecule image not available in API.");
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <motion.p
                        className="text-center text-muted-foreground text-sm mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        Graph Neural Network powered Tuberculosis Drug Discovery Assistant
                    </motion.p>
                </motion.div>
            </div>

            <ResultModal
                isOpen={showModal}
                isLoading={isLoading}
                result={result}
                onClose={handleCloseModal}
                onNewAnalysis={handleNewAnalysis}
            />
        </main>
    );
}
