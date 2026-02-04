/**
 * st4ck Landing Page - Main JavaScript
 * Handles scroll animations, counters, multi-step form, and interactions
 */

// Waitlist API endpoint
const WAITLIST_API = 'https://sxlmasltyghxyypnoqsg.supabase.co/functions/v1/waitlist';

// Current form step
let currentStep = 1;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounterAnimations();
  initMobileMenu();
  initSmoothScrolling();
  initStackAnimation();
  initNavbarScroll();
});

/**
 * Scroll Reveal Animation
 * Uses Intersection Observer to animate elements as they enter viewport
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Counter Animation
 * Animates numbers counting up when they enter viewport
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');

  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.counter, 10);
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const current = Math.round(target * easeOutQuart);

          counter.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(counter);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => observer.observe(counter));
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuButton = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuButton || !mobileMenu) return;

  menuButton.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');

    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      menuButton.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navHeight = document.querySelector('nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Stack Visual Animation Enhancement
 */
function initStackAnimation() {
  const stackLayers = document.querySelectorAll('.stack-layer');

  stackLayers.forEach((layer, index) => {
    layer.style.animationDelay = `${index * 0.1}s`;

    layer.addEventListener('mouseenter', () => {
      stackLayers.forEach((l, i) => {
        if (i !== index) {
          l.style.opacity = '0.6';
          l.style.transform = 'rotateX(10deg) scale(0.98)';
        }
      });
    });

    layer.addEventListener('mouseleave', () => {
      stackLayers.forEach(l => {
        l.style.opacity = '1';
        l.style.transform = '';
      });
    });
  });
}

/**
 * Navbar scroll effect
 */
function initNavbarScroll() {
  const nav = document.querySelector('nav');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/**
 * Multi-step Waitlist Form Functions
 */

function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(s => s.classList.add('hidden'));

  // Show current step
  const stepEl = document.getElementById(`step-${step}`);
  if (stepEl) {
    stepEl.classList.remove('hidden');
  }

  // Update progress indicators
  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById(`step-${i}-indicator`);
    if (indicator) {
      if (i <= step) {
        indicator.classList.remove('bg-white/20');
        indicator.classList.add('bg-layer-design');
      } else {
        indicator.classList.remove('bg-layer-design');
        indicator.classList.add('bg-white/20');
      }
    }
  }

  currentStep = step;
}

function nextStep(fromStep) {
  // Validate current step
  if (fromStep === 1) {
    const email = document.getElementById('waitlist-email').value;
    if (!email || !email.includes('@')) {
      document.getElementById('waitlist-email').classList.add('border-layer-ship');
      setTimeout(() => {
        document.getElementById('waitlist-email').classList.remove('border-layer-ship');
      }, 2000);
      return;
    }
  }

  if (fromStep === 2) {
    const role = document.getElementById('waitlist-role').value;
    const companySize = document.getElementById('waitlist-company-size').value;
    const painPoint = document.getElementById('waitlist-pain-point').value;

    // All fields are optional but encourage filling them
    // Just proceed to next step
  }

  showStep(fromStep + 1);
}

function prevStep(fromStep) {
  showStep(fromStep - 1);
}

async function submitWaitlist() {
  const submitBtn = document.getElementById('submit-btn');
  const originalText = submitBtn.textContent;

  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  // Gather form data
  const email = document.getElementById('waitlist-email').value;
  const role = document.getElementById('waitlist-role').value;
  const companySize = document.getElementById('waitlist-company-size').value;
  const painPoint = document.getElementById('waitlist-pain-point').value;
  const excitement = document.getElementById('waitlist-excitement').value;

  // Get selected tools
  const toolCheckboxes = document.querySelectorAll('input[name="tools"]:checked');
  const currentTools = Array.from(toolCheckboxes).map(cb => cb.value);

  // Get UTM params from URL if present
  const urlParams = new URLSearchParams(window.location.search);

  const data = {
    email,
    role: role || null,
    company_size: companySize || null,
    pain_point: painPoint || null,
    current_tools: currentTools,
    excitement_reason: excitement || null,
    source: 'landing_page',
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    referrer: document.referrer || null
  };

  try {
    const response = await fetch(WAITLIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      // Show success state
      showStep('success');
    } else {
      throw new Error(result.error || 'Failed to join waitlist');
    }
  } catch (error) {
    console.error('Waitlist error:', error);
    document.getElementById('error-message').textContent = error.message || 'Please try again later.';
    showStep('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function resetForm() {
  // Reset all form fields
  document.getElementById('waitlist-email').value = '';
  document.getElementById('waitlist-role').value = '';
  document.getElementById('waitlist-company-size').value = '';
  document.getElementById('waitlist-pain-point').value = '';
  document.getElementById('waitlist-excitement').value = '';
  document.querySelectorAll('input[name="tools"]').forEach(cb => cb.checked = false);

  // Go back to step 1
  showStep(1);
}

// Make functions globally available
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitWaitlist = submitWaitlist;
window.resetForm = resetForm;
