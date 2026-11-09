console.log("MAIN.JS LOADED");

import './style.css'
import { projects } from './data/projects.js'
import { flagshipProjects } from './data/flagship-projects.js'
import { initHeroArchitecture } from "./components/architecture/architecture-preview.js";

// 1. ASSET STRINGS ENGINE VIA VITE COMPILER MACROS
import navbarHTML from './sections/navbar.html?raw'
import homeHTML from './sections/home.html?raw'
import aboutHTML from './sections/about.html?raw'
import contactHTML from './sections/contact.html?raw'

const disciplineOrder = [
  "dataEngineering",
  "analytics",
  "ml",
  "genai",
  "deployment",
];

const expandedFlagships = new Set();
const activeDisciplines = {};

const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

function safeExternalUrl(url) {
  if (typeof url !== "string") return null;

  try {
    const parsed = new URL(url, window.location.origin);

    if (!["https:", "http:"].includes(parsed.protocol)) {
      return null;
    }

    // Only allow relative URLs for same-origin resources.
    if (
      !url.startsWith("https://") &&
      !url.startsWith("http://") &&
      parsed.origin !== window.location.origin
    ) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function renderProjectLink(url, label, primary = false) {
  const safeUrl = safeExternalUrl(url);

  if (!safeUrl) return "";

  const external = /^https?:\/\//i.test(safeUrl);

  return `
    <a
      href="${escapeHTML(safeUrl)}"
      class="${primary ? "flagship-primary-link" : "flagship-secondary-link"}"
      ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}
    >
      ${escapeHTML(label)} <span aria-hidden="true">↗</span>
    </a>
  `;
}

function renderDisciplineContent(project, disciplineKey) {
  const discipline = project.disciplines[disciplineKey];

  if (!discipline) {
    return `<p class="text-slate-400">No details are available yet.</p>`;
  }

  const isPlanned = discipline.status === "Planned";

  const bullets = discipline.bullets?.length
    ? `
      <ul class="flagship-bullet-list">
        ${discipline.bullets.map((bullet) => `
          <li class="flex items-start gap-3">
            <span class="flagship-check" aria-hidden="true">✓</span>
            <span>${escapeHTML(bullet)}</span>
          </li>
        `).join("")}
      </ul>
    `
    : `
      <p class="text-sm text-slate-400">
        Detailed implementation information will be added when this track is developed.
      </p>
    `;

  const technologies = (discipline.technologies ?? []).map((technology) => `
    <span class="flagship-tech-tag">${escapeHTML(technology)}</span>
  `).join("");

  const links = [
    renderProjectLink(discipline.repositoryUrl, "View Repository", true),
    renderProjectLink(discipline.docsUrl, "Documentation"),
    renderProjectLink(discipline.demoUrl, "Live Demo"),
  ].filter(Boolean).join("");

  return `
      <div>
        <div class="flex flex-wrap items-center gap-3 mb-3">
          <h4 class="text-2xl font-bold text-white">
            ${escapeHTML(discipline.label)}
          </h4>
          <span class="flagship-status ${isPlanned ? "is-planned" : ""}">
            ${escapeHTML(discipline.status ?? "In progress")}
          </span>
        </div>

        <p class="text-slate-400 leading-relaxed mb-5">
          ${escapeHTML(discipline.summary ?? "")}
        </p>

        ${bullets}

        ${technologies ? `
          <div class="flex flex-wrap gap-2 mt-6">
            ${technologies}
          </div>
        ` : ""}

        ${links ? `
          <div class="flex flex-wrap gap-3 mt-7">
            ${links}
          </div>
        ` : ""}
      </div>
  `;
}

function renderArchitectureGallery(images, projectId, disciplineKey) {
  if (!Array.isArray(images) || images.length === 0) {
    return "";
  }

  const validImages = images.filter(
    (image) =>
      image &&
      typeof image.src === "string" &&
      image.src.trim() !== ""
  );

  if (validImages.length === 0) {
    return "";
  }

  const galleryId = `${projectId}-${disciplineKey}`;

  const imageMarkup = validImages.map((image, index) => `
    <div
      class="flagship-architecture-slide"
      data-gallery-slide="${index}"
      ${index === 0 ? "" : "hidden"}
    >
      <img
        src="${escapeHTML(image.src)}"
        alt="${escapeHTML(image.alt ?? "System architecture diagram")}"
        loading="lazy"
      />

      <p class="flagship-architecture-caption">
        ${escapeHTML(image.caption ?? "")}
      </p>
    </div>
  `).join("");

  const navigation = validImages.length > 1
    ? `
      <div class="flagship-gallery-controls">
        <button
          type="button"
          data-gallery-prev="${galleryId}"
          aria-label="Previous architecture image"
        >
          &#8592;
        </button>

        <span data-gallery-counter="${galleryId}">
          1 / ${validImages.length}
        </span>

        <button
          type="button"
          data-gallery-next="${galleryId}"
          aria-label="Next architecture image"
        >
          &#8594;
        </button>
      </div>
    `
    : "";

  return `
    <aside class="flagship-architecture">
      <h4 class="flagship-architecture-title">
        System Architecture
      </h4>

      <div
        class="flagship-architecture-gallery"
        data-architecture-gallery="${galleryId}"
        data-gallery-index="0"
      >
        ${imageMarkup}
      </div>

      ${navigation}
    </aside>
  `;
}

function renderFlagshipAccordion() {
  const container = document.getElementById(
    "flagship-projects-accordion"
  );

  if (!container) return;

  container.innerHTML = flagshipProjects.map((project) => {
    const expanded = expandedFlagships.has(project.id);

    const disciplineKeys = disciplineOrder.filter(
      (key) => project.disciplines[key]
    );

    const activeKey = project.disciplines[
      activeDisciplines[project.id]
    ]
      ? activeDisciplines[project.id]
      : disciplineKeys[0];

    activeDisciplines[project.id] = activeKey;

    const discipline = project.disciplines[activeKey];

    const tags = (project.tags ?? []).map((tag) => `
      <span class="flagship-chip">${escapeHTML(tag)}</span>
    `).join("");

    const tabs = disciplineKeys.map((key) => {
      const discipline = project.disciplines[key];
      const active = key === activeKey;

      return `
        <button
          type="button"
          id="tab-${escapeHTML(project.id)}-${escapeHTML(key)}"
          class="flagship-discipline-tab ${active ? "is-active" : ""}"
          data-discipline="${escapeHTML(key)}"
          role="tab"
          aria-selected="${active}"
          aria-controls="panel-${escapeHTML(project.id)}"
          tabindex="${active ? "0" : "-1"}"
        >
          ${escapeHTML(discipline.label)}
          ${discipline.status === "Planned"
            ? '<span class="flagship-tab-planned">Planned</span>'
            : ""}
        </button>
      `;
    }).join("");

    return `
      <article
        class="flagship-accordion-item ${expanded ? "is-expanded" : ""}"
        data-flagship-item="${escapeHTML(project.id)}"
      >
        <button
          type="button"
          class="flagship-accordion-trigger"
          data-accordion-toggle="${escapeHTML(project.id)}"
          aria-expanded="${expanded}"
          aria-controls="panel-${escapeHTML(project.id)}"
        >
          <span class="flagship-project-icon" aria-hidden="true">
            ${escapeHTML(project.icon)}
          </span>

          <span class="flagship-project-heading">
            <span class="flagship-project-title">
              ${escapeHTML(project.title)}
            </span>
            <span class="flagship-project-description">
              ${escapeHTML(project.description)}
            </span>
            <span class="flagship-project-tags">${tags}</span>
          </span>

          <span class="flagship-expand-icon" aria-hidden="true">
            ${expanded ? "⌄" : "›"}
          </span>
        </button>

        <div
          id="panel-${escapeHTML(project.id)}"
          class="flagship-accordion-panel"
          ${expanded ? "" : "hidden"}
        >
          <div
            class="flagship-discipline-tabs"
            role="tablist"
            aria-label="${escapeHTML(project.title)} disciplines"
          >
            ${tabs}
          </div>
          <div
            id="content-${escapeHTML(project.id)}"
            class="flagship-discipline-content"
            role="tabpanel"
            aria-labelledby="tab-${escapeHTML(project.id)}-${escapeHTML(activeKey)}"
            tabindex="0"
          >
            <div class="flagship-detail-layout">

              <div class="flagship-detail-main">
                ${renderDisciplineContent(project, activeKey)}

              </div>

              ${renderArchitectureGallery(
                discipline.architectureImages,
                project.id,
                activeKey
              )}

            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  console.log(flagshipProjects);
  document.querySelectorAll(
  "#flagship-projects-accordion .flagship-accordion-trigger"
  ).length;
  console.log("Flagship projects:", flagshipProjects);
  console.log("Rendered accordion HTML:", document.getElementById("flagship-projects-accordion")?.innerHTML);
}

function initFlagshipAccordion() {
  const container = document.getElementById(
    "flagship-projects-accordion"
  );

  if (!container || container.dataset.initialized === "true") return;

  container.dataset.initialized = "true";

  container.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-accordion-toggle]");

    if (toggle) {
      const projectId = toggle.dataset.accordionToggle;

      if (expandedFlagships.has(projectId)) {
        expandedFlagships.delete(projectId);
      } else {
        expandedFlagships.clear();
        expandedFlagships.add(projectId);
      }

      renderFlagshipAccordion();
      return;
    }

    const tab = event.target.closest("[data-discipline]");

    if (tab) {
      const item = tab.closest("[data-flagship-item]");
      if (!item) return;

      const projectId = item.dataset.flagshipItem;
      const disciplineKey = tab.dataset.discipline;

      activeDisciplines[projectId] = disciplineKey;

      const project = flagshipProjects.find(
        (entry) => entry.id === projectId
      );

      if (!project) return;

      const content = item.querySelector(
        ".flagship-discipline-content"
      );

      // Re-render the complete accordion panel for the selected discipline.
      renderFlagshipAccordion();

      // Restore focus to the newly selected tab.
      container
        .querySelector(
          `#${CSS.escape(tab.id)}`
        )
        ?.focus();

      item.querySelectorAll("[data-discipline]").forEach((button) => {
        const active = button.dataset.discipline === disciplineKey;

        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
    }
  });

  container.addEventListener("keydown", (event) => {
    const tab = event.target.closest("[data-discipline]");

    if (!tab) return;

    const tabList = tab.closest('[role="tablist"]');
    const tabs = [...tabList.querySelectorAll("[data-discipline]")];

    let index = tabs.indexOf(tab);

    if (event.key === "ArrowRight") {
      index = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      index = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      index = 0;
    } else if (event.key === "End") {
      index = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    const nextTab = tabs[index];
    const item = tab.closest("[data-flagship-item]");

    activeDisciplines[item.dataset.flagshipItem] =
      nextTab.dataset.discipline;

    renderFlagshipAccordion();

    container
      .querySelector(`#${CSS.escape(nextTab.id)}`)
      ?.focus();
  });

  // const container = document.getElementById(
  //   "flagship-projects-accordion"
  // );

  container?.addEventListener("click", (event) => {
    const nextButton = event.target.closest("[data-gallery-next]");
    const prevButton = event.target.closest("[data-gallery-prev]");

    if (!nextButton && !prevButton) return;

    event.stopPropagation();

    const galleryId = (
      nextButton ?? prevButton
    ).dataset.galleryNext ?? (
      nextButton ?? prevButton
    ).dataset.galleryPrev;

    const gallery = [...container.querySelectorAll(
      "[data-architecture-gallery]"
    )].find((element) =>
      element.dataset.architectureGallery === galleryId
    );

    if (!gallery) return;

    const slides = [
      ...gallery.querySelectorAll("[data-gallery-slide]")
    ];

    if (slides.length <= 1) return;

    let currentIndex = Number(gallery.dataset.galleryIndex) || 0;

    if (nextButton) {
      currentIndex = (currentIndex + 1) % slides.length;
    } else {
      currentIndex = (
        currentIndex - 1 + slides.length
      ) % slides.length;
    }

    gallery.dataset.galleryIndex = currentIndex;

    slides.forEach((slide, index) => {
      slide.hidden = index !== currentIndex;
    });

    const counter = [...container.querySelectorAll(
      "[data-gallery-counter]"
    )].find((element) =>
      element.dataset.galleryCounter === galleryId
    );

    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    }
  });

}

/**
 * Dynamically computes and updates the project counter badges based on projects.js
 */
function updateCategoryBadges() {

  const featuredCount =
    projects.filter(project => project.featured).length;

  const featuredBadge =
    document.querySelector('[data-count-badge="featured"]');

  if (featuredBadge) {
    featuredBadge.textContent = featuredCount;
  }

  const tabButtons =
    document.querySelectorAll('.tab-btn');

  tabButtons.forEach(button => {

    const category =
      button.getAttribute('data-filter');

    if (category === 'featured') return;

    const matchingCount =
      projects.filter(project =>
        project.categories?.includes(category)
      ).length;

    const badge =
      button.querySelector('[data-count-badge]');

    if (badge) {

      badge.textContent = matchingCount;

      if (matchingCount === 0) {
        badge.classList.replace(
          'text-slate-500',
          'text-slate-600/40'
        );
      } else {
        badge.classList.replace(
          'text-slate-600/40',
          'text-slate-500'
        );
      }
    }
  });
}

/**
 * Injects HTML components synchronously into layout hooks
 */
function loadLayoutArchitecture() {
  const blueprint = {
    '#navbar-container': navbarHTML,
    '#home-section': homeHTML,
    '#about-section': aboutHTML,
    '#contact-section': contactHTML
  };

  for (const [selector, rawHTML] of Object.entries(blueprint)) {
    const rootNode = document.querySelector(selector);
    if (rootNode) {
      rootNode.innerHTML = rawHTML;
    } else {
      console.warn(`Target interface mount hook matching '${selector}' absent from index DOM layout tree.`);
    }
  }
}

/**
 * Helper function to return correct action buttons based on configuration flags
 */
function getDemoButtonHTML(project) {
  const type = project.links.demoType;
  
  if (type === 'video') {
    return `
      <a href="${project.links.demoUrl}" target="_blank" class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 ${project.theme.primaryBtnClass} font-medium text-xs rounded-lg transition border cursor-pointer">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c0-.55.45-1 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
        <span>Video Demo</span>
      </a>
    `;
  }
  
  if (type === 'docs') {
    return `
      <a href="${project.links.demoUrl}" class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 ${project.theme.primaryBtnClass} font-medium text-xs rounded-lg transition border cursor-pointer">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <span>Live Demo</span>
      </a>
      <a href="${project.links.docsUrl}" class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium text-xs rounded-lg transition border border-blue-500/20 cursor-pointer">
        <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <span>API Docs</span>
      </a>
    `;
  }
  
  return `
    <a href="${project.links.demoUrl}" class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 ${project.theme.primaryBtnClass} font-medium text-xs rounded-lg transition border cursor-pointer">
      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      <span>Live Demo</span>
    </a>
  `;
}

/**
 * Dynamic Cards Generation Engine
 */
// onclick="document.getElementById('${project.links.archModalId}').showModal()" 
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) {
    console.error("Critical: '#projects-grid' element container target missing from HTML DOM layout.");
    return;
  }

  grid.innerHTML = projects.map(project => `
    <div class="project-card-wrapper h-full" data-categories="${project.categories.join(',')}" data-featured="${project.featured}">
      <div class="project-card relative p-[1px] rounded-2xl overflow-hidden bg-slate-950/95 border border-slate-800/80 transition-all duration-300 h-full flex flex-col">
          
        <div class="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 card-radial-glow"
             style="background: radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ${project.theme.glowBg}, transparent 80%);">
        </div>
        
        <div class="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 card-border-glow"
             style="background: radial-gradient(120px circle at var(--mouse-x) var(--mouse-y), ${project.theme.accentColor} 0%, transparent 100%);">
        </div>
        
        <div class="group relative p-6 rounded-[15px] bg-slate-950/95 backdrop-blur-sm h-full w-full flex flex-col justify-between flex-1">
          
          <div>
            <div class="flex flex-wrap gap-2 text-[11px] mt-1 mb-4 select-none">
              <span class="px-2.5 py-1 font-bold tracking-wide rounded-md uppercase backdrop-blur-md transition-all duration-300 ${project.theme.badgeClass}">
                ${project.badgeText}
              </span>
            </div>

            <h3 class="text-xl font-semibold text-white ${project.theme.textHoverClass} transition-colors duration-200">${project.title}</h3>
            <p class="text-sm text-slate-400 mt-2">${project.description}</p>

            <div class="flex flex-wrap gap-2 mt-4 text-xs">
              ${project.tags.map(t => `<span class="px-2 py-1 bg-slate-900 rounded text-slate-400 border border-slate-900">${t}</span>`).join('')}
            </div>
          </div>

          <div class="space-y-4 mt-6 pt-4 border-t border-slate-900">
            <div class="flex items-center gap-2">
              ${getDemoButtonHTML(project)}
              
              <a href="${project.links.sourceUrl}" class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-lg transition border border-slate-800 cursor-pointer">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.0.069-.608 0 1 .436 1.524 1.302 1.524.891 1.521 2.372 1.082 2.95.828.09-.647.35-1.082.636-1.331-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>
                <span>Source</span>
              </a>
            </div>

            <div class="flex items-center justify-between text-[11px] px-0.5">
              <button 
                onclick="openArchitecture('${project.id}')"
                class="flex items-center gap-1 text-slate-400 ${project.theme.iconHoverClass} transition cursor-pointer bg-transparent border-none p-0 focus:outline-none"
              >
                <svg class="w-3 h-3 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="4" rx="1" /><rect x="3" y="17" width="6" height="4" rx="1" /><rect x="15" y="17" width="6" height="4" rx="1" /><path d="M12 7v5M12 12H6v5M12 12h6v5" /></svg>
                <span>View Architecture</span>
              </button>
              <a href="${project.links.caseStudyUrl}" class="text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-0.5">
                <span>Read Case Study</span> <span class="text-xs">→</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  `).join('');

  initializeGlowEffects();
}

/**
 * Initializes Neon Tracer Glow Track Mouse Events
 */
function initializeGlowEffects() {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      const radialGlow = card.querySelector('.card-radial-glow');
      const borderGlow = card.querySelector('.card-border-glow');
      
      if (radialGlow) radialGlow.style.opacity = '1';
      if (borderGlow) borderGlow.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      const radialGlow = card.querySelector('.card-radial-glow');
      const borderGlow = card.querySelector('.card-border-glow');
      
      if (radialGlow) radialGlow.style.opacity = '0';
      if (borderGlow) borderGlow.style.opacity = '0';
    });
  });
}

/**
 * Hamburger Mobile Navigation Controller Logic
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const menuLinks = document.getElementById('menu-links');
  const menuIcon = document.getElementById('menu-icon');

  if (!menuBtn || !menuLinks || !menuIcon) return;

  menuBtn.addEventListener('click', () => {
    menuLinks.classList.toggle('hidden');
    menuLinks.classList.toggle('flex');

    if (menuLinks.classList.contains('hidden')) {
      menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    } else {
      menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    }
  });

  document.querySelectorAll('#menu-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (!menuLinks.classList.contains('hidden')) {
        menuLinks.classList.add('hidden');
        menuLinks.classList.remove('flex');
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      }
    });
  });
}

/**
 * Global Category Filtering Engine Configuration
 */
window.filterCategory = function (
  selectedButton,
  categoryKey
) {

  const allTabs =
    document.querySelectorAll('.tab-btn');

  allTabs.forEach(btn => {

    btn.classList.remove(
      'tab-active-gradient',
      'text-white'
    );

    btn.classList.add('text-slate-400');

    const badge =
      btn.querySelector('.font-mono');

    if (badge) {
      badge.classList.replace(
        'text-slate-400',
        'text-slate-500'
      );
    }
  });

  selectedButton.classList.add(
    'tab-active-gradient',
    'text-white'
  );

  selectedButton.classList.remove(
    'text-slate-400'
  );

  const activeBadge =
    selectedButton.querySelector('.font-mono');

  if (activeBadge) {
    activeBadge.classList.replace(
      'text-slate-500',
      'text-slate-400'
    );
  }

  const projectCards =
    document.querySelectorAll(
      '.project-card-wrapper'
    );

  projectCards.forEach(card => {

    const featured =
      card.getAttribute('data-featured') === 'true';

    const categories =
      card.getAttribute('data-categories')
          .split(',');

    let shouldShow = false;

    if (categoryKey === 'featured') {

      shouldShow = featured;

    } else {

      shouldShow =
        categories.includes(categoryKey);

    }

    if (shouldShow) {

      card.classList.remove('hidden');

    } else {

      card.classList.add('hidden');

    }

  });

}

let currentArchitectureImages = [];
let currentArchitectureIndex = 0;

window.openArchitecture = function(projectId) {

  const project = projects.find(p => p.id === projectId);

  if (!project) return;

  currentArchitectureImages = project.architecture.images;
  currentArchitectureIndex = 0;

  document.getElementById("architecture-title").textContent =
    project.title;

  renderArchitectureImage();

  document
    .getElementById("architecture-modal")
    .showModal();
  
  console.log(currentArchitectureImages[currentArchitectureIndex]);
};

window.closeArchitecture = function () {

  const modal =
    document.getElementById("architecture-modal");

  modal.close();

  document.body.classList.remove("overflow-hidden");

  document.getElementById("architecture-modal").close();

};

/* Render the current image */
function renderArchitectureImage() {
  const base = import.meta.env.BASE_URL;

  const imagePath =
    `${base}${currentArchitectureImages[currentArchitectureIndex]}`;

  console.log(imagePath);

  document.getElementById("architecture-viewer").innerHTML = `
    <img
      src="${imagePath}"
      class="max-w-full max-h-[70vh] object-contain rounded-xl"
      loading="lazy"
      onerror="console.error('Image failed:', this.src)"
    />
  `;
}

/* previous */
window.previousArchitecture = function() {

  currentArchitectureIndex =
    (
      currentArchitectureIndex - 1 +
      currentArchitectureImages.length
    ) % currentArchitectureImages.length;

  renderArchitectureImage();

};

/* next */
window.nextArchitecture = function() {

  currentArchitectureIndex =
    (currentArchitectureIndex + 1) %
    currentArchitectureImages.length;

  renderArchitectureImage();

};



const architectureModal =
  document.getElementById("architecture-modal");

architectureModal.addEventListener("click", e => {

  const rect =
    architectureModal.getBoundingClientRect();

  const inside =
    rect.top <= e.clientY &&
    e.clientY <= rect.bottom &&
    rect.left <= e.clientX &&
    e.clientX <= rect.right;

  if (!inside) {

    architectureModal.close();

  }

});

architectureModal.addEventListener("cancel", e => {

  e.preventDefault();

  architectureModal.close();

});

/**
 * Master Application Lifecycle Execution Pipeline
 * Runs instantly because ES Modules evaluate safely after DOM rendering.
 */

function initApplication() {

  console.log("[DEBUG] Before layout:", 
    document.getElementById("flagship-projects-accordion")
  );

  loadLayoutArchitecture();

  // 2. Initialize Hero architecture preview.
  initHeroArchitecture(flagshipProjects);

  console.log("[DEBUG] After layout:", 
    document.getElementById("flagship-projects-accordion")
  );

  console.log("[DEBUG] Project section:", 
    document.getElementById("project")
  );

  renderFlagshipAccordion();
  initFlagshipAccordion();
  initMobileMenu();
}

initApplication();