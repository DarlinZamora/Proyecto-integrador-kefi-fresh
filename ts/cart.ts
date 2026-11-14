"use strict";
/**
 * Kefi-Fresh — Carrito de compras (localStorage + checkout por WhatsApp)
 */
(function initCart() {
    const STORAGE_KEY = "kefi-cart";
    const WHATSAPP_NUMBER = "593980148377";
    
    function readCart() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        }
        catch {
            return [];
        }
    }
    
    function writeCart(items: any[]) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
        catch {
            /* localStorage no disponible */
        }
    }
    
    let cart = readCart();
    const toggle = document.querySelector("[data-cart-toggle]") as HTMLElement;
    const drawer = document.querySelector("[data-cart-drawer]") as HTMLElement;
    const backdrop = document.querySelector("[data-cart-backdrop]") as HTMLElement;
    const closeButton = document.querySelector("[data-cart-close]") as HTMLElement;
    const list = document.querySelector("[data-cart-list]") as HTMLElement;
    const emptyMessage = document.querySelector("[data-cart-empty]") as HTMLElement;
    const totalEl = document.querySelector("[data-cart-total]") as HTMLElement;
    const countEl = document.querySelector("[data-cart-count]") as HTMLElement;
    const checkoutLink = document.querySelector("[data-cart-checkout]") as HTMLAnchorElement;

    if (!toggle || !drawer || !list || !totalEl || !countEl)
        return;
        
    function formatPrice(value: number) {
        return `$${value.toFixed(2)}`;
    }
    
    function isOpen() {
        return drawer.classList.contains("is-open");
    }
    
    function openDrawer() {
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        backdrop?.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("cart-open");
    }
    
    function closeDrawer() {
        drawer.classList.remove("is-open");
        drawer.setAttribute("aria-hidden", "true");
        backdrop?.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("cart-open");
    }
    
    function totalItems() {
        return cart.reduce((sum: number, item: any) => sum + item.qty, 0);
    }
    
    function totalPrice() {
        return cart.reduce((sum: number, item: any) => sum + item.qty * item.price, 0);
    }

    function buildWhatsAppLink() {
        if (cart.length === 0) {
            return "#";
        }

        const nombreCliente = (document.getElementById('nombreCliente') as HTMLInputElement)?.value.trim() || '';
        const telefono = (document.getElementById('telefono') as HTMLInputElement)?.value.trim() || '';
        const direccionEntrega = (document.getElementById('direccionEntrega') as HTMLInputElement)?.value.trim() || '';
        const observaciones = (document.getElementById('observaciones') as HTMLInputElement)?.value.trim() || '';

        const lines = cart.map((item: any) => `- ${item.qty}x ${item.name} (${formatPrice(item.price)} c/u)`);
        
        const message = [
            "Hola, quiero hacer este pedido en Kefi-Fresh:",
            "",
            ...lines,
            "",
            `Total: ${formatPrice(totalPrice())}`,
            "",
            "*Datos de Despacho:*",
            `- Nombre: ${nombreCliente}`,
            `- Teléfono: ${telefono}`,
            `- Dirección: ${direccionEntrega}`,
            `- Observaciones: ${observaciones}`
        ].join("\n");

        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    }

    function render() {
        if (!list || !emptyMessage || !totalEl || !countEl) return;
        list.innerHTML = "";
        for (const item of cart) {
            const li = document.createElement("li");
            li.className = "cart-item";
            li.dataset.cartItem = item.id;
            li.innerHTML = `
        <img class="cart-item__photo" src="${item.image}" alt="" />
        <div class="cart-item__info">
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__price">${formatPrice(item.price)}</p>
        </div>
        <div class="cart-item__qty">
          <button type="button" class="btn btn--icon" data-cart-decrease aria-label="Quitar una unidad de ${item.name}">−</button>
          <span class="cart-item__qty-value">${item.qty}</span>
          <button type="button" class="btn btn--icon" data-cart-increase aria-label="Agregar una unidad de ${item.name}">+</button>
        </div>
        <button type="button" class="cart-item__remove" data-cart-remove aria-label="Eliminar ${item.name} del carrito">&times;</button>
      `;
            list.appendChild(li);
        }
        const hasItems = cart.length > 0;
        emptyMessage?.toggleAttribute("hidden", hasItems);
        list.toggleAttribute("hidden", !hasItems);
        totalEl.textContent = formatPrice(totalPrice());
        const count = totalItems();
        countEl.textContent = String(count);
        countEl.toggleAttribute("hidden", count === 0);
        if (checkoutLink) {
            checkoutLink.href = buildWhatsAppLink();
            checkoutLink.classList.toggle("is-disabled", !hasItems);
            checkoutLink.setAttribute("aria-disabled", String(!hasItems));
        }
        writeCart(cart);
    }

    function addItem(id: string, name: string, price: number, image: string) {
        const existing = cart.find((item: any) => item.id === id);
        if (existing) {
            existing.qty += 1;
        }
        else {
            cart.push({ id, name, price, image, qty: 1 });
        }
        render();
        openDrawer();
    }

    function changeQty(id: string, delta: number) {
        const existing = cart.find((item: any) => item.id === id);
        if (!existing)
            return;
        existing.qty += delta;
        if (existing.qty <= 0) {
            cart = cart.filter((item: any) => item.id !== id);
        }
        render();
    }

    function removeItem(id: string) {
        cart = cart.filter((item: any) => item.id !== id);
        render();
    }

    function trackMixpanelEvent(eventName: string, properties: any) {
        const mixpanel = (window as any).mixpanel;
        if (mixpanel && typeof mixpanel.track === "function") {
            mixpanel.track(eventName, properties);
        }
    }

    toggle.addEventListener("click", () => {
        if (isOpen()) {
            closeDrawer();
        }
        else {
            openDrawer();
        }
    });
    
    closeButton?.addEventListener("click", closeDrawer);
    backdrop?.addEventListener("click", closeDrawer);
    
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen()) {
            closeDrawer();
            toggle.focus();
        }
    });

    list.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const itemEl = target.closest("[data-cart-item]") as HTMLElement;
        if (!itemEl)
            return;
        const id = itemEl.dataset.cartItem;
        if (!id) return;
        if (target.closest("[data-cart-increase]")) {
            changeQty(id, 1);
        }
        else if (target.closest("[data-cart-decrease]")) {
            changeQty(id, -1);
        }
        else if (target.closest("[data-cart-remove]")) {
            removeItem(id);
        }
    });

    
// Evitar que escriban letras o símbolos en tiempo real en el teléfono
const telefonoInput = document.getElementById('telefono') as HTMLInputElement;
    const telefonoError = document.getElementById('telefonoError') as HTMLElement; // Referencia al texto de error

    telefonoInput?.addEventListener("input", () => {
        // Remover todo lo que no sea número automáticamente
        telefonoInput.value = telefonoInput.value.replace(/\D/g, ''); 

        // Validar en tiempo real si tiene menos de 10 dígitos
        if (telefonoInput.value.length < 10 && telefonoInput.value.length > 0) {
            telefonoInput.style.borderColor = "red";
            if (telefonoError) {
                telefonoError.style.display = "block";
                telefonoError.textContent = `Dígitos incompletos (${telefonoInput.value.length}/10)`;
            }
        } else {
            telefonoInput.style.borderColor = "";
            if (telefonoError) {
                telefonoError.style.display = "none";
            }
        }
    });

    checkoutLink?.addEventListener("click", (event) => {
        if (cart.length === 0) {
            event.preventDefault();
            return;
        }

        const nombreCliente = (document.getElementById('nombreCliente') as HTMLInputElement)?.value.trim() || '';
        const telefono = telefonoInput?.value.trim() || '';
        const direccionEntrega = (document.getElementById('direccionEntrega') as HTMLInputElement)?.value.trim() || '';

        if (!nombreCliente || !telefono || !direccionEntrega) {
            event.preventDefault();
            if (!telefono && telefonoInput) telefonoInput.style.borderColor = 'red';
            alert('Por favor, completa tu Nombre, Teléfono y Dirección de entrega.');
            return;
        }

        if (telefono.length !== 10) {
            event.preventDefault();
            telefonoInput.style.borderColor = 'red';
            if (telefonoError) {
                telefonoError.style.display = "block";
                telefonoError.textContent = 'El número debe tener exactamente 10 dígitos.';
            }
            return;
        }

        const link = buildWhatsAppLink();
        if (link === "#") {
            event.preventDefault();
            return;
        }
        checkoutLink.href = link;

        trackMixpanelEvent("carrito_checkout_whatsapp", { total: totalPrice(), items: totalItems() });
    });

    document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
        button.addEventListener("click", () => {
            const dataset = (button as HTMLElement).dataset;
            const productId = dataset.productId;
            const productName = dataset.productName;
            const productPrice = dataset.productPrice;
            const productImage = dataset.productImage;

            if (!productId || !productName || !productPrice)
                return;
            addItem(productId, productName, Number(productPrice), productImage ?? "");
            trackMixpanelEvent("producto_agregado_carrito", {
                producto_id: productId,
                producto_nombre: productName,
                producto_precio: Number(productPrice),
            });
        });
    });
    
    render();
})();
