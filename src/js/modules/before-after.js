/**
 * Before/After Image Comparison Slider
 * Precision clinical comparison with Pointer Events, ARIA slider accessibility,
 * and gentle entrance micro-interaction.
 */

export function initBeforeAfter() {
  const comparisons = document.querySelectorAll('[data-before-after]');
  if (!comparisons.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  comparisons.forEach((container) => {
    const handle = container.querySelector('.before-after__handle');
    if (!handle) return;

    let dragging = false;
    let userInteracted = false;
    let animationFrameId = null;

    const setPosition = (percentage) => {
      const clamped = Math.max(0, Math.min(100, percentage));
      container.style.setProperty('--comparison-position', `${clamped}%`);
      handle.setAttribute('aria-valuenow', Math.round(clamped).toString());
    };

    const cancelTeaser = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const updateFromClientX = (clientX) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0) return;
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setPosition(percentage);
    };

    // Pointer events for mouse & touch
    container.addEventListener('pointerdown', (event) => {
      // Primary button or touch only
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      userInteracted = true;
      cancelTeaser();

      dragging = true;
      container.classList.add('is-dragging');

      try {
        container.setPointerCapture(event.pointerId);
      } catch {
        // Fallback for browsers with strict pointer capture constraints
      }

      updateFromClientX(event.clientX);
    });

    container.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      updateFromClientX(event.clientX);
    });

    const stopDragging = (event) => {
      if (!dragging) return;
      dragging = false;
      container.classList.remove('is-dragging');

      try {
        if (container.hasPointerCapture(event.pointerId)) {
          container.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore if pointer capture already released
      }
    };

    container.addEventListener('pointerup', stopDragging);
    container.addEventListener('pointercancel', stopDragging);

    // Keyboard accessibility
    handle.addEventListener('keydown', (event) => {
      let current = Number.parseFloat(handle.getAttribute('aria-valuenow')) || 50;
      const step = event.shiftKey ? 10 : 2;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          current -= step;
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          current += step;
          break;
        case 'Home':
          current = 0;
          break;
        case 'End':
          current = 100;
          break;
        default:
          return;
      }

      event.preventDefault();
      userInteracted = true;
      cancelTeaser();
      setPosition(current);
    });

    // Subtle entrance teaser animation (50% -> 44% -> 56% -> 50% in ~900ms)
    if (!prefersReducedMotion) {
      const runTeaser = () => {
        if (userInteracted) return;

        const startTime = performance.now();
        const duration = 900; // ms

        const animate = (now) => {
          if (userInteracted) return;

          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Smooth sine oscillation: sin(2 * PI * progress) decaying gently
          // Amplitude is ~6% (oscillation between 44% and 56%)
          const oscillation = Math.sin(progress * Math.PI * 2) * (1 - progress * 0.4);
          const currentPos = 50 + oscillation * 6;

          setPosition(currentPos);

          if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
          } else {
            setPosition(50);
            animationFrameId = null;
          }
        };

        animationFrameId = requestAnimationFrame(animate);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !userInteracted) {
              observer.unobserve(container);
              // Small delay for natural entrance feel
              setTimeout(runTeaser, 250);
            }
          });
        },
        { threshold: 0.35 }
      );

      observer.observe(container);
    }
  });
}
