async function checkURL() {
    const url = document.getElementById("urlInput").value;

    if (!url) {
        alert("Please enter a URL");
        return;
    }

    const response = await fetch("http://127.0.0.1:5000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
    });

    const data = await response.json();
    document.getElementById("result").innerText = `Result: ${data.result}`;
} 

// --- Hard 3D Touch/Tilt (site-wide) ---
(function initHard3DTilt() {
    // Enable pointer-based 3D tilt globally
    const ENABLE_TILT = true;
    const selectorList = [
        '.container',
        '.feature-item',
        '.btn-primary',
        '.btn-secondary',
        '.nav-logo',
        '.nav-link',
        '.history-item',
        '.footer-card',
        '.contact-item',
        '.social-btn',
        '.app-badge',
        '.file-checker'
    ];

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function applyTiltFromEvent(target, event) {
        const rect = target.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const px = (x / rect.width) * 2 - 1; // -1..1
        const py = (y / rect.height) * 2 - 1; // -1..1

        // Hard tilt angles
        const maxTiltDeg = 22;
        const tiltX = clamp(-py * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
        const tiltY = clamp(px * maxTiltDeg, -maxTiltDeg, maxTiltDeg);

        // Shadow only (disable pointer-following glare highlight)
        const shadowX = clamp(-px * 28, -40, 40);
        const shadowY = clamp(py * 28 + 10, -10, 42);

        target.style.setProperty('--tiltX', tiltX + 'deg');
        target.style.setProperty('--tiltY', tiltY + 'deg');
        target.style.setProperty('--shadowX', shadowX + 'px');
        target.style.setProperty('--shadowY', shadowY + 'px');
    }

    function resetTilt(target) {
        target.style.setProperty('--tiltX', '0deg');
        target.style.setProperty('--tiltY', '0deg');
        target.style.setProperty('--tiltScale', '1');
        target.style.setProperty('--tiltDepth', '0px');
        target.style.setProperty('--shadowX', '0px');
        target.style.setProperty('--shadowY', '10px');
        target.style.setProperty('--shadowBlur', '30px');
        target.style.setProperty('--shadowAlpha', '0.15');
        target.style.setProperty('--glareAlpha', '0');
    }

    function bindTilt(el) {
        el.classList.add('tilt-3d');

        const onEnter = () => {
            el.classList.add('tilt-pop');
        };
        const onMove = (e) => {
            applyTiltFromEvent(el, e);
        };
        const onLeave = () => {
            el.classList.remove('tilt-pressing');
            resetTilt(el);
        };
        const onDown = (e) => {
            el.classList.add('tilt-pressing');
            applyTiltFromEvent(el, e);
        };
        const onUp = () => {
            el.classList.remove('tilt-pressing');
        };

        // Pointer events
        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointerup', onUp);

        // Touch fallbacks
        el.addEventListener('touchstart', (e) => { onDown(e); }, { passive: true });
        el.addEventListener('touchmove', (e) => { onMove(e); }, { passive: true });
        el.addEventListener('touchend', onUp, { passive: true });
        el.addEventListener('touchcancel', onLeave, { passive: true });
    }

    function init() {
        const unique = new Set();
        selectorList.forEach(sel => {
            document.querySelectorAll(sel).forEach(node => {
                if (!unique.has(node)) {
                    unique.add(node);
                    bindTilt(node);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Global page + scroll reveal animations
(function initAnimations() {
    // Mark page loaded for fade-in
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => document.body.classList.add('page-loaded'));
    } else {
        document.body.classList.add('page-loaded');
    }

    // Apply .reveal to common blocks
    const candidates = [
        '.container',
        '.feature-item',
        '.history-item',
        '.footer-col',
        '.file-section',
        '.check-form'
    ];
    candidates.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, idx) => {
            el.classList.add('reveal');
            el.style.setProperty('--reveal-delay', (idx * 60) + 'ms');
        });
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();