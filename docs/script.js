const homePage = document.getElementById('homePage');
const detailPage = document.getElementById('detailPage');
const detailTitleFirst = document.getElementById('detailTitleFirst');
const detailImage = document.getElementById('detailImage');
const categoryStage = document.getElementById('categoryStage');
const categoryPreview = document.getElementById('categoryPreview');
const categoryLinks = [...document.querySelectorAll('.category-link')];
const hero = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const appBase = location.pathname.startsWith('/inhousedesign/') ? '/inhousedesign/' : '/';

let currentView = 'home';
let transitioning = false;
let hoveredCategory = null;
let pointer = { x: 920, y: 210 };
let smoothPointer = { ...pointer };
let targetParallax = 0;
let smoothParallax = 0;
let animationFrame;

function viewFromURL() {
  const view = new URL(location.href).searchParams.get('view');
  return view === 'residential' || view === 'commercial' ? view : 'home';
}

function revealElements() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.14, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.hero-title, .closing-title, .reveal-copy').forEach(el => observer.observe(el));
}

function animateFrame() {
  smoothParallax += (targetParallax - smoothParallax) * 0.085;
  if (!reduceMotion.matches) hero.style.setProperty('--hero-image-y', `${smoothParallax.toFixed(2)}px`);

  smoothPointer.x += (pointer.x - smoothPointer.x) * 0.16;
  smoothPointer.y += (pointer.y - smoothPointer.y) * 0.16;
  categoryPreview.style.setProperty('--preview-x', `${smoothPointer.x.toFixed(2)}px`);
  categoryPreview.style.setProperty('--preview-y', `${smoothPointer.y.toFixed(2)}px`);
  animationFrame = requestAnimationFrame(animateFrame);
}

function updateParallax() {
  targetParallax = Math.max(-220, -Math.min(window.scrollY, hero.offsetHeight) * 0.17);
}

function updatePointer(event) {
  const bounds = categoryStage.getBoundingClientRect();
  const width = categoryPreview.offsetWidth;
  const height = categoryPreview.offsetHeight;
  pointer.x = Math.max(50, Math.min(bounds.width - width - 50, event.clientX - bounds.left - width * 0.45));
  pointer.y = Math.max(0, Math.min(bounds.height - height, event.clientY - bounds.top - height * 0.46));
}

categoryLinks.forEach(link => {
  link.addEventListener('pointerenter', event => {
    hoveredCategory = link.dataset.category;
    updatePointer(event);
    if (!categoryPreview.classList.contains('is-active')) smoothPointer = { ...pointer };
    categoryPreview.classList.add('is-active');
  });
  link.addEventListener('pointermove', updatePointer);
  link.addEventListener('pointerleave', () => {
    hoveredCategory = null;
    categoryPreview.classList.remove('is-active');
  });
  link.addEventListener('focus', () => {
    hoveredCategory = link.dataset.category;
    const rect = link.getBoundingClientRect();
    updatePointer({ clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 });
    smoothPointer = { ...pointer };
    categoryPreview.classList.add('is-active');
  });
  link.addEventListener('blur', () => categoryPreview.classList.remove('is-active'));
  link.addEventListener('click', async event => {
    event.preventDefault();
    await openDetail(link.dataset.category);
  });
});

function setDetailContent(view) {
  detailTitleFirst.textContent = view === 'commercial' ? 'Commercial' : 'Residential';
  document.title = `${view === 'commercial' ? 'Commercial' : 'Residential'} Interiors — Inhouse`;
}

function showView(view, options = {}) {
  currentView = view;
  const isHome = view === 'home';
  homePage.hidden = !isHome;
  detailPage.hidden = isHome;
  if (!isHome) setDetailContent(view);
  else document.title = 'Inhouse — Calm, conscious spaces';
  if (options.scroll !== false) window.scrollTo({ top: 0, behavior: 'instant' });
  updateParallax();
}

async function openDetail(view) {
  if (transitioning) return;
  transitioning = true;
  history.pushState({ view }, '', `${appBase}?view=${view}`);
  setDetailContent(view);

  if (reduceMotion.matches) {
    showView(view);
    categoryPreview.classList.remove('is-active');
    transitioning = false;
    return;
  }

  const source = categoryPreview.classList.contains('is-active')
    ? categoryPreview.getBoundingClientRect()
    : document.querySelector(`[data-category="${view}"]`).getBoundingClientRect();
  const start = { left: source.left, top: source.top, width: source.width, height: source.height };
  const flight = document.createElement('div');
  flight.className = 'shared-flight';
  flight.style.left = `${start.left}px`;
  flight.style.top = `${start.top}px`;
  flight.style.width = `${start.width}px`;
  flight.style.height = `${start.height}px`;
  flight.innerHTML = '<img src="assets/interior.jpg" alt="">';
  document.body.appendChild(flight);
  document.body.classList.add('is-transitioning');
  detailPage.classList.add('is-entering');
  showView(view);
  detailImage.style.visibility = 'hidden';
  const target = detailImage.getBoundingClientRect();

  const transition = flight.animate([
    { left: `${start.left}px`, top: `${start.top}px`, width: `${start.width}px`, height: `${start.height}px` },
    { left: `${target.left}px`, top: `${target.top}px`, width: `${target.width}px`, height: `${target.height}px` }
  ], { duration: 1050, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });

  try { await transition.finished; } catch (_) {}
  detailImage.style.visibility = '';
  flight.remove();
  detailPage.classList.remove('is-entering');
  document.body.classList.remove('is-transitioning');
  categoryPreview.classList.remove('is-active');
  transitioning = false;
}

function navigateHome(section = 'home') {
  if (transitioning) return;
  if (currentView !== 'home') {
    history.pushState({ view: 'home' }, '', section === 'home' ? appBase : `${appBase}#${section}`);
    showView('home', { scroll: false });
  } else if (section === 'home') {
    history.pushState({ view: 'home' }, '', appBase);
  } else {
    history.pushState({ view: 'home' }, '', `${appBase}#${section}`);
  }
  requestAnimationFrame(() => {
    const target = document.getElementById(section);
    if (target) target.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'start' });
  });
}

document.querySelectorAll('[data-home]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  navigateHome();
}));
document.querySelectorAll('[data-scroll]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  navigateHome(link.dataset.scroll);
}));

window.addEventListener('popstate', () => {
  if (transitioning) return;
  showView(viewFromURL(), { scroll: false });
  const section = location.hash.slice(1);
  requestAnimationFrame(() => {
    if (section && currentView === 'home') document.getElementById(section)?.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  });
});
window.addEventListener('scroll', updateParallax, { passive: true });

showView(viewFromURL());
revealElements();
updateParallax();
animationFrame = requestAnimationFrame(animateFrame);
