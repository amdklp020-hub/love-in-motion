const canvas = document.getElementById("loveCanvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("loveButton");

let W, H;
let rotation = 0;
let power = 1;
let particles = [];

function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    W = rect.width;
    H = rect.height;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function heartPoint(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: -(13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t))
    };
}

function drawHeart(time) {
    const pulse = 1 + Math.sin(time * 0.004) * 0.04;
    const scale = Math.min(W / 38, H / 34) * pulse * power;

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, scale);

    // چند لایه نوشته برای ایجاد عمق
    for (let layer = 0; layer < 5; layer++) {
        ctx.globalAlpha = 0.35 + layer * 0.12;
        ctx.fillStyle = layer % 2 ? "#ff3e9d" : "#ffacd6";
        ctx.shadowColor = "#ff1687";
        ctx.shadowBlur = 10;

        for (let i = 0; i < 170; i++) {
            const t = i / 170 * Math.PI * 2 + rotation;
            const p = heartPoint(t);

            ctx.save();
            ctx.translate(
                p.x + Math.cos(t) * layer * 0.65,
                p.y + Math.sin(t) * layer * 0.65
            );

            ctx.rotate(t + Math.PI / 2);
            ctx.font = "1.3px Arial";
            ctx.textAlign = "center";
            ctx.fillText("I love you", 0, 0);

            ctx.restore();
        }
    }

    // نوشته‌های داخل قلب
    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#ffb5dc";
    ctx.font = "1.4px Arial";
    ctx.textAlign = "center";

    for (let i = 0; i < 18; i++) {
        const y = -7 + i * 0.85;
        ctx.fillText("I LOVE YOU ♥", 0, y);
    }

    ctx.restore();
}

function createParticles() {
    particles = [];

    for (let i = 0; i < 45; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.2
        });
    }
}

function drawBackground() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
        p.y -= p.speed;

        if (p.y < 0) {
            p.y = H;
            p.x = Math.random() * W;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,130,200,0.6)";
        ctx.fill();
    }
}

function animate(time) {
    drawBackground();
    drawHeart(time);

    rotation += 0.004;

    requestAnimationFrame(animate);
}

button.addEventListener("click", () => {
    power = 1.15;
    button.textContent = "LOVE ACTIVATED ♥";

    setTimeout(() => {
        power = 1;
        button.textContent = "FEEL THE LOVE ♥";
    }, 700);
});

window.addEventListener("resize", () => {
    resize();
    createParticles();
});

resize();
createParticles();
requestAnimationFrame(animate);