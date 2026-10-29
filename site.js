(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const KEY = 'afterglow_age_confirmed_v1';
  const age = $('#age-screen');
  if (age) {
    let accepted = false;
    try { accepted = sessionStorage.getItem(KEY) === 'yes'; } catch (_) {}
    if (!accepted) age.classList.add('show');
    $('#age-yes')?.addEventListener('click', () => {
      try { sessionStorage.setItem(KEY, 'yes'); } catch (_) {}
      age.classList.remove('show');
      document.body.classList.remove('age-locked');
    });
  }
  const toggle = $('#menu-toggle'), nav = $('#main-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const search = $('#article-search');
  if (search) {
    const cards = $$('.article-card[data-search]');
    const empty = $('#search-empty');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase(); let visible = 0;
      cards.forEach(card => {
        const match = card.dataset.search.toLowerCase().includes(q);
        card.classList.toggle('hidden', !match); if (match) visible++;
      });
      if (empty) empty.classList.toggle('hidden', visible !== 0);
    });
  }
 
 const form = $('#contact-form');

  if (form) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();

      const button = form.querySelector('[type="submit"]');
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = 'Sending...';

      let status = form.querySelector('#contact-status');

      if (!status) {
        status = document.createElement('p');
        status.id = 'contact-status';
        status.setAttribute('role', 'status');
        form.appendChild(status);
      }

      status.textContent = '';

      try {
        const fd = new FormData(form);

        const response = await fetch(
          'https://high.profikeuy.workers.dev',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: fd.get('name'),
              email: fd.get('email'),
              subject: fd.get('subject'),
              message: fd.get('message')
            })
          }
        );



        
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Sending failed');
        }

        status.textContent = 'Message sent successfully.';
        form.reset();
      } catch (error) {
        status.textContent =
          'Could not send the message. Please try again later.';
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  }
})();







    
    if (email.includes('REPLACE_')) { alert('Before using the form, update SITE_EMAIL in site.js with your real contact email.'); return; }
    const fd = new FormData(form);
    const subject = encodeURIComponent('[Afterglow website] ' + String(fd.get('subject') || 'Message'));
    const body = encodeURIComponent('Name: ' + fd.get('name') + '\nReply-to: ' + fd.get('email') + '\n\n' + fd.get('message'));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
})();
// IMPORTANT: Replace this with an inbox you control before publishing.
window.SITE_EMAIL = '          ';
