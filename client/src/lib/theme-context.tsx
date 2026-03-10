import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type DesignTheme = "a" | "b";

interface ThemeContextType {
  designTheme: DesignTheme;
  setDesignTheme: (theme: DesignTheme) => void;
  toggleDesignTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  designTheme: "a",
  setDesignTheme: () => {},
  toggleDesignTheme: () => {},
});

export function DesignThemeProvider({ children }: { children: ReactNode }) {
  const [designTheme, setDesignTheme] = useState<DesignTheme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("design-theme") as DesignTheme) || "a";
    }
    return "a";
  });

  useEffect(() => {
    localStorage.setItem("design-theme", designTheme);
    document.documentElement.classList.remove("theme-a", "theme-b");
    document.documentElement.classList.add(`theme-${designTheme}`);
  }, [designTheme]);

  const toggleDesignTheme = () => {
    setDesignTheme((prev) => (prev === "a" ? "b" : "a"));
  };

  return (
    <ThemeContext.Provider value={{ designTheme, setDesignTheme, toggleDesignTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useDesignTheme() {
  return useContext(ThemeContext);
}
