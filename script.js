(() => {
  const ageGate = document.getElementById('ageGate');
  const confirmAge = document.getElementById('confirmAge');
  const leaveSite = document.getElementById('leaveSite');
  const searchInput = document.getElementById('searchInput');
  const cards = [...document.querySelectorAll('.media-card')];
  const navItems = [...document.querySelectorAll('.nav-item')];
  const grid = document.getElementById('contentGrid');
  const emptyState = document.getElementById('emptyState');
  const resultCount = document.getElementById('resultCount');
  const menuToggle = document.getElementById('menuToggle');
  const navBar = document.getElementById('navBar');
  let currentFilter = 'all';

  // Age confirmation is stored only for this browser session.
  try {
    if (sessionStorage.getItem('adultConfirmed') === 'yes') ageGate.classList.add('hidden');
  } catch (_) {}

  confirmAge.addEventListener('click', () => {
    try { sessionStorage.setItem('adultConfirmed', 'yes'); } catch (_) {}
    ageGate.classList.add('hidden');
  });

  leaveSite.addEventListener('click', () => {
    document.body.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center;font-family:system-ui;color:#eee;background:#111114"><div><h1>تم إغلاق صفحة المحتوى</h1><p>يمكنك إغلاق علامة التبويب هذه.</p></div></main>';
  });

  function updateCards() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const type = card.dataset.type;
      const isNew = card.dataset.new === 'true';
      const searchText = (card.dataset.search + ' ' + card.innerText).toLocaleLowerCase();
      const matchesFilter = currentFilter === 'all' ||
        (currentFilter === 'new' && isNew) ||
        (currentFilter === 'video' && type === 'video') ||
        (currentFilter === 'photo' && type === 'photo');
      const matchesSearch = !query || searchText.includes(query);
      const show = matchesFilter && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    resultCount.textContent = `${visible} عناصر`;
    emptyState.hidden = visible > 0;
    grid.classList.toggle('is-empty', visible === 0);
  }

  navItems.forEach(button => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter;
      navItems.forEach(item => item.classList.toggle('active', item === button));
      const labels = {all:'المحتوى المميز', video:'الفيديوهات', photo:'الصور', new:'الأحدث'};
      document.getElementById('contentHeading').textContent = labels[currentFilter];
      updateCards();
      navBar.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
  searchInput.addEventListener('input', updateCards);
  menuToggle.addEventListener('click', () => {
    const open = navBar.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  updateCards();
})();
