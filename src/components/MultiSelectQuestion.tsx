interface Props {
  question: {
    options: string[];
  };
  index: number;
  answer: string | string[];
  result: "correct" | "incorrect" | null;
  onToggle: (index: number, option: string) => void;
  onSubmit: (index: number) => void;
}

export default function MultiSelectQuestion({
  question,
  index,
  answer,
  result,
  onToggle,
  onSubmit,
}: Props) {
  const isAnswerComplete = Array.isArray(answer) && answer.length > 0;

  return (
    <div className="space-y-2">
      {question.options?.map((opt: string) => (
        <label key={opt} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={answer.includes(opt)}
            onChange={() => onToggle(index, opt)}
            disabled={result !== null}
            className="accent-blue-600"
          />
          <span>{opt}</span>
        </label>
      ))}

      {result === null && (
        <button
          onClick={() => onSubmit(index)}
          disabled={!isAnswerComplete}
          className="mt-2 px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          Submit
        </button>
      )}
    </div>
  );
}