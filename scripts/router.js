const pages = document.querySelectorAll('[data-page]');
const links = document.querySelectorAll('.site-header__nav a');

function showPage() {
  if (location.hash && !location.hash.startsWith('#/')) return;

  const current = location.hash.slice(2) || 'home';

  pages.forEach((page) => {
    page.hidden = page.dataset.page !== current;
  });

  links.forEach((link) => {
    if (link.getAttribute('href') === `#/${current}`) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', showPage);
showPage();
