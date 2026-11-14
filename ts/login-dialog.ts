/**
 * Kefi-Fresh — Modales del sitio (<dialog> nativo con .showModal())
 * Maneja cualquier disparador [data-dialog-open="<id>"] hacia su <dialog id="<id>">,
 * más el comportamiento propio del modal de inicio de sesión.
 */

import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

(function initDialogs(): void {
  type DialogEntry = { dialog: HTMLDialogElement; lastTrigger: HTMLElement | null };
  const dialogs = new Map<string, DialogEntry>();

  // 1. Abre cualquier modal del sitio usando data-dialog-open
  document.querySelectorAll<HTMLButtonElement>("[data-dialog-open]").forEach((openButton) => {
    const dialogId = openButton.getAttribute("data-dialog-open");
    if (!dialogId) return;

    let entry = dialogs.get(dialogId);
    if (!entry) {
      const dialog = document.getElementById(dialogId) as HTMLDialogElement | null;
      if (!dialog) return;

      entry = { dialog, lastTrigger: null };
      dialogs.set(dialogId, entry);

      dialog.querySelectorAll<HTMLButtonElement>("[data-dialog-close]").forEach((closeButton) => {
        closeButton.addEventListener("click", () => dialog.close("cancel"));
      });

      dialog.addEventListener("close", () => {
        entry!.lastTrigger?.focus();
        entry!.lastTrigger = null;
      });
    }

    const currentEntry = entry;
    openButton.addEventListener("click", () => {
      currentEntry.lastTrigger = openButton;
      currentEntry.dialog.showModal();
      currentEntry.dialog.querySelector<HTMLElement>("[data-dialog-close]")?.focus();
    });
  });

  function trackMixpanelEvent(eventName: string, properties?: Record<string, unknown>): void {
    const mixpanel = (window as any).mixpanel;
    if (mixpanel && typeof mixpanel.track === "function") {
      mixpanel.track(eventName, properties);
    }
  }

  const loginDialog = document.querySelector<HTMLDialogElement>("#login-dialog");

  // 2. Conecta el botón de inicio de sesión con Google (Firebase)
  const botonGoogle = document.querySelector<HTMLButtonElement>("#btn-google-login");

  if (botonGoogle) {
    botonGoogle.addEventListener("click", async () => {
      trackMixpanelEvent("login_gmail_clicked");
      try {
        const resultado = await signInWithPopup(auth, googleProvider);
        console.log("¡Usuario autenticado con éxito!", resultado.user.email);
        loginDialog?.close("success");
      } catch (error) {
        console.error("Error al iniciar sesión con Google", error);
      }
    });
  }

  loginDialog?.querySelector<HTMLFormElement>("[data-login-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    trackMixpanelEvent("login_email_submitted");
  });
})();