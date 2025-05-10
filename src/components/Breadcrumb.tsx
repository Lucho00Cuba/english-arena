type Crumb = {
    name: string;
    href?: string;
};

type Props = {
    items: Crumb[];
};

export default function Breadcrumb({ items }: Props) {
    return (
        <nav className="text-sm mb-6" aria-label="Breadcrumb">
            <ol className="list-none flex flex-wrap items-center gap-2 text-gray-500 dark:text-gray-400">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {item.href ? (
                            <a href={item.href} className="hover:text-blue-600">
                                {item.name}
                            </a>
                        ) : (
                            <span className="text-gray-700 dark:text-white font-medium">
                                {item.name}
                            </span>
                        )}
                        {index < items.length - 1 && <span className="text-gray-400">/</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
