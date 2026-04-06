import { useState, useEffect } from "react";

const InstructionsModal = ({ open, onClose }: any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md mt-60 animate-in fade-in zoom-in duration-300 ">
      
      <div className="relative w-full max-w-xl p-px rounded-2xl 
        bg-linear-to-r from-stone-800 via-cyan-700 to-gray-800">

        <div className="bg-black/70 backdrop-blur-xl rounded-2xl p-6 space-y-4">

          <h2 className="text-xl font-semibold text-stone-600 from-stone-50 to-cyan-100 text-center">
            Welcome to Resume Intelligence System
          </h2>

          <p className="text-sm text-gray-300">
            Here's how to get the best out of your resume analysis:
          </p>

          <ul className="text-sm text-gray-300 space-y-3">
  <li><span className="text-cyan-600 font-medium">Upload Resume:</span> PDF format recommended for optimal parsing</li>
  <li><span className="text-cyan-600 font-medium">Add Job Description:</span> Improves matching accuracy</li>
  <li><span className="text-cyan-600 font-medium">Include Job Link (Optional):</span> Provides additional context</li>
  <li><span className="text-cyan-600 font-medium">Analyze Results:</span> Review ATS, content, and structure scores</li>
  <li><span className="text-cyan-600 font-medium">Apply Improvements:</span> Enhance your resume with actionable suggestions</li>
</ul>

          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-amber-500">
              You can reopen this anytime from the info button.
            </p>

            <button
  onClick={onClose}
>
  <span className="nav-button">
    Got it
  </span>
</button>
          </div>
        </div>

        {/* glow */}
        <div className="absolute inset-0 blur-xl opacity-30 
          bg-linear-to-r from-stone-400 via-cyan-500 to-gray-600 -z-10"/>
      </div>
    </div>
  );
};

export default InstructionsModal;