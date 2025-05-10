import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import Celebration from "@/components/Celebration";
import InstructionsModal from "@/components/InstructionsModal";

export default function Quiz({ topic }: { topic: string }) {
    const [allQuestions, setAllQuestions] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<any[]>([]);
    const [results, setResults] = useState<(string | null)[]>([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/data/${topic}.json`);
                if (!res.ok) throw new Error("Quiz data not found");
                const data = await res.json();
                setAllQuestions(data);
            } catch (err) {
                console.error("Error loading quiz:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [topic]);

    const pickRandomQuestions = () => {
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 10);
    };

    const newQuiz = () => {
        const picked = pickRandomQuestions();
        setQuestions(picked);
        setAnswers(picked.map((q) =>
            q.type === "multi-select" || q.type === "matching" || q.type === "fill-in-the-blank" ? [] : ""
        ));
        setResults(new Array(picked.length).fill(null));
        setVisible(true);
    };

    const startQuiz = () => {
        const picked = pickRandomQuestions();
        setQuestions(picked);
        setAnswers(picked.map((q) =>
            q.type === "multi-select" || q.type === "matching" || q.type === "fill-in-the-blank" ? [] : ""
        ));
        setResults(new Array(picked.length).fill(null));
        setVisible(true);
    };

    const resetQuiz = () => {
        setAnswers(questions.map((q) =>
            q.type === "multi-select" || q.type === "matching" || q.type === "fill-in-the-blank" ? [] : ""
        ));
        setResults(new Array(questions.length).fill(null));
    };

    const checkAnswer = (index: number, value: any) => {
        const q = questions[index];
        let isCorrect = false;

        if (q.type === "multi-select") {
            if (!Array.isArray(value)) return;
            const expected = q.answer;
            isCorrect = expected.length === value.length && expected.every((val: string) => value.includes(val));
        } else if (q.type === "true-false") {
            isCorrect = q.answer === (value === "true" || value === true);
        } else if (q.type === "text") {
            isCorrect = String(q.answer).trim().toLowerCase() === String(value).trim().toLowerCase();
        } else if (q.type === "matching") {
            const matchingAnswers = value as string[];
            if (matchingAnswers.length < q.pairs.length || matchingAnswers.some(v => !v)) return;
            const expectedPairs = q.pairs;
            isCorrect = expectedPairs.every((pair: any, idx: number) => pair.right === matchingAnswers[idx]);
        } else if (q.type === "fill-in-the-blank") {
            isCorrect = (value as string[]).every((v, idx) =>
                q.answers[idx].some((correct: string) => correct.toLowerCase() === v.trim().toLowerCase())
            );
        }

        const newResults = [...results];
        newResults[index] = isCorrect ? "correct" : "incorrect";
        setResults(newResults);
    };

    const handleInput = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter") {
            checkAnswer(index, answers[index]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newAnswers = [...answers];
        newAnswers[index] = e.target.value;
        setAnswers(newAnswers);
    };

    const handleSelect = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
        checkAnswer(index, value);
    };

    const handleCheckboxToggle = (index: number, option: string) => {
        const current = answers[index] as string[];
        const updated = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
        const newAnswers = [...answers];
        newAnswers[index] = updated;
        setAnswers(newAnswers);
    };

    const submitMultiSelect = (index: number) => {
        checkAnswer(index, answers[index]);
    };

    const [showModal, setShowModal] = useState(false);

    if (loading) return <p>Loading quiz...</p>;

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <a href="/" className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">
                    ← Back to Home
                </a>
                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                        aria-label="Show quiz instructions"
                    >
                        Instructions
                    </button>
                    <InstructionsModal open={showModal} onClose={() => setShowModal(false)} />
                    {!visible ? (
                        <button
                            onClick={() => {
                                if (questions.length === 0) {
                                    newQuiz();
                                } else {
                                    setVisible(true);
                                }
                            }}
                            disabled={error || allQuestions.length === 0}
                            className={`px-6 py-2 text-sm rounded transition ${error || allQuestions.length === 0
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            {error || allQuestions.length === 0 ? "Quiz Not Available" : "Start Quiz"}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={newQuiz}
                                className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                New Quiz
                            </button>
                            <button
                                onClick={resetQuiz}
                                className="px-4 py-2 text-sm rounded bg-gray-200 text-gray-900 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            >
                                Reset Quiz
                            </button>
                            <button
                                onClick={() => setVisible(false)}
                                className="px-6 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Hide Quiz
                            </button>
                        </>
                    )}
                </div>
            </div>

            {visible && (
                <>
                    {questions.map((q, i) => (
                        <div key={i} className="space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-md shadow-sm transition-colors">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="inline-block px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
                                    {q.type === "text" && "📝 Text"}
                                    {q.type === "true-false" && "🔘 True/False"}
                                    {q.type === "multi-select" && "☑️ Multi-Select"}
                                    {q.type === "matching" && "🔗 Matching"}
                                    {q.type === "fill-in-the-blank" && "✏️ Fill in the Blank"}
                                </span>
                            </div>
                            <p className="font-medium">{q.question}</p>
                            {q.type === "text" && (
                                <input
                                    key={`${i}-${results[i]}`}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    type="text"
                                    value={answers[i]}
                                    onChange={(e) => handleChange(e, i)}
                                    onKeyDown={(e) => handleInput(e, i)}
                                    className={`w-full px-4 py-2 rounded border outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500
                                  ${results[i] === "correct"
                                            ? "border-green-500 bg-green-400 text-black animate-bounceFast"
                                            : results[i] === "incorrect"
                                                ? "border-red-500 bg-red-400 text-black animate-shake"
                                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        }`}
                                    placeholder="Type your answer and press Enter"
                                />
                            )}
                            {q.type === "true-false" && (
                                <div className="flex gap-4">
                                    {["true", "false"].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => handleSelect(i, val)}
                                            disabled={results[i] !== null}
                                            className={`
                                                px-4 py-2 rounded border transition focus:outline-none focus:ring-2 focus:ring-blue-500
                                                ${results[i] !== null
                                                    ? val === answers[i]
                                                        ? val === String(questions[i].answer)
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
                            )}
                            {q.type === "matching" && (
                                <div className="space-y-2">
                                    {q.pairs.map((pair, idx) => {
                                        const rightOptions = [...q.pairs.map(p => p.right)].sort();
                                        return (
                                            <div key={idx} className="flex items-center gap-4">
                                                <span>{pair.left}</span>
                                                <select
                                                    value={answers[i]?.[idx] || ""}
                                                    onChange={(e) => {
                                                        const newAnswers = [...answers];
                                                        const newMatching = [...(newAnswers[i] || [])];
                                                        newMatching[idx] = e.target.value;
                                                        newAnswers[i] = newMatching;
                                                        setAnswers(newAnswers);
                                                        checkAnswer(i, newMatching);
                                                    }}
                                                    disabled={results[i] !== null}
                                                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    <option value="">Select</option>
                                                    {rightOptions.map((r) => (
                                                        <option key={r} value={r}>{r}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {q.type === "fill-in-the-blank" && (
                                <p className="text-lg">
                                    {q.question.split("___").map((chunk, idx, arr) => (
                                        <span key={idx}>
                                            {chunk}
                                            {idx < arr.length - 1 && (
                                                <input
                                                    type="text"
                                                    value={answers[i]?.[idx] || ""}
                                                    onChange={(e) => {
                                                        const newAnswers = [...answers];
                                                        const newFill = [...(newAnswers[i] || [])];
                                                        newFill[idx] = e.target.value;
                                                        newAnswers[i] = newFill;
                                                        setAnswers(newAnswers);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") checkAnswer(i, answers[i]);
                                                    }}
                                                    className="inline-block w-24 mx-1 border-b border-gray-400 bg-transparent text-center"
                                                />
                                            )}
                                        </span>
                                    ))}
                                </p>
                            )}
                            {q.type === "multi-select" && (
                                <div className="space-y-2">
                                    {q.options?.map((opt) => (
                                        <label key={opt} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={(answers[i] as string[]).includes(opt)}
                                                onChange={() => handleCheckboxToggle(i, opt)}
                                                disabled={results[i] === "correct"}
                                                className="accent-blue-600"
                                            />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => submitMultiSelect(i)}
                                        disabled={results[i] === "correct"}
                                        className="mt-2 px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                            {results[i] === "correct" && <p className="text-green-600 text-sm">✅ Correct!</p>}
                            {results[i] === "incorrect" && (
                                <div className="text-red-600 text-sm">
                                    <p>❌ Incorrect!</p>
                                    {q.hint && <p className="italic text-yellow-700 mt-1">💡 Hint: {q.hint}</p>}
                                    <button
                                        onClick={() => {
                                            const newAnswers = [...answers];
                                            newAnswers[i] = [];
                                            setAnswers(newAnswers);

                                            const newResults = [...results];
                                            newResults[i] = null;
                                            setResults(newResults);
                                        }}
                                        className="mt-2 px-4 py-2 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <ProgressBar
                        current={results.filter((r) => r !== null).length}
                        total={questions.length}
                    />
                    {results.length === questions.length && results.every(r => r === "correct") && <Celebration />}
                </>
            )}
        </div>
    );
}
