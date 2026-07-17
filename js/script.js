/**
 * =============================================
 *  VIP LOVE LETTER — Full Interactive Script
 *  Author : HackerAI
 *  Features: Envelope open/close, floating hearts,
 *            sparkle particles (canvas), smooth animations
 * =============================================
 */

(function () {
    'use strict';

    /* =============================================
       DOM REFERENCES
       ============================================= */
    const envelope  = document.getElementById('envelope');
    const resetBtn  = document.getElementById('resetBtn');
    const heartsBg  = document.getElementById('heartsBg');
    const canvas    = document.getElementById('sparkleCanvas');

    let isOpen = false;
    let sparkleAnimId = null;

    /* =============================================
       ENVELOPE OPEN / CLOSE
       ============================================= */
    function openEnvelope() {
        if (isOpen) return;
        envelope.classList.add('open');
        isOpen = true;

        // Show reset button with a small delay
        setTimeout(function () {
            resetBtn.style.display = 'inline-flex';
            // trigger enter animation
            resetBtn.style.opacity = '0';
            resetBtn.style.transform = 'translateY(10px)';
            requestAnimationFrame(function () {
                resetBtn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                resetBtn.style.opacity = '1';
                resetBtn.style.transform = 'translateY(0)';
            });
        }, 1300);
    }

    function closeEnvelope() {
        if (!isOpen) return;
        envelope.classList.remove('open');
        isOpen = false;

        // Hide reset button
        resetBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        resetBtn.style.opacity = '0';
        resetBtn.style.transform = 'translateY(10px)';
        setTimeout(function () {
            resetBtn.style.display = 'none';
        }, 350);
    }

    // --- Event listeners ---
    envelope.addEventListener('click', openEnvelope);
    resetBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeEnvelope();
    });

    /* =============================================
       FLOATING HEARTS GENERATOR
       ============================================= */
    var emojiHearts = ['💕', '💖', '💗', '💝', '💘', '❤️', '🌸', '✨'];
    var heartInterval = null;

    function spawnHeart() {
        var el = document.createElement('div');
        el.classList.add('floating-heart');
        el.textContent = emojiHearts[Math.floor(Math.random() * emojiHearts.length)];
        el.style.left = (Math.random() * 94 + 3) + '%';
        el.style.fontSize = (Math.random() * 1.4 + 1.2) + 'rem';
        el.style.animationDuration = (Math.random() * 5 + 7) + 's';
        el.style.color = ['#ff4d6d', '#c9184a', '#ff8fa3', '#d6336c', '#f06595'][Math.floor(Math.random() * 5)];
        heartsBg.appendChild(el);

        // Remove after animation ends
        setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 13000);
    }

    function startHeartGenerator() {
        if (heartInterval) return;
        // Spawn a few immediately
        for (var i = 0; i < 8; i++) {
            setTimeout(spawnHeart, i * 180);
        }
        heartInterval = setInterval(spawnHeart, 500);
    }

    /* =============================================
       SPARKLE / PARTICLE CANVAS
       ============================================= */
    var ctx = null;
    var particles = [];
    var PARTICLE_COUNT = 60;
    var mouseX = -9999;
    var mouseY = -9999;
    var lastMove = 0;

    function initCanvas() {
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Create particles
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3.5 + 1.5,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4 - 0.15,
                opacity: Math.random() * 0.5 + 0.3,
                life: Math.random() * 200 + 100,
                maxLife: 300,
                hue: Math.random() * 40 + 330 // pink-red range
            });
        }

        // Track mouse for extra sparkles
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            lastMove = Date.now();
        });
    }

    function drawSparkles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var now = Date.now();

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            // Update position
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around edges
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;

            // Life cycle for shimmer
            p.life -= 1;
            if (p.life <= 0) {
                p.life = p.maxLife;
                p.opacity = Math.random() * 0.4 + 0.2;
                p.size = Math.random() * 3 + 1;
            }

            // Pulsing opacity
            var pulse = Math.sin(now * 0.002 + i) * 0.2 + 0.6;
            var alpha = p.opacity * pulse;

            // Draw sparkle (4-point star)
            ctx.save();
            ctx.translate(p.x, p.y);

            // Glow
            var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 5);
            grad.addColorStop(0, 'hsla(' + p.hue + ', 90%, 70%, ' + (alpha * 0.15) + ')');
            grad.addColorStop(1, 'hsla(' + p.hue + ', 90%, 70%, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 5, 0, Math.PI * 2);
            ctx.fill();

            // Star shape
            ctx.fillStyle = 'hsla(' + p.hue + ', 85%, 75%, ' + alpha + ')';
            ctx.shadowColor = 'hsla(' + p.hue + ', 85%, 70%, 0.5)';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            var spikes = 4;
            var outerR = p.size * 2.5;
            var innerR = p.size * 0.7;
            for (var j = 0; j < spikes * 2; j++) {
                var r = j % 2 === 0 ? outerR : innerR;
                var angle = (j * Math.PI) / spikes - Math.PI / 2;
                if (j === 0) ctx.moveTo(r * Math.cos(angle), r * Math.sin(angle));
                else ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
            }
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        // Mouse-reactive sparkles
        if (now - lastMove < 300 && mouseX > 0 && mouseY > 0) {
            for (var k = 0; k < 3; k++) {
                var angle = Math.random() * Math.PI * 2;
                var dist = Math.random() * 30 + 5;
                var px = mouseX + Math.cos(angle) * dist;
                var py = mouseY + Math.sin(angle) * dist;
                ctx.save();
                ctx.translate(px, py);
                var mAlpha = Math.random() * 0.3 + 0.2;
                var mSize = Math.random() * 2.5 + 1;
                ctx.fillStyle = 'hsla(340, 90%, 75%, ' + mAlpha + ')';
                ctx.shadowColor = 'hsla(340, 85%, 70%, 0.4)';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                for (var j2 = 0; j2 < 8; j2++) {
                    var r2 = j2 % 2 === 0 ? mSize * 2 : mSize * 0.6;
                    var a2 = (j2 * Math.PI) / 4 - Math.PI / 2;
                    if (j2 === 0) ctx.moveTo(r2 * Math.cos(a2), r2 * Math.sin(a2));
                    else ctx.lineTo(r2 * Math.cos(a2), r2 * Math.sin(a2));
                }
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.restore();
            }
        }

        sparkleAnimId = requestAnimationFrame(drawSparkles);
    }

    function startSparkles() {
        initCanvas();
        if (sparkleAnimId) cancelAnimationFrame(sparkleAnimId);
        drawSparkles();
    }

    /* =============================================
       INIT — BOOT EVERYTHING
       ============================================= */
    window.addEventListener('load', function () {
        startHeartGenerator();
        startSparkles();
    });

    // Cleanup on page unload (optional)
    window.addEventListener('beforeunload', function () {
        if (heartInterval) clearInterval(heartInterval);
        if (sparkleAnimId) cancelAnimationFrame(sparkleAnimId);
    });

})();
