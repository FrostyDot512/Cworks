// ============================================================
// CWORKS — Premium Agency JS v2
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // 1. CUSTOM CURSOR
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (cursor && follower && window.innerWidth > 768) {
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    }, { passive: true });
    (function loop() {
      fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
      requestAnimationFrame(loop);
    })();
  }

  // 2. HERO MOUSE GLOW
  const heroGlow = document.getElementById('heroGlow');
  const heroEl   = document.querySelector('.hero');
  if (heroGlow && heroEl) {
    heroEl.addEventListener('mousemove', function (e) {
      const r = heroEl.getBoundingClientRect();
      heroGlow.style.left = (e.clientX - r.left) + 'px';
      heroGlow.style.top  = (e.clientY - r.top)  + 'px';
    }, { passive: true });
  }

  // 3. SERVICE CARD SPOTLIGHT
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width)  * 100;
      const y = ((e.clientY - r.top)  / r.height) * 100;
      const bg = card.querySelector('.service-hover-bg');
      if (bg) bg.style.background =
        'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(224,122,95,.07) 0%, transparent 60%)';
    });
  });

  // 4. MAGNETIC BUTTONS
  document.querySelectorAll('.mag-btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.22;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.22;
      btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translateY(-1px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });

  // 5. STICKY NAVBAR
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // 6. MOBILE MENU
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('.nav-link').forEach(function (l) {
      l.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 7. SCROLL REVEAL
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed', 'visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });
    document.querySelectorAll('[data-reveal], .reveal').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal], .reveal').forEach(function (el) {
      el.classList.add('revealed', 'visible');
    });
  }

  // 8. ANIMATED COUNTERS
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if ('IntersectionObserver' in window && statNums.length) {
    const cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const t0 = performance.now();
        const dur = 1400;
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * e);
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { cObs.observe(el); });
  }

  // 9. ACTIVE NAV LINK
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  if (sections.length && navLinks.length) {
    const sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          const m = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
          if (m) m.classList.add('active');
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(function (s) { sObs.observe(s); });
  }

  // 10. CARD TILT
  document.querySelectorAll('.why-card, .team-card, .stat-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = 'translateY(-4px) rotateX(' + (-y*4) + 'deg) rotateY(' + (x*4) + 'deg)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

  // 11. RIPPLE
  document.querySelectorAll('.btn-primary,.btn-secondary,.btn-ghost,.btn-submit').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(r.width, r.height);
      ripple.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;'
        + 'left:' + (e.clientX - r.left - size/2) + 'px;top:' + (e.clientY - r.top - size/2) + 'px;'
        + 'background:rgba(255,255,255,.16);border-radius:50%;transform:scale(0);'
        + 'animation:ripple-anim .5s ease-out forwards;pointer-events:none;';
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  });
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes ripple-anim{to{transform:scale(2.5);opacity:0;}}';
    document.head.appendChild(s);
  }

}); // end DOMContentLoaded


// ----------------------------------------------------------
// CONTACT FORM — Web3Forms + Discord webhook
// ----------------------------------------------------------
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn  = document.getElementById('form-submit');
  const feedback   = document.getElementById('form-feedback');
  const nameInput  = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const tierInput  = document.getElementById('contact-tier');
  const nameError  = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const tierError  = document.getElementById('tier-error');

  function val(input, errEl, check, msg) {
    if (!input) return true;
    const ok = check(input.value.trim());
    if (errEl) errEl.textContent = ok ? '' : msg;
    input.classList.toggle('input-error', !ok);
    return ok;
  }

  const vName  = function() { return val(nameInput,  nameError,  function(v){ return v.length > 0; }, 'Please enter your name.'); };
  const vEmail = function() { return val(emailInput, emailError, function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Please enter a valid email.'); };
  const vPhone = function() { return val(phoneInput, phoneError, function(v){ return v.length > 0; }, 'Please enter your phone number.'); };
  const vTier  = function() { return val(tierInput,  tierError,  function(v){ return v.length > 0; }, 'Please select a service tier.'); };

  if (nameInput)  nameInput.addEventListener('input',  vName);
  if (emailInput) emailInput.addEventListener('input', vEmail);
  if (phoneInput) phoneInput.addEventListener('input', vPhone);
  if (tierInput)  tierInput.addEventListener('change', vTier);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const hasTier = !!tierInput;
    const ok = (vName() & vEmail() & vPhone() & (!hasTier || vTier()));
    if (!ok) return;

    const origHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    submitBtn.disabled  = true;
    feedback.hidden     = true;
    feedback.className  = 'form-feedback';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
      const data = await res.json();

      if (res.ok) {
        const name    = nameInput  ? nameInput.value.trim()  : 'N/A';
        const email   = emailInput ? emailInput.value.trim() : 'N/A';
        const phone   = phoneInput ? phoneInput.value.trim() : 'N/A';
        const tier    = tierInput  ? tierInput.value         : '';
        const msgEl   = form.querySelector('textarea');
        const message = msgEl ? msgEl.value.trim() : 'N/A';

        const fields = [
          { name: '👤 Name',    value: name,  inline: true },
          { name: '📧 Email',   value: email, inline: true },
          { name: '📞 Phone',   value: phone, inline: true }
        ];
        if (tier) fields.push({ name: '📦 Tier', value: tier, inline: false });
        fields.push({ name: '💬 Message', value: message || '—', inline: false });

        await fetch(
          'https://discord.com/api/webhooks/1493186929200730232/FEOmFACU4P64xHDYXEieG20kWcHU306K0qlwxspmWnumiJg9VmjxMMXC1oc7inaJst_7',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'CWORKS Website',
              embeds: [{
                title: '📬 New Enquiry — CWORKS', color: 0xe07a5f, fields,
                footer: { text: 'Sent from CWORKS website' }, timestamp: new Date().toISOString()
              }]
            })
          }
        );

        feedback.textContent = '✓ Message sent! We\'ll get back to you within 24 hours.';
        feedback.classList.add('form-feedback--success');
        feedback.hidden = false;
        form.reset();
        [nameError, emailError, phoneError, tierError].forEach(function(el){ if (el) el.textContent = ''; });
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
      submitBtn.innerHTML = origHTML;
      submitBtn.disabled  = false;
    }
  });
})();
