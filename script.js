// ==========================================
// 0. TOAST HELPER
// ==========================================
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ==========================================
// 1. DAY/NIGHT TOGGLE (Adaptive UI)
// ==========================================
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
let isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;

function applyTheme(dark, animateText = true) {
  isDarkMode = dark;
  document.body.classList.toggle('theme-dark', dark);
  document.body.classList.toggle('theme-light', !dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  updateAdaptiveText(dark ? 'dark' : 'light', animateText);
}

function toggleTheme() {
  applyTheme(!isDarkMode, true);
  showToast(isDarkMode ? '✨ Switched to Mystical Night Mode' : '🍃 Switched to Sunny Forest Mode');
}

function updateAdaptiveText(mode, animate = true) {
  const elements = document.querySelectorAll('.adaptive-text');
  elements.forEach(el => {
    const newText = mode === 'dark' ? el.getAttribute('data-dark') : el.getAttribute('data-light');
    if (!newText) return;
    if (!animate) {
      el.textContent = newText;
      return;
    }
    el.style.transition = 'opacity 0.25s ease';
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = newText;
      el.style.opacity = '1';
    }, 220);
  });
}

applyTheme(isDarkMode, false);

// ==========================================
// 2. LIVING GHIBLI ATMOSPHERE CANVAS
// ==========================================
(function initAtmosphere() {
  const canvas = document.getElementById('atmosphereCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  let width = 0;
  let height = 0;
  const mouse = { x: -999, y: -999 };
  const PARTICLE_COUNT = 34;
  const particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle(randomY = true) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      vx: (Math.random() - 0.35) * 0.45,
      vy: 0.18 + Math.random() * 0.35,
      size: 2.2 + Math.random() * 4.2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.018,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.015 + Math.random() * 0.025,
      isGold: Math.random() > 0.55
    };
  }

  resize();
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle(true));

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.phase += p.phaseSpeed;
      p.angle += p.spin;

      // Gentle cursor breeze
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120 && dist > 1) {
        const force = (120 - dist) / 120;
        p.x += (dx / dist) * force * 0.85;
        p.y += (dy / dist) * force * 0.85;
      }

      if (isDarkMode) {
        // Mystical Forest: gently floating fireflies
        p.x += Math.sin(p.phase) * 0.35 + p.vx * 0.4;
        p.y -= p.vy * 0.55;
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const pulse = 0.35 + 0.65 * ((Math.sin(p.phase * 1.6) + 1) / 2);
        const radius = p.size * 2.6;
        const grad = ctx.createRadialGradient(p.x, p.y, 0.5, p.x, p.y, radius);
        if (p.isGold) {
          grad.addColorStop(0, `rgba(232, 194, 143, ${0.75 * pulse})`);
          grad.addColorStop(1, 'rgba(232, 194, 143, 0)');
        } else {
          grad.addColorStop(0, `rgba(163, 194, 166, ${0.7 * pulse})`);
          grad.addColorStop(1, 'rgba(163, 194, 166, 0)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sunny Forest: sunlit pollen & gentle drifting leaf petals
        p.x += p.vx + Math.sin(p.phase) * 0.35;
        p.y += p.vy;
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.isGold
          ? 'rgba(214, 138, 62, 0.24)'
          : 'rgba(74, 107, 76, 0.22)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.35, p.size * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();

// ==========================================
// 3. TYPEWRITER EFFECT
// ==========================================
const phrases = [
  'Crafting Digital Ecology.',
  'Computer Vision Specialist.',
  'AR/VR Developer.',
  'Bridging AI & Reality.'
];
let pi = 0;
let ci = 0;
let del = false;

function type() {
  const p = phrases[pi];
  const el = document.getElementById('typewriter');
  if (!el) return;

  if (!del) {
    el.textContent = p.slice(0, ++ci);
    if (ci === p.length) {
      del = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    el.textContent = p.slice(0, --ci);
    if (ci === 0) {
      del = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(type, del ? 30 : 60);
}
setTimeout(type, 700);

// ==========================================
// 4. NAV, SCROLL PROGRESS, ACTIVE SPY & MOBILE DRAWER
// ==========================================
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const menuToggle = document.getElementById('menuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

function closeMobileDrawer() {
  if (!mobileDrawer || !menuToggle) return;
  if (mobileDrawer.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  mobileDrawer.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileDrawer.setAttribute('aria-hidden', 'true');
}

if (menuToggle && mobileDrawer) {
  menuToggle.addEventListener('click', () => {
    const opening = !mobileDrawer.classList.contains('open');
    mobileDrawer.classList.toggle('open', opening);
    menuToggle.classList.toggle('open', opening);
    menuToggle.setAttribute('aria-expanded', String(opening));
    mobileDrawer.setAttribute('aria-hidden', String(!opening));
  });

  mobileDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

  if (scrollProgress) scrollProgress.style.width = `${pct}%`;
  if (navbar) navbar.classList.toggle('scrolled', scrollTop > 20);
  if (backToTop) backToTop.classList.toggle('visible', scrollTop > 420);
}, { passive: true });

// Active Section Spy
const sections = document.querySelectorAll('section[id]');
const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => a.classList.toggle('active', a.dataset.section === id));
    }
  });
}, { rootMargin: '-38% 0px -52% 0px' });

sections.forEach(sec => spyObserver.observe(sec));

// ==========================================
// 5. FADE-UP & STAT COUNTER ANIMATION
// ==========================================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // Animate stat numbers once
    entry.target.querySelectorAll('[data-count]').forEach(counter => {
      if (counter.dataset.counted) return;
      counter.dataset.counted = 'true';
      const target = parseInt(counter.dataset.count, 10);
      let current = 0;
      const stepTime = Math.max(35, Math.floor(700 / target));
      const timer = setInterval(() => {
        current += 1;
        counter.textContent = String(current);
        if (current >= target) clearInterval(timer);
      }, stepTime);
    });
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// ==========================================
// 6. PROJECT FILTERING & SPOTLIGHT
// ==========================================
const projectCards = Array.from(document.querySelectorAll('.project-card'));
const filterBtns = document.querySelectorAll('.filter-btn');
const projectsEmpty = document.getElementById('projectsEmpty');
const resetProjectFilters = document.getElementById('resetProjectFilters');

let activeFilter = 'all';

function filterProjects() {
  let visibleCount = 0;

  projectCards.forEach(card => {
    const cat = card.dataset.category || '';
    const show = activeFilter === 'all' || cat === activeFilter;

    card.classList.toggle('hidden-card', !show);
    if (show) visibleCount++;
  });

  if (projectsEmpty) projectsEmpty.hidden = visibleCount > 0;
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    filterBtns.forEach(b => {
      const isActive = b === btn;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', String(isActive));
    });
    filterProjects();
  });
});

if (resetProjectFilters) {
  resetProjectFilters.addEventListener('click', () => {
    activeFilter = 'all';
    filterBtns.forEach(b => {
      const isAll = b.dataset.filter === 'all';
      b.classList.toggle('active', isAll);
      b.setAttribute('aria-selected', String(isAll));
    });
    filterProjects();
  });
}

// Cursor spotlight on project cards
projectCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// ==========================================
// 7. MODAL HELPERS & PROJECT PREVIEW MODAL
// ==========================================
const projectModal = document.getElementById('projectModal');
const modalBanner = document.getElementById('modalBanner');
const modalIcon = document.getElementById('modalIcon');
const modalBadge = document.getElementById('modalBadge');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');
const modalLiveBtn = document.getElementById('modalLiveBtn');
const modalLoadPreviewBtn = document.getElementById('modalLoadPreviewBtn');
const modalEmbedArea = document.getElementById('modalEmbedArea');
const modalIframe = document.getElementById('modalIframe');
const closeEmbedBtn = document.getElementById('closeEmbedBtn');

let currentPreviewUrl = '';
let lastFocusedElement = null;

function isGitHubUrl(url) {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === 'github.io' || host.endsWith('.github.io') || host === 'github.com' || host.endsWith('.github.com');
  } catch {
    return false;
  }
}

function openModal(backdrop) {
  if (!backdrop) return;
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop.open').forEach(m => {
    if (m.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  });
  document.body.classList.remove('modal-open');
  // Unload iframe to free memory/audio
  if (modalIframe) modalIframe.src = 'about:blank';
  if (modalEmbedArea) modalEmbedArea.hidden = true;
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function' && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function openProjectModal(card) {
  const bgEl = card.querySelector('.project-img-bg');
  const bgClass = Array.from(bgEl.classList).find(c => c.startsWith('img-bg-')) || 'img-bg-1';
  const icon = card.querySelector('.proj-icon')?.textContent || '✨';
  const badge = card.querySelector('.proj-badge')?.textContent || 'Project';
  const title = card.querySelector('.project-title')?.textContent || '';
  const desc = card.querySelector('.project-desc')?.textContent || '';
  const tags = Array.from(card.querySelectorAll('.ptag')).map(t => t.textContent);
  const previewUrl = card.dataset.preview || '';
  const embeddable = card.dataset.embeddable === 'true';

  modalBanner.className = `modal-banner ${bgClass}`;
  modalIcon.textContent = icon;
  modalBadge.textContent = badge;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalTags.innerHTML = tags.map(t => `<span class="ptag">${t}</span>`).join('');

  currentPreviewUrl = previewUrl;
  if (previewUrl) {
    modalLiveBtn.href = previewUrl;
    modalLiveBtn.hidden = false;
  } else {
    modalLiveBtn.hidden = true;
  }

  const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches;
  const canPreview = embeddable && isGitHubUrl(previewUrl);
  modalEmbedArea.hidden = true;
  modalIframe.src = 'about:blank';
  modalLoadPreviewBtn.hidden = isMobileOrTablet || !canPreview;

  openModal(projectModal);
}

projectCards.forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return; // Let direct Live Demo link open normally
    openProjectModal(card);
  });
});

if (modalLoadPreviewBtn) {
  modalLoadPreviewBtn.addEventListener('click', () => {
    if (!isGitHubUrl(currentPreviewUrl)) return;
    modalIframe.src = currentPreviewUrl;
    modalEmbedArea.hidden = false;
    modalLoadPreviewBtn.hidden = true;
  });
}

if (closeEmbedBtn) {
  closeEmbedBtn.addEventListener('click', () => {
    modalIframe.src = 'about:blank';
    modalEmbedArea.hidden = true;
    modalLoadPreviewBtn.hidden = false;
  });
}

// ==========================================
// 8. COMMAND PALETTE (Ctrl+K)
// ==========================================
const cmdModal = document.getElementById('cmdModal');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');

function buildCmdItems() {
  const items = [
    { group: 'Quick Actions', title: 'Toggle Day / Night Theme', sub: isDarkMode ? 'Switch to Sunny Forest' : 'Switch to Mystical Night', action: () => { toggleTheme(); closeAllModals(); } },
    { group: 'Quick Actions', title: 'Download CV (PDF)', sub: 'Rafiq Azizi Resume.pdf', action: () => { window.open('Rafiq Azizi Resume.pdf', '_blank', 'noopener,noreferrer'); closeAllModals(); } },
    { group: 'Quick Actions', title: 'Draft a Message', sub: 'Open Contact Modal', action: () => { closeAllModals(); openModal(document.getElementById('messageModal')); } },
    { group: 'Sections', title: 'Chapter 01 — About Me', sub: '#about', action: () => jumpTo('#about') },
    { group: 'Sections', title: 'Chapter 02 — Tech Stack', sub: '#skills', action: () => jumpTo('#skills') },
    { group: 'Sections', title: 'Chapter 03 — Projects', sub: '#projects', action: () => jumpTo('#projects') },
    { group: 'Sections', title: 'Chapter 04 — Experience', sub: '#experience', action: () => jumpTo('#experience') },
    { group: 'Sections', title: 'Chapter 05 — Education', sub: '#education', action: () => jumpTo('#education') },
    { group: 'Sections', title: 'Chapter 06 — Contact', sub: '#contact', action: () => jumpTo('#contact') }
  ];

  projectCards.forEach(card => {
    const title = card.querySelector('.project-title')?.textContent || '';
    const badge = card.querySelector('.proj-badge')?.textContent || '';
    const tags = Array.from(card.querySelectorAll('.ptag')).map(t => t.textContent).join(', ');
    items.push({
      group: 'Projects',
      title,
      sub: `${badge} · ${tags}`,
      action: () => {
        closeAllModals();
        openProjectModal(card);
      }
    });
  });

  return items;
}

function jumpTo(selector) {
  closeAllModals();
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

function renderCmdResults(query = '') {
  if (!cmdResults) return;
  const q = query.trim().toLowerCase();
  const items = buildCmdItems().filter(item =>
    !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
  );

  if (items.length === 0) {
    cmdResults.innerHTML = `<div class="cmd-group-label">No matches found for "${query}".</div>`;
    return;
  }

  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.group]) grouped[item.group] = [];
    grouped[item.group].push(item);
  });

  cmdResults.innerHTML = '';
  Object.entries(grouped).forEach(([groupName, groupItems]) => {
    const label = document.createElement('div');
    label.className = 'cmd-group-label';
    label.textContent = groupName;
    cmdResults.appendChild(label);

    groupItems.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cmd-item';
      btn.innerHTML = `<span>${item.title}</span><span class="cmd-item-sub">${item.sub}</span>`;
      btn.addEventListener('click', item.action);
      cmdResults.appendChild(btn);
    });
  });
}

function openCmdPalette() {
  closeMobileDrawer();
  openModal(cmdModal);
  if (cmdInput) {
    cmdInput.value = '';
    renderCmdResults('');
    setTimeout(() => cmdInput.focus(), 50);
  }
}

if (cmdInput) {
  cmdInput.addEventListener('input', e => {
    renderCmdResults(e.target.value);
  });
}

document.getElementById('cmdTrigger')?.addEventListener('click', openCmdPalette);
document.getElementById('mobileCmdBtn')?.addEventListener('click', openCmdPalette);

// Keyboard shortcuts (Ctrl+K / Cmd+K & Escape)
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (cmdModal.classList.contains('open')) {
      closeAllModals();
    } else {
      openCmdPalette();
    }
  } else if (e.key === 'Escape') {
    closeAllModals();
    closeMobileDrawer();
  }
});

// Close modals on backdrop click or close button
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop || e.target.closest('[data-close-modal]')) {
      closeAllModals();
    }
  });
});

// ==========================================
// 9. CONTACT ACTIONS & QUICK MESSAGE MODAL
// ==========================================
const copyPortfolioBtn = document.getElementById('copyPortfolioBtn');
if (copyPortfolioBtn) {
  copyPortfolioBtn.addEventListener('click', async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast('🔗 Portfolio link copied to clipboard!');
    } catch {
      showToast('Link ready: ' + url);
    }
  });
}

const messageModal = document.getElementById('messageModal');
document.getElementById('openMessageModal')?.addEventListener('click', () => openModal(messageModal));

function buildFormattedMessage() {
  const name = document.getElementById('msgName')?.value.trim() || '';
  const topic = document.getElementById('msgTopic')?.value.trim() || '';
  const body = document.getElementById('msgBody')?.value.trim() || '';
  return `Hi Rafiq,\n\nMy name is ${name} (${topic}).\n\n${body}`;
}

const quickMsgForm = document.getElementById('quickMsgForm');
if (quickMsgForm) {
  quickMsgForm.addEventListener('submit', async e => {
    e.preventDefault();
    const text = buildFormattedMessage();
    try {
      await navigator.clipboard.writeText(text);
    } catch { /* ignore clipboard block */ }
    showToast('📋 Message copied! Opening LinkedIn...');
    window.open('https://www.linkedin.com/in/rafiq-azizi-roslan-04abb8274', '_blank', 'noopener,noreferrer');
    closeAllModals();
    quickMsgForm.reset();
  });
}

document.getElementById('copyOnlyMsgBtn')?.addEventListener('click', async () => {
  if (!quickMsgForm.reportValidity()) return;
  const text = buildFormattedMessage();
  try {
    await navigator.clipboard.writeText(text);
    showToast('📋 Draft message copied to clipboard!');
    closeAllModals();
  } catch {
    showToast('Could not access clipboard automatically.');
  }
});
