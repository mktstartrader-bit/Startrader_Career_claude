/* ============================================
   STARTRADER CAREERS — Interactions
============================================ */

(() => {
  'use strict';

  /* ---------- 1. Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile drawer ---------- */
  const toggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');

  const closeDrawer = () => {
    toggle.classList.remove('open');
    drawer.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  };

  toggle.addEventListener('click', () => {
    const open = !drawer.classList.contains('open');
    drawer.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  });

  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ---------- 3. Reveal on scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('in-view'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- 4. Nav active state: HOME stays highlighted always ---------- */
  // (scrollspy disabled per design — only the HOME link carries .active in markup)

  /* ---------- 5. Parallax tilt on story cards ---------- */
  const cards = document.querySelectorAll('.story-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rX = (y - 0.5) * -6;
      const rY = (x - 0.5) * 6;
      card.style.transform = `translateY(-6px) perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- 6. Video play / pause via center button ---------- */
  const brandVideo  = document.getElementById('brandVideo');
  const videoCtrl   = document.getElementById('videoControl');
  const videoStrip  = document.querySelector('.video-strip');

  if (brandVideo && videoCtrl) {
    const setPlayingState = (playing) => {
      videoCtrl.classList.toggle('is-playing', playing);
      videoStrip.classList.toggle('is-playing', playing);
      videoCtrl.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    };

    videoCtrl.addEventListener('click', () => {
      if (brandVideo.paused) brandVideo.play().catch(() => {});
      else brandVideo.pause();
    });

    // Also toggle if the user clicks the video itself
    brandVideo.addEventListener('click', () => {
      if (brandVideo.paused) brandVideo.play().catch(() => {});
      else brandVideo.pause();
    });

    brandVideo.addEventListener('play',  () => setPlayingState(true));
    brandVideo.addEventListener('pause', () => setPlayingState(false));
    brandVideo.addEventListener('ended', () => setPlayingState(false));

    // Auto-pause when the section scrolls off-screen (saves bandwidth)
    if ('IntersectionObserver' in window) {
      const vio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && !brandVideo.paused) brandVideo.pause();
        });
      }, { threshold: 0.05 });
      vio.observe(brandVideo);
    }
  }

  /* ---------- 6.5 Filter chip active state + label sync ---------- */
  const filterPills = document.querySelector('.filter-pills');
  if (filterPills) {
    const allChip = filterPills.querySelector('.chip[data-filter="all"]');
    const dropdowns = filterPills.querySelectorAll('.chip-select select');

    allChip?.addEventListener('click', () => {
      allChip.classList.add('chip-active');
      dropdowns.forEach(s => {
        s.selectedIndex = 0;
        const label = s.parentElement.querySelector('.chip-label');
        if (label) label.textContent = s.dataset.default;
      });
    });

    dropdowns.forEach(sel => {
      sel.addEventListener('change', () => {
        const label = sel.parentElement.querySelector('.chip-label');
        if (sel.selectedIndex > 0) {
          if (label) label.textContent = sel.options[sel.selectedIndex].textContent;
          allChip?.classList.remove('chip-active');
        } else {
          if (label) label.textContent = sel.dataset.default;
        }
      });
    });
  }

  /* ---------- 7. Pagination active state ---------- */
  const pagination = document.querySelector('.pagination');
  if (pagination) {
    const numberedBtns = pagination.querySelectorAll('.page-btn:not(.page-arrow)');
    numberedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        numberedBtns.forEach(b => {
          b.classList.remove('is-active');
          b.removeAttribute('aria-current');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-current', 'page');
        document.getElementById('jobList')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---------- 8. Accordion: keep one item open at a time ---------- */
  const accordion = document.getElementById('mcAccordion');
  if (accordion) {
    const items = accordion.querySelectorAll('.accordion-item');
    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          items.forEach(other => { if (other !== item) other.open = false; });
        }
      });
    });
  }

  /* ---------- 9. Smooth anchor scroll w/ header offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
