import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import Celebration from "@/components/Celebration";
import InstructionsModal from "@/components/InstructionsModal";
import TextQuestion from "@/components/TextQuestion";
import TrueFalseQuestion from "@/components/TrueFalseQuestion";
import MultiSelectQuestion from "./MultiSelectQuestion";
import MatchingQuestion from "./MatchingQuestion";
import FillInTheBlankQuestion from "./FillInTheBlankQuestion";
import type { Question } from "@/types";

export default function Quiz({ topic }: { topic: string }) {
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<(string | string[])[]>([]);
    const [results, setResults] = useState<("correct" | "incorrect" | null)[]>([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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

    const generateEmptyAnswers = (questions: any[]) => {
        return questions.map((q) =>
            q.type === "multi-select" || q.type === "matching" || q.type === "fill-in-the-blank"
            ? []
            : ""
        );
    };

    const newQuiz = () => {
        const picked = pickRandomQuestions();
        setQuestions(picked);
        setAnswers(generateEmptyAnswers(picked));
        setResults(new Array(picked.length).fill(null));
        setVisible(true);
    };

    const resetQuiz = () => {
        setAnswers(generateEmptyAnswers(questions));
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

    const handleAnswerChange = (index: number, value: any) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleMatchingChange = (index: number, values: string[]) => {
        const q = questions[index];
        if (q.type !== "matching") return;
        const filteredValues = values.filter((v) => v !== "");
        const isComplete = filteredValues.length === q.pairs.length && values.every((v) => v);

        console.log("Pairs:", q.pairs);
        console.log("Question:", q);
        console.log("Answer:", answers[index]);
        console.log("Matching values:", values);
        console.log("Is complete:", isComplete);

        const newAnswers = [...answers];
        newAnswers[index] = values;
        setAnswers(newAnswers);

        if (isComplete) {
            checkAnswer(index, values);
        }
    };

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
                            onClick={newQuiz}
                            disabled={error || allQuestions.length === 0}
                            className={`px-6 py-2 text-sm rounded transition ${
                                error || allQuestions.length === 0
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
                                <TextQuestion
                                value={answers[i]}
                                onChange={(val) => handleAnswerChange(i, val)}
                                onKeyDown={(e) => handleInput(e, i)}
                                result={results[i]}
                                />
                            )}
                            {q.type === "true-false" && (
                                <TrueFalseQuestion
                                    question={q}
                                    index={i}
                                    answer={answers[i]}
                                    result={results[i]}
                                    onSelect={handleSelect}
                                />
                            )}
                            {q.type === "matching" && (
                                <MatchingQuestion
                                    question={q}
                                    index={i}
                                    answer={answers[i]}
                                    result={results[i]}
                                    onChange={handleMatchingChange}
                                />
                            )}
                            {q.type === "fill-in-the-blank" && (
                                <FillInTheBlankQuestion
                                    question={q}
                                    index={i}
                                    answer={answers[i]}
                                    result={results[i]}
                                    onChange={(idx, newFill) => {
                                    const newAnswers = [...answers];
                                    newAnswers[idx] = newFill;
                                    setAnswers(newAnswers);
                                    }}
                                    onCheck={(idx, filled) => checkAnswer(idx, filled)}
                                />
                            )}
                            {q.type === "multi-select" && (
                                <MultiSelectQuestion
                                    question={q}
                                    index={i}
                                    answer={answers[i]}
                                    result={results[i]}
                                    onToggle={handleCheckboxToggle}
                                    onSubmit={submitMultiSelect}
                                />
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
