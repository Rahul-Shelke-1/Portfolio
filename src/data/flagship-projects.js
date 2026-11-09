const openSourceRepo =
  "https://github.com/Rahul-404/open-source-data-platform";

const healthcareRepo =
  "https://github.com/Rahul-404/heart-stroke-prediction";

const plannedTrack = (label, summary) => ({
  label,
  status: "Planned",
  summary,
  bullets: [],
  technologies: [],
  architectureImages: [],
  repositoryUrl: null,
  docsUrl: null,
  demoUrl: null,
});

export const flagshipProjects = [
  {
    id: "open-source",
    title: "Open-Source Opportunity Intelligence",
    icon: "⌘",
    description:
      "Discover, analyze, and recommend high-value open-source contribution opportunities.",
    tags: ["Data Engineering", "Analytics", "ML / GenAI", "Deployment"],
    repositoryUrl: openSourceRepo,
    docsUrl: openSourceRepo,
    disciplines: {
      dataEngineering: {
        label: "Data Engineering",
        status: "In progress",
        summary:
          "Build a reliable, continuously refreshed data platform for collecting, validating, and organizing open-source repository and contribution data.",
        bullets: [
          "Collect repository and issue data from GitHub APIs",
          "Design incremental ingestion and refresh workflows",
          "Validate, deduplicate, and organize collected records",
          "Define storage and data-modeling strategies",
          "Plan scheduling, observability, and failure recovery",
        ],
        architectureImages: [
          {
            src: "/Portfolio/projects/open-source/data-engineering/system-architecture.png",
            alt: "Opportunity Intelligence Platform system architecture",
            caption: "End-to-end system architecture",
          },
          {
            src: "/Portfolio/projects/open-source/data-engineering/da.png",
            alt: "Data ingestion and processing architecture",
            caption: "Data ingestion and processing pipeline",
          },
        ],
        technologies: ["Python", "GitHub API", "SQL", "ETL"],
        repositoryUrl: openSourceRepo,
        docsUrl: openSourceRepo,
        demoUrl: openSourceRepo,
      },
      analytics: plannedTrack(
        "Analytics",
        "Analyze repository health, issue activity, and contribution opportunities."
      ),
      ml: plannedTrack(
        "ML / DL",
        "Evaluate ranking and recommendation approaches for contribution discovery."
      ),
      genai: plannedTrack(
        "GenAI / Agentic AI",
        "Explore issue understanding, repository context retrieval, and contribution assistance."
      ),
      deployment: plannedTrack(
        "Deployment",
        "Package and operate the platform with reproducible deployments and observability."
      ),
    },
  },
  {
    id: "healthcare",
    title: "Healthcare Risk Intelligence",
    icon: "♡",
    description:
      "A clinical risk stratification system for evaluating stroke risk and supporting resource prioritization.",
    tags: ["Data Engineering", "ML", "MLOps", "Deployment"],
    repositoryUrl: healthcareRepo,
    docsUrl: healthcareRepo,
    disciplines: {
      dataEngineering: {
        label: "Data Engineering",
        status: "Existing work",
        summary:
          "Prepare reproducible, validated datasets for clinical risk modeling.",
        bullets: [
          "Validate input schemas and data types",
          "Explore missingness and data quality",
          "Build reproducible preprocessing and feature workflows",
          "Document dataset assumptions and limitations",
        ],
        technologies: ["Python", "Pandas", "SQL"],
        repositoryUrl: healthcareRepo,
        docsUrl: healthcareRepo,
        demoUrl: healthcareRepo,
      },
      analytics: plannedTrack(
        "Analytics",
        "Explore risk distributions, class imbalance, and relevant evaluation metrics."
      ),
      ml: plannedTrack(
        "Machine Learning",
        "Evaluate risk prediction models, calibration, and classification errors."
      ),
      genai: plannedTrack(
        "GenAI / Agentic AI",
        "Investigate evidence-grounded explanations and safe clinical information retrieval."
      ),
      deployment: plannedTrack(
        "MLOps & Deployment",
        "Package inference, automate model delivery, and monitor service health."
      ),
    },
  },
];
