/* =====================================================================
   MOTION · SCROLLYTELL — JS fallback  (OPTIONAL)
   ---------------------------------------------------------------------
   Reproduces the pinned scene cross-fade for browsers WITHOUT native CSS
   scroll-driven animations (Firefox today, older Safari/Chrome). Where the
   native feature IS available, this is a no-op — the pure-CSS path in
   scrollytell.css handles everything.

   Usage:
       import { initScrollytell } from "jc-tailwind-ui/motion/scrollytell.js";
       initScrollytell();   // once, after DOM is ready
   ===================================================================== */

function nativeSupported() {
    return typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline", "view()");
}

function reducedMotion() {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* How much of a scene's slot is spent CROSS-FADING vs HELD fully visible.
   Lower = longer dwell on each scene before the hand-off. 0.55 ≈ hold is
   ~1.8× the fade, so there is real scroll "inside" a scene. */
const FADE_RATIO = 0.55;

/* Split [0,1] into n holds + (n-1) fades. A hold shows one scene at full
   opacity (no neighbour bleed); a fade cross-fades two adjacent scenes. */
function buildSegments(n) {
    const hold = 1 / (n + (n - 1) * FADE_RATIO);
    const fade = hold * FADE_RATIO;
    const segs = [];
    let cursor = 0;
    for (let i = 0; i < n; i++) {
        segs.push({ type: "hold", a: i, start: cursor, end: cursor + hold });
        cursor += hold;
        if (i < n - 1) {
            segs.push({ type: "fade", a: i, b: i + 1, start: cursor, end: cursor + fade });
            cursor += fade;
        }
    }
    segs[segs.length - 1].end = 1; // absorb float drift into the final hold
    return segs;
}

// Smootherstep — eases the cross-fade so hand-offs aren't linear.
function ease(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function setup(section) {
    const scenes = Array.from(section.querySelectorAll(".scene"));
    const n = scenes.length;
    if (n === 0) return;

    section.classList.add("scrollytell--js");
    const segments = buildSegments(n);

    let ticking = false;
    const update = () => {
        ticking = false;
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;   // scrollable travel
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
        const p = total > 0 ? scrolled / total : 0;                 // 0 → 1 through the section

        for (let i = 0; i < n; i++) scenes[i].style.opacity = "0";

        const seg = segments.find((s) => p >= s.start && p <= s.end) || segments[segments.length - 1];
        if (seg.type === "hold") {
            scenes[seg.a].style.opacity = "1";                       // full dwell, no bleed
        } else {
            const f = ease((p - seg.start) / (seg.end - seg.start));
            scenes[seg.a].style.opacity = String(1 - f);            // outgoing
            scenes[seg.b].style.opacity = String(f);                // incoming
        }
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

/**
 * Enable the scrollytell JS fallback on any .scrollytell that needs it.
 * No-op when native scroll-driven animations are supported, or under
 * prefers-reduced-motion (the plain stacked fallback stays).
 * @param {Document|HTMLElement} [root=document]
 */
export function initScrollytell(root = document) {
    if (nativeSupported() || reducedMotion()) return;
    root.querySelectorAll?.(".scrollytell").forEach(setup);
}

export default { initScrollytell };
