// ==========================================
// 1. DAY/NIGHT TOGGLE (Adaptive UI)
// ==========================================

// Semak kalau pengguna pernah pilih mode malam sebelum ni
let isDarkMode = localStorage.getItem('theme') === 'dark';

if (isDarkMode) {
  document.body.classList.replace('theme-light', 'theme-dark');
  updateAdaptiveText('dark');
}

function toggleTheme() {
  const body = document.body;
  
  if (body.classList.contains('theme-light')) {
    body.classList.replace('theme-light', 'theme-dark');
    localStorage.setItem('theme', 'dark');
    updateAdaptiveText('dark');
  } else {
    body.classList.replace('theme-dark', 'theme-light');
    localStorage.setItem('theme', 'light');
    updateAdaptiveText('light');
  }
}

function updateAdaptiveText(mode) {
  const elements = document.querySelectorAll('.adaptive-text');
  
  elements.forEach(el => {
    const newText = mode === 'dark' ? el.getAttribute('data-dark') : el.getAttribute('data-light');
    
    if (newText) {
      el.style.transition = "opacity 0.3s ease";
      el.style.opacity = 0; // Hilangkan dulu teks lama
      
      setTimeout(() => {
        el.innerText = newText; // Tukar ke teks baru
        el.style.opacity = 1;   // Munculkan semula
      }, 300);
    }
  });
}

// ==========================================
// 2. TYPEWRITER EFFECT
// ==========================================

const phrases = [
  'Crafting Digital Ecology.', 
  'Computer Vision Specialist.', 
  'AR/VR Developer.', 
  'Bridging AI & Reality.'
];
let pi = 0, ci = 0, del = false;

function type() {
  const p = phrases[pi];
  const el = document.getElementById('typewriter');
  
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

// Tambah style kursor kelip-kelip untuk typewriter
const typeWriterElement = document.getElementById('typewriter');
typeWriterElement.style.cssText = 'font-family: "Lora", serif; font-size: clamp(1.2rem, 2.5vw, 1.5rem); color: var(--green); font-style: italic; min-height: 1.5em; display: block; margin-bottom: 1.5rem; border-right: 2px solid var(--green); padding-right: 5px; width: fit-content; margin-left: auto; margin-right: auto; animation: blink-caret .75s step-end infinite;';

const style = document.createElement('style');
style.innerHTML = `
  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: var(--green); }
  }
`;
document.head.appendChild(style);

setTimeout(type, 800);

// ==========================================
// 3. FADE-UP ANIMATION ON SCROLL
// ==========================================

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));