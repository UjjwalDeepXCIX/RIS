import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const gradientClass = score > 69
    ? 'from-green-100'
    : score > 49
      ? 'from-yellow-100'
      : 'from-red-100';

  // Determine icon based on score
  const iconSrc = score > 69
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg';

  // Determine subtitle based on score
  const subtitle = score > 69
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  return (
  <div className="w-full rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.6)] flex flex-col gap-6">

    {/* TOP SECTION */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={iconSrc} alt="ATS Score Icon" className="w-10 h-10 opacity-90" />
        <div>
          <h2 className="text-xl font-semibold text-white">
            ATS Score
          </h2>
          <p className="text-sm text-gray-400">
            Resume screening performance
          </p>
        </div>
      </div>

      <div className="text-2xl font-semibold text-white">
        {score}/100
      </div>
    </div>

    {/* PROGRESS BAR */}
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          score > 69
            ? "bg-emerald-400"
            : score > 49
            ? "bg-amber-400"
            : "bg-red-400"
        }`}
        style={{ width: `${score}%` }}
      />
    </div>

    {/* STATUS */}
    <div>
      <h3 className="text-lg font-semibold text-white">
        {subtitle}
      </h3>
      <p className="text-sm text-gray-400 mt-1">
        This score reflects how well your resume performs in ATS systems.
      </p>
    </div>

    {/* SUGGESTIONS */}
    <div className="flex flex-col gap-3">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
            suggestion.type === "good"
              ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-300"
              : "bg-amber-500/10 border-amber-400/20 text-amber-300"
          }`}
        >
          <img
            src={
              suggestion.type === "good"
                ? "/icons/check.svg"
                : "/icons/warning.svg"
            }
            className="w-4 h-4 mt-1 opacity-80"
          />
          <p className="text-sm leading-relaxed">
            {suggestion.tip}
          </p>
        </div>
      ))}
    </div>

    {/* FOOTER */}
    <p className="text-xs text-gray-500 italic">
      Improve your resume to increase visibility to recruiters.
    </p>

  </div>
);
}

export default ATS