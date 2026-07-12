document.addEventListener('DOMContentLoaded', () => {
  // --- Global selectors ---
  const timelineContainer = document.querySelector('.timeline-container');
  const timelineProgress = document.getElementById('timeline-progress');
  const testimonialsSection = document.querySelector('.testimonials-sec');
  const testimonialsTrack = document.getElementById('testimonials-track');
  let ticking = false;

  // --- Optimized Scroll Handler ---
  function handleScrollAnimations() {
    // Roadmap timeline progress
    if (timelineContainer && timelineProgress) {
      const rect = timelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const fillStartPoint = windowHeight * 0.6;
      const scrolledDistance = fillStartPoint - rect.top;
      let percentage = (scrolledDistance / rect.height) * 100;
      percentage = Math.max(0, Math.min(percentage, 100));
      timelineProgress.style.height = `${percentage}%`;
    }

    // Testimonials horizontal scroll
    if (testimonialsSection && testimonialsTrack && window.innerWidth > 768) {
      const rect = testimonialsSection.getBoundingClientRect();
      // Start scrolling when the top of the section hits the top of the viewport
      if (rect.top <= 0) {
        const scrollableHeight = testimonialsSection.offsetHeight - window.innerHeight;
        const scrollProgress = Math.min(1, Math.abs(rect.top) / scrollableHeight);
        
        const maxTranslate = testimonialsTrack.scrollWidth - window.innerWidth;
        testimonialsTrack.style.transform = `translateX(-${scrollProgress * maxTranslate}px)`;
      }
    }
  }

  // --- Event Listener with requestAnimationFrame ---
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScrollAnimations();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Set the height of the testimonials section dynamically based on the track width
  function setTestimonialsHeight() {
    if (testimonialsSection && testimonialsTrack && window.innerWidth > 768) {
      const trackWidth = testimonialsTrack.scrollWidth;
      const extraSpace = window.innerHeight; // Adjust this value for more/less space
      testimonialsSection.style.height = `${trackWidth - window.innerWidth + extraSpace}px`;
    }
  }

  // --- Initialization Functions ---

  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
    document.querySelectorAll('.reveal, .reveal-wave, .reveal-right').forEach(el => observer.observe(el));
  }

  function initNavbarObserver() {
    const nav = document.querySelector('.nav');
    const heroSection = document.querySelector('.hero');
    if (!nav || !heroSection) return;

    const observer = new IntersectionObserver((entries) => {
      nav.classList.toggle('scrolled', !entries[0].isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px', threshold: 0 });

    observer.observe(heroSection);
  }

  function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const isVisible = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
          card.classList.toggle('hide', !isVisible);
          if (isVisible) {
            card.classList.remove('in');
            void card.offsetWidth; // Trigger reflow to restart animation
            card.classList.add('in');
          }
        });
      });
    });
  }

  function initDraggableTestimonials() {
    const testimonialsTrack = document.getElementById('testimonials-track');
    if (!testimonialsTrack) return;
    let isDown = false, startX, scrollLeft;

    const startDrag = (e) => {
      isDown = true;
      testimonialsTrack.classList.add('grabbing');
      startX = (e.pageX || e.touches[0].pageX) - testimonialsTrack.offsetLeft;
      scrollLeft = testimonialsTrack.scrollLeft;
    };

    const stopDrag = () => {
      isDown = false;
      testimonialsTrack.classList.remove('grabbing');
    };

    const doDrag = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.pageX || e.touches[0].pageX) - testimonialsTrack.offsetLeft;
      const walk = (x - startX) * 2;
      testimonialsTrack.scrollLeft = scrollLeft - walk;
    };

    testimonialsTrack.addEventListener('mousedown', startDrag);
    testimonialsTrack.addEventListener('touchstart', startDrag, { passive: true });
    testimonialsTrack.addEventListener('mouseleave', stopDrag);
    testimonialsTrack.addEventListener('mouseup', stopDrag);
    testimonialsTrack.addEventListener('touchend', stopDrag);
    testimonialsTrack.addEventListener('mousemove', doDrag);
    testimonialsTrack.addEventListener('touchmove', doDrag, { passive: false });
  }

  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const declineBtn = document.getElementById('cookie-decline-btn');
    if (!banner) return;

    if (!localStorage.getItem('cookies_accepted')) {
      banner.classList.add('show');
    }
    const hideBanner = () => banner.classList.remove('show');
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookies_accepted', 'true');
      hideBanner();
    });
    declineBtn.addEventListener('click', hideBanner);
  }

  function initRadialMenu() {
    const menu = document.getElementById('radial-menu');
    const toggle = document.getElementById('radial-menu-toggle');
    const footer = document.querySelector('.footer');
    if (!menu || !toggle) return;

    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    document.querySelectorAll('.uiverse-menu-item').forEach(link => link.addEventListener('click', () => menu.classList.remove('open')));

    if (footer) {
      const observer = new IntersectionObserver((entries) => {
        menu.classList.toggle('hidden', entries[0].isIntersecting);
      }, { threshold: 0.1 });
      observer.observe(footer);
    }
  }

  function initServicesAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length === 0) return;

    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        accordionItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    async function handleSubmit(event) {
      event.preventDefault();
      const statusMessage = form.querySelector('.form-status');
      let isValid = true;

      form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
      statusMessage.textContent = '';

      const name = form.querySelector('#name');
      if (name.value.trim().length < 2) {
        isValid = false;
        showError(name, 'Please enter your full name.');
      }

      const email = form.querySelector('#email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        isValid = false;
        showError(email, 'Please enter a valid email address.');
      }

      const message = form.querySelector('#message');
      if (message.value.trim().length < 10) {
        isValid = false;
        showError(message, 'Message must be at least 10 characters long.');
      }

      if (isValid) {
        const submitButton = form.querySelector('.btn-submit');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        statusMessage.textContent = '';

        const data = new FormData(event.target);
        try {
          const response = await fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            statusMessage.textContent = "Thanks for your submission!";
            statusMessage.style.color = 'green';
            form.reset();
          } else {
            const responseData = await response.json();
            if (Object.hasOwn(responseData, 'errors')) {
              statusMessage.textContent = responseData["errors"].map(error => error["message"]).join(", ");
            } else {
              statusMessage.textContent = "Oops! There was a problem submitting your form";
            }
            statusMessage.style.color = '#ef4444';
          }
        } catch (error) {
          statusMessage.textContent = "Oops! There was a problem submitting your form";
          statusMessage.style.color = '#ef4444';
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }
      } else {
        statusMessage.textContent = 'Please correct the errors above.';
        statusMessage.style.color = '#ef4444';
      }
    }
    form.addEventListener('submit', handleSubmit);

    function showError(input, message) {
      input.classList.add('invalid');
      input.nextElementSibling.textContent = message;
    }
  }

  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });
      lazyImages.forEach(img => observer.observe(img));
    }
  }

  // --- Run All Initializations ---
  initScrollReveal();
  initNavbarObserver();
  initProjectFiltering();
  initDraggableTestimonials();
  initCookieBanner();
  initRadialMenu();
  initServicesAccordion();
  initContactForm();
  initLazyLoading();
  setTestimonialsHeight(); // Set initial height
  window.addEventListener('resize', setTestimonialsHeight); // Adjust on resize
});
