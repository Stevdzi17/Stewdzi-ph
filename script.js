document.addEventListener("DOMContentLoaded", () => {
  // Hamburger meni
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('.nav-links');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Fade sekcije
  const fadeSections = document.querySelectorAll(".fade-section");

  const fadeInOnScroll = () => {
    fadeSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add("fade-in");
      }
    });
  };

  window.addEventListener("scroll", fadeInOnScroll);
  fadeInOnScroll();

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const thumbnails = document.querySelectorAll('.lightbox-thumb');

  let currentIndex = 0;

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      currentIndex = index;
      lightboxImg.src = thumb.src;
      lightbox.style.display = 'flex';
    });
  });

  closeBtn?.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    lightboxImg.src = thumbnails[currentIndex].src;
  });

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % thumbnails.length;
    lightboxImg.src = thumbnails[currentIndex].src;
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
});
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}