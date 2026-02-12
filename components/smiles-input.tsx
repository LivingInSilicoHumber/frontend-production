"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, FlaskConical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SmilesInputProps {
  value: string
  onChange: (value: string) => void
  onAnalyze: () => void
  onReset: () => void
  isValid: boolean | null
  isAnalyzing: boolean
}

export function SmilesInput({
  value,
  onChange,
  onAnalyze,
  onReset,
  isValid,
  isAnalyzing,
}: SmilesInputProps) {
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (isValid === false && value.length > 0) {
      setShake(true)
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isValid, value])

  const getBorderClass = () => {
    if (value.length === 0) return "border-border"
    if (isValid === true) return "border-accent shadow-[0_0_12px_rgba(94,234,212,0.3)]"
    if (isValid === false) return "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
    return "border-border"
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="relative flex items-center">
            <FlaskConical className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste SMILES code here (e.g., CC1=CC=C...)"
              className={`pl-12 pr-12 py-6 text-lg bg-muted/50 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${getBorderClass()}`}
              disabled={isAnalyzing}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="absolute right-4 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs p-4 bg-popover/95 backdrop-blur-sm border-border"
                >
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-foreground">How to use:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Paste SMILES code</li>
                      <li>Click Analyze Compound</li>
                      <li>View Activity + Confidence</li>
                    </ol>
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                      Powered by GNN + Random Forest
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>

        <AnimatePresence>
          {isValid === true && value.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-accent mt-2"
            >
              Valid SMILES structure detected
            </motion.p>
          )}
          {isValid === false && value.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-500 mt-2"
            >
              Invalid SMILES format
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onAnalyze}
            disabled={!isValid || isAnalyzing || value.length === 0}
            className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Compound"}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onReset}
            variant="outline"
            disabled={isAnalyzing}
            className="py-6 px-6 text-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all duration-300 bg-transparent"
          >
            Reset Input
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
