/* =====================================================================
   MOTION · REVEAL — scrub driver  (OPTIONAL, pairs with reveal.css)
   ---------------------------------------------------------------------
   For browsers WITHOUT native CSS scroll-driven timelines (Firefox today,
   older Safari), this reproduces the SCRUBBED, reversible reveal: opacity
   and transform track scroll position, so elements animate in on the way
   down and back out on the way up — matching the native path.

   No-op where native scroll-timeline exists (Chrome/Edge/Safari 26+) or
   under prefers-reduced-motion.

   Usage:
       import { initReveal } from "jc-tailwind-ui/motion/reveal.js";
       initReveal();

   To avoid a first-paint flash, add this in <head> (sets the hidden-first
   state only when the JS path will actually run):

       <script>
         if (window.CSS && CSS.supports && !CSS.supports('animation-timeline','view()') &&
             !matchMedia('(prefers-reduced-motion: reduce)').matches)
           document.documentElement.classList.add('js-reveal');
       </script>
   ===================================================================== */

const DISTANCE = 24;      // px — matches --reveal-distance default (1.5rem)
const SCALE_FROM = 0.92;  //      matches --reveal-scale-from default

function nativeSupported() {
    return typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline", "view()");
}
function reducedMotion() {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Scroll progress of one element: 0 just as it enters the bottom, 1 once its
// top reaches ~mid-viewport. Reverses when scrolling back up.
function progressFor(rect) {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const start = vh * 0.95;   // ~5% into view
    const end = vh * 0.45;     // revealed by mid-viewport
    return Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
}

function apply(el) {
    const p = progressFor(el.getBoundingClientRect());
    let transform;
    if (el.classList.contains("reveal-fade")) transform = "none";
    else if (el.classList.contains("reveal-scale")) transform = `scale(${SCALE_FROM + (1 - SCALE_FROM) * p})`;
    else if (el.classList.contains("reveal-left")) transform = `translateX(${-(1 - p) * DISTANCE}px)`;
    else if (el.classList.contains("reveal-right")) transform = `translateX(${(1 - p) * DISTANCE}px)`;
    else transform = `translateY(${(1 - p) * DISTANCE}px)`; // rise (default)
    el.style.opacity = String(p);
    el.style.transform = transform;
}

/**
 * Enable the scrubbed reveal fallback. No-op when native scroll-timeline is
 * supported or under reduced-motion.
 * @param {Document|HTMLElement} [root=document]
 */
export function initReveal(root = document) {
    const els = Array.from(root.querySelectorAll?.(".reveal") || []);
    if (els.length === 0) return;
    if (nativeSupported() || reducedMotion()) return;

    document.documentElement.classList.add("js-reveal");

    let ticking = false;
    const update = () => {
        ticking = false;
        for (const el of els) apply(el);
    };
    const onScroll = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
}

export default { initReveal };
