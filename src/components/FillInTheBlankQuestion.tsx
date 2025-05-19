interface Props {
  question: {
    question: string;
    answers: string[][];
    hint?: string;
  };
  index: number;
  answer: string | string[];
  result: string | null;
  onChange: (index: number, newAnswers: string[]) => void;
  onCheck: (index: number, answer: string[]) => void;
}

export default function FillInTheBlankQuestion({
  question,
  index,
  answer,
  result,
  onChange,
  onCheck,
}: Props) {
  const parts = question.question.split("___");
  const answersArray = Array.isArray(answer) ? answer : [];

  const handleChange = (value: string, idx: number) => {
    const newAnswers = [...answersArray];
    newAnswers[idx] = value;
    onChange(index, newAnswers);
  };

  return (
    <p className="text-lg flex flex-wrap items-center gap-1">
      {parts.map((chunk, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {chunk}
          {idx < parts.length - 1 && (
            <input
              type="text"
              value={answersArray[idx] || ""}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onCheck(index, answersArray);
              }}
              className="inline-block w-24 border-b border-gray-400 bg-transparent text-center dark:text-white"
              disabled={result === "correct"}
            />
          )}
        </span>
      ))}
    </p>
  );
}