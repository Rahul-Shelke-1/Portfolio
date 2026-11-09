
/**
 * Hero Architecture Preview
 *
 * Reuses architecture images from flagship project metadata.
 * Supports automatic rotation and circular progress.
 */

export function initHeroArchitecture(flagshipProjects) {
    const container = document.getElementById("hero-architecture");

    if (!container || !Array.isArray(flagshipProjects)) {
        return;
    }

    const image = document.getElementById("hero-architecture-image");
    const projectName = document.getElementById("hero-architecture-project");
    const caption = document.getElementById("hero-architecture-caption");
    const counter = document.getElementById("hero-architecture-counter");
    const link = document.getElementById("hero-architecture-link");
    const explore = document.getElementById("hero-architecture-explore");
    const progressRing = document.getElementById("hero-architecture-progress");

    if (!image || !projectName || !caption || !counter ||
        !link || !explore || !progressRing) {
        console.warn("Hero architecture: required elements are missing.");
        return;
    }

    const architectures = flagshipProjects.flatMap((project) =>
        Object.entries(project.disciplines ?? {}).flatMap(
            ([disciplineKey, discipline]) =>
                (discipline.architectureImages ?? []).map((architecture) => ({
                    project,
                    disciplineKey,
                    architecture,
                }))
        )
    );

    if (!architectures.length) {
        container.hidden = true;
        return;
    }

    let activeIndex = 0;
    let startTime = null;
    let elapsedBeforePause = 0;
    let animationFrame = null;
    let paused = false;

    const duration = 7000;
    const circumference = 113.1;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function resetProgress() {
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference;
    }

    function renderArchitecture(index) {
        const { project, architecture } = architectures[index];

        image.src = architecture.src;
        image.alt = architecture.alt || `${project.title} architecture`;

        projectName.textContent = project.title;
        caption.textContent = architecture.caption || "System architecture";

        counter.textContent =
            `${String(index + 1).padStart(2, "0")} / ` +
            `${String(architectures.length).padStart(2, "0")}`;

        link.href = "#project";
        explore.href = "#project";

        resetProgress();
    }

    function updateProgress(timestamp) {
        if (paused) return;

        if (startTime === null) {
            startTime = timestamp - elapsedBeforePause;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        progressRing.style.strokeDashoffset =
            circumference * (1 - progress);

        if (progress >= 1) {
            activeIndex = (activeIndex + 1) % architectures.length;

            renderArchitecture(activeIndex);

            elapsedBeforePause = 0;
            startTime = timestamp;
        }

        animationFrame = requestAnimationFrame(updateProgress);
    }

    function pauseProgress() {
        if (paused || animationFrame === null) return;

        paused = true;
        cancelAnimationFrame(animationFrame);

        if (startTime !== null) {
            elapsedBeforePause = performance.now() - startTime;
        }

        animationFrame = null;
    }

    function resumeProgress() {
        if (!paused) return;

        paused = false;
        animationFrame = requestAnimationFrame(updateProgress);
    }

    renderArchitecture(activeIndex);

    if (architectures.length > 1 && !prefersReducedMotion) {
        resetProgress();

        container.addEventListener("mouseenter", pauseProgress);
        container.addEventListener("mouseleave", resumeProgress);

        animationFrame = requestAnimationFrame(updateProgress);
    }
}
