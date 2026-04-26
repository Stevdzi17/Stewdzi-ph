/* =============================================
   STEWDZI PHOTOGRAPHY — MAIN SCRIPT
   3D tilt, particles, counter, FAQ, scroll anim
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ──────────── CUSTOM CURSOR ──────────── */
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');

  if (cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth follower with lerp
    function animateCursor() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top  = followerY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale cursor on hover interactive elements
    const interactives = document.querySelectorAll('a, button, .tilt-card, .gallery-item, input, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '20px';
        cursor.style.height = '20px';
        cursorFollower.style.width  = '56px';
        cursorFollower.style.height = '56px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '10px';
        cursor.style.height = '10px';
        cursorFollower.style.width  = '36px';
        cursorFollower.style.height = '36px';
      });
    });
  }

  /* ──────────── PARTICLE CANVAS ──────────── */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    });

    const PARTICLE_COUNT = 70;
    const COLORS = ['255, 166, 43', '255, 118, 49', '255, 200, 100'];

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size   = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life   = 0;
        this.maxLife = Math.random() * 300 + 200;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.life > this.maxLife) {
          this.reset();
        }
      }
      draw() {
        const fade = Math.sin((this.life / this.maxLife) * Math.PI);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity * fade})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // Draw connecting lines between nearby particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 166, 43, ${(1 - dist / 120) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ──────────── HEADER SCROLL EFFECT ──────────── */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ──────────── HAMBURGER MENU ──────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    const toggleMenu = () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    };

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    });

    // Close on nav link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  }

  /* ──────────── SCROLL REVEAL (INTERSECTION OBSERVER) ──────────── */
  const fadeSections = document.querySelectorAll(".fade-section");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  fadeSections.forEach(section => revealObserver.observe(section));

  /* ──────────── ANIMATED COUNTER ──────────── */
  const counters = document.querySelectorAll('.stat-number');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const increment = target / 60;
        const suffix = el.getAttribute('data-suffix') || '';

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + suffix;
          }
        }, 25);

        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => countObserver.observe(counter));

  /* ──────────── 3D TILT ON HOVER ──────────── */
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      const rotateX = -y * 12;  // tilt strength
      const rotateY =  x * 12;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.1s ease';

      // Dynamic shine
      const shine = card.querySelector('.shine');
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255, 166, 43, 0.15) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });

  /* ──────────── LIGHTBOX ──────────── */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn    = document.getElementById('lightbox-close');
  const prevBtn     = document.getElementById('lightbox-prev');
  const nextBtn     = document.getElementById('lightbox-next');
  const thumbnails  = document.querySelectorAll('.lightbox-thumb');

  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    lightboxImg.src = thumbnails[currentIndex].src;
    lightboxImg.alt = thumbnails[currentIndex].alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxImg.classList.remove('lb-anim');
    void lightboxImg.offsetWidth;
    lightboxImg.classList.add('lb-anim');
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  const showImage = (index) => {
    currentIndex = (index + thumbnails.length) % thumbnails.length;
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.92)';
    setTimeout(() => {
      lightboxImg.src = thumbnails[currentIndex].src;
      lightboxImg.alt = thumbnails[currentIndex].alt;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 150);
    if (!lightboxImg.style.transition) {
      lightboxImg.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    }
  };

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => openLightbox(index));
    thumb.style.cursor = 'pointer';
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showImage(currentIndex + 1));

  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft')  showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    }
  });

  // Touch swipe for lightbox
  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; });
  lightbox?.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) showImage(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  });

  /* ──────────── FAQ ACCORDION ──────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if wasn't open)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ──────────── SMOOTH SCROLL FOR ANCHOR LINKS ──────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────── CONTACT FORM ──────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.submit-btn');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<span>Slanje...</span> <i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      try {
        const res = await fetch('/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: contactForm.name.value,
            email: contactForm.email.value,
            message: contactForm.message.value,
          }),
        });
        if (res.ok) {
          btn.innerHTML = '<span>Poruka poslata!</span> <i class="fas fa-check"></i>';
          btn.style.background = 'linear-gradient(135deg, #25d366, #1ebe5d)';
          contactForm.reset();
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        } else {
          throw new Error('Greška');
        }
      } catch {
        btn.innerHTML = '<span>Greška, pokušaj ponovo</span> <i class="fas fa-times"></i>';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  /* ──────────── SCROLL TO SECTION (global helper) ──────────── */
  window.scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
      window.scrollTo({ top: section.offsetTop - headerH, behavior: 'smooth' });
    }
  };

});
