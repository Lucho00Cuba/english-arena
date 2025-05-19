import React from "react";

interface Props {
  value: string | string[];
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  result: "correct" | "incorrect" | null;
}

export default function TextQuestion({ value, onChange, onKeyDown, result }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className={`w-full px-4 py-2 rounded border outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500
        ${result === "correct"
          ? "border-green-500 bg-green-400 text-black animate-bounceFast"
          : result === "incorrect"
            ? "border-red-500 bg-red-400 text-black animate-shake"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        }`}
      placeholder="Type your answer and press Enter"
    />
  );
}