/**
 * Ke-Fresh — Backoffice / Playground de componentes
 *
 * Comportamiento de interacción de Alerts, Dialogs, Menús y Toasts.
 * Todo el markup vive en playground.html y los estilos en /css.
 */

/* ------------------------------------------------------------------ *
 * Utilidades de foco
 * ------------------------------------------------------------------ */

const FOCUSABLE_SELECTOR: string = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableElements(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/* ------------------------------------------------------------------ *
 * 1. Alerts — cerrar sin dejar el foco huérfano en el <body>
 * ------------------------------------------------------------------ */

function initAlerts(): void {
  const closeButtons = document.querySelectorAll<HTMLButtonElement>(".c-alert-close");

  closeButtons.forEach((button: HTMLButtonElement): void => {
    button.addEventListener("click", (): void => {
      const alert: HTMLElement | null = button.closest<HTMLElement>(".c-alert");
      if (!alert) return;

      // El botón que tiene el foco está por desaparecer: se decide a dónde va
      // antes de quitar el alert del DOM.
      const container: HTMLElement | null = alert.parentElement;
      const siblings: HTMLElement[] = container ? getFocusableElements(container) : [];
      const nextTarget: HTMLElement | undefined = siblings.find(
        (candidate: HTMLElement): boolean => !alert.contains(candidate)
      );

      alert.remove();
      nextTarget?.focus();
    });
  });
}

/* ------------------------------------------------------------------ *
 * 2. Dialogs — <dialog> nativo abierto como modal
 * ------------------------------------------------------------------ */

function initDialogs(): void {
  const openButtons = document.querySelectorAll<HTMLButtonElement>("[data-dialog-open]");

  openButtons.forEach((openButton: HTMLButtonElement): void => {
    const dialogId: string | null = openButton.getAttribute("data-dialog-open");
    if (!dialogId) return;

    const dialog: HTMLDialogElement | null = document.getElementById(
      dialogId
    ) as HTMLDialogElement | null;
    if (!dialog) return;

    // Se recuerda el disparador para devolverle el foco al cerrar.
    let lastTrigger: HTMLElement | null = null;

    openButton.addEventListener("click", (): void => {
      lastTrigger = openButton;

      // .showModal() (no .show()): vuelve inerte el resto de la página,
      // atrapa el foco dentro y habilita el cierre con Escape.
      dialog.showModal();

      // Foco inicial en la acción segura, nunca en la destructiva.
      const cancelButton: HTMLButtonElement | null =
        dialog.querySelector<HTMLButtonElement>("[data-dialog-close]");
      cancelButton?.focus();
    });

    dialog.querySelectorAll<HTMLButtonElement>("[data-dialog-close]").forEach(
      (cancelButton: HTMLButtonElement): void => {
        cancelButton.addEventListener("click", (): void => {
          dialog.close("cancel");
        });
      }
    );

    const confirmButton: HTMLButtonElement | null =
      dialog.querySelector<HTMLButtonElement>("[data-dialog-confirm]");

    if (confirmButton) {
      confirmButton.addEventListener("click", (): void => {
        const message: string =
          confirmButton.getAttribute("data-dialog-confirm") ?? "Acción confirmada.";
        dialog.close("confirm");
        showToast(message, "success");
      });
    }

    // "close" cubre las tres salidas: Escape, Cancelar y confirmar.
    dialog.addEventListener("close", (): void => {
      lastTrigger?.focus();
      lastTrigger = null;
    });
  });
}

/* ------------------------------------------------------------------ *
 * 3. Menús — dropdown de cuenta (trigger de texto e icon button)
 * ------------------------------------------------------------------ */

function initMenus(): void {
  const menus = document.querySelectorAll<HTMLElement>("[data-menu]");

  menus.forEach((menu: HTMLElement): void => {
    const toggle: HTMLButtonElement | null =
      menu.querySelector<HTMLButtonElement>("[data-menu-toggle]");
    const list: HTMLUListElement | null =
      menu.querySelector<HTMLUListElement>("[data-menu-list]");

    if (!toggle || !list) return;

    function isOpen(): boolean {
      return toggle!.getAttribute("aria-expanded") === "true";
    }

    function openMenu(): void {
      toggle!.setAttribute("aria-expanded", "true");
      list!.hidden = false;
      getFocusableElements(list!)[0]?.focus();
    }

    function closeMenu(returnFocus: boolean): void {
      toggle!.setAttribute("aria-expanded", "false");
      list!.hidden = true;
      if (returnFocus) toggle!.focus();
    }

    toggle.addEventListener("click", (): void => {
      if (isOpen()) {
        closeMenu(true);
      } else {
        openMenu();
      }
    });

    // Flechas, Inicio y Fin recorren las opciones; el foco no queda atrapado.
    list.addEventListener("keydown", (event: KeyboardEvent): void => {
      const items: HTMLElement[] = getFocusableElements(list);
      const currentIndex: number = items.indexOf(document.activeElement as HTMLElement);

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          items[(currentIndex + 1) % items.length]?.focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          items[(currentIndex - 1 + items.length) % items.length]?.focus();
          break;
        case "Home":
          event.preventDefault();
          items[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case "Tab":
          // Tab sale del menú y sigue con la página: se cierra sin mover el foco.
          closeMenu(false);
          break;
        default:
          break;
      }
    });

    // Activar una opción cierra el menú. Si la opción es un botón (no navega),
    // el foco vuelve al trigger; si es un enlace, la navegación lo mueve sola.
    list.addEventListener("click", (event: MouseEvent): void => {
      const target: HTMLElement | null = event.target as HTMLElement | null;
      const item: HTMLElement | null = target?.closest<HTMLElement>("a, button") ?? null;
      if (!item) return;
      closeMenu(item.tagName === "BUTTON");
    });

    // Escape cierra desde cualquier punto del menú y devuelve el foco al trigger.
    menu.addEventListener("keydown", (event: KeyboardEvent): void => {
      if (event.key === "Escape" && isOpen()) {
        event.preventDefault();
        closeMenu(true);
      }
    });

    // Clic afuera: cierra, pero sin forzar el foco de vuelta al trigger.
    document.addEventListener("click", (event: MouseEvent): void => {
      const target: Node | null = event.target as Node | null;
      if (isOpen() && target && !menu.contains(target)) {
        closeMenu(false);
      }
    });
  });
}

/* ------------------------------------------------------------------ *
 * 4. Toasts — aria-live, autodescarte y máximo 3 visibles
 * ------------------------------------------------------------------ */

type ToastVariant = "success" | "error";

const TOAST_MAX_VISIBLE: number = 3;
const TOAST_DURATION_MS: number = 5000;

function getToastContainer(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-toast-container]");
}

function scheduleToastDismissal(toast: HTMLElement): void {
  window.setTimeout((): void => {
    toast.remove();
  }, TOAST_DURATION_MS);
}

function enforceToastLimit(container: HTMLElement): void {
  const toasts: HTMLElement[] = Array.from(container.querySelectorAll<HTMLElement>(".c-toast"));
  // Al llegar el cuarto se retira el más antiguo, para no encolar una ráfaga
  // de anuncios en la región aria-live.
  while (toasts.length > TOAST_MAX_VISIBLE) {
    toasts.shift()?.remove();
  }
}

function showToast(message: string, variant: ToastVariant): void {
  const container: HTMLElement | null = getToastContainer();
  if (!container) return;

  const toast: HTMLDivElement = document.createElement("div");
  toast.className = `c-toast c-toast--${variant}`;

  const text: HTMLParagraphElement = document.createElement("p");
  text.textContent = message;
  toast.appendChild(text);

  // Se inserta dentro de la región aria-live="polite": se anuncia solo,
  // sin robarle el foco a lo que el usuario esté haciendo.
  container.appendChild(toast);

  enforceToastLimit(container);
  scheduleToastDismissal(toast);
}

function initToasts(): void {
  const container: HTMLElement | null = getToastContainer();

  // Los toasts que ya vienen en el HTML también desaparecen solos.
  container
    ?.querySelectorAll<HTMLElement>(".c-toast")
    .forEach((toast: HTMLElement): void => scheduleToastDismissal(toast));

  const demoButtons = document.querySelectorAll<HTMLButtonElement>("[data-toast-demo]");

  demoButtons.forEach((button: HTMLButtonElement): void => {
    button.addEventListener("click", (): void => {
      const variant: ToastVariant =
        button.getAttribute("data-toast-demo") === "error" ? "error" : "success";
      const message: string =
        button.getAttribute("data-toast-message") ?? "Operación completada.";
      showToast(message, variant);
    });
  });
}

/* ------------------------------------------------------------------ *
 * Arranque
 * ------------------------------------------------------------------ */

function initPlayground(): void {
  initAlerts();
  initDialogs();
  initMenus();
  initToasts();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPlayground);
} else {
  initPlayground();
}

// Marca el archivo como módulo ES: nada de este archivo llega al scope global.
export {};
