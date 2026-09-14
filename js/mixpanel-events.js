"use strict";
/**
 * Kefi-Fresh — Tracking genérico de Mixpanel vía atributos data-mixpanel-event
 */
(function initMixpanelEvents() {
    document.querySelectorAll("[data-mixpanel-event]").forEach((el) => {
        el.addEventListener("click", () => {
            const mixpanel = window.mixpanel;
            if (!mixpanel || typeof mixpanel.track !== "function")
                return;
            const { mixpanelEvent, ...properties } = el.dataset;
            mixpanel.track(mixpanelEvent, properties);
        });
    });
})();
