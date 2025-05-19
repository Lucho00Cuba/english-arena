interface Props {
  question: any;
  index: number;
  answer: any;
  result: string | null;
  onSelect: (index: number, value: string) => void;
}

export default function TrueFalseQuestion({ question, index, answer, result, onSelect }: Props) {
  const options = ["true", "false"];

  return (
    <div className="flex gap-4">
      {options.map((val) => (
        <button
          key={val}
          onClick={() => onSelect(index, val)}
          disabled={result !== null}
          className={`
            px-4 py-2 rounded border transition focus:outline-none focus:ring-2 focus:ring-blue-500
            ${result !== null
              ? val === answer
                ? val === String(question.answer)
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              : "bg-white text-gray-800 hover:bg-blue-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            }
          `}
        >
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </button>
      ))}
    </div>
  );
}