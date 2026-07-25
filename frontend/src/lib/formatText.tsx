import React from "react";

/**
 * Parses and cleans text to remove raw markdown asterisks (* and **) 
 * while maintaining clean formatting (bold text, bullet points).
 */
export const renderCleanFormattedText = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split into lines to format lists and paragraphs
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) return <div key={lineIdx} className="h-1" />;

        // Clean bullet points starting with * or -
        let isBullet = false;
        let lineContent = line;

        if (/^\s*[\*\-]\s+/.test(lineContent)) {
          isBullet = true;
          lineContent = lineContent.replace(/^\s*[\*\-]\s+/, "");
        }

        // Parse **bold** markers inside the line
        const parts = lineContent.split(/(\*\*.*?\*\*)/g);

        const formattedParts = parts.map((part, partIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            const innerText = part.slice(2, -2).replace(/\*/g, "");
            return (
              <strong key={partIdx} className="font-semibold text-orange-600 dark:text-orange-400">
                {innerText}
              </strong>
            );
          }
          // Remove any leftover lone asterisks from text
          const sanitized = part.replace(/\*/g, "");
          return <span key={partIdx}>{sanitized}</span>;
        });

        return (
          <div key={lineIdx} className="flex items-start gap-1.5 leading-relaxed">
            {isBullet && (
              <span className="text-orange-500 font-bold text-xs select-none mt-0.5">•</span>
            )}
            <div className="flex-1">{formattedParts}</div>
          </div>
        );
      })}
    </div>
  );
};
