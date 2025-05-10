type Props = {
    open: boolean;
    onClose: () => void;
};

export default function InstructionsModal({ open, onClose }: Props) {
    if (!open) return null;
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
            onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
            }}
            tabIndex={-1}
        >
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                <h2 id="modal-title" className="text-lg font-bold mb-4">
                    🧠 How to use this Quiz
                </h2>
                <ul className="list-disc ml-5 space-y-2 text-sm">
                    <li>Read each question carefully.</li>
                    <li>Type or select your answer and press Enter or click.</li>
                    <li>You’ll see feedback after each answer.</li>
                    <li>You can retry some questions if you get them wrong.</li>
                    <li>When you answer all correctly, you’ll get a surprise 🎉</li>
                </ul>
                <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Got it!
                </button>
            </div>
        </div>
    );

}
