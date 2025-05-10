import { useEffect, useState } from "react";
import { CiDark, CiLight } from "react-icons/ci";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (!stored && prefersDark);

    if (shouldBeDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setIsDark(shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentlyDark = root.classList.contains("dark");
    const newIsDark = !currentlyDark;
    root.classList.toggle("dark", newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    setIsDark(newIsDark);
  };

  if (isDark === null) return null;

  return (
    <button
      aria-label="Toggle Theme"
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {isDark ? <CiLight className="w-6 h-6" /> : <CiDark className="w-6 h-6" />}
    </button >
  );
}
