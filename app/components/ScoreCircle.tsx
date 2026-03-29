import React from "react";

type Props = {
  score?: number;
};

const ScoreCircle = ({ score }: Props) => {
  // Handle missing score
  if (score === undefined || score === null) {
    return (
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
        N/A
      </div>
    );
  }
  console.log("ScoreCircle score:", score);

  // Clamp score between 0–100
  const safeScore = Math.max(0, Math.min(score, 100));

  // Circle math
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
          fill="transparent"
        />

        {/* Progress circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A5B4FC" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>
      </svg>

      {/* Score text */}
      <span className="absolute text-sm font-semibold text-white">
        {safeScore}
      </span>
    </div>
  );
};

export default ScoreCircle;