// ============================================================
// CWORKS — Unified JS (main page + service pages)
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // 1. STICKY NAVBAR
  // ----------------------------------------------------------
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }


  // ----------------------------------------------------------
  // 2. MOBILE MENU
  // ----------------------------------------------------------
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ----------------------------------------------------------
  // 3. TYPING ANIMATION
  // ----------------------------------------------------------
  const typingPhrases = [
    'Code Works.',
    'Creative Work.',
    'Smart Solutions.',
    'Real Results.',
    'Clean Code.',
    'Websites that Work.',
  ];

  // Service page phrases (keyed by page path)
  const serviceTypingPhrases = {
    'web-development': [
      'We build clean, fast websites.',
      'From blank page to live site.',
      'Design. Code. Deploy.',
      'Responsive by default.',
    ],
    'ui-ux-design': [
      'Interfaces that feel right.',
      'Design with the user in mind.',
      'From wireframe to final pixel.',
      'Intuitive. Beautiful. Functional.',
    ],
    'graphic-design': [
      'Visuals that tell your story.',
      'Logos that last.',
      'Bold identity design.',
      'From screen to print.',
    ],
    'database-management': [
      'Your data, structured right.',
      'Fast queries. Reliable storage.',
      'Built to scale with you.',
      'MySQL. PHP. Python.',
    ],
    'system-building': [
      'Systems built to your spec.',
      'Inventory. Booking. Tools.',
      'Custom software solutions.',
      'From idea to running system.',
    ],
  };

  const typingTarget = document.getElementById('typing-text');
  const typingCursor = document.querySelector('.typing-cursor');

  if (typingTarget) {
    // Detect which page we're on
    const pagePath = window.location.pathname;
    let phrases = typingPhrases;
    for (const key in serviceTypingPhrases) {
      if (pagePath.includes(key)) {
        phrases = serviceTypingPhrases[key];
        break;
      }
    }

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    function type() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        typingTarget.textContent = current.slice(0, charIndex - 1);
        charIndex--;
      } else {
        typingTarget.textContent = current.slice(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 35 : 72;

      if (!isDeleting && charIndex === current.length) {
        delay      = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay       = 350;
      }

      setTimeout(type, delay);
    }

    type();
  }


  // ----------------------------------------------------------
  // 4. SCROLL REVEAL
  // ----------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('visible'); });
  }


  // ----------------------------------------------------------
  // 5. ACTIVE NAV LINK (main page only — section-based)
  // ----------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) { link.classList.remove('active'); });
          const active = document.querySelector(
            '.nav-links a[href="#' + entry.target.id + '"]'
          );
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }


  // ----------------------------------------------------------
  // 6. SERVICE PAGE — active nav on scroll
  // ----------------------------------------------------------
  if (window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html')) {
    const pageSections = document.querySelectorAll('section[id]');
    const pageNavLinks = document.querySelectorAll('.nav-links .nav-link');
    if (pageSections.length && pageNavLinks.length) {
      const pageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            pageNavLinks.forEach(function (l) { l.classList.remove('active'); });
            const match = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
            if (match) match.classList.add('active');
          }
        });
      }, { threshold: 0.3 });
      pageSections.forEach(function (s) { pageObserver.observe(s); });
    }
  }


  // ----------------------------------------------------------
  // 7. BUTTON MICRO-INTERACTIONS — ripple effect
  // ----------------------------------------------------------
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-submit').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const rect  = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-anim 0.5s ease-out forwards;
        pointer-events: none;
      `;
      // Ensure button has position relative
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  });

  // Inject ripple keyframe if not present
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = '@keyframes ripple-anim { to { transform: scale(2.5); opacity: 0; } }';
    document.head.appendChild(style);
  }


  // ----------------------------------------------------------
  // 8. CARD TILT EFFECT (subtle)
  // ----------------------------------------------------------
  document.querySelectorAll('.service-card, .project-card, .pricing-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect  = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

}); // end DOMContentLoaded


// ----------------------------------------------------------
// CONTACT FORM — Web3Forms + Discord webhook
// ----------------------------------------------------------
(function () {
  const form      = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn  = document.getElementById('form-submit');
  const feedback   = document.getElementById('form-feedback');
  const nameInput  = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const nameError  = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');

  function validateName() {
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      nameInput.classList.add('input-error');
      return false;
    }
    nameError.textContent = '';
    nameInput.classList.remove('input-error');
    return true;
  }
  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      emailError.textContent = 'Please enter your email.';
      emailInput.classList.add('input-error');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      emailError.textContent = 'Please enter a valid email.';
      emailInput.classList.add('input-error');
      return false;
    }
    emailError.textContent = '';
    emailInput.classList.remove('input-error');
    return true;
  }
  function validatePhone() {
    if (!phoneInput || !phoneInput.value.trim()) {
      if (phoneError) phoneError.textContent = 'Please enter your phone number.';
      if (phoneInput) phoneInput.classList.add('input-error');
      return false;
    }
    if (phoneError) phoneError.textContent = '';
    if (phoneInput) phoneInput.classList.remove('input-error');
    return true;
  }

  if (nameInput)  nameInput.addEventListener('input',  validateName);
  if (emailInput) emailInput.addEventListener('input', validateEmail);
  if (phoneInput) phoneInput.addEventListener('input', validatePhone);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const phoneOk = phoneInput ? validatePhone() : true;
    if (!validateName() | !validateEmail() | !phoneOk) return;

    const originalHTML   = submitBtn.innerHTML;
    submitBtn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled   = true;
    feedback.hidden      = true;
    feedback.className   = 'form-feedback';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data     = await response.json();

      if (response.ok) {
        const name    = nameInput.value.trim();
        const email   = emailInput.value.trim();
        const phone   = phoneInput ? phoneInput.value.trim() : 'N/A';
        const msgEl   = form.querySelector('textarea');
        const message = msgEl ? msgEl.value.trim() : 'N/A';

        await fetch('https://discord.com/api/webhooks/1493186929200730232/FEOmFACU4P64xHDYXEieG20kWcHU306K0qlwxspmWnumiJg9VmjxMMXC1oc7inaJst_7', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username:   'Cworks Website',
            embeds: [{
              title:  '📬 New Contact Form Submission',
              color:  0x415a77,
              fields: [
                { name: '👤 Name',    value: name,    inline: true },
                { name: '📧 Email',   value: email,   inline: true },
                { name: '📞 Phone',   value: phone,   inline: true },
                { name: '💬 Message', value: message, inline: false }
              ],
              footer:    { text: 'Sent from Cworks website' },
              timestamp: new Date().toISOString()
            }]
          })
        });

        feedback.textContent = '✓ Message sent! We\'ll get back to you soon.';
        feedback.classList.add('form-feedback--success');
        feedback.hidden = false;
        form.reset();
        if (nameError)  nameError.textContent  = '';
        if (emailError) emailError.textContent = '';
        if (phoneError) phoneError.textContent = '';
      } else {
        feedback.textContent = '✗ ' + (data.message || 'Something went wrong. Please try again.');
        feedback.classList.add('form-feedback--error');
        feedback.hidden = false;
      }
    } catch {
      feedback.textContent = '✗ Network error. Please check your connection.';
      feedback.classList.add('form-feedback--error');
      feedback.hidden = false;
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled  = false;
    }
  });
})();
