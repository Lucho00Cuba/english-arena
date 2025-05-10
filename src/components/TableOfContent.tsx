import { useEffect, useState } from "react";

type Heading = {
    id: string;
    text: string;
    level: number;
};

export default function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const article = document.querySelector("article");
        if (!article) return;

        const elements = Array.from(article.querySelectorAll("h1, h2, h3")) as HTMLElement[];

        const newHeadings = elements.map((el) => ({
            id: el.id,
            text: el.innerText,
            level: Number(el.tagName.replace("H", "")),
        }));

        setHeadings(newHeadings);

        const onScroll = () => {
            let currentId = null;
            for (const el of elements) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 80) currentId = el.id;
                else break;
            }
            setActiveId(currentId);
        };

        window.addEventListener("scroll", onScroll);
        onScroll();

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!headings.length) return null;

    return (
        <div className="fixed top-32 right-0 z-40 group">
            {/* Mini bar visible siempre */}
            <div className="w-3 h-32 bg-gray-300 dark:bg-gray-600 rounded-l opacity-70 hover:opacity-0 transition-all" />

            {/* TOC box on hover */}
            <div className="absolute top-0 right-0 w-64 max-h-[70vh] overflow-y-auto opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md p-4">
                <h2 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Table of Contents
                </h2>
                <ul className="space-y-1 text-sm">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            style={{ paddingLeft: `${(heading.level - 1) * 1.25}rem` }} // indent per level
                        >
                            <a
                                href={`#${heading.id}`}
                                className={`block truncate ${activeId === heading.id
                                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                                    : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300"
                                    }`}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
