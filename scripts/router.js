const pages = [...document.querySelectorAll('[data-page]')];
const links = document.querySelectorAll('nav a[href^="#/"]');
const menus = document.querySelectorAll('.chapter-menu');

function isActive(route, current) {
  return current === route || current.startsWith(`${route}/`);
}

// A route that has pages nested under it (a story) opens its first one (the story's home).
function resolve(route) {
  const first = pages.find((page) => page.dataset.page.startsWith(`${route}/`));
  const current = first ? first.dataset.page : route;
  return pages.some((page) => page.dataset.page === current) ? current : 'home';
}

function showPage() {
  if (location.hash && !location.hash.startsWith('#/')) return;

  const current = resolve(location.hash.slice(2) || 'home');

  pages.forEach((page) => {
    page.hidden = !isActive(page.dataset.page, current);
  });

  // A link can also stay lit for a second route, e.g. "Stories" while reading a story.
  links.forEach((link) => {
    const routes = [link.getAttribute('href').slice(2), link.dataset.also];
    if (routes.some((route) => route && isActive(route, current))) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  menus.forEach((menu) => {
    menu.open = false;
    menu.classList.toggle('is-current', Boolean(menu.querySelector('[aria-current]')));
  });

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', showPage);
showPage();
