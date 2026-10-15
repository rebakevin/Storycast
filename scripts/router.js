const pages = document.querySelectorAll('[data-page]');
const links = document.querySelectorAll('nav a[href^="#/"]');
const defaultChapter = { story: 'story/the-story' };

function isActive(route, current) {
  return current === route || current.startsWith(`${route}/`);
}

function showPage() {
  if (location.hash && !location.hash.startsWith('#/')) return;

  const route = location.hash.slice(2) || 'home';
  const current = defaultChapter[route] ?? route;

  pages.forEach((page) => {
    page.hidden = !isActive(page.dataset.page, current);
  });

  links.forEach((link) => {
    const target = link.getAttribute('href').slice(2);
    if (isActive(target, current)) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', showPage);
showPage();
