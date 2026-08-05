/* =====================================================================
   MOTION · SCROLLYTELL — pin a section and hand its scenes over on scroll
   ---------------------------------------------------------------------
   Drives every browser. This is the scrollytell implementation, not a
   fallback for the ones missing native scroll-driven animations.

   Scene hand-over is TRIGGERED, not scrubbed. The script picks whichever
   scene owns the slice of the section the viewport is in and marks it
   .is-active; the CSS transition then runs on its own clock. That is what
   makes a small scroll across a boundary finish the whole hand-over.

   Binding opacity straight to scroll offset (animation-timeline, or setting
   opacity per frame) cannot do that by definition: wherever the scroll stops
   is where the animation sits, so stopping mid-band leaves two scenes
   half-faded on top of one another. That was the old behaviour here.

   Scroll progress is still published as --p on the section, so anything that
   genuinely should track the scroll rather than snap — a progress rail, a
   travelling marker — reads it and stays frame-accurate.

   Usage:
       import { initScrollytell } from "jc-tailwind-ui/motion/scrollytell.js";
       initScrollytell();   // once, after DOM is ready

   Also marks the section .is-pinned for exactly the span its stage is stuck to
   the top of the viewport, so a page can move fixed furniture out of the way
   with `html:has(.scrollytell.is-pinned) …` and no scroll listener of its own.

   Emits `scrollytell:change` on the section when the active scene changes:
       detail = { index, scenes, progress }
   ===================================================================== */

function reducedMotion() {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Which scene owns a given progress value.
 *
 * floor(p * n) divides [0,1) into n equal slices, and the clamp folds p === 1
 * back into the last scene rather than overflowing to an nth+1 that does not
 * exist. Every scene therefore gets exactly the same share of the scroll.
 *
 * Deliberately NOT round(p * (n - 1)), which looks equivalent and is not: it
 * gives the first and last scenes half the travel of the middle ones, so both
 * ends feel rushed and the last scene reaches full opacity well before the pin
 * releases.
 *
 * @param {number} p Progress through the section, 0 to 1.
 * @param {number} n Scene count.
 * @returns {number} Scene index, or -1 where there are no scenes.
 */
function sceneAt(p, n) {
    if (!Number.isFinite(p) || !Number.isFinite(n) || n < 1) return -1;
    return Math.min(n - 1, Math.max(0, Math.floor(p * n)));
}

function setup(section) {
    const scenes = Array.from(section.querySelectorAll(".scene"));
    const count = scenes.length;
    if (count === 0) return;

    section.classList.add("scrollytell--js");

    let active = -1;
    let stuck = null;

    const update = () => {
        const viewport = window.innerHeight || document.documentElement.clientHeight || 0;
        const travel = section.offsetHeight - viewport;     // scrollable distance while pinned
        const past = -section.getBoundingClientRect().top;  // how far into the section we are

        // A section no taller than the viewport has nothing to travel through, so it
        // rests on its first scene rather than dividing by zero.
        const p = travel > 0 ? Math.min(Math.max(past, 0), travel) / travel : 0;

        section.style.setProperty("--p", p.toFixed(4));

        // .is-pinned marks exactly the span the stage is stuck to the top of the
        // viewport, so a page can get fixed furniture out of the way with a plain
        // `html:has(.scrollytell.is-pinned)` rule rather than its own scroll listener.
        const pinned = travel > 0 && past >= 0 && past <= travel;
        if (pinned !== stuck) {
            stuck = pinned;
            section.classList.toggle("is-pinned", pinned);
        }

        const index = sceneAt(p, count);
        if (index === active || index < 0) return;

        active = index;
        scenes.forEach((scene, i) => scene.classList.toggle("is-active", i === index));

        section.dispatchEvent(new CustomEvent("scrollytell:change", {
            bubbles: true,
            detail: { index, scenes: count, progress: p },
        }));
    };

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            update();
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
}

/**
 * Pin and drive every .scrollytell in the tree.
 *
 * No-op under prefers-reduced-motion, which leaves the plain stacked fallback:
 * .scrollytell--js is never added, so none of the pinning or fading applies and
 * the scenes read as ordinary full-height blocks.
 *
 * @param {Document|HTMLElement} [root=document]
 */
export function initScrollytell(root = document) {
    if (reducedMotion()) return;
    root.querySelectorAll?.(".scrollytell").forEach(setup);
}

export default { initScrollytell };
