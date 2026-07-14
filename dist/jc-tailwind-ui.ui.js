/* =====================================================================
   INTERACTIVE · JS  (OPTIONAL — pairs with interactive.css + component CSS)
   ---------------------------------------------------------------------
   Vanilla ESM, zero dependencies, progressive enhancement. One delegated
   listener drives everything, so dynamically-injected markup works without
   re-init.

       import { initUI, toast } from "jc-tailwind-ui/interactive/ui.js";
       initUI();

   Data-attribute API:
     Modal      [data-modal-open="ID"] / [data-modal-close]  (backdrop + Esc close)
     Offcanvas  [data-offcanvas-open="ID"] / [data-offcanvas-close]
     Dropdown   .dropdown > .dropdown-toggle  → toggles the .dropdown-menu
     Popover    [data-popover-toggle="#ID"]   → toggles #ID.popover
     Tabs       .nav-link[data-tab-target="#PANE"]
     Accordion  .accordion-button             → single-open within its .accordion
     Dismiss    [data-dismiss] (optionally ="#ID")  → removes the alert/banner
     Copy       [data-copy="TEXT"]
     Switch     .switch                        (legacy toggle; see also .form-switch)
     Inline     .edit-field + [data-edit-start] / [data-edit-cancel]
     Palette    .palette [data-swatch="VALUE"] → writes [data-palette-input]
     Top        [data-back-to-top]             → appears past 400px, scrolls up
   ===================================================================== */

/* ---- Toasts ---------------------------------------------------------- */
function toastHost() {
    let host = document.querySelector(".toast-host");
    if (!host) {
        host = document.createElement("div");
        host.className = "toast-host";
        host.setAttribute("role", "status");
        host.setAttribute("aria-live", "polite");
        document.body.appendChild(host);
    }
    return host;
}
export function toast(message, opts = {}) {
    const { variant, timeout = 3200 } = opts;
    const el = document.createElement("div");
    el.className = "toast" + (variant ? ` toast--${variant}` : "");
    el.textContent = message;
    toastHost().appendChild(el);
    const remove = () => {
        el.style.opacity = "0";
        el.addEventListener("transitionend", () => el.remove(), { once: true });
        setTimeout(() => el.remove(), 250);
    };
    if (timeout > 0) setTimeout(remove, timeout);
    el.addEventListener("click", remove);
    return el;
}

/* ---- Modals ---------------------------------------------------------- */
export function openModal(id) {
    const b = typeof id === "string" ? document.getElementById(id) : id;
    if (b) b.classList.add("open");
}
export function closeModal(b) { if (b) b.classList.remove("open"); }
function closeAllModals() { document.querySelectorAll(".modal-backdrop.open").forEach((b) => b.classList.remove("open")); }

/* ---- Offcanvas ------------------------------------------------------- */
function offcanvasBackdrop() {
    let bd = document.querySelector(".offcanvas-backdrop");
    if (!bd) {
        bd = document.createElement("div");
        bd.className = "offcanvas-backdrop";
        document.body.appendChild(bd);
    }
    return bd;
}
export function openOffcanvas(id) {
    const el = typeof id === "string" ? document.getElementById(id) : id;
    if (!el) return;
    el.classList.add("show");
    offcanvasBackdrop().classList.add("show");
}
export function closeOffcanvas() {
    document.querySelectorAll(".offcanvas.show").forEach((o) => o.classList.remove("show"));
    const bd = document.querySelector(".offcanvas-backdrop");
    if (bd) bd.classList.remove("show");
}

/* ---- Dropdowns / popovers -------------------------------------------- */
function closeFloating(except) {
    document.querySelectorAll(".dropdown-menu.show, .popover.show").forEach((m) => {
        if (m !== except) m.classList.remove("show");
    });
}

/* ---- Clipboard ------------------------------------------------------- */
async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement("textarea");
            ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
            document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
        }
        return true;
    } catch { return false; }
}

/* ---- Delegated click ------------------------------------------------- */
function onClick(e) {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;

    // Dropdown toggle
    const ddToggle = t.closest(".dropdown-toggle, [data-dropdown-toggle]");
    if (ddToggle) {
        const menu = ddToggle.closest(".dropdown")?.querySelector(".dropdown-menu");
        const willOpen = menu && !menu.classList.contains("show");
        closeFloating();
        if (menu) menu.classList.toggle("show", !!willOpen);
        return;
    }
    // Popover toggle
    const popToggle = t.closest("[data-popover-toggle]");
    if (popToggle) {
        const pop = document.querySelector(popToggle.getAttribute("data-popover-toggle"));
        const willOpen = pop && !pop.classList.contains("show");
        closeFloating();
        if (pop) pop.classList.toggle("show", !!willOpen);
        return;
    }
    // Clicking outside any open dropdown/popover closes them.
    if (!t.closest(".dropdown-menu, .popover")) closeFloating();

    // Modal
    const mOpen = t.closest("[data-modal-open]");
    if (mOpen) { openModal(mOpen.getAttribute("data-modal-open")); return; }
    const mClose = t.closest("[data-modal-close]");
    if (mClose) { closeModal(mClose.closest(".modal-backdrop")); return; }
    if (t.classList.contains("modal-backdrop")) { closeModal(t); return; }

    // Offcanvas
    const ocOpen = t.closest("[data-offcanvas-open]");
    if (ocOpen) { openOffcanvas(ocOpen.getAttribute("data-offcanvas-open")); return; }
    if (t.closest("[data-offcanvas-close]") || t.classList.contains("offcanvas-backdrop")) { closeOffcanvas(); return; }

    // Tabs
    const tab = t.closest("[data-tab-target]");
    if (tab) {
        const target = document.querySelector(tab.getAttribute("data-tab-target"));
        const navRoot = tab.closest(".nav, .nav-tabs, .nav-pills") || tab.parentElement;
        navRoot?.querySelectorAll("[data-tab-target]").forEach((l) => l.classList.remove("active"));
        tab.classList.add("active");
        if (target) {
            target.parentElement?.querySelectorAll(":scope > .tab-pane").forEach((p) => p.classList.remove("active"));
            target.classList.add("active");
        }
        return;
    }

    // Segmented control / toggle button-group (moves .active among siblings)
    const segItem = t.closest(".segmented > .btn, .btn-group[data-toggle] > .btn");
    if (segItem) {
        const group = segItem.parentElement;
        group.querySelectorAll(".btn.active").forEach((b) => b.classList.remove("active"));
        segItem.classList.add("active");
        group.dispatchEvent(new CustomEvent("segment:change", { bubbles: true, detail: { value: segItem.textContent.trim() } }));
        return;
    }

    // Accordion (single-open within its .accordion)
    const accBtn = t.closest(".accordion-button");
    if (accBtn) {
        const item = accBtn.closest(".accordion-item");
        const panel = item?.querySelector(".accordion-collapse");
        const isOpen = panel?.classList.contains("show");
        accBtn.closest(".accordion")?.querySelectorAll(".accordion-collapse.show").forEach((p) => {
            p.classList.remove("show");
            p.previousElementSibling?.classList.add("collapsed");
            p.closest(".accordion-item")?.querySelector(".accordion-button")?.classList.add("collapsed");
        });
        if (panel && !isOpen) { panel.classList.add("show"); accBtn.classList.remove("collapsed"); }
        return;
    }

    // Dismiss (alert / banner)
    const dismiss = t.closest("[data-dismiss]");
    if (dismiss) {
        const sel = dismiss.getAttribute("data-dismiss");
        const target = sel && sel.startsWith("#") ? document.querySelector(sel) : dismiss.closest(".alert, .banner");
        if (target) {
            target.style.transition = "opacity .2s ease";
            target.style.opacity = "0";
            target.addEventListener("transitionend", () => target.remove(), { once: true });
            setTimeout(() => target.remove(), 260);
        }
        return;
    }

    // Copy
    const copyEl = t.closest("[data-copy]");
    if (copyEl) {
        const text = copyEl.getAttribute("data-copy") || copyEl.textContent.trim();
        copyText(text).then((ok) => toast(ok ? "Copied to clipboard" : "Copy failed", { variant: ok ? "success" : "danger" }));
        return;
    }

    // Legacy switch
    const sw = t.closest(".switch");
    if (sw) {
        const on = sw.classList.toggle("switch--on");
        sw.setAttribute("aria-checked", String(on));
        sw.dispatchEvent(new CustomEvent("switch:change", { bubbles: true, detail: { on } }));
        return;
    }

    // Inline edit
    const startEl = t.closest("[data-edit-start]");
    if (startEl) {
        const field = startEl.closest(".edit-field");
        if (field) { field.classList.add("editing"); field.querySelector("input, textarea, select")?.focus(); }
        return;
    }
    const cancelEl = t.closest("[data-edit-cancel]");
    if (cancelEl) { cancelEl.closest(".edit-field")?.classList.remove("editing"); return; }

    // Palette
    const swatch = t.closest("[data-swatch]");
    if (swatch) {
        const palette = swatch.closest(".palette");
        if (palette) {
            palette.querySelectorAll(".swatch--active").forEach((s) => s.classList.remove("swatch--active"));
            swatch.classList.add("swatch--active");
            const input = palette.querySelector("[data-palette-input]");
            const value = swatch.getAttribute("data-swatch");
            if (input) input.value = value;
            palette.dispatchEvent(new CustomEvent("palette:change", { bubbles: true, detail: { value } }));
        }
        return;
    }

    // Back to top
    if (t.closest("[data-back-to-top]")) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
}

function onKeydown(e) {
    if (e.key === "Escape") { closeAllModals(); closeOffcanvas(); closeFloating(); }
    const el = document.activeElement;
    if ((e.key === " " || e.key === "Enter") && el instanceof Element && el.classList.contains("switch")) {
        e.preventDefault();
        el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
}

let wired = false;

/**
 * Wire the interactive components. Idempotent; delegation means later markup
 * still works. Pass a root only to (re)initialise ARIA on a subtree.
 * @param {Document|HTMLElement} [root=document]
 */
export function initUI(root = document) {
    root.querySelectorAll?.(".switch").forEach((sw) => {
        sw.setAttribute("role", "switch");
        sw.setAttribute("tabindex", sw.getAttribute("tabindex") ?? "0");
        sw.setAttribute("aria-checked", String(sw.classList.contains("switch--on")));
    });

    if (wired) return;
    wired = true;
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeydown);

    // Back-to-top visibility.
    const topBtns = () => document.querySelectorAll("[data-back-to-top]");
    const onScroll = () => topBtns().forEach((b) => b.classList.toggle("show", window.scrollY > 400));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

export default { initUI, toast, openModal, closeModal, openOffcanvas, closeOffcanvas };
