interface HiddenObject {
    id: number;
    x: number;
    y: number;
    found: boolean;
}

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let objects: HiddenObject[] = [];
const flashlightRadius = 100;

async function fetchObjects(): Promise<void> {
    const response = await fetch('/get-objects');
    objects = await response.json();
}

function setupCanvas(): void {
    canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.addEventListener('mousemove', drawFlashlight);
    canvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        drawFlashlight({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawGame();
    });
}

function drawFlashlight(event: MouseEvent): void {
    const x = event.clientX;
    const y = event.clientY;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the flashlight effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(x, y, flashlightRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.0)";
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Redraw the objects
    drawObjects(x, y);
}

function drawObjects(flashlightX: number, flashlightY: number): void {
    objects.forEach((obj) => {
        if (!obj.found && Math.hypot(obj.x - flashlightX, obj.y - flashlightY) < flashlightRadius) {
            obj.found = true;
        }

        if (obj.found) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawGame(): void {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawObjects(0, 0);
}

async function initGame(): Promise<void> {
    await fetchObjects();
    setupCanvas();
    drawGame();
}

initGame();
