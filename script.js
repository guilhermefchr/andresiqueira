document.addEventListener("DOMContentLoaded", () => {
    // FAQ Toggle Setup for Icon rotation
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");

        questionBtn.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Close all
            faqItems.forEach(faq => {
                faq.classList.remove("active");
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add("active");
                const answer = item.querySelector('.faq-answer');
                // Calculate height for smooth transition
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Premium Scroll Reveal Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to elements - Excused testimonials because infinite scroll handles itself
    const elementsToReveal = document.querySelectorAll(`
        .pain-header, .pain-list li, .pain-conclusion,
        .authority-image-wrapper, .authority-content > *,
        .section-header, .opportunity-card,
        .faq-item, .footer-cta
    `);

    elementsToReveal.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';

        let delay = 0;
        if (el.classList.contains('opportunity-card') || el.matches('.pain-list li')) {
            // Find its sibling index roughly
            let nodeIndex = Array.from(el.parentNode.children).indexOf(el);
            delay = nodeIndex * 0.15;
        }

        el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
        observer.observe(el);
    });

    // Infinite Draggable Slider Logic
    const track = document.querySelector('.testimonials-track');
    if (track) {
        let isDown = false;
        let startX;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationId;

        // Disable drag on links and images inside the slider
        track.querySelectorAll('img, a').forEach(el => el.addEventListener('dragstart', (e) => e.preventDefault()));

        const loop = () => {
            if (!isDown) {
                // Auto scrolling speed
                currentTranslate -= 0.5;
            }

            // Reached exactly half of the cloned elements length?
            const halfWidth = track.scrollWidth / 2;

            // Loop boundaries logic
            if (Math.abs(currentTranslate) >= halfWidth) {
                currentTranslate = 0;
                prevTranslate = 0;
            } else if (currentTranslate > 0) {
                currentTranslate = -halfWidth;
                prevTranslate = -halfWidth;
            }

            track.style.transform = `translateX(${currentTranslate}px)`;
            animationId = requestAnimationFrame(loop);
        };

        // Start Loop
        animationId = requestAnimationFrame(loop);

        // Mouse Events
        track.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX;
            cancelAnimationFrame(animationId);
            track.style.cursor = 'grabbing';
            track.style.userSelect = 'none'; // prevent text selection
        });

        track.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                track.style.cursor = 'grab';
                track.style.userSelect = 'auto';
                prevTranslate = currentTranslate;
                animationId = requestAnimationFrame(loop);
            }
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.cursor = 'grab';
            track.style.userSelect = 'auto';
            prevTranslate = currentTranslate;
            animationId = requestAnimationFrame(loop);
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = (x - startX) * 1.5; // Drag speed multiplier
            currentTranslate = prevTranslate + walk;
        });

        // Touch Events
        track.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX;
            cancelAnimationFrame(animationId);
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 1.5;
            currentTranslate = prevTranslate + walk;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            isDown = false;
            prevTranslate = currentTranslate;
            animationId = requestAnimationFrame(loop);
        });

        // Pause auto-scroll when hovered for readability
        track.parentElement.addEventListener('mouseenter', () => {
            if (!isDown) prevTranslate = currentTranslate;
        });
    }
});
