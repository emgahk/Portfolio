const header = document.querySelector('.site-header');
const progress = document.getElementById('scrollProgress');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const reveals = document.querySelectorAll('.reveal');

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 30);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? (y / docHeight) * 100 : 0;
  progress.style.width = `${ratio}%`;

  let current = '';
  sections.forEach(section => {
    if (y >= section.offsetTop - 180) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const courseModal = document.getElementById('courseModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalMeta = document.getElementById('modalMeta');

document.querySelectorAll('.course-item').forEach(button => {
  button.addEventListener('click', () => {
    const [title, desc, meta] = button.dataset.course.split('|');
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalMeta.textContent = meta;
    courseModal.showModal();
  });
});

modalClose.addEventListener('click', () => courseModal.close());
courseModal.addEventListener('click', event => {
  const rect = courseModal.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) courseModal.close();
});

// 데스크톱에서 버튼 위를 움직일 때 아주 미세한 따라오기 효과
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('mousemove', e => {
      const r = button.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.08;
      const y = (e.clientY - r.top - r.height / 2) * 0.08;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}
