/**
 * Hero Architecture Preview
 *
 * Reuses architecture images from flagship project metadata.
 * Does not duplicate image paths or architecture data.
 */

export function initHeroArchitecture(flagshipProjects) {

    const container = document.getElementById("hero-architecture");

    if (!container || !Array.isArray(flagshipProjects)) {
        return;
    }

    const image = document.getElementById("hero-architecture-image");
    const projectName = document.getElementById(
        "hero-architecture-project"
    );
    const caption = document.getElementById(
        "hero-architecture-caption"
    );
    const counter = document.getElementById(
        "hero-architecture-counter"
    );
    const link = document.getElementById(
        "hero-architecture-link"
    );
    const explore = document.getElementById(
        "hero-architecture-explore"
    );

    // Collect only projects with actual architecture images.
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

    function renderArchitecture(index) {
        const item = architectures[index];
        const { project, architecture } = item;

        image.src = architecture.src;
        image.alt = architecture.alt || `${project.title} architecture`;

        projectName.textContent = project.title;
        caption.textContent = architecture.caption || "System architecture";

        counter.textContent =
            `${String(index + 1).padStart(2, "0")} / ` +
            `${String(architectures.length).padStart(2, "0")}`;

        // Update destination to the relevant project.
        // const projectId = project.id;

        // link.href = `#${projectId}`;
        // explore.href = `#${projectId}`;
        link.href = "#project";
        explore.href = "#project";
    }

    renderArchitecture(activeIndex);

    // Rotate only when multiple architectures are available.
    if (architectures.length > 1) {
        window.setInterval(() => {
            activeIndex = (activeIndex + 1) % architectures.length;

            renderArchitecture(activeIndex);
        }, 7000);
    }
}