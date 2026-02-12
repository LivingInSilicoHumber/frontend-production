"use client"

import { motion } from "framer-motion"

export function MoleculeIcon({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {/* Central atom */}
      <motion.circle
        cx="24"
        cy="24"
        r="6"
        fill="url(#centerGradient)"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />
      
      {/* Outer atoms */}
      <motion.circle
        cx="10"
        cy="16"
        r="4"
        fill="url(#atomGradient)"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
      />
      <motion.circle
        cx="38"
        cy="16"
        r="4"
        fill="url(#atomGradient)"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
      />
      <motion.circle
        cx="10"
        cy="36"
        r="4"
        fill="url(#atomGradient)"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
      />
      <motion.circle
        cx="38"
        cy="36"
        r="4"
        fill="url(#atomGradient)"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.8 }}
      />
      
      {/* Bonds */}
      <line x1="18" y1="20" x2="12" y2="18" stroke="rgba(45, 212, 191, 0.6)" strokeWidth="2" />
      <line x1="30" y1="20" x2="36" y2="18" stroke="rgba(45, 212, 191, 0.6)" strokeWidth="2" />
      <line x1="18" y1="28" x2="12" y2="34" stroke="rgba(45, 212, 191, 0.6)" strokeWidth="2" />
      <line x1="30" y1="28" x2="36" y2="34" stroke="rgba(45, 212, 191, 0.6)" strokeWidth="2" />
      
      {/* Gradients */}
      <defs>
        <radialGradient id="centerGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </radialGradient>
        <radialGradient id="atomGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </radialGradient>
      </defs>
    </motion.svg>
  )
}

export function LoadingMolecule({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {/* Hexagonal ring */}
      <motion.path
        d="M40 10 L60 22 L60 46 L40 58 L20 46 L20 22 Z"
        stroke="url(#hexGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />
      
      {/* Atoms at vertices */}
      {[
        { cx: 40, cy: 10 },
        { cx: 60, cy: 22 },
        { cx: 60, cy: 46 },
        { cx: 40, cy: 58 },
        { cx: 20, cy: 46 },
        { cx: 20, cy: 22 },
      ].map((pos, i) => (
        <motion.circle
          key={i}
          cx={pos.cx}
          cy={pos.cy}
          r="5"
          fill="url(#loadingAtomGradient)"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.15 }}
        />
      ))}
      
      {/* Center pulse */}
      <motion.circle
        cx="40"
        cy="34"
        r="8"
        fill="url(#centerPulse)"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
      />
      
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <radialGradient id="loadingAtomGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </radialGradient>
        <radialGradient id="centerPulse" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </radialGradient>
      </defs>
    </motion.svg>
  )
}
