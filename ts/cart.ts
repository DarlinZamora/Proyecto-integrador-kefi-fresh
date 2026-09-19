/**
 * Kefi-Fresh — Carrito de compras (localStorage + checkout por WhatsApp)
 */
(function initCart(): void {
  const STORAGE_KEY = "kefi-cart";
  const WHATSAPP_NUMBER = "593980148377";

  type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
    qty: number;
  };

  function readCart(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  function writeCart(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* localStorage no disponible (modo privado, etc.) */
    }
  }

  let cart = readCart();

  const toggle = document.querySelector<HTMLButtonElement>("[data-cart-toggle]");
  const drawer = document.querySelector<HTMLElement>("[data-cart-drawer]");
  const backdrop = document.querySelector<HTMLElement>("[data-cart-backdrop]");
  const closeButton = document.querySelector<HTMLButtonElement>("[data-cart-close]");
  const list = document.querySelector<HTMLUListElement>("[data-cart-list]");
  const emptyMessage = document.querySelector<HTMLElement>("[data-cart-empty]");
  const totalEl = document.querySelector<HTMLElement>("[data-cart-total]");
  const countEl = document.querySelector<HTMLElement>("[data-cart-count]");
  const checkoutLink = document.querySelector<HTMLAnchorElement>("[data-cart-checkout]");

  if (!toggle || !drawer || !list || !totalEl || !countEl) return;

  function formatPrice(value: number): string {
    return `$${value.toFixed(2)}`;
  }

  function isOpen(): boolean {
    return drawer!.classList.contains("is-open");
  }

  function openDrawer(): void {
    drawer!.classList.add("is-open");
    drawer!.setAttribute("aria-hidden", "false");
    backdrop?.classList.add("is-open");
    toggle!.setAttribute("aria-expanded", "true");
    document.body.classList.add("cart-open");
  }

  function closeDrawer(): void {
    drawer!.classList.remove("is-open");
    drawer!.setAttribute("aria-hidden", "true");
    backdrop?.classList.remove("is-open");
    toggle!.setAttribute("aria-expanded", "false");
    document.body.classList.remove("cart-open");
  }

  function totalItems(): number {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function totalPrice(): number {
    return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  function buildWhatsAppLink(): string {
    if (cart.length === 0) return "#";
    const lines = cart.map((item) => `- ${item.qty}x ${item.name} (${formatPrice(item.price)} c/u)`);
    const message = [
      "Hola, quiero hacer este pedido en Kefi-Fresh:",
      "",
      ...lines,
      "",
      `Total: ${formatPrice(totalPrice())}`,
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function render(): void {
    list!.innerHTML = "";

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
      list!.appendChild(li);
    }

    const hasItems = cart.length > 0;
    emptyMessage?.toggleAttribute("hidden", hasItems);
    list!.toggleAttribute("hidden", !hasItems);

    totalEl!.textContent = formatPrice(totalPrice());

    const count = totalItems();
    countEl!.textContent = String(count);
    countEl!.toggleAttribute("hidden", count === 0);

    if (checkoutLink) {
      checkoutLink.href = buildWhatsAppLink();
      checkoutLink.classList.toggle("is-disabled", !hasItems);
      checkoutLink.setAttribute("aria-disabled", String(!hasItems));
    }

    writeCart(cart);
  }

  function addItem(id: string, name: string, price: number, image: string): void {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, image, qty: 1 });
    }
    render();
    openDrawer();
  }

  function changeQty(id: string, delta: number): void {
    const existing = cart.find((item) => item.id === id);
    if (!existing) return;
    existing.qty += delta;
    if (existing.qty <= 0) {
      cart = cart.filter((item) => item.id !== id);
    }
    render();
  }

  function removeItem(id: string): void {
    cart = cart.filter((item) => item.id !== id);
    render();
  }

  function trackMixpanelEvent(eventName: string, properties?: Record<string, unknown>): void {
    const mixpanel = (window as any).mixpanel;
    if (mixpanel && typeof mixpanel.track === "function") {
      mixpanel.track(eventName, properties);
    }
  }

  toggle.addEventListener("click", () => {
    if (isOpen()) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeButton?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      closeDrawer();
      toggle!.focus();
    }
  });

  list.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const itemEl = target.closest<HTMLElement>("[data-cart-item]");
    if (!itemEl) return;
    const id = itemEl.dataset.cartItem!;

    if (target.closest("[data-cart-increase]")) {
      changeQty(id, 1);
    } else if (target.closest("[data-cart-decrease]")) {
      changeQty(id, -1);
    } else if (target.closest("[data-cart-remove]")) {
      removeItem(id);
    }
  });

  checkoutLink?.addEventListener("click", (event) => {
    if (cart.length === 0) {
      event.preventDefault();
      return;
    }
    trackMixpanelEvent("carrito_checkout_whatsapp", { total: totalPrice(), items: totalItems() });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId, productName, productPrice, productImage } = button.dataset;
      if (!productId || !productName || !productPrice) return;

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
