type Props = {
    current: number;
    total: number;
};

export default function ProgressBar({ current, total }: Props) {
    const percent = Math.round((current / total) * 100);

    return (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-1 text-gray-600 dark:text-gray-300">
                <span>
                    Progress: {current} / {total}
                </span>
                <span>{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-3 overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
