/**
 * Kefi-Fresh — Drawer de navegación responsive
 */
(function initNavDrawer(): void {
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const backdrop = document.querySelector<HTMLElement>("[data-nav-backdrop]");

  if (!toggle || !nav) return;

  function isOpen(): boolean {
    return nav!.classList.contains("is-open");
  }

  function openNav(): void {
    nav!.classList.add("is-open");
    backdrop?.classList.add("is-open");
    toggle!.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  function closeNav(): void {
    nav!.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
    toggle!.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  toggle.addEventListener("click", () => {
    if (isOpen()) {
      closeNav();
    } else {
      openNav();
    }
  });

  backdrop?.addEventListener("click", closeNav);

  nav.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.closest("a") && isOpen()) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      closeNav();
      toggle!.focus();
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 64rem)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches && isOpen()) {
      closeNav();
    }
  });
})();
