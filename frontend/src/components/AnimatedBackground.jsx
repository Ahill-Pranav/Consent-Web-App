import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let scrollY = 0;
        let W, H;
        let animationFrameId;
        let t = 0;

        const orbs = [];
        const initOrbs = () => {
            orbs.length = 0;
            const palette = [
                'rgba(27,77,62,', 'rgba(232,146,58,', 'rgba(90,138,117,',
                'rgba(45,107,88,', 'rgba(245,176,106,'
            ];
            for (let i = 0; i < 7; i++) {
                orbs.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: 80 + Math.random() * 200,
                    dx: (Math.random() - 0.5) * 0.3,
                    dy: (Math.random() - 0.5) * 0.3,
                    color: palette[i % palette.length],
                    alpha: 0.06 + Math.random() * 0.09,
                    parallax: 0.05 + Math.random() * 0.15,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.003 + Math.random() * 0.005
                });
            }
        };

        const resizeCanvas = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            initOrbs();
        };

        const drawBg = () => {
            ctx.clearRect(0, 0, W, H);
            t += 0.008;

            orbs.forEach(o => {
                const py = scrollY * o.parallax;
                const bx = o.x + Math.sin(t + o.phase) * 30;
                const by = o.y + Math.cos(t * 0.7 + o.phase) * 20 - py * 0.3;

                const grd = ctx.createRadialGradient(bx, by, 0, bx, by, o.r);
                grd.addColorStop(0, o.color + o.alpha + ')');
                grd.addColorStop(1, o.color + '0)');
                ctx.beginPath();
                ctx.arc(bx, by, o.r, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(drawBg);
        };

        const handleScroll = () => {
            scrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', resizeCanvas);

        // Initial setup
        resizeCanvas();
        drawBg();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.55
            }}
        />
    );
};

export default AnimatedBackground;
