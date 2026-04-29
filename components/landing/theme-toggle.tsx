"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-card text-fg-muted transition-all duration-200 hover:bg-card-hover hover:text-fg"
    >
      {/* Visibility controlled via CSS in globals.css — no React state needed */}
      <Sun size={16} className="theme-icon-dark" />
      <Moon size={16} className="theme-icon-light" />
    </button>
  );
}
