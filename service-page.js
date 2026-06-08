function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('s') || '';
}

function renderServicePage() {
  const slug = getSlug();
  const service = getServiceBySlug(slug);
  const main = document.getElementById('serviceMain');

  if (!service) {
    document.title = 'Service nicht gefunden — PEGASUS UMZUG';
    main.innerHTML = `
      <section class="service-detail service-detail--error">
        <div class="container">
          <p class="label">FEHLER</p>
          <h1 class="section-title">SERVICE NICHT GEFUNDEN</h1>
          <p class="section-desc">Der gewünschte Service existiert nicht.</p>
          <a href="index.html#services" class="btn btn--primary" style="margin-top:24px">ALLE LEISTUNGEN</a>
        </div>
      </section>`;
    populateServiceSelect();
    return;
  }

  document.title = `${service.title} — PEGASUS UMZUG`;

  const imagesHtml = service.images
    .map(
      (img) => `
      <figure class="service-gallery__item">
        <img src="${img.src}" alt="${img.alt}" loading="lazy" />
      </figure>`
    )
    .join('');

  const highlightsHtml = service.highlights
    .map((h) => `<li>${h}</li>`)
    .join('');

  main.innerHTML = `
    <section class="service-hero">
      <div class="container">
        <a href="index.html#services" class="service-back">← ALLE LEISTUNGEN</a>
        <p class="label">PEGASUS UMZUG & SERVICE</p>
        <h1 class="section-title">${service.title}</h1>
        <p class="service-hero__intro">${service.intro}</p>
      </div>
    </section>

    <section class="service-gallery">
      <div class="container service-gallery__grid${service.images.length === 1 ? ' service-gallery__grid--single' : ''}">
        ${imagesHtml}
      </div>
    </section>

    <section class="service-content">
      <div class="container service-content__inner">
        <div class="service-content__text">
          <h2>ÜBER UNSEREN SERVICE</h2>
          <p>${service.body}</p>
          <ul class="service-highlights">${highlightsHtml}</ul>
        </div>
      </div>
    </section>
  `;

  populateServiceSelect(slug);
}

function populateServiceSelect(selectedSlug) {
  const select = document.getElementById('service');
  if (!select) return;

  select.innerHTML = SERVICES.map((s) => {
    const selected = s.slug === selectedSlug ? ' selected' : '';
    return `<option value="${s.slug}"${selected}>${s.title}</option>`;
  }).join('');
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

renderServicePage();
initContactForm('contactForm', 'service');
