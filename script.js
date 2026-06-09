function renderServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid || typeof SERVICES === 'undefined') return;

  // Render only the 3 main services on the homepage
  const homeServices = ['kleintransport', 'malerarbeiten', 'moebelmontage'];
  const servicesToRender = SERVICES.filter(s => homeServices.includes(s.slug));

  grid.innerHTML = servicesToRender.map((s) => `
    <a href="service.html?s=${s.slug}" class="service-card">
      <div class="service-card__icon">
        <svg viewBox="0 0 24 24">${icons[s.icon] || icons.box}</svg>
      </div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <span class="service-card__more">Mehr erfahren →</span>
    </a>
  `).join('');
}

function populateHomeContactSelect() {
  const select = document.getElementById('service');
  if (!select || typeof SERVICES === 'undefined') return;

  select.innerHTML = SERVICES.map((s) =>
    `<option value="${s.slug}">${s.title}</option>`
  ).join('');
}

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle?.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  nav?.classList.toggle('open');
});

nav?.querySelectorAll('.nav__link').forEach((link) => {
  link.addEventListener('click', (e) => {
    const parent = link.parentElement;
    const isMobile = window.innerWidth <= 768;

    if (isMobile && parent.classList.contains('has-dropdown')) {
      e.preventDefault();
      parent.classList.toggle('dropdown-open');
    } else {
      menuToggle?.classList.remove('active');
      nav?.classList.remove('open');
      // Ensure dropdowns are closed when a normal link is clicked
      nav?.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('dropdown-open'));
    }
  });
});

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header?.style.setProperty('box-shadow', '0 2px 20px rgba(15,23,42,0.08)');
  } else {
    header?.style.removeProperty('box-shadow');
  }
});

renderServices();
populateHomeContactSelect();
initContactForm('contactForm', 'service');

function initPriceCalculator() {
  const checkboxes = document.querySelectorAll('.price-calc-cb');
  const totalPriceEl = document.getElementById('total-price');
  if (!checkboxes.length || !totalPriceEl) return;

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      let total = 0;
      checkboxes.forEach(box => {
        if (box.checked) {
          total += parseInt(box.value, 10);
        }
      });
      totalPriceEl.textContent = total;
    });
  });
}

initPriceCalculator();
