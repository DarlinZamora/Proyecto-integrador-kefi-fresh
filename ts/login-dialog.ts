/**
 * Kefi-Fresh — Modales del sitio (<dialog> nativo con .showModal())
 * Maneja cualquier disparador [data-dialog-open="<id>"] hacia su <dialog id="<id>">,
 * más el comportamiento propio del modal de inicio de sesión.
 */
(function initDialogs(): void {
  type DialogEntry = { dialog: HTMLDialogElement; lastTrigger: HTMLElement | null };
  const dialogs = new Map<string, DialogEntry>();

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

      // "close" cubre tanto Escape (nativo de <dialog>) como el botón de cerrar.
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

  loginDialog?.querySelector<HTMLButtonElement>("[data-login-gmail]")?.addEventListener("click", () => {
    trackMixpanelEvent("login_gmail_clicked");
  });

  loginDialog?.querySelector<HTMLFormElement>("[data-login-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    trackMixpanelEvent("login_email_submitted");
  });
})();
