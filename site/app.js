// Pathfolio Marketing Site Script

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const currentTheme = localStorage.getItem('pathfolio-site-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', active);
      localStorage.setItem('pathfolio-site-theme', active);
      updateThemeIcon(active);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    themeBtn.innerHTML = theme === 'dark' 
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // Interactive Kanban card click handler
  const sampleCards = document.querySelectorAll('.sample-card');
  sampleCards.forEach(card => {
    card.addEventListener('click', () => {
      const company = card.querySelector('h4')?.textContent;
      const role = card.querySelector('.role')?.textContent;
      if (company && role) {
        alert(`${company} (${role})\n\nOpen the live Pathfolio web app at /app/ to organize your opportunities, track deadlines, and cite career evidence.`);
      }
    });
  });
});

