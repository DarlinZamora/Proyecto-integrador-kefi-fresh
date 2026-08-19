/**
 * Kefi-Fresh — Selector de modo claro/oscuro
 */
(function initThemeToggle(): void {
  const STORAGE_KEY = "kefi-theme";
  const toggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");

  if (!toggle) return;

  function currentTheme(): "light" | "dark" {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateToggle(theme: "light" | "dark"): void {
    const isDark = theme === "dark";
    toggle!.setAttribute("aria-pressed", String(isDark));
    toggle!.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    toggle!.textContent = isDark ? "☀️" : "🌙";
  }

  updateToggle(currentTheme());

  toggle.addEventListener("click", () => {
    const next: "light" | "dark" = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage no disponible (modo privado, etc.) */
    }
    updateToggle(next);
  });
})();
