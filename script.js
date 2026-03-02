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
});
