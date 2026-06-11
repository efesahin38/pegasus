const FORM_EMAIL = 'info@pegasus-umzuege-entruempelungen.de';
const FORM_URL = `https://formsubmit.co/ajax/${FORM_EMAIL}`;
const SUCCESS_MSG =
  'Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.';

function getField(form, fieldName) {
  const el = form.querySelector(`[name="${fieldName}"]`);
  return (el?.value || '').trim();
}



function showFormToast(message, type = 'success') {
  const existing = document.getElementById('formToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'formToast';
  toast.className = `form-toast form-toast--${type}`;
  toast.innerHTML = `
    <span class="form-toast__text">${message}</span>
    <button type="button" class="form-toast__close" aria-label="Schließen">&times;</button>
  `;

  document.body.prepend(toast);
  toast.querySelector('.form-toast__close')?.addEventListener('click', () => toast.remove());
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (type === 'success') {
    setTimeout(() => toast.remove(), 10000);
  }
}

async function sendForm(form, serviceSelectId) {


  const btn = form.querySelector('#formSubmitBtn');
  const originalText = btn?.textContent;
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'WIRD GESENDET…';
  }

  const serviceSelect = document.getElementById(serviceSelectId);
  const serviceName =
    serviceSelect?.selectedOptions[0]?.textContent || 'Allgemeine Anfrage';

  const name = getField(form, 'name');
  const phone = getField(form, 'phone');
  const email = getField(form, 'email');
  const von = getField(form, 'from');
  const nach = getField(form, 'to');
  const nachricht = getField(form, 'message');

  const formData = new FormData();
  formData.append('Name', name || '—');
  formData.append('Telefon', phone || '—');
  formData.append('E-Mail', email || '—');
  formData.append('Von (PLZ / Ort)', von || '—');
  formData.append('Nach (PLZ / Ort)', nach || '—');
  formData.append('Gewünschter Service', serviceName);
  formData.append('Nachricht', nachricht || '—');
  formData.append(
    'Zusammenfassung',
    [
      `Name: ${name || '—'}`,
      `Telefon: ${phone || '—'}`,
      `E-Mail: ${email || '—'}`,
      `Von: ${von || '—'}`,
      `Nach: ${nach || '—'}`,
      `Service: ${serviceName}`,
      `Nachricht: ${nachricht || '—'}`,
    ].join('\n')
  );
  formData.append('_subject', `Neue Anfrage: ${name || 'Kunde'} — ${serviceName}`);
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');
  if (email) formData.append('_replyto', email);

  try {
    const res = await fetch(FORM_URL, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    const data = await res.json().catch(() => ({}));
    const ok = data.success === true || data.success === 'true';

    if (ok) {
      showFormToast(SUCCESS_MSG);
      form.reset();
      if (typeof populateServiceSelect === 'function' && serviceSelectId === 'service') {
        const slug = new URLSearchParams(window.location.search).get('s');
        populateServiceSelect(slug || '');
      } else if (typeof populateHomeContactSelect === 'function') {
        populateHomeContactSelect();
      }
    } else if (data.message && /activation/i.test(data.message)) {
      showFormToast(
        'Bitte info@pegasus-umzuege-entruempelungen.de prüfen (auch Spam) und „Activate Form" klicken.',
        'error'
      );
    } else {
      showFormToast(data.message || 'Senden fehlgeschlagen.', 'error');
    }
  } catch {
    showFormToast(
      'Senden fehlgeschlagen. Bitte erneut versuchen: +49 123 456 7890',
      'error'
    );
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}

function initContactForm(formId, serviceSelectId) {

  const form = document.getElementById(formId);
  if (!form) return;

  form.removeAttribute('action');
  form.setAttribute('method', 'post');
  form.setAttribute('novalidate', 'novalidate');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  const btn = form.querySelector('button[type="submit"]');
  if (btn) {
    btn.type = 'button';
    btn.id = 'formSubmitBtn';
    btn.addEventListener('click', () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      sendForm(form, serviceSelectId);
    });
  }
}
