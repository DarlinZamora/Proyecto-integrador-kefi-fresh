/**
 * Ke-Fresh — Backoffice / Playground de componentes
 *
 * Comportamiento de interacción de Alerts, Dialogs, Menús y Toasts.
 * Todo el markup vive en playground.html y los estilos en /css.
 */
/* ------------------------------------------------------------------ *
 * Utilidades de foco
 * ------------------------------------------------------------------ */
const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(", ");
function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}
/* ------------------------------------------------------------------ *
 * 1. Alerts — cerrar sin dejar el foco huérfano en el <body>
 * ------------------------------------------------------------------ */
function initAlerts() {
    const closeButtons = document.querySelectorAll(".c-alert-close");
    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const alert = button.closest(".c-alert");
            if (!alert)
                return;
            // El botón que tiene el foco está por desaparecer: se decide a dónde va
            // antes de quitar el alert del DOM.
            const container = alert.parentElement;
            const siblings = container ? getFocusableElements(container) : [];
            const nextTarget = siblings.find((candidate) => !alert.contains(candidate));
            alert.remove();
            nextTarget?.focus();
        });
    });
}
/* ------------------------------------------------------------------ *
 * 2. Dialogs — <dialog> nativo abierto como modal
 * ------------------------------------------------------------------ */
function initDialogs() {
    const openButtons = document.querySelectorAll("[data-dialog-open]");
    openButtons.forEach((openButton) => {
        const dialogId = openButton.getAttribute("data-dialog-open");
        if (!dialogId)
            return;
        const dialog = document.getElementById(dialogId);
        if (!dialog)
            return;
        // Se recuerda el disparador para devolverle el foco al cerrar.
        let lastTrigger = null;
        openButton.addEventListener("click", () => {
            lastTrigger = openButton;
            // .showModal() (no .show()): vuelve inerte el resto de la página,
            // atrapa el foco dentro y habilita el cierre con Escape.
            dialog.showModal();
            // Foco inicial en la acción segura, nunca en la destructiva.
            const cancelButton = dialog.querySelector("[data-dialog-close]");
            cancelButton?.focus();
        });
        dialog.querySelectorAll("[data-dialog-close]").forEach((cancelButton) => {
            cancelButton.addEventListener("click", () => {
                dialog.close("cancel");
            });
        });
        const confirmButton = dialog.querySelector("[data-dialog-confirm]");
        if (confirmButton) {
            confirmButton.addEventListener("click", () => {
                const message = confirmButton.getAttribute("data-dialog-confirm") ?? "Acción confirmada.";
                dialog.close("confirm");
                showToast(message, "success");
            });
        }
        // "close" cubre las tres salidas: Escape, Cancelar y confirmar.
        dialog.addEventListener("close", () => {
            lastTrigger?.focus();
            lastTrigger = null;
        });
    });
}
/* ------------------------------------------------------------------ *
 * 3. Menús — dropdown de cuenta (trigger de texto e icon button)
 * ------------------------------------------------------------------ */
function initMenus() {
    const menus = document.querySelectorAll("[data-menu]");
    menus.forEach((menu) => {
        const toggle = menu.querySelector("[data-menu-toggle]");
        const list = menu.querySelector("[data-menu-list]");
        if (!toggle || !list)
            return;
        function isOpen() {
            return toggle.getAttribute("aria-expanded") === "true";
        }
        function openMenu() {
            toggle.setAttribute("aria-expanded", "true");
            list.hidden = false;
            getFocusableElements(list)[0]?.focus();
        }
        function closeMenu(returnFocus) {
            toggle.setAttribute("aria-expanded", "false");
            list.hidden = true;
            if (returnFocus)
                toggle.focus();
        }
        toggle.addEventListener("click", () => {
            if (isOpen()) {
                closeMenu(true);
            }
            else {
                openMenu();
            }
        });
        // Flechas, Inicio y Fin recorren las opciones; el foco no queda atrapado.
        list.addEventListener("keydown", (event) => {
            const items = getFocusableElements(list);
            const currentIndex = items.indexOf(document.activeElement);
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
        list.addEventListener("click", (event) => {
            const target = event.target;
            const item = target?.closest("a, button") ?? null;
            if (!item)
                return;
            closeMenu(item.tagName === "BUTTON");
        });
        // Escape cierra desde cualquier punto del menú y devuelve el foco al trigger.
        menu.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && isOpen()) {
                event.preventDefault();
                closeMenu(true);
            }
        });
        // Clic afuera: cierra, pero sin forzar el foco de vuelta al trigger.
        document.addEventListener("click", (event) => {
            const target = event.target;
            if (isOpen() && target && !menu.contains(target)) {
                closeMenu(false);
            }
        });
    });
}
const TOAST_MAX_VISIBLE = 3;
const TOAST_DURATION_MS = 5000;
function getToastContainer() {
    return document.querySelector("[data-toast-container]");
}
function scheduleToastDismissal(toast) {
    window.setTimeout(() => {
        toast.remove();
    }, TOAST_DURATION_MS);
}
function enforceToastLimit(container) {
    const toasts = Array.from(container.querySelectorAll(".c-toast"));
    // Al llegar el cuarto se retira el más antiguo, para no encolar una ráfaga
    // de anuncios en la región aria-live.
    while (toasts.length > TOAST_MAX_VISIBLE) {
        toasts.shift()?.remove();
    }
}
function showToast(message, variant) {
    const container = getToastContainer();
    if (!container)
        return;
    const toast = document.createElement("div");
    toast.className = `c-toast c-toast--${variant}`;
    const text = document.createElement("p");
    text.textContent = message;
    toast.appendChild(text);
    // Se inserta dentro de la región aria-live="polite": se anuncia solo,
    // sin robarle el foco a lo que el usuario esté haciendo.
    container.appendChild(toast);
    enforceToastLimit(container);
    scheduleToastDismissal(toast);
}
function initToasts() {
    const container = getToastContainer();
    // Los toasts que ya vienen en el HTML también desaparecen solos.
    container
        ?.querySelectorAll(".c-toast")
        .forEach((toast) => scheduleToastDismissal(toast));
    const demoButtons = document.querySelectorAll("[data-toast-demo]");
    demoButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const variant = button.getAttribute("data-toast-demo") === "error" ? "error" : "success";
            const message = button.getAttribute("data-toast-message") ?? "Operación completada.";
            showToast(message, variant);
        });
    });
}
/* ------------------------------------------------------------------ *
 * Arranque
 * ------------------------------------------------------------------ */
function initPlayground() {
    initAlerts();
    initDialogs();
    initMenus();
    initToasts();
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPlayground);
}
else {
    initPlayground();
}
export {};
