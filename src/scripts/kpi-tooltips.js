
export function initKpiTooltips() {

    const popovers = document.querySelectorAll(".kpi-info");

    if (!popovers.length) return;

    function positionPopover(popover) {

        const summary = popover.querySelector("summary");
        const panel = popover.querySelector(".kpi-popover");

        if (!summary || !panel) return;

        // Reset previous positioning.
        panel.classList.remove(
            "top-full", "bottom-full",
            "mt-2", "mb-2",
            "left-0", "right-0"
        );

        panel.style.maxHeight = "";
        panel.style.overflowY = "";

        const rect = summary.getBoundingClientRect();

        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        const panelHeight = panel.offsetHeight;
        const panelWidth = panel.offsetWidth;

        // Choose vertical direction.
        if (spaceBelow >= panelHeight + 16 || spaceBelow >= spaceAbove) {
            panel.classList.add("top-full", "mt-2");
        } else {
            panel.classList.add("bottom-full", "mb-2");
        }

        // Choose horizontal alignment.
        if (rect.left + panelWidth > window.innerWidth - 12) {
            panel.classList.remove("left-0");
            panel.classList.add("right-0");
        } else {
            panel.classList.add("left-0");
        }

        // Prevent excessive height.
        const availableHeight = Math.max(
            120,
            Math.max(spaceAbove, spaceBelow) - 20
        );

        panel.style.maxHeight = `${availableHeight}px`;
        panel.style.overflowY = "auto";
    }

    popovers.forEach(popover => {

        const summary = popover.querySelector("summary");

        summary.addEventListener("click", () => {

            // Wait until the browser updates <details open>.
            requestAnimationFrame(() => {
                if (popover.open) {
                    positionPopover(popover);
                }
            });

        });

    });

    // Outside click.
    document.addEventListener("click", event => {

        const active = event.target.closest(".kpi-info");

        popovers.forEach(popover => {
            if (popover !== active) {
                popover.removeAttribute("open");
            }
        });

    });

    // Escape key.
    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        popovers.forEach(popover => {
            if (popover.open) {
                popover.removeAttribute("open");
                popover.querySelector("summary")?.focus();
            }
        });

    });

    // Reposition on viewport changes.
    window.addEventListener("resize", () => {
        popovers.forEach(popover => {
            if (popover.open) positionPopover(popover);
        });
    });

    window.addEventListener("scroll", () => {
        popovers.forEach(popover => {
            if (popover.open) positionPopover(popover);
        });
    }, true);
}
