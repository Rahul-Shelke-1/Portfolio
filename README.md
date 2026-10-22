# Portfolio Website

My personal engineering portfolio website, showcasing my projects, technical skills, certifications, and work across machine learning, data engineering, MLOps, and AI.

The website is designed to present technical work through organized project categories, supporting assets, and reusable UI components.

## Tech Stack

- **HTML** — Website structure
- **CSS** — Styling and layout
- **JavaScript** — Interactive functionality
- **Tailwind CSS** — Utility-first styling and responsive design
- **Node.js** — JavaScript runtime and development tooling
- **npm** — Package and dependency management
- **Docker** — Containerized deployment
- **GitHub Pages** — Website hosting

## Project Structure

```text
.
├── public/
│   └── assets/
│       ├── About/
│       ├── Certificates/
│       ├── Contact/
│       └── Project/
│           ├── computer_vision/
│           │   ├── project-1/
│           │   ├── project-2/
│           │   └── project-3/
│           ├── data_analytics/
│           ├── data_engineering/
│           │   ├── 1-news-etl-pipeline/
│           │   ├── 2-weather-data-pipeline/
│           │   ├── 3-financial-data-pipeline/
│           │   ├── 4-local-train-data-pipeline/
│           │   ├── 5-e-commerce-data-pipeline/
│           │   ├── 6-yt-data-pipeline/
│           │   ├── 7-social-media-data-pipeline/
│           │   └── 8-phantom-data-etl/
│           ├── deep_learning/
│           │   └── assets/
│           ├── dsa_and_ml_algorithms/
│           ├── gen_ai/
│           ├── machine_learning/
│           │   ├── 1-heart-stroke-prediction/
│           │   ├── 2-sensor-fault-prediction/
│           │   ├── 3-shipment-price-prediction/
│           │   ├── 4-customer-segmentation/
│           │   ├── 5-taxi-fare-prediction/
│           │   ├── 6-churn-prediction/
│           │   └── recommendation-engine/
│           ├── mlops/
│           ├── natural_language_processing/
│           └── time_series/
└── src/
    ├── components/
    │   ├── about/
    │   ├── blog/
    │   ├── certifications/
    │   ├── contact/
    │   ├── footer/
    │   ├── ham-navbar/
    │   ├── home/
    │   ├── navbar/
    │   └── project/
    │       └── data/
    ├── styles/
    └── utils/
```

### Directory Overview

- **`public/assets/`** — Static assets for the website, including images and project resources.
- **`public/assets/Project/`** — Assets organized by technical domain and individual project.
- **`src/components/`** — UI components organized by website section and functionality.
- **`src/styles/`** — Stylesheets and styling-related files.
- **`src/utils/`** — Shared utilities and helper functions.

## Prerequisites

Install the following tools before running the project:

- [Node.js and npm](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) — Required for containerized execution.

Verify the installations:

```bash
node --version
npm --version
git --version
docker --version
```

## Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd Portfolio
```

Replace `YOUR_REPOSITORY_URL` with the repository's Git URL.

### 2. Install Dependencies

```bash
npm install
```

This installs the dependencies defined in `package.json`.

### 3. Run the Website Locally

Run the development command configured in `package.json`. For example, if the project uses Vite:

```bash
npm run dev
```

Open the local URL displayed in the terminal to view the website.

### 4. Build for Production

If a production build script is configured:

```bash
npm run build
```

The generated static files will be placed in the directory specified by the build tool, commonly `dist/`.

## 🚀 How to Build and Run with Docker

### 1. Build the Docker Image

From the project root directory, run:

```bash
docker build -t my-portfolio .
```

This builds a Docker image named `my-portfolio` using the project's `Dockerfile`.

### 2. Run the Container

```bash
docker run -d -p 8080:80 --name my-portfolio my-portfolio
```

This runs the container in detached mode and maps port `8080` on your machine to port `80` inside the container.

Open your browser and navigate to:

**http://localhost:8080**

### 3. Check the Running Container

Find the container ID, name, and status:

```bash
docker ps
```

### 4. Stop the Container

Stop the container by name:

```bash
docker stop my-portfolio
```

Alternatively, use the container ID returned by `docker ps`:

```bash
docker stop CONTAINER_ID
```

### 5. Restart the Container

If the container still exists, restart it with:

```bash
docker start my-portfolio
```

### 6. Remove the Container

After stopping it, remove the container if you no longer need it:

```bash
docker rm my-portfolio
```

To rebuild and run an updated version of the website, rebuild the image and recreate the container:

```bash
docker build -t my-portfolio .
docker rm -f my-portfolio
docker run -d -p 8080:80 --name my-portfolio my-portfolio
```

## Deployment

The portfolio website is hosted on GitHub Pages. The deployment workflow depends on the repository's hosting and build configuration.

Docker provides an additional way to package and run the website in a containerized environment, provided the included `Dockerfile` is configured for the project's build and serving process.

## License

This project is licensed under the [MIT License](LICENSE).