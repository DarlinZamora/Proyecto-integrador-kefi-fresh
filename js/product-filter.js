"use strict";
/**
 * Kefi-Fresh — Buscador de productos por categoría (productos.html)
 */
(function initProductFilter() {
    const input = document.querySelector("[data-product-search]");
    const grid = document.querySelector("[data-product-grid]");
    const emptyMessage = document.querySelector("[data-product-filter-empty]");
    const chips = Array.from(document.querySelectorAll("[data-filter-chip]"));
    if (!input || !grid)
        return;
    const cards = Array.from(grid.querySelectorAll(".product-detail"));
    function normalize(value) {
        return value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "");
    }
    function applyFilter() {
        const term = normalize(input.value.trim());
        let visibleCount = 0;
        for (const card of cards) {
            const matches = term === "" || normalize(card.textContent ?? "").includes(term);
            card.hidden = !matches;
            if (matches)
                visibleCount += 1;
        }
        emptyMessage?.toggleAttribute("hidden", visibleCount !== 0);
        for (const chip of chips) {
            const isActive = term !== "" && normalize(chip.dataset.filterChip ?? "") === term;
            chip.classList.toggle("is-active", isActive);
        }
    }
    input.addEventListener("input", applyFilter);
    for (const chip of chips) {
        chip.addEventListener("click", () => {
            const value = chip.dataset.filterChip ?? "";
            const alreadyActive = chip.classList.contains("is-active");
            input.value = alreadyActive ? "" : value;
            applyFilter();
            input.focus();
        });
    }
    applyFilter();
})();
