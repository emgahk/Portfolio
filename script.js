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
    menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    document.body.classList.toggle('menu-open', isOpen);
  });

  // 메뉴 안 링크를 누르면 모바일 메뉴 자동 닫기
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', '메뉴 열기');
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

// ============================================================
// Portfolio YouTube modal player (EDUC 1 / EDUC 2)
// ============================================================
const videoModal = document.getElementById('videoModal');
const portfolioYoutube = document.getElementById('portfolioYoutube');
const videoModalTitle = document.getElementById('videoModalTitle');
const videoExternalLink = document.getElementById('videoExternalLink');
const videoCards = document.querySelectorAll('[data-youtube-id]');
const videoCloseButtons = document.querySelectorAll('[data-video-close]');

function openPortfolioVideo(card) {
  if (!videoModal || !portfolioYoutube) return;

  const youtubeId = card.dataset.youtubeId?.trim();
  const title = card.dataset.videoTitle || 'Video Presentation';

  // 아직 YouTube 주소를 넣지 않은 카드
  if (!youtubeId || youtubeId.startsWith('YOUR_')) {
    if (videoModalTitle) videoModalTitle.textContent = title;
    portfolioYoutube.removeAttribute('src');
    if (videoExternalLink) {
      videoExternalLink.textContent = 'YouTube link not added yet';
      videoExternalLink.removeAttribute('href');
      videoExternalLink.classList.add('is-disabled');
    }
    videoModal.classList.add('is-open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('video-modal-open');
    return;
  }

  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0`;

  portfolioYoutube.src = embedUrl;
  portfolioYoutube.title = title;
  if (videoModalTitle) videoModalTitle.textContent = title;
  if (videoExternalLink) {
    videoExternalLink.href = watchUrl;
    videoExternalLink.textContent = 'Open on YouTube ↗';
    videoExternalLink.classList.remove('is-disabled');
  }

  videoModal.classList.add('is-open');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('video-modal-open');
}

function closePortfolioVideo() {
  if (!videoModal || !portfolioYoutube) return;

  portfolioYoutube.removeAttribute('src');
  videoModal.classList.remove('is-open');
  videoModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('video-modal-open');
}

videoCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    event.preventDefault();
    openPortfolioVideo(card);
  });
});

videoCloseButtons.forEach((button) => {
  button.addEventListener('click', closePortfolioVideo);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && videoModal?.classList.contains('is-open')) {
    closePortfolioVideo();
  }
});


// Portfolio main label active state (EDUC 1/2/3 + CIVer Photos)
const portfolioMainLink = document.querySelector('.portfolio-main-link');

function updatePortfolioMainState() {
  if (!portfolioMainLink) return;
  const activePortfolioLink = document.querySelector('.portfolio-dropdown-menu a.active');
  portfolioMainLink.classList.toggle('active', Boolean(activePortfolioLink));
}

window.addEventListener('scroll', updatePortfolioMainState, { passive: true });
updatePortfolioMainState();

// ============================================================
// CIVer Photos fullscreen lightbox
// ============================================================
const civerPhotoTiles = [...document.querySelectorAll('[data-civer-photo]')];
const civerLightbox = document.getElementById('civerLightbox');
const civerLightboxImage = document.getElementById('civerLightboxImage');
const civerLightboxCaption = document.getElementById('civerLightboxCaption');
const civerLightboxCounter = document.getElementById('civerLightboxCounter');
const civerCloseButtons = document.querySelectorAll('[data-civer-close]');
const civerPrevButton = document.querySelector('[data-civer-prev]');
const civerNextButton = document.querySelector('[data-civer-next]');
let currentCiverPhotoIndex = 0;

function renderCiverPhoto(index) {
  if (!civerPhotoTiles.length || !civerLightboxImage) return;
  currentCiverPhotoIndex = (index + civerPhotoTiles.length) % civerPhotoTiles.length;
  const tile = civerPhotoTiles[currentCiverPhotoIndex];
  const image = tile.querySelector('img');
  const src = tile.dataset.civerPhoto;
  const caption = tile.dataset.civerCaption || image?.alt || 'CIVer Photo';

  civerLightboxImage.src = src;
  civerLightboxImage.alt = image?.alt || caption;
  if (civerLightboxCaption) civerLightboxCaption.textContent = caption;
  if (civerLightboxCounter) {
    civerLightboxCounter.textContent = `${currentCiverPhotoIndex + 1} / ${civerPhotoTiles.length}`;
  }
}

function openCiverLightbox(index) {
  if (!civerLightbox) return;
  renderCiverPhoto(index);
  civerLightbox.classList.add('is-open');
  civerLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('civer-lightbox-open');
  civerLightbox.querySelector('.civer-lightbox-close')?.focus();
}

function closeCiverLightbox() {
  if (!civerLightbox) return;
  civerLightbox.classList.remove('is-open');
  civerLightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('civer-lightbox-open');
}

civerPhotoTiles.forEach((tile, index) => {
  tile.addEventListener('click', () => openCiverLightbox(index));
});

civerCloseButtons.forEach((button) => {
  button.addEventListener('click', closeCiverLightbox);
});

civerPrevButton?.addEventListener('click', () => renderCiverPhoto(currentCiverPhotoIndex - 1));
civerNextButton?.addEventListener('click', () => renderCiverPhoto(currentCiverPhotoIndex + 1));

window.addEventListener('keydown', (event) => {
  if (!civerLightbox?.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeCiverLightbox();
  if (event.key === 'ArrowLeft') renderCiverPhoto(currentCiverPhotoIndex - 1);
  if (event.key === 'ArrowRight') renderCiverPhoto(currentCiverPhotoIndex + 1);
});


// Responsive menu cleanup: one source of truth, no duplicate click toggles.
if (menuToggle && mainNav) {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', '메뉴 열기');
      document.body.classList.remove('menu-open');
      menuToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', '메뉴 열기');
      document.body.classList.remove('menu-open');
    }
  }, { passive: true });
}

// ============================================================
// Mobile/tablet navigation viewport mounting
// On some mobile browsers, backdrop-filter on a fixed header makes a
// position:fixed descendant use the header as its containing block.
// Mount the mobile nav directly under <body> so it always fills the viewport,
// even when opened after the page has been scrolled.
// ============================================================
if (mainNav) {
  const navHomeParent = mainNav.parentNode;
  const navHomeMarker = document.createComment('main-nav-home');
  navHomeParent?.insertBefore(navHomeMarker, mainNav);
  const mobileNavMedia = window.matchMedia('(max-width: 980px)');

  function syncMainNavMount() {
    if (mobileNavMedia.matches) {
      if (mainNav.parentNode !== document.body) {
        document.body.appendChild(mainNav);
      }
    } else if (navHomeMarker.parentNode && mainNav.parentNode !== navHomeMarker.parentNode) {
      navHomeMarker.parentNode.insertBefore(mainNav, navHomeMarker.nextSibling);
    }
  }

  syncMainNavMount();

  if (typeof mobileNavMedia.addEventListener === 'function') {
    mobileNavMedia.addEventListener('change', syncMainNavMount);
  } else if (typeof mobileNavMedia.addListener === 'function') {
    mobileNavMedia.addListener(syncMainNavMount);
  }
}
