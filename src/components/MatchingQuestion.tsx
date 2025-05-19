interface MatchingPair {
  left: string;
  right: string;
}

interface Props {
  question: {
    pairs: MatchingPair[];
  };
  index: number;
  answer: string | string[];
  result: string | null;
  onChange: (index: number, answers: string[]) => void;
}

export default function MatchingQuestion({
  question,
  index,
  answer,
  result,
  onChange,
}: Props) {
  const rightOptions = [...question.pairs.map((p) => p.right)].sort();

  const handleSelect = (idx: number, value: string) => {
    const updated = [...(answer || [])];
    updated[idx] = value;
    onChange(index, updated);
  };

  return (
    <div className="space-y-2">
      {question.pairs.map((pair, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <span>{pair.left}</span>
          <select
            value={answer?.[idx] || ""}
            onChange={(e) => handleSelect(idx, e.target.value)}
            disabled={result !== null}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Select</option>
            {rightOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}