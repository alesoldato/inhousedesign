const site = document.getElementById('site');
const homePage = document.getElementById('homePage');
const contentPage = document.getElementById('contentPage');
const introScreen = document.getElementById('introScreen');
const routeCurtain = document.getElementById('routeCurtain');
const mobileMenu = document.getElementById('mobileMenu');
const hero = document.querySelector('.hero');
const heroTitle = document.getElementById('heroTitle');
const heroVisual = document.querySelector('.hero-visual');
const heroImage = document.querySelector('.hero-image');
const heroScrollCue = document.getElementById('heroScrollCue');
const homeServiceList = document.getElementById('homeServiceList');
const homeServicePreview = document.getElementById('homeServicePreview');
const homeServiceRows = [...document.querySelectorAll('.home-service-row')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const smoothScrollEnabled = !reduceMotion.matches && window.matchMedia('(min-width: 980px) and (pointer: fine)').matches;
const appBase = location.protocol === 'file:'
  ? new URL('index.html', location.href).href
  : new URL('.', location.href).pathname;
const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));
const twoFrames = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (smoothScrollEnabled) document.documentElement.classList.add('has-smooth-scroll');

const projects = [
  {
    slug: 'morrow-house', title: 'Morrow House', category: 'residential', type: 'Private residence',
    location: 'London', year: '2025', image: 'figma/work-chair.png',
    detailA: 'quiet-bedroom.jpg', detailB: 'material-detail.jpg',
    intro: 'A calm city home shaped around light, warmth, and the quiet rituals of everyday life.',
    story: 'A restrained palette of limestone, oak, and soft textiles gives each room room to breathe. The plan balances open gathering spaces with intimate corners for retreat.',
    scope: 'Interior architecture · Bespoke joinery · Furniture & styling'
  },
  {
    slug: 'cedar-residence', title: 'Cedar Residence', category: 'residential', type: 'Family home',
    location: 'Copenhagen', year: '2024', image: 'figma/work-table.png',
    detailA: 'townhouse-living.jpg', detailB: 'material-detail.jpg',
    intro: 'A tactile home where timber, stone, and natural light make the everyday feel considered.',
    story: 'We brought warmth into a simple architectural shell through layered material choices and a plan that moves gently between social and private space.',
    scope: 'Spatial planning · Interior design · Material direction'
  },
  {
    slug: 'solace-suite', title: 'Solace Suite', category: 'residential', type: 'Private apartment',
    location: 'Amsterdam', year: '2025', image: 'figma/work-living.png',
    detailA: 'material-detail.jpg', detailB: 'townhouse-living.jpg',
    intro: 'An intimate retreat with a soft sense of order and a deeply personal material palette.',
    story: 'Quiet proportions and natural textures create continuity from room to room. Every detail is designed to support rest without losing the character of the space.',
    scope: 'Interior design · Custom furniture · Styling'
  },
  {
    slug: 'atelier-hotel', title: 'Atelier Hotel', category: 'commercial', type: 'Boutique hospitality',
    location: 'Lisbon', year: '2025', image: 'figma/work-bench.png',
    detailA: 'material-detail.jpg', detailB: 'quiet-bedroom.jpg',
    intro: 'A welcoming hospitality space with the ease of a residence and the presence of a destination.',
    story: 'The lobby opens as a sequence of warm, layered rooms. Curved timber, tactile plaster, and low light build a memorable arrival without overwhelming the guest.',
    scope: 'Concept design · Interior architecture · FF&E'
  },
  {
    slug: 'the-gather', title: 'The Gather', category: 'commercial', type: 'Creative workplace',
    location: 'Berlin', year: '2024', image: 'oak-workspace.jpg',
    detailA: 'material-detail.jpg', detailB: 'atelier-hotel.jpg',
    intro: 'A workplace made for focus, conversation, and the spaces in between.',
    story: 'A long communal table anchors the space, while quieter zones offer moments of concentration. Natural materials make the workplace feel generous and human.',
    scope: 'Workplace strategy · Interior design · Bespoke furniture'
  }
];

const serviceData = {
  residential: {
    title: 'Residential', second: 'Interiors', image: 'townhouse-living.jpg',
    intro: 'Homes that feel unmistakably yours. We shape spaces around the way you live, with clarity, warmth, and lasting material choices.',
    scope: ['Whole-home concepts', 'Interior architecture', 'Kitchens & joinery', 'Furniture, lighting & styling'],
    imageA: 'quiet-bedroom.jpg', imageB: 'material-detail.jpg'
  },
  commercial: {
    title: 'Commercial', second: 'Spaces', image: 'atelier-hotel.jpg',
    intro: 'Thoughtful places for people to gather, work, and stay. We translate a clear idea into an experience that feels both distinctive and welcoming.',
    scope: ['Hospitality interiors', 'Workplace design', 'Spatial identity', 'Furniture & material direction'],
    imageA: 'oak-workspace.jpg', imageB: 'material-detail.jpg'
  }
};

const asset = name => `assets/${name}`;
const projectHref = slug => `${appBase}?page=project&slug=${slug}`;
const serviceHref = type => `${appBase}?page=service&type=${type}`;
const pageHref = page => page === 'home' ? appBase : `${appBase}?page=${page}`;
const portfolioHref = category => `${appBase}?page=portfolio${category && category !== 'all' ? '&category=' + category : ''}`;

function routeFromURL() {
  const params = new URL(location.href).searchParams;
  const page = params.get('page');
  if (page === 'portfolio') {
    const category = params.get('category');
    return { page, category: category === 'residential' || category === 'commercial' ? category : 'all' };
  }
  if (page === 'project') {
    const slug = params.get('slug');
    return { page, slug: projects.some(project => project.slug === slug) ? slug : projects[0].slug };
  }
  if (page === 'service') {
    return { page, type: params.get('type') === 'commercial' ? 'commercial' : 'residential' };
  }
  if (['services', 'about', 'contact'].includes(page)) return { page };
  const legacyView = params.get('view');
  if (legacyView === 'residential' || legacyView === 'commercial') {
    return { page: 'portfolio', category: legacyView };
  }
  return { page: 'home' };
}

function urlFor(route) {
  if (route.page === 'portfolio') return portfolioHref(route.category);
  if (route.page === 'project') return projectHref(route.slug);
  if (route.page === 'service') return serviceHref(route.type);
  return pageHref(route.page);
}

function navigation(active, dark = false) {
  const links = [
    ['Home', 'home'], ['Portfolio', 'portfolio'], ['Services', 'services'],
    ['About Us', 'about'], ['Contacts', 'contact']
  ];
  return `<header class="site-nav site-nav--${dark ? 'dark' : 'light'} page-nav">
    <a class="brand" href="${appBase}" data-home aria-label="Inhouse, home">
      <img src="${asset(dark ? 'logo-dark.svg' : 'logo-light.svg')}" alt="Inhouse" />
      <span class="mobile-brand" aria-hidden="true"><span>inhouse</span><em>design</em></span>
    </a>
    <nav aria-label="Main navigation">
      ${links.map(([label, page]) => `<a href="${pageHref(page)}" data-route="${page}"${active === page ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    <button class="mobile-menu-toggle" type="button" aria-controls="mobileMenu" aria-expanded="false">Menu</button>
  </header>`;
}

function heading(lines) {
  return lines.map(line => {
    const item = typeof line === 'string' ? { text: line } : line;
    return `<span class="page-line"><span class="page-line-content${item.italic ? ' is-italic' : ''}">${item.text}</span></span>`;
  }).join('');
}

function editorialHero({ page, image, alt, eyebrow, lines, subtitle, imageClass = '' }) {
  return `<section class="editorial-hero">
    <div class="editorial-hero-media ${imageClass}"><img src="${asset(image)}" alt="${alt}" /></div>
    <div class="editorial-hero-shade"></div>
    ${navigation(page)}
    <div class="editorial-hero-inner">
      <p class="eyebrow">${eyebrow}</p>
      <h1 class="editorial-title">${heading(lines)}</h1>
      <div class="editorial-hero-bottom"><p>${subtitle}</p><span>Scroll to explore &nbsp; ↓</span></div>
    </div>
  </section>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="footer-top"><span>Inhouse Interiors</span><span>Spaces with intention</span></div>
    <div class="footer-main">
      <p>Have a space<br />in mind?</p>
      <a href="${pageHref('contact')}" data-route="contact">Let's talk <span aria-hidden="true">↗</span></a>
    </div>
    <div class="footer-bottom">
      <span>© Inhouse Interiors</span>
      <nav aria-label="Footer navigation">
        <a href="${pageHref('portfolio')}" data-route="portfolio">Portfolio</a>
        <a href="${pageHref('services')}" data-route="services">Services</a>
        <a href="${pageHref('about')}" data-route="about">About</a>
        <a href="${pageHref('contact')}" data-route="contact">Contact</a>
      </nav>
      <a href="${appBase}" data-home>Back to top ↑</a>
    </div>
  </footer>`;
}

function projectFeature(project, index) {
  return `<a class="project-feature page-reveal" href="${projectHref(project.slug)}" data-project="${project.slug}">
    <div class="project-feature-media"><img src="${asset(project.image)}" alt="${project.title} interior" loading="lazy" /></div>
    <div class="project-feature-shade"></div>
    <div class="project-feature-copy">
      <span class="project-feature-index">${String(index + 1).padStart(2, '0')} / ${project.category}</span>
      <h2><span class="project-name-mask"><span class="project-name-inner">${project.title}</span></span></h2>
      <span class="project-feature-type">${project.type} <span aria-hidden="true">↗</span></span>
    </div>
  </a>`;
}

function portfolioPage(category = 'all') {
  const selected = category === 'all' ? projects : projects.filter(project => project.category === category);
  const heroImage = category === 'commercial' ? 'atelier-hotel.jpg' : 'townhouse-living.jpg';
  const heroLines = category === 'all'
    ? ['Selected', { text: 'Work', italic: true }]
    : [{ text: category === 'residential' ? 'Residential' : 'Commercial' }, { text: 'Spaces', italic: true }];
  const filters = [['All projects', 'all'], ['Residential', 'residential'], ['Commercial', 'commercial']];
  return `${editorialHero({
    page: 'portfolio', image: heroImage, imageClass: 'portfolio-hero-image',
    alt: 'Considered interior space', eyebrow: '01 / Portfolio',
    lines: heroLines, subtitle: 'A selection of spaces shaped by people, place, and purpose.'
  })}
  <section class="portfolio-intro page-pad">
    <div class="section-label page-reveal">01 / Selected work</div>
    <div class="portfolio-intro-main">
      <p class="large-statement page-reveal">The most meaningful spaces are the ones you can <em>feel.</em></p>
      <p class="body-copy page-reveal">Every project begins with listening. From homes to places of gathering, our work balances quiet beauty with the life happening inside it.</p>
    </div>
    <nav class="portfolio-filters" aria-label="Project categories">
      ${filters.map(([label, value]) => `<a href="${portfolioHref(value)}" data-filter="${value}"${category === value ? ' aria-current="page"' : ''}>${label}<span>${value === 'all' ? '05' : value === 'residential' ? '03' : '02'}</span></a>`).join('')}
    </nav>
  </section>
  <section class="project-list" aria-label="Projects">${selected.map(projectFeature).join('')}</section>
  ${footer()}`;
}

function projectPage(project) {
  const index = projects.findIndex(item => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  return `${editorialHero({
    page: 'portfolio', image: project.image, imageClass: 'project-hero-image',
    alt: project.title + ' interior', eyebrow: `${String(index + 1).padStart(2, '0')} / ${project.category}`,
    lines: project.title.split(' ').map((word, i) => ({ text: word, italic: i === 1 })),
    subtitle: `${project.type} · ${project.location}`
  })}
  <section class="project-intro page-pad">
    <div class="section-label page-reveal">Project / ${String(index + 1).padStart(2, '0')}</div>
    <div class="project-intro-main">
      <h2 class="large-statement page-reveal">${project.intro}</h2>
      <div class="project-meta page-reveal">
        <div><span>Location</span><strong>${project.location}</strong></div>
        <div><span>Type</span><strong>${project.type}</strong></div>
        <div><span>Year</span><strong>${project.year}</strong></div>
      </div>
    </div>
  </section>
  <section class="project-editorial">
    <div class="project-wide-image image-reveal"><img src="${asset(project.detailA)}" alt="A second view of ${project.title}" loading="lazy" /></div>
    <div class="project-story page-pad">
      <span class="section-label page-reveal">A quiet point of view</span>
      <div><h2 class="statement-title page-reveal">Made to <em>belong.</em></h2><p class="body-copy page-reveal">${project.story}</p></div>
    </div>
    <div class="project-detail-grid page-pad">
      <div class="project-detail-image image-reveal"><img src="${asset(project.detailB)}" alt="Materials and details in ${project.title}" loading="lazy" /></div>
      <div class="project-scope page-reveal"><span>What we shaped</span><p>${project.scope}</p></div>
    </div>
  </section>
  <a class="next-project" href="${projectHref(next.slug)}" data-project="${next.slug}">
    <div class="next-project-media"><img src="${asset(next.image)}" alt="" loading="lazy" /></div>
    <span>Next project</span><h2>${next.title} <span aria-hidden="true">↗</span></h2>
  </a>
  ${footer()}`;
}

function servicesPage() {
  const serviceCards = Object.entries(serviceData).map(([key, service], index) => `<a class="service-row page-reveal" href="${serviceHref(key)}" data-service="${key}">
    <div class="service-row-image"><img src="${asset(service.image)}" alt="${service.title} interior" loading="lazy" /></div>
    <div class="service-row-copy">
      <span>0${index + 1} / ${key}</span>
      <h3>${service.title}<br /><em>${service.second}</em></h3>
      <p>${service.intro}</p>
      <b aria-hidden="true">↗</b>
    </div>
  </a>`).join('');
  return `${editorialHero({
    page: 'services', image: 'atelier-hotel.jpg', alt: 'Warm hospitality interior',
    eyebrow: '02 / Services', lines: ['Spaces', { text: 'with purpose', italic: true }],
    subtitle: 'From the first conversation to the final considered detail.'
  })}
  <section class="editorial-intro page-pad">
    <span class="section-label page-reveal">What we do</span>
    <div><h2 class="large-statement page-reveal">We create interiors that make space for <em>life.</em></h2>
      <p class="body-copy page-reveal">Whether it is a home, a workplace, or a place to stay, our approach is grounded in how people move, gather, and feel within a room.</p></div>
  </section>
  <section class="service-list page-pad"><div class="service-list-heading"><span>01 / Areas of practice</span><span>Explore a service ↓</span></div>${serviceCards}</section>
  <section class="process-section page-pad">
    <div class="section-label page-reveal">02 / The process</div>
    <div class="process-main"><h2 class="statement-title page-reveal">Thoughtful from <em>the start.</em></h2>
      <div class="process-steps">
        <div class="page-reveal"><span>01</span><h3>Listen</h3><p>We begin with your story, your needs, and the qualities that make a space feel right.</p></div>
        <div class="page-reveal"><span>02</span><h3>Shape</h3><p>We explore proportion, material, light, and the details that connect them.</p></div>
        <div class="page-reveal"><span>03</span><h3>Realise</h3><p>We bring the design into focus with care, collaboration, and a clear eye for craft.</p></div>
      </div>
    </div>
  </section>
  ${footer()}`;
}

function servicePage(type) {
  const service = serviceData[type];
  const related = projects.filter(project => project.category === type).slice(0, 2);
  return `${editorialHero({
    page: 'services', image: service.image, alt: service.title + ' interior',
    eyebrow: `02 / ${service.title}`,
    lines: [service.title, { text: service.second, italic: true }],
    subtitle: type === 'residential' ? 'A place to come home to.' : 'Places that bring people together.'
  })}
  <section class="editorial-intro page-pad">
    <span class="section-label page-reveal">The intention</span>
    <div><h2 class="large-statement page-reveal">${service.intro}</h2>
      <p class="body-copy page-reveal">We work closely with you to uncover what a space needs to do and how it should feel, then translate that into a clear and lasting design language.</p></div>
  </section>
  <section class="service-detail-visual">
    <div class="service-detail-primary image-reveal"><img src="${asset(service.imageA)}" alt="${service.title} space" loading="lazy" /></div>
    <div class="service-detail-secondary image-reveal"><img src="${asset(service.imageB)}" alt="Material detail" loading="lazy" /></div>
  </section>
  <section class="service-scope page-pad">
    <span class="section-label page-reveal">01 / What we shape</span>
    <div><h2 class="statement-title page-reveal">From the whole<br />to the <em>detail.</em></h2>
      <ul>${service.scope.map((item, index) => `<li class="page-reveal"><span>0${index + 1}</span>${item}</li>`).join('')}</ul>
    </div>
  </section>
  <section class="related-work page-pad">
    <div class="related-heading"><span>02 / Related work</span><a href="${portfolioHref(type)}" data-filter="${type}">View all ${type} projects ↗</a></div>
    <div class="related-grid">${related.map(project => `<a class="related-card page-reveal" href="${projectHref(project.slug)}" data-project="${project.slug}"><img src="${asset(project.image)}" alt="${project.title} interior" loading="lazy" /><span>${project.title} <b>↗</b></span></a>`).join('')}</div>
  </section>
  ${footer()}`;
}

function aboutPage() {
  return `${editorialHero({
    page: 'about', image: 'material-detail.jpg', alt: 'Warm natural materials and crafted details',
    eyebrow: '03 / About Inhouse', lines: ['A way', { text: 'of seeing', italic: true }],
    subtitle: 'Design that begins with how a place should feel.'
  })}
  <section class="editorial-intro page-pad">
    <span class="section-label page-reveal">Our point of view</span>
    <div><h2 class="large-statement page-reveal">We believe the most beautiful interiors have a quiet <em>confidence.</em></h2>
      <p class="body-copy page-reveal">Inhouse is an interior design practice drawn to honest materials, natural light, and spaces that hold the texture of real life. We look for the essential, then give it room to breathe.</p></div>
  </section>
  <section class="about-image-band image-reveal"><img src="${asset('townhouse-living.jpg')}" alt="A light-filled Inhouse interior" loading="lazy" /></section>
  <section class="about-philosophy page-pad">
    <div><span class="section-label page-reveal">01 / The approach</span><h2 class="statement-title page-reveal">Considered in<br />every <em>detail.</em></h2></div>
    <div class="about-philosophy-copy">
      <p class="page-reveal">A space is never just a picture. It is where mornings begin, ideas take shape, and people come together. We design for those moments.</p>
      <p class="page-reveal">Our work moves between architecture and atmosphere: clear proportions, tactile finishes, and furniture chosen to feel inevitable in its place.</p>
    </div>
  </section>
  <section class="about-values page-pad">
    <span class="section-label page-reveal">02 / What guides us</span>
    <div class="values-list">
      <div class="page-reveal"><span>01</span><h3>Light</h3><p>We let daylight reveal the form and feeling of a room.</p></div>
      <div class="page-reveal"><span>02</span><h3>Material</h3><p>Natural surfaces bring depth that grows more beautiful with use.</p></div>
      <div class="page-reveal"><span>03</span><h3>Human scale</h3><p>Comfort, movement, and everyday rituals guide every decision.</p></div>
    </div>
  </section>
  <section class="about-pair page-pad"><img src="${asset('quiet-bedroom.jpg')}" alt="Soft residential interior" loading="lazy" /><img src="${asset('oak-workspace.jpg')}" alt="Considered workspace interior" loading="lazy" /></section>
  ${footer()}`;
}

function contactPage() {
  return `<section class="contact-page">
    ${navigation('contact', true)}
    <div class="contact-frame">
      <p class="eyebrow">04 / Contact</p>
      <div class="contact-marquee" aria-hidden="true">Let's make space for what matters.</div>
      <div class="contact-portrait"><img src="${asset('material-detail.jpg')}" alt="Warm timber and stone materials" /></div>
      <div class="contact-lead page-reveal"><h1>Let's make<br /><em>space.</em></h1><p>Tell us what you have in mind. A home, a place to gather, or the first thought of something new — we would love to hear it.</p></div>
      <div class="contact-details page-reveal"><span>Project enquiries</span><a href="mailto:hello@inhouseinteriors.com?subject=Project%20enquiry">hello@inhouseinteriors.com <b aria-hidden="true">↗</b></a><p>Share a few words about your space and we will take it from there.</p></div>
      <div class="contact-bottom"><span>Inhouse Interiors</span><a href="${pageHref('portfolio')}" data-route="portfolio">Explore our work ↗</a></div>
    </div>
  </section>${footer()}`;
}

function titleFor(route) {
  if (route.page === 'home') return 'Inhouse — Calm, conscious spaces';
  if (route.page === 'portfolio') return 'Portfolio — Inhouse Interiors';
  if (route.page === 'project') return `${projects.find(project => project.slug === route.slug).title} — Inhouse Interiors`;
  if (route.page === 'service') return `${serviceData[route.type].title} Interiors — Inhouse`;
  return `${route.page[0].toUpperCase() + route.page.slice(1)} — Inhouse Interiors`;
}

let currentRoute = { page: 'home' };
let transitioning = false;
let pointer = { x: 920, y: 210 };
let smoothPointer = { ...pointer };
let targetParallax = 0;
let smoothParallax = 0;
let smoothScroll = window.scrollY;
let renderedScroll = NaN;
let maxScroll = 0;
let lastFrameTime = 0;
let revealObserver;
let parallaxMedia = [];
const paragraphText = new WeakMap();
let paragraphResizeTimer;

function prepareParagraphs(root) {
  if (reduceMotion.matches) return;
  root.querySelectorAll('p:not(.eyebrow):not(.large-statement):not(.footer-main p)').forEach(paragraph => {
    if (!paragraphText.has(paragraph)) {
      if (paragraph.children.length) return;
      paragraphText.set(paragraph, paragraph.textContent.replace(/\s+/g, ' ').trim());
    }
    const content = paragraphText.get(paragraph);
    paragraph.classList.add('paragraph-reveal', 'is-resplitting');
    paragraph.textContent = content;
    const node = paragraph.firstChild;
    const range = document.createRange();
    const lines = [];
    let previousTop = null;
    for (const match of content.matchAll(/\S+/g)) {
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const top = range.getBoundingClientRect().top;
      if (previousTop === null || Math.abs(top - previousTop) > 2) lines.push([]);
      lines[lines.length - 1].push(match[0]);
      previousTop = top;
    }
    const fragment = document.createDocumentFragment();
    lines.forEach((words, index) => {
      const mask = document.createElement('span');
      const inner = document.createElement('span');
      mask.className = 'paragraph-line';
      inner.className = 'paragraph-line-inner';
      inner.style.setProperty('--line-index', index);
      inner.textContent = words.join(' ');
      mask.appendChild(inner);
      fragment.appendChild(mask);
      if (index < lines.length - 1) fragment.appendChild(document.createTextNode(' '));
    });
    paragraph.replaceChildren(fragment);
    requestAnimationFrame(() => paragraph.classList.remove('is-resplitting'));
  });
}

function armProjectName(card) {
  if (card.dataset.nameArmed) return;
  card.dataset.nameArmed = 'true';
  const media = card.querySelector('.home-work-media, .project-feature-media');
  const image = media?.querySelector('img');
  const imageReady = image?.decode().catch(() => {}) || Promise.resolve();
  const maskReady = reduceMotion.matches ? Promise.resolve() : new Promise(resolve => {
    const fallback = window.setTimeout(finish, 1750);
    function finish() {
      window.clearTimeout(fallback);
      media.removeEventListener('transitionend', onEnd);
      resolve();
    }
    function onEnd(event) {
      if (event.target === media && event.propertyName === 'clip-path') finish();
    }
    media.addEventListener('transitionend', onEnd);
  });
  Promise.all([imageReady, maskReady]).then(() => card.classList.add('is-media-ready'));
}

function syncScrollHeight() {
  if (!smoothScrollEnabled) return;
  const height = site.scrollHeight;
  document.body.style.height = `${height}px`;
  maxScroll = Math.max(0, height - window.innerHeight);
}

function jumpTo(top) {
  window.scrollTo({ top, behavior: 'instant' });
  if (!smoothScrollEnabled) return;
  smoothScroll = window.scrollY;
  renderedScroll = smoothScroll;
  site.style.transform = `translate3d(0,${-smoothScroll}px,0)`;
}

function observeReveals() {
  if (revealObserver) revealObserver.disconnect();
  if (reduceMotion.matches) {
    document.querySelectorAll('.page-reveal, .image-reveal, .closing-title, .reveal-copy, .home-statement, .home-work, .home-image-mask, .paragraph-reveal').forEach(el => {
      el.classList.add('is-visible');
      if (el.matches('.home-work, .project-feature')) armProjectName(el);
    });
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.matches('.home-work, .project-feature')) armProjectName(entry.target);
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  const root = currentRoute.page === 'home' ? homePage : contentPage;
  root.querySelectorAll('.page-reveal, .image-reveal, .closing-title, .reveal-copy, .home-statement, .home-work, .home-image-mask, .paragraph-reveal').forEach(el => revealObserver.observe(el));
}

function activatePageMotion() {
  observeReveals();
  const pageHero = contentPage.querySelector('.editorial-hero');
  if (pageHero) requestAnimationFrame(() => pageHero.classList.add('is-visible'));
}

function activateCurrentRoute() {
  if (currentRoute.page === 'home') {
    observeReveals();
    beginHeroReveal();
  } else activatePageMotion();
}

function renderRoute(route, { activate = true, scroll = true } = {}) {
  currentRoute = route;
  const isHome = route.page === 'home';
  homePage.hidden = !isHome;
  contentPage.hidden = isHome;
  if (!isHome) {
    if (route.page === 'portfolio') contentPage.innerHTML = portfolioPage(route.category);
    if (route.page === 'project') contentPage.innerHTML = projectPage(projects.find(project => project.slug === route.slug));
    if (route.page === 'services') contentPage.innerHTML = servicesPage();
    if (route.page === 'service') contentPage.innerHTML = servicePage(route.type);
    if (route.page === 'about') contentPage.innerHTML = aboutPage();
    if (route.page === 'contact') contentPage.innerHTML = contactPage();
  } else {
    contentPage.innerHTML = '';
  }
  document.title = titleFor(route);
  document.body.dataset.page = route.page;
  closeMobileMenu();
  prepareParagraphs(isHome ? homePage : contentPage);
  parallaxMedia = [...(isHome ? homePage : contentPage).querySelectorAll('.home-work-media, .project-feature-media, .image-reveal, .related-card, .next-project-media')];
  if (scroll) jumpTo(0);
  syncScrollHeight();
  if (activate) {
    if (isHome) {
      observeReveals();
      if (!document.contains(introScreen)) beginHeroReveal();
    } else activatePageMotion();
  }
}

async function navigate(route, source = null) {
  if (transitioning || JSON.stringify(route) === JSON.stringify(currentRoute)) return;
  transitioning = true;
  const sourceMedia = source && (source.classList.contains('home-work-media') || source.classList.contains('project-feature-media'))
    ? source : source?.querySelector('.home-work-media, .project-feature-media, .related-card img, .next-project-media');
  const canFly = !reduceMotion.matches && sourceMedia && (route.page === 'portfolio' || route.page === 'project');
  const sourceRect = canFly ? sourceMedia.getBoundingClientRect() : null;
  const sourceImage = canFly ? (sourceMedia.matches('img') ? sourceMedia : sourceMedia.querySelector('img')) : null;
  history.pushState({ route }, '', urlFor(route));
  document.body.classList.add('is-transitioning');

  try {
    if (canFly && sourceImage) {
      const flight = document.createElement('div');
      flight.className = 'shared-flight';
      Object.assign(flight.style, {
        left: `${sourceRect.left}px`, top: `${sourceRect.top}px`,
        width: `${sourceRect.width}px`, height: `${sourceRect.height}px`
      });
      const image = document.createElement('img');
      image.src = sourceImage.src;
      image.alt = '';
      flight.appendChild(image);
      document.body.appendChild(flight);
      renderRoute(route, { activate: false });
      await twoFrames();
      const target = contentPage.querySelector('.editorial-hero-media');
      const targetRect = target.getBoundingClientRect();
      target.style.visibility = 'hidden';
      const animation = flight.animate([
        { left: `${sourceRect.left}px`, top: `${sourceRect.top}px`, width: `${sourceRect.width}px`, height: `${sourceRect.height}px` },
        { left: `${targetRect.left}px`, top: `${targetRect.top}px`, width: `${targetRect.width}px`, height: `${targetRect.height}px` }
      ], { duration: 1050, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
      try { await animation.finished; } catch (_) {}
      target.style.visibility = '';
      target.closest('.editorial-hero').classList.add('is-flight-complete');
      flight.remove();
      activatePageMotion();
    } else if (reduceMotion.matches) {
      renderRoute(route);
    } else {
      const cover = routeCurtain.animate([
        { clipPath: 'polygon(0 100%,100% 92%,100% 100%,0 100%)' },
        { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }
      ], { duration: 670, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
      await cover.finished;
      renderRoute(route, { activate: false });
      await twoFrames();
      const reveal = routeCurtain.animate([
        { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' },
        { clipPath: 'polygon(0 -10%,100% 0,100% 0,0 -10%)' }
      ], { duration: 880, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
      activateCurrentRoute();
      await reveal.finished;
      cover.cancel();
      reveal.cancel();
    }
  } finally {
    document.body.classList.remove('is-transitioning');
    transitioning = false;
    syncScrollHeight();
  }
}

function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  mobileMenu.hidden = true;
  document.body.classList.remove('is-menu-open');
  document.querySelectorAll('.mobile-menu-toggle').forEach(button => button.setAttribute('aria-expanded', 'false'));
}

function openMobileMenu() {
  mobileMenu.hidden = false;
  document.body.classList.add('is-menu-open');
  document.querySelectorAll('.mobile-menu-toggle').forEach(button => button.setAttribute('aria-expanded', 'true'));
  requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
}

function beginHeroReveal(withMask = false) {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
    if (withMask) introScreen.classList.add('is-mask-revealing');
    heroVisual.classList.add('is-revealing');
    heroTitle.classList.add('is-visible');
    window.setTimeout(() => heroScrollCue.classList.add('is-visible'), 3000);
    resolve();
  })));
}

const heroImageReady = heroImage.decode().catch(() => {});
async function runIntro() {
  if (currentRoute.page !== 'home' || reduceMotion.matches) {
    introScreen.remove();
    document.body.classList.remove('is-intro');
    if (currentRoute.page === 'home') {
      await heroImageReady;
      beginHeroReveal();
    }
    return;
  }
  let heroRevealStarted = false;
  try {
    await document.fonts.ready;
    await twoFrames();
    introScreen.classList.add('is-visible');
    await wait(1450);
    await wait(1500);
    await heroImageReady;
    const logo = introScreen.querySelector('.intro-logo');
    const logoExitFinished = new Promise(resolve => {
      let fallback;
      const finish = () => {
        logo.removeEventListener('transitionend', onEnd);
        window.clearTimeout(fallback);
        resolve();
      };
      const onEnd = event => {
        if (event.propertyName === 'transform') finish();
      };
      logo.addEventListener('transitionend', onEnd);
      fallback = window.setTimeout(finish, 1000);
    });
    introScreen.classList.add('is-logo-exiting');
    await logoExitFinished;
    await wait(50);
    const maskFinished = new Promise(resolve => introScreen.addEventListener('animationend', resolve, { once: true }));
    heroRevealStarted = true;
    await beginHeroReveal(true);
    await maskFinished;
  } finally {
    introScreen.remove();
    document.body.classList.remove('is-intro');
    if (!heroRevealStarted) beginHeroReveal();
  }
}

function updateServicePointer(event) {
  const bounds = homeServiceList.getBoundingClientRect();
  const width = homeServicePreview.offsetWidth;
  pointer.x = Math.max(0, Math.min(bounds.width - width, event.clientX - bounds.left - width * 0.5));
  pointer.y = 0;
}

const servicePreviewImages = [...homeServicePreview.querySelectorAll('img')];
function showServicePreview(index) {
  servicePreviewImages.forEach((image, imageIndex) => image.classList.toggle('is-current', imageIndex === index));
}

homeServiceRows.forEach((link, index) => {
  link.addEventListener('pointerenter', event => {
    updateServicePointer(event);
    showServicePreview(index);
    if (!homeServicePreview.classList.contains('is-active')) smoothPointer = { ...pointer };
    homeServicePreview.classList.add('is-active');
  });
  link.addEventListener('pointermove', updateServicePointer);
  link.addEventListener('pointerleave', () => homeServicePreview.classList.remove('is-active'));
  link.addEventListener('focus', () => {
    const rect = link.getBoundingClientRect();
    updateServicePointer({ clientX: rect.left + rect.width / 2 });
    showServicePreview(index);
    smoothPointer = { ...pointer };
    homeServicePreview.classList.add('is-active');
  });
  link.addEventListener('blur', () => homeServicePreview.classList.remove('is-active'));
});

document.addEventListener('click', event => {
  if (event.target.closest('.mobile-menu-toggle')) {
    if (mobileMenu.hidden) openMobileMenu(); else closeMobileMenu();
  } else if (event.target.closest('.mobile-menu-close')) {
    closeMobileMenu();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) closeMobileMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 979 && !mobileMenu.hidden) closeMobileMenu();
  window.clearTimeout(paragraphResizeTimer);
  paragraphResizeTimer = window.setTimeout(() => {
    prepareParagraphs(currentRoute.page === 'home' ? homePage : contentPage);
    syncScrollHeight();
  }, 180);
});

document.addEventListener('click', event => {
  const link = event.target.closest('a[data-route],a[data-home],a[data-project],a[data-service],a[data-filter]');
  if (!link || location.protocol === 'file:' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  closeMobileMenu();
  if (link.dataset.project) {
    navigate({ page: 'project', slug: link.dataset.project }, link);
  } else if (link.dataset.service) {
    navigate({ page: 'service', type: link.dataset.service });
  } else if (link.dataset.filter) {
    navigate({ page: 'portfolio', category: link.dataset.filter });
  } else if (link.dataset.route) {
    navigate({ page: link.dataset.route, ...(link.dataset.route === 'portfolio' ? { category: 'all' } : {}) });
  } else if (link.hasAttribute('data-home')) {
    navigate({ page: 'home' });
  }
});

window.addEventListener('popstate', () => {
  if (transitioning) return;
  renderRoute(routeFromURL());
});
window.addEventListener('scroll', () => {
  targetParallax = Math.max(-220, -Math.min(smoothScrollEnabled ? smoothScroll : window.scrollY, currentRoute.page === 'home' ? hero.offsetHeight : window.innerHeight) * 0.17);
}, { passive: true });
if (smoothScrollEnabled) {
  window.addEventListener('resize', syncScrollHeight);
  if ('ResizeObserver' in window) new ResizeObserver(syncScrollHeight).observe(site);
}

function animateFrame(now) {
  if (smoothScrollEnabled) {
    const delta = Math.min(64, now - (lastFrameTime || now));
    const target = Math.min(window.scrollY, maxScroll);
    const distance = target - smoothScroll;
    smoothScroll = Math.abs(distance) < .1 ? target : smoothScroll + distance * (1 - Math.pow(.94, delta / 16.67));
    if (smoothScroll !== renderedScroll) {
      site.style.transform = `translate3d(0,${(-smoothScroll).toFixed(2)}px,0)`;
      renderedScroll = smoothScroll;
    }
  }
  lastFrameTime = now;
  smoothParallax += (targetParallax - smoothParallax) * 0.085;
  if (!reduceMotion.matches) {
    hero.style.setProperty('--hero-image-y', `${smoothParallax.toFixed(2)}px`);
    const pageHero = contentPage.querySelector('.editorial-hero');
    if (pageHero) pageHero.style.setProperty('--page-image-y', `${(smoothParallax * .28).toFixed(2)}px`);
    parallaxMedia.forEach(media => {
      const rect = media.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
      const relative = (rect.top + rect.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2 + rect.height / 2);
      media.style.setProperty('--image-parallax', `${Math.max(-24, Math.min(24, -relative * 24)).toFixed(2)}px`);
    });
  }
  smoothPointer.x += (pointer.x - smoothPointer.x) * 0.16;
  smoothPointer.y += (pointer.y - smoothPointer.y) * 0.16;
  homeServicePreview.style.setProperty('--service-preview-x', `${smoothPointer.x.toFixed(2)}px`);
  homeServicePreview.style.setProperty('--service-preview-y', `${smoothPointer.y.toFixed(2)}px`);
  requestAnimationFrame(animateFrame);
}

(async function start() {
  const route = routeFromURL();
  renderRoute(route, { activate: false });
  if (route.page !== 'home') {
    const firstImage = contentPage.querySelector('.editorial-hero-media img');
    if (firstImage) await firstImage.decode().catch(() => {});
    activatePageMotion();
  } else {
    observeReveals();
  }
  requestAnimationFrame(animateFrame);
  runIntro();
  document.fonts.ready.then(() => {
    prepareParagraphs(currentRoute.page === 'home' ? homePage : contentPage);
    syncScrollHeight();
  });
})();
