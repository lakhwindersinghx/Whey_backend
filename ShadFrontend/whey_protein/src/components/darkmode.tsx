"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"; // Ensure the correct path to the Switch component

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isDarkMode}
        onCheckedChange={setIsDarkMode}
        className="bg-secondary"
      />
      <span className="text-sm text-foreground">
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
}
