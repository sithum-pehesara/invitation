/* =========================================================
   WEDDING INVITATION — app.js
   ========================================================= */

'use strict';

// ══════════════════════════════════════════════
// 1. LOADER
// ══════════════════════════════════════════════
(function initLoader() {
  const loader    = document.getElementById('loader');
  const bar       = document.getElementById('loader-bar');
  const particles = document.getElementById('particles');
  const main      = document.getElementById('main-content');

  // Spawn floating particles
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 6 + 4}s;
      animation-delay: ${Math.random() * 4}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    particles.appendChild(p);
  }

  // Progress bar animation
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('fade-out');
        main.classList.remove('hidden');
        setTimeout(() => {
          loader.style.display = 'none';
          initFallingPetals();
          initScrollReveal();
        }, 850);
      }, 400);
    }
    bar.style.width = progress + '%';
  }, 60);
})();

// ══════════════════════════════════════════════
// 2. FALLING PETALS (hero section)
// ══════════════════════════════════════════════
function initFallingPetals() {
  const container = document.getElementById('falling-petals');
  const emojis    = ['🌸', '🌺', '✿', '❀', '🌷'];

  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.className = 'fall-petal';
    petal.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * .8 + .7}rem;
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.2};
    `;
    container.appendChild(petal);
  }
}

// ══════════════════════════════════════════════
// 3. SCROLL REVEAL
// ══════════════════════════════════════════════
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════
// 4. COUNTDOWN TIMER
// ══════════════════════════════════════════════
(function initCountdown() {
  // *** WEDDING DATE — change here if needed ***
  const WEDDING_DATE = new Date('2027-01-27T16:00:00');

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-minutes');
  const elSecs  = document.getElementById('cd-seconds');
  const elMsg   = document.getElementById('cd-message');

  function pad(n)  { return String(n).padStart(2, '0'); }

  function setVal(el, val) {
    const str = pad(val);
    if (el.textContent !== str) {
      el.textContent = str;
      el.classList.remove('flip');
      void el.offsetWidth; // reflow
      el.classList.add('flip');
    }
  }

  function tick() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      elDays.textContent = elHours.textContent
        = elMins.textContent = elSecs.textContent = '00';
      if (elMsg) {
        elMsg.classList.remove('hidden');
        document.getElementById('countdown-grid').classList.add('hidden');
      }
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    setVal(elDays,  days);
    setVal(elHours, hours);
    setVal(elMins,  mins);
    setVal(elSecs,  secs);
  }

  tick();
  setInterval(tick, 1000);
})();

// ══════════════════════════════════════════════
// 5. RSVP FORM
// ══════════════════════════════════════════════
(function initRSVP() {
  const form    = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');
  const msg     = document.getElementById('rsvp-success-msg');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name      = document.getElementById('guest-name').value.trim();
    const email     = document.getElementById('guest-email').value.trim();
    const attending = form.querySelector('input[name="attending"]:checked');

    // Basic validation
    if (!name)      { shakeField('guest-name');  return; }
    if (!email || !email.includes('@')) { shakeField('guest-email'); return; }
    if (!attending) {
      const opts = document.querySelector('.attend-options');
      opts.style.animation = 'none';
      void opts.offsetWidth;
      opts.style.animation = 'shake .4s ease';
      return;
    }

    const isYes = attending.value === 'yes';
    const fname = name.split(' ')[0];

    // Show success state
    if (msg) {
      msg.textContent = isYes
        ? `🎉 Wonderful, ${fname}! We're so excited to have you join us on January 27, 2027. See you there!`
        : `We're sorry you can't make it, ${fname}. We'll miss you and will be thinking of you! 💕`;
    }

    form.classList.add('hidden');
    success.classList.remove('hidden');

    // Confetti burst
    launchConfetti();
  });

  function shakeField(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'shake .4s ease';
    el.focus();
  }
})();

// ══════════════════════════════════════════════
// 6. CONFETTI (on RSVP submit)
// ══════════════════════════════════════════════
function launchConfetti() {
  const colors = ['#c9a96e', '#e8d5a3', '#d4826a', '#f7e6e0', '#ffffff', '#a07840'];
  const count  = 80;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed;
      top: 50%; left: 50%;
      width: ${Math.random() * 10 + 4}px;
      height: ${Math.random() * 10 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > .5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9998;
      animation: confetti-fly ${Math.random() * 2 + 1.5}s ease-out forwards;
      --tx: ${(Math.random() - .5) * 600}px;
      --ty: ${(Math.random() - 1) * 500}px;
      --rot: ${Math.random() * 720 - 360}deg;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  // Inject keyframes once
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confetti-fly {
        0%   { transform: translate(0,0) rotate(0deg); opacity:1; }
        100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity:0; }
      }
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        20%,60% { transform: translateX(-8px); }
        40%,80% { transform: translateX(8px); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ══════════════════════════════════════════════
// 7. SMOOTH SCROLL for hero button
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('hero-scroll-btn');
  if (btn) {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById('countdown');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// ══════════════════════════════════════════════
// 8. THANK YOU — Floating hearts on scroll
// ══════════════════════════════════════════════
(function initThankYouHearts() {
  const section = document.getElementById('thankyou');
  const container = document.getElementById('ty-hearts-bg');
  if (!section || !container) return;

  let spawned = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !spawned) {
        spawned = true;
        spawnHearts();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(section);

  function spawnHearts() {
    const emojis = ['♥', '❤', '🌸', '✿', '❀'];
    for (let i = 0; i < 20; i++) {
      const h = document.createElement('span');
      h.className = 'ty-float-heart';
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.cssText = `
        left: ${Math.random() * 100}%;
        font-size: ${Math.random() * .8 + .7}rem;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 6}s;
      `;
      container.appendChild(h);
    }
  }
})();

// ══════════════════════════════════════════════
// 9. SHARE functions
// ══════════════════════════════════════════════
function shareInvite(platform) {
  const url  = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('You are invited to our wedding! 💍 Kavya & Arjun — January 27, 2027');

  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  }
}

function copyLink() {
  const url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(showCopied);
  } else {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCopied();
  }
}

function showCopied() {
  const el = document.getElementById('ty-copied');
  if (!el) return;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}
