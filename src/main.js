import './style.css'
import { projects } from './data/projects.js'

// 1. ASSET STRINGS ENGINE VIA VITE COMPILER MACROS
import navbarHTML from './sections/navbar.html?raw'
import homeHTML from './sections/home.html?raw'
import aboutHTML from './sections/about.html?raw'
import contactHTML from './sections/contact.html?raw'

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
                onclick="document.getElementById('${project.links.archModalId}').showModal()" 
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

/**
 * Master Application Lifecycle Execution Pipeline
 * Runs instantly because ES Modules evaluate safely after DOM rendering.
 */
function initApplication() {
  // 1. Build layout container structures
  loadLayoutArchitecture();
  
  // 2. Render layout content cards
  renderProjects();
  
  // 3. Compute dynamic metric tracking counter badges
  updateCategoryBadges();

  // 4. Bind interactive nav menus
  initMobileMenu();

  // 5. Initialize layout defaults
  const featuredButton =
  document.querySelector(
    '[data-filter="featured"]'
  );

  if (featuredButton) {
    filterCategory(
      featuredButton,
      'featured'
    );
  }
}

// Fire application instantly
initApplication();