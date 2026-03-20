// ===== Configuration & State =====
const TOTAL_PAGES = 4;
let currentPage = 0;

// DOM Elements
const track = document.getElementById('pagesTrack');
const dotsContainer = document.getElementById('dotsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Default Configuration
const defaultConfig = {
  // Color Theme
  background_color: '#0f172a',
  surface_color: '#1e293b',
  text_color: '#f8fafc',
  primary_action: '#f59e42',
  secondary_action: '#64748b',
  // Typography
  font_family: 'Outfit',
  font_size: 16,
  // Content
  full_name: 'Alex Morgan',
  job_title: 'Senior Product Designer',
  profile_summary: 'Crafting intuitive digital experiences for 8+ years. Passionate about user-centered design, micro-interactions, and building products people love.',
  experience_title: 'Work Experience',
  education_title: 'Education',
  contact_title: 'Get In Touch',
  contact_email: 'alex.morgan@email.com',
  contact_phone: '+44 7700 900123',
  contact_location: 'London, United Kingdom'
};

// ===== Navigation Functions =====

// Initialize page dots
for (let i = 0; i < TOTAL_PAGES; i++) {
  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.setAttribute('aria-label', `Go to page ${i + 1}`);
  dot.addEventListener('click', () => goToPage(i));
  dotsContainer.appendChild(dot);
}

// Navigate to a specific page
function goToPage(index) {
  currentPage = Math.max(0, Math.min(TOTAL_PAGES - 1, index));
  track.style.transform = `translateX(-${currentPage * 100}%)`;
  updateNav();
}

// Update navigation buttons and dots
function updateNav() {
  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  const accent = cfg.primary_action || defaultConfig.primary_action;
  const muted = cfg.secondary_action || defaultConfig.secondary_action;

  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === TOTAL_PAGES - 1;

  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentPage);
    d.style.background = i === currentPage ? accent : muted + '55';
  });
}

// Button navigation
prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

// ===== Touch Swipe Support =====
let touchStartX = 0, touchDeltaX = 0, isSwiping = false;

track.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  isSwiping = true;
  track.classList.add('swiping');
}, { passive: true });

track.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;
  touchDeltaX = e.touches[0].clientX - touchStartX;
  const offset = -(currentPage * 100) + (touchDeltaX / track.offsetWidth) * 100;
  track.style.transform = `translateX(${offset}%)`;
}, { passive: true });

track.addEventListener('touchend', () => {
  track.classList.remove('swiping');
  if (Math.abs(touchDeltaX) > 50) {
    goToPage(currentPage + (touchDeltaX < 0 ? 1 : -1));
  } else {
    goToPage(currentPage);
  }
  touchDeltaX = 0;
  isSwiping = false;
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
  if (e.key === 'ArrowRight') goToPage(currentPage + 1);
});

// ===== UI Rendering Functions =====

// Apply configuration to all UI elements
function applyConfig(cfg) {
  const bg = cfg.background_color || defaultConfig.background_color;
  const surface = cfg.surface_color || defaultConfig.surface_color;
  const text = cfg.text_color || defaultConfig.text_color;
  const accent = cfg.primary_action || defaultConfig.primary_action;
  const muted = cfg.secondary_action || defaultConfig.secondary_action;
  const font = cfg.font_family || defaultConfig.font_family;
  const baseSize = cfg.font_size || defaultConfig.font_size;

  // Update page backgrounds
  for (let i = 0; i < TOTAL_PAGES; i++) {
    document.getElementById('page' + i).style.background = bg;
  }

  // Update navigation bar styling
  document.getElementById('navBar').style.background = `linear-gradient(to top, ${bg}f2, ${bg}b3)`;
  prevBtn.style.background = accent + '26';
  prevBtn.style.color = accent;
  nextBtn.style.background = accent + '26';
  nextBtn.style.color = accent;

  // Update avatar ring and icon colors
  document.getElementById('avatarRing').style.background = `linear-gradient(135deg, ${accent}, #ef4444)`;
  document.querySelector('.avatar-inner').style.background = surface;
  document.querySelectorAll('.avatar-inner svg circle, .avatar-inner svg ellipse').forEach(el => {
    el.setAttribute('fill', accent);
  });

  // ===== PAGE 1: Profile =====
  const nameEl = document.getElementById('nameEl');
  nameEl.textContent = cfg.full_name || defaultConfig.full_name;
  nameEl.style.color = text;
  nameEl.style.fontFamily = `'Playfair Display', serif`;
  nameEl.style.fontSize = `${baseSize * 2}px`;

  const titleEl = document.getElementById('titleEl');
  titleEl.textContent = cfg.job_title || defaultConfig.job_title;
  titleEl.style.color = accent;
  titleEl.style.fontFamily = `${font}, sans-serif`;
  titleEl.style.fontSize = `${baseSize}px`;

  const summaryEl = document.getElementById('summaryEl');
  summaryEl.textContent = cfg.profile_summary || defaultConfig.profile_summary;
  summaryEl.style.color = muted;
  summaryEl.style.fontFamily = `${font}, sans-serif`;
  summaryEl.style.fontSize = `${baseSize * 0.92}px`;

  // Update skill pills
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.style.background = accent + '26';
    pill.style.color = accent;
    pill.style.fontFamily = `${font}, sans-serif`;
    pill.style.fontSize = `${baseSize * 0.78}px`;
  });

  // ===== PAGE 2: Experience =====
  const expHeading = document.getElementById('expHeading');
  expHeading.textContent = cfg.experience_title || defaultConfig.experience_title;
  expHeading.style.color = text;
  expHeading.style.fontSize = `${baseSize * 1.6}px`;

  // Update section dividers
  document.querySelectorAll('.section-divider').forEach(d => d.style.background = accent);

  // Update timeline styling with dynamic colors
  const tl = document.querySelector('.timeline');
  if (tl) {
    const beforeStyle = document.getElementById('dynamicTimelineStyle') || document.createElement('style');
    beforeStyle.id = 'dynamicTimelineStyle';
    beforeStyle.textContent = `
      .timeline::before { background: ${accent}33; }
      .timeline-item::before { border-color: ${accent}; background: ${bg}; }
    `;
    if (!beforeStyle.parentNode) document.head.appendChild(beforeStyle);
  }

  // Update timeline items
  document.querySelectorAll('.timeline-item').forEach(item => {
    const dateEl = item.querySelector('p:first-child');
    const titleItemEl = item.querySelector('h3');
    const companyEl = item.querySelectorAll('p')[1];
    const descEl = item.querySelectorAll('p')[2];
    if (dateEl) { dateEl.style.color = accent; dateEl.style.fontFamily = `${font}, sans-serif`; dateEl.style.fontSize = `${baseSize * 0.75}px`; }
    if (titleItemEl) { titleItemEl.style.color = text; titleItemEl.style.fontFamily = `${font}, sans-serif`; titleItemEl.style.fontSize = `${baseSize * 1.05}px`; }
    if (companyEl) { companyEl.style.color = muted; companyEl.style.fontFamily = `${font}, sans-serif`; companyEl.style.fontSize = `${baseSize * 0.88}px`; }
    if (descEl) { descEl.style.color = muted + 'cc'; descEl.style.fontFamily = `${font}, sans-serif`; descEl.style.fontSize = `${baseSize * 0.82}px`; }
  });

  // ===== PAGE 3: Education =====
  const eduHeading = document.getElementById('eduHeading');
  eduHeading.textContent = cfg.education_title || defaultConfig.education_title;
  eduHeading.style.color = text;
  eduHeading.style.fontSize = `${baseSize * 1.6}px`;

  // Update education cards
  document.querySelectorAll('.edu-card').forEach(card => {
    card.style.background = accent + '12';
    card.style.borderColor = accent + '26';
    const iconBox = card.querySelector('div > div:first-child');
    if (iconBox) iconBox.style.background = accent + '26';
    card.querySelectorAll('i').forEach(ic => ic.style.color = accent);
    const h3 = card.querySelector('h3');
    if (h3) { h3.style.color = text; h3.style.fontFamily = `${font}, sans-serif`; h3.style.fontSize = `${baseSize}px`; }
    card.querySelectorAll('p').forEach(p => {
      p.style.fontFamily = `${font}, sans-serif`;
      if (p.style.color === 'rgb(100, 116, 139)' || !p.style.color) p.style.color = muted;
      if (p.textContent.match(/^\d{4}/)) p.style.color = accent;
    });
  });

  // ===== PAGE 4: Contact =====
  const contactHeading = document.getElementById('contactHeading');
  contactHeading.textContent = cfg.contact_title || defaultConfig.contact_title;
  contactHeading.style.color = text;
  contactHeading.style.fontSize = `${baseSize * 1.6}px`;

  // Update contact information
  document.getElementById('contactEmailEl').textContent = cfg.contact_email || defaultConfig.contact_email;
  document.getElementById('contactPhoneEl').textContent = cfg.contact_phone || defaultConfig.contact_phone;
  document.getElementById('contactLocationEl').textContent = cfg.contact_location || defaultConfig.contact_location;

  // Update contact cards
  document.querySelectorAll('.contact-item').forEach(item => {
    item.style.background = accent + '12';
    item.style.borderColor = accent + '1f';
    const iconBox = item.querySelector('.contact-icon-box');
    if (iconBox) iconBox.style.background = accent + '26';
    item.querySelectorAll('i').forEach(ic => ic.style.color = accent);
    const label = item.querySelector('p:first-child');
    const value = item.querySelectorAll('p')[1];
    if (label) { label.style.color = muted; label.style.fontFamily = `${font}, sans-serif`; label.style.fontSize = `${baseSize * 0.75}px`; }
    if (value) { value.style.color = text; value.style.fontFamily = `${font}, sans-serif`; value.style.fontSize = `${baseSize * 0.92}px`; }
  });

  // Update all section headings font
  document.querySelectorAll('.section-heading').forEach(h => {
    h.style.fontFamily = `'Playfair Display', serif`;
  });

  updateNav();
  lucide.createIcons();
}

// Initial render with default configuration
applyConfig(defaultConfig);