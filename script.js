// ============================================================
// 공통 DOM 요소
// ============================================================
const header = document.querySelector('.site-header');
const progress = document.getElementById('scrollProgress');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

const navLinks = [...document.querySelectorAll('.main-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealElements = document.querySelectorAll('.reveal');


// ============================================================
// 스크롤 상태 처리
// 1) 헤더 스타일 변경
// 2) 상단 진행률 표시
// 3) 현재 보고 있는 메뉴에 active 클래스 표시
//
// requestAnimationFrame으로 한 프레임에 한 번만 실행해서
// 일반 scroll 이벤트보다 불필요한 연산을 줄입니다.
// ============================================================
let scrollTicking = false;

function updateScrollUI() {
  const y = window.scrollY;

  if (header) {
    header.classList.toggle('scrolled', y > 30);
  }

  if (progress) {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? (y / docHeight) * 100 : 0;
    progress.style.width = `${Math.min(ratio, 100)}%`;
  }

  let currentSection = '';

  sections.forEach((section) => {
    if (y >= section.offsetTop - 180) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');

    // 외부 링크가 아니라 #section 형태의 링크만 active 처리
    if (href?.startsWith('#')) {
      link.classList.toggle('active', href === `#${currentSection}`);
    }
  });

  scrollTicking = false;
}

function onScroll() {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollUI);
    scrollTicking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
updateScrollUI();


// ============================================================
// 모바일 메뉴 열기 / 닫기
// ============================================================
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');

    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  // 메뉴 안 링크를 누르면 모바일 메뉴 자동 닫기
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}


// ============================================================
// 스크롤 등장 애니메이션
// 화면에 들어온 요소에 is-visible 클래스를 한 번만 추가합니다.
// ============================================================
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  // 아주 오래된 브라우저에서는 콘텐츠가 숨겨진 채 남지 않도록 즉시 표시
  revealElements.forEach((element) => element.classList.add('is-visible'));
}


// ============================================================
// Footer 연도 자동 업데이트
// ============================================================
const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// ============================================================
// 데스크톱 마우스 전용 Magnetic 버튼 효과
// 접근성 설정에서 모션 감소를 요청한 사용자는 효과를 끕니다.
// ============================================================
const canUseMagneticEffect =
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canUseMagneticEffect) {
  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();

      const x =
        (event.clientX - rect.left - rect.width / 2) * 0.08;
      const y =
        (event.clientY - rect.top - rect.height / 2) * 0.08;

      button.style.transform = `translate(${x}px, ${y}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}
