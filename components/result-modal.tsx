"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConfidenceRing } from "@/components/confidence-ring"
import { LoadingMolecule } from "@/components/molecule-icon"

interface AnalysisResult {
  isActive: boolean
  confidence: number
  gnnAccuracy: number
  rfAccuracy: number
  smiles: string
}

interface ResultModalProps {
  isOpen: boolean
  isLoading: boolean
  result: AnalysisResult | null
  onClose: () => void
  onNewAnalysis: () => void
}

export function ResultModal({
  isOpen,
  isLoading,
  result,
  onClose,
  onNewAnalysis,
}: ResultModalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    if (result?.smiles) {
      await navigator.clipboard.writeText(result.smiles)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={!isLoading ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-card border border-border rounded-3xl shadow-2xl p-6 mx-4">
              {/* Close button */}
              {!isLoading && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              {isLoading ? (
                <LoadingState />
              ) : result ? (
                <ResultContent
                  result={result}
                  copied={copied}
                  onCopy={copyToClipboard}
                  onNewAnalysis={onNewAnalysis}
                  onClose={onClose}
                />
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center py-8"
    >
      <LoadingMolecule />
      <motion.p
        className="mt-6 text-lg text-foreground font-medium text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        Analyzing compound using Graph Neural Network...
      </motion.p>
      <div className="w-full mt-6 bg-secondary/30 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  )
}

interface ResultContentProps {
  result: AnalysisResult
  copied: boolean
  onCopy: () => void
  onNewAnalysis: () => void
  onClose: () => void
}

function ResultContent({ result, copied, onCopy, onNewAnalysis, onClose }: ResultContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground tracking-wide">
          TUBERCULOSIS DRUG DISCOVERY ASSISTANT
        </h2>
      </div>

      {/* Result Badge */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          className={`px-8 py-3 rounded-full text-lg font-bold ${
            result.isActive
              ? "bg-teal-500/20 text-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.3)]"
              : "bg-red-500/20 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          }`}
        >
          <motion.span
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {result.isActive ? "ACTIVE" : "INACTIVE"} {result.isActive ? "💊" : "❌"}
          </motion.span>
        </motion.div>
      </div>

      {/* Confidence Ring */}
      <div className="flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Confidence</p>
        <ConfidenceRing percentage={result.confidence*100} />
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-3 gap-3">
        <DetailCard title="Result" value={result.isActive ? "Active" : "Inactive"} />
        <DetailCard title="Confidence" value={`${(result.confidence * 100).toFixed(2)}%`} />
        <DetailCard
          title="Model Breakdown"
          value={`GNN: ${(result.gnnAccuracy * 100).toFixed(1)}%`}
          subValue={`RF: ${(result.rfAccuracy * 100).toFixed(1)}%`}

        />
      </div>

      {/* SMILES with copy */}
      <div className="bg-secondary/30 rounded-lg p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Input SMILES</p>
            <p className="text-sm font-mono text-foreground truncate">{result.smiles}</p>
          </div>
          <button
            onClick={onCopy}
            className="p-2 rounded-md hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-teal-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onNewAnalysis}
            className="w-full py-5 font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-primary-foreground"
          >
            New Analysis
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onClose}
            variant="outline"
            className="py-5 px-6 border-border hover:bg-secondary/50 bg-transparent"
          >
            Close
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

interface DetailCardProps {
  title: string
  value: string
  subValue?: string
}

function DetailCard({ title, value, subValue }: DetailCardProps) {
  return (
    <motion.div
      className="bg-secondary/30 rounded-lg p-3 text-center hover:bg-secondary/40 transition-colors cursor-default"
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(20, 184, 166, 0.1)" }}
    >
      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{title}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>}
    </motion.div>
  )
}
