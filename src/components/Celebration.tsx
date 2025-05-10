import { Component, createRef } from "react";

const confettiDefaultOptions = {
    colors: [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "pink",
        "SlateBlue",
        "lightblue",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson"
    ],
    count: 200,
    waveAngle: 0,
    timeout: 10,
    gravity: 10,
    windSpeed: 1
};

class BridalConfetti {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.options = {
            ...confettiDefaultOptions,
            ...options
        };
        this.height = 0;
        this.particles = [];
        this.width = 0;
        this.stopStreamingConfetti = false;
        this.animationId = null;
    }

    updateAndDrawParticles(context) {
        this.options.waveAngle += 0.01;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.tiltAngle += p.tiltAngleIncrement;
            p.x += Math.sin(p.tiltAngle) * 2 - this.options.windSpeed;
            p.y += (Math.cos(this.options.waveAngle) + p.diameter + this.options.gravity) * 0.2;
            p.tilt = Math.sin(p.tiltAngle);

            if (p.x > this.width + 20 || p.x < -20 || p.y > this.height) {
                if (this.stopStreamingConfetti) {
                    this.particles.splice(i, 1);
                } else {
                    this.setParticle(p);
                }
            }

            context.beginPath();
            context.lineWidth = p.diameter;
            const x2 = p.x - p.diameter / 3 + p.tilt * p.diameter;
            const y2 = p.y + p.diameter + p.tilt * p.diameter;
            context.strokeStyle = p.color;
            context.moveTo(p.x, p.y);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
        }
    }

    runAnimation(ctx, height, width) {
        ctx.clearRect(0, 0, width, height);
        this.updateAndDrawParticles(ctx);
        this.animationId = requestAnimationFrame(() => this.runAnimation(ctx, height, width));
    }

    setParticle(p) {
        const r = Math.random;
        const c = this.options.colors;
        p.color = c[Math.floor(r() * c.length)];
        p.x = r() * this.width;
        p.y = r() * this.height - this.height;
        p.diameter = r() * 6 + 6;
        p.tilt = r() * 10 - 10;
        p.tiltAngleIncrement = r() * 0.07 + 0.05;
        p.tiltAngle = r() * Math.PI;
        return p;
    }

    startAnimation() {
        cancelAnimationFrame(this.animationId);
        this.stopStreamingConfetti = false;
        const ctx = this.canvas.getContext("2d");
        const { width, height } = this.canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        this.canvas.width = width * ratio;
        this.canvas.height = height * ratio;
        ctx.scale(ratio, ratio);

        this.height = height;
        this.width = width;

        while (this.particles.length < this.options.count) {
            this.particles.push(this.setParticle({}));
        }

        this.runAnimation(ctx, height, width);

        const { timeout } = this.options;
        if (timeout && Number.isInteger(timeout)) {
            setTimeout(() => this.stopAnimation(), timeout);
        }
    }

    stopAnimation() {
        this.stopStreamingConfetti = true;
    }

    unmountCanvas() {
        this.particles = [];
        cancelAnimationFrame(this.animationId);
    }
}

export default class Celebration extends Component {
    private canvasRef = createRef<HTMLCanvasElement>();
    private confettiInstance: BridalConfetti | null = null;

    componentDidMount() {
        if (this.canvasRef.current) {
            this.confettiInstance = new BridalConfetti(this.canvasRef.current);
            this.confettiInstance.startAnimation();
        }
    }

    componentWillUnmount() {
        this.confettiInstance?.unmountCanvas();
    }

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 9999,
                    pointerEvents: "none"
                }}
            />
        );
    }
}