/**
 * st4ck Landing Page - Main JavaScript
 * Handles scroll animations, counters, and interactions
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounterAnimations();
  initMobileMenu();
  initSmoothScrolling();
  initStackAnimation();
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
        // Optionally unobserve after revealing
        // observer.unobserve(entry.target);
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
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function for smooth animation
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
  const menuButton = document.getElementById('mobile-menu-button');
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

      // Skip if it's just "#"
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
 * Adds interactive hover effects to the stack layers
 */
function initStackAnimation() {
  const stackLayers = document.querySelectorAll('.stack-layer');

  stackLayers.forEach((layer, index) => {
    // Add staggered entrance animation
    layer.style.animationDelay = `${index * 0.1}s`;

    // Enhanced hover interaction
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
 * Waitlist Form Handling
 * Note: This is a placeholder - replace with actual form submission
 */
function initWaitlistForm() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const submitButton = form.querySelector('button[type="submit"]');

      if (!emailInput || !submitButton) return;

      const email = emailInput.value;
      const originalText = submitButton.textContent;

      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Joining...';

      try {
        // TODO: Replace with actual API endpoint
        // await fetch('/api/waitlist', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email })
        // });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success
        submitButton.textContent = 'You\'re on the list! ✓';
        submitButton.classList.add('bg-green-500');
        emailInput.value = '';

        // Reset after delay
        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.classList.remove('bg-green-500');
          submitButton.disabled = false;
        }, 3000);

      } catch (error) {
        // Show error
        submitButton.textContent = 'Error - Try again';
        submitButton.classList.add('bg-red-500');

        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.classList.remove('bg-red-500');
          submitButton.disabled = false;
        }, 3000);
      }
    });
  });
}

/**
 * Navbar scroll effect
 * Adds background blur when scrolled
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

// Initialize navbar scroll effect
initNavbarScroll();
