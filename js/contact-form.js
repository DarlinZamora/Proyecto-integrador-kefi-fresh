"use strict";
/**
 * Kefi-Fresh — Validación del formulario de contacto
 */
(function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form)
        return;
    const nombreInput = form.querySelector("#nombre");
    const emailInput = form.querySelector("#email");
    const mensajeInput = form.querySelector("#mensaje");
    const feedback = document.querySelector("[data-form-feedback]");
    if (!nombreInput || !emailInput || !mensajeInput)
        return;
    function validateNombre(value) {
        if (!value)
            return "Ingresa tu nombre.";
        if (value.length < 2)
            return "El nombre debe tener al menos 2 caracteres.";
        return "";
    }
    function validateEmail(value) {
        if (!value)
            return "Ingresa tu correo electrónico.";
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(value))
            return "Ingresa un correo electrónico válido.";
        return "";
    }
    function validateMensaje(value) {
        if (!value)
            return "Escribe tu mensaje.";
        if (value.length < 10)
            return "El mensaje debe tener al menos 10 caracteres.";
        return "";
    }
    const fields = [
        { input: nombreInput, validate: validateNombre },
        { input: emailInput, validate: validateEmail },
        { input: mensajeInput, validate: validateMensaje },
    ];
    function showFieldError(input, message) {
        const errorId = input.getAttribute("aria-describedby");
        const errorEl = errorId ? document.getElementById(errorId) : null;
        if (errorEl) {
            errorEl.textContent = message;
        }
        input.setAttribute("aria-invalid", message ? "true" : "false");
    }
    function validateOne(entry) {
        const message = entry.validate(entry.input.value.trim());
        showFieldError(entry.input, message);
        return message === "";
    }
    function setFeedback(message, kind) {
        if (!feedback)
            return;
        feedback.textContent = message;
        feedback.classList.remove("form-feedback--success", "form-feedback--error");
        feedback.classList.add(kind === "success" ? "form-feedback--success" : "form-feedback--error");
    }
    for (const entry of fields) {
        entry.input.addEventListener("blur", () => validateOne(entry));
        entry.input.addEventListener("input", () => {
            if (entry.input.getAttribute("aria-invalid") === "true") {
                validateOne(entry);
            }
        });
    }
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const invalidFields = fields.filter((entry) => !validateOne(entry));
        if (invalidFields.length > 0) {
            invalidFields[0].input.focus();
            setFeedback("Revisa los campos marcados antes de continuar.", "error");
            return;
        }
        setFeedback("¡Gracias! Tu mensaje fue enviado, te contactaré pronto.", "success");
        form.reset();
        for (const entry of fields) {
            showFieldError(entry.input, "");
        }
    });
})();
