// Update local time
  function updateTime() {
    const el = document.getElementById('local-time');
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + ', GMT +0';
    }
  }
  setInterval(updateTime, 1000);
  updateTime();

  const timelineContainer = document.querySelector('.timeline-container');
  const timelineProgress = document.getElementById('timeline-progress');

  if (timelineContainer && timelineProgress) {
    window.addEventListener('scroll', () => {
      // Calculate position of the timeline container relative to viewport
      const rect = timelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Start filling line when top of container reaches 60% down the screen
      const fillStartPoint = windowHeight * 0.6;
      
      // Calculate how far we've scrolled past the start point
      const scrolledDistance = fillStartPoint - rect.top;
      
      // Calculate percentage based on container height
      let percentage = (scrolledDistance / rect.height) * 100;
      
      // Clamp between 0% and 100%
      percentage = Math.max(0, Math.min(percentage, 100));
      
      // Apply the height to the black line overlay
      timelineProgress.style.height = `${percentage}%`;
    }, { passive: true });
  }

  // Roadmap Tabs Functionality
  const roadmapTabs = document.querySelectorAll('.roadmap-tab-btn');
  const roadmapPanes = document.querySelectorAll('.roadmap-tab-pane');

  roadmapTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      // Update tab buttons
      roadmapTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update tab panes
      roadmapPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // Project Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage Active States
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter Logic
      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.classList.remove('hide');
          // Re-trigger animation
          card.classList.remove('in');
          void card.offsetWidth; // Trigger DOM reflow
          card.classList.add('in');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // Draggable Testimonials
  const testimonialsTrack = document.getElementById('testimonials-track');
  if (testimonialsTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialsTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      testimonialsTrack.classList.add('grabbing');
      startX = e.pageX - testimonialsTrack.offsetLeft;
      scrollLeft = testimonialsTrack.scrollLeft;
    });

    testimonialsTrack.addEventListener('mouseleave', () => {
      isDown = false;
      testimonialsTrack.classList.remove('grabbing');
    });

    testimonialsTrack.addEventListener('mouseup', () => {
      isDown = false;
      testimonialsTrack.classList.remove('grabbing');
    });

    testimonialsTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - testimonialsTrack.offsetLeft;
      const walk = (x - startX) * 2; // The multiplier makes it feel faster
      testimonialsTrack.scrollLeft = scrollLeft - walk;
    });
  }


  // Horizontal Scroll for Testimonials
  const testSec = document.querySelector('.testimonials-sec');
  const testTrack = document.getElementById('testimonials-track');

  if (testSec && testTrack) {
    window.addEventListener('scroll', () => {
      // Disable scroll pinning on mobile devices where swiping is preferred
      if (window.innerWidth <= 768) {
        testTrack.style.transform = 'none';
        return;
      }
      
      const rect = testSec.getBoundingClientRect();
      const scrollMax = rect.height - window.innerHeight;
      
      let scrollProgress = -rect.top / scrollMax;
      scrollProgress = Math.max(0, Math.min(scrollProgress, 1));
      
      // Calculate how far to scroll based on the track's width
      const maxTranslate = testTrack.scrollWidth - window.innerWidth + (window.innerWidth * 0.05);
      
      if (window.innerWidth > 768) {
        testTrack.style.transform = `translateX(${-scrollProgress * maxTranslate}px)`;
      }
    }, { passive: true });
    
    // Reset transform smoothly on window resize if breakpoint is hit
    window.addEventListener('resize', () => {
       if (window.innerWidth <= 768) testTrack.style.transform = 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll reveal functionality ---
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{threshold:0.15, rootMargin:"0px 0px -10% 0px"});
    // Updated to include .reveal-right
    document.querySelectorAll('.reveal, .reveal-wave, .reveal-right').forEach(el=>io.observe(el));

    // --- Navbar Scroll Color Change ---
    const heroSection = document.querySelector('.hero');
    if (heroSection) { // Only run this logic on the homepage
      const nav = document.querySelector('.nav');
      const lightSections = document.querySelectorAll('#about, #tech, #projects, #roadmap, #services, #faq, #cta');
      const darkSections = document.querySelectorAll('.hero, #testimonials');

      const navObserverOptions = {
          rootMargin: '-10% 0px -90% 0px',
          threshold: 0,
      };

      const navObserver = new IntersectionObserver((entries) => {
          let isOnLightSection = false;
          entries.forEach(entry => {
              if (entry.isIntersecting && entry.target.closest('.light-bg')) {
                  isOnLightSection = true;
              }
          });
          nav.classList.toggle('scrolled', isOnLightSection);
      }, navObserverOptions);

      lightSections.forEach(section => { section.classList.add('light-bg'); navObserver.observe(section); });
      darkSections.forEach(section => navObserver.observe(section));
    }

    // --- Cookie Banner Logic ---
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const declineBtn = document.getElementById('cookie-decline-btn');

    if (banner && acceptBtn && declineBtn) {
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

    // --- Mobile Radial Menu ---
    const uiverseMenu = document.getElementById('radial-menu');
    const uiverseToggle = document.getElementById('radial-menu-toggle');
    const uiverseLinks = document.querySelectorAll('.uiverse-menu-item');

    if (uiverseMenu && uiverseToggle) {
      const toggleRadialMenu = () => {
        uiverseMenu.classList.toggle('open');
      };
      uiverseToggle.addEventListener('click', toggleRadialMenu);
      // Close menu when a link is clicked
      uiverseLinks.forEach(link => link.addEventListener('click', toggleRadialMenu));
    }

    // --- Hide Radial Menu on Footer Scroll ---
    const footer = document.querySelector('.footer');
    if (footer && uiverseMenu) {
      const footerObserverOptions = {
        rootMargin: '0px',
        threshold: 0.1, // 10% of the footer is visible
      };

      const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            uiverseMenu.classList.add('hidden');
          } else {
            uiverseMenu.classList.remove('hidden');
          }
        });
      }, footerObserverOptions);

      footerObserver.observe(footer);
    }

    // --- Services Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if(accordionItems.length > 0) {
      accordionItems.forEach(item => {
          // Trigger opening on hover over the entire item
          item.addEventListener('mouseenter', () => {
              accordionItems.forEach(other => other.classList.remove('active'));
              item.classList.add('active');
          });
          
          // Trigger closing on mouse leave
          item.addEventListener('mouseleave', () => {
              item.classList.remove('active');
          });
      });
    }

    // --- Process Timeline Animation Replay ---
    document.querySelectorAll('.process-title').forEach(title => {
      title.addEventListener('click', () => {
        const section = title.closest('.process-section');
        if (!section) return;

        const nodes = section.querySelectorAll('.node');
        const path = section.querySelector('.wavy-line path');
        
        path.style.animation = 'none';
        nodes.forEach(node => node.style.animation = 'none');
        
        void path.offsetWidth; // Trigger reflow
        
        path.style.animation = 'drawLine 2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        nodes.forEach((node, index) => { node.style.animation = `popIn 0.5s ease ${0.4 + (index * 0.3)}s forwards`; });
      });
    });

    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      const successMessageContainer = document.getElementById('success-message');
      const sendAnotherBtn = document.getElementById('send-another-btn');
      // Set the secure FormSubmit endpoint URL
      contactForm.setAttribute('action', 'https://formsubmit.co/el/wikisa');

      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('.btn-submit');
        const statusMessage = form.querySelector('.form-status');
        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        statusMessage.textContent = '';

        // --- Validation Rules ---
        const name = form.querySelector('#name');
        if (name.value.trim().length < 2) {
          isValid = false;
          showError(name, 'Please enter your full name.');
        }

        const email = form.querySelector('#email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
          isValid = false;
          showError(email, 'Please enter a valid email address.');
        }

        const subject = form.querySelector('#subject');
        if (subject.value.trim() === '') {
          isValid = false;
          showError(subject, 'Please enter a subject.');
        }

        const message = form.querySelector('#message');
        if (message.value.trim().length < 10) {
          isValid = false;
          showError(message, 'Message must be at least 10 characters long.');
        }

        // --- Submission ---
        if (isValid) {
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';

          const formData = new FormData(form);

          fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          }).then(response => {
            if (response.ok) {
              contactForm.style.display = 'none';
              successMessageContainer.style.display = 'block';
            } else {
              return response.json().then(data => {
                throw new Error(data.message || 'Something went wrong.');
              });
            }
          }).catch(error => {
            statusMessage.textContent = `An error occurred: ${error.message}`;
            statusMessage.style.color = '#ef4444';
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
          });

        } else {
          statusMessage.textContent = 'Please correct the errors above.';
          statusMessage.style.color = '#ef4444';
        }
      });

      function showError(inputElement, message) {
        const errorElement = inputElement.nextElementSibling;
        inputElement.classList.add('invalid');
        errorElement.textContent = message;
      }

      if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', () => {
          successMessageContainer.style.display = 'none';
          contactForm.style.display = 'flex';
          contactForm.reset();
          contactForm.querySelector('.btn-submit').disabled = false;
          contactForm.querySelector('.btn-submit').textContent = 'Send Message';
        });
      }
    }

    // --- Lazy Loading Images ---
    const lazyImages = document.querySelectorAll('img.lazy');

    if ("IntersectionObserver" in window) {
      const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.add('loaded');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });

      lazyImages.forEach(lazyImage => {
        lazyImageObserver.observe(lazyImage);
      });
    }

  });