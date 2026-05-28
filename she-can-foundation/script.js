/**
 * She Can Foundation - Interactive Web Scripts
 * Authorship: Antigravity AI
 * Design Features: Interactive panels, micro-animations, statistics counts, multi-step validations.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Navigation Scroll Effect & Active Links
  // ==========================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Scroll header background transition
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });


  // ==========================================
  // 2. Mobile Responsive Menu
  // ==========================================
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }


  // ==========================================
  // 3. Scroll Reveal System (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ==========================================
  // 4. Interactive Statistics Counter
  // ==========================================
  const counterElements = document.querySelectorAll('.counter');
  let countTriggered = false;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // Animation duration in ms
    const stepTime = Math.max(Math.floor(duration / target), 10);
    let currentVal = 0;

    const timer = setInterval(() => {
      currentVal += Math.ceil(target / (duration / stepTime));
      if (currentVal >= target) {
        el.innerText = target.toLocaleString() + (el.innerText.includes('%') || el.innerText.includes('+') ? '' : getSuffix(target));
        clearInterval(timer);
      } else {
        el.innerText = currentVal.toLocaleString() + getSuffix(target);
      }
    }, stepTime);
  };

  const getSuffix = (target) => {
    if (target === 95) return '%';
    if (target === 5000) return '+';
    return '';
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countTriggered) {
        countTriggered = true;
        counterElements.forEach(counter => countUp(counter));
      }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }


  // ==========================================
  // 5. Interactive Tab Switcher (About Section)
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Deactivate current active tab
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Activate selected tab
      button.classList.add('active');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });


  // ==========================================
  // 6. Testimonials Carousel / Slider
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let currentSlide = 0;
  let carouselInterval;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };

  if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'), 10);
      showSlide(index);
      resetInterval();
    });
  });

  const startInterval = () => {
    carouselInterval = setInterval(nextSlide, 8000);
  };

  const resetInterval = () => {
    clearInterval(carouselInterval);
    startInterval();
  };

  if (slides.length > 0) {
    startInterval();
  }


  // ==========================================
  // 7. Interactive Multi-Step Registration Modal
  // ==========================================
  const modal = document.getElementById('join-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const step1 = document.querySelector('.form-step[data-step="1"]');
  const step2 = document.querySelector('.form-step[data-step="2"]');
  const successSection = document.getElementById('modal-success-section');
  const modalHeader = document.getElementById('modal-header-section');
  const modalBody = document.getElementById('modal-body-section');

  const roleCards = document.querySelectorAll('.role-card');
  const nextBtnStep1 = document.getElementById('btn-step1-next');
  const prevBtnStep2 = document.getElementById('btn-step2-prev');
  const joinUsForm = document.getElementById('join-us-form');
  const successCloseBtn = document.getElementById('btn-success-close');

  const labelMap = {
    volunteer: {
      title: "Tell us about your background",
      placeholder: "e.g., Coding, marketing, teaching skills, or available hours to help us..."
    },
    learner: {
      title: "What tech skills do you want to learn?",
      placeholder: "e.g., I want to study Web Development, Python Programming, Digital Marketing..."
    },
    donor: {
      title: "What program would you like to support?",
      placeholder: "e.g., Laptops distribution, software scholarships, general safe hubs..."
    }
  };

  let selectedRole = 'volunteer'; // Default

  // Open Modal logic
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll
      resetModalForm();
    });
  });

  // Close Modal logic
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto'; // Unlock scroll
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  // Close when clicking outside of the modal dialog
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Role Card Selection
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRole = card.getAttribute('data-role');

      // Dynamic updates to Step 2 input structures
      const messageLabel = document.getElementById('message-label');
      const messageInput = document.getElementById('user-msg');
      if (messageLabel && messageInput && labelMap[selectedRole]) {
        messageLabel.innerText = labelMap[selectedRole].title;
        messageInput.placeholder = labelMap[selectedRole].placeholder;
      }
    });
  });

  // Step Navigations
  if (nextBtnStep1) {
    nextBtnStep1.addEventListener('click', () => {
      step1.classList.remove('active');
      step2.classList.add('active');
    });
  }

  if (prevBtnStep2) {
    prevBtnStep2.addEventListener('click', () => {
      step2.classList.remove('active');
      step1.classList.add('active');
    });
  }

  // Submit Handler
  if (joinUsForm) {
    joinUsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Perform standard validation
      const name = document.getElementById('user-name').value;
      const email = document.getElementById('user-email').value;
      const msg = document.getElementById('user-msg').value;

      if (name.trim() === '' || email.trim() === '' || msg.trim() === '') {
        alert('Please fill out all fields before submitting.');
        return;
      }

      // Animate and switch UI to Success Section
      modalHeader.style.display = 'none';
      modalBody.style.display = 'none';

      const successMessage = document.getElementById('success-message');
      if (selectedRole === 'learner') {
        successMessage.innerText = `Congratulations ${name}! You are registered for our next Digital Cohort. An admissions officer will contact you at ${email} with details.`;
      } else if (selectedRole === 'donor') {
        successMessage.innerText = `Thank you, ${name}! Your request to support She Can has been received. Our partnerships coordinator will reach out to ${email} to finalize your contribution details.`;
      } else {
        successMessage.innerText = `Thank you for volunteering, ${name}! Our community directors will reach out to ${email} within 48 business hours with next steps.`;
      }

      successSection.style.display = 'block';
    });
  }

  // Reset Modal Form
  const resetModalForm = () => {
    if (joinUsForm) joinUsForm.reset();

    // Default steps
    step1.classList.add('active');
    step2.classList.remove('active');
    successSection.style.display = 'none';
    modalHeader.style.display = 'block';
    modalBody.style.display = 'block';

    // Default select state
    roleCards.forEach(c => c.classList.remove('selected'));
    const defaultRole = document.querySelector('.role-card[data-role="volunteer"]');
    if (defaultRole) defaultRole.classList.add('selected');
    selectedRole = 'volunteer';

    const messageLabel = document.getElementById('message-label');
    const messageInput = document.getElementById('user-msg');
    if (messageLabel && messageInput && labelMap['volunteer']) {
      messageLabel.innerText = labelMap['volunteer'].title;
      messageInput.placeholder = labelMap['volunteer'].placeholder;
    }
  };

});
