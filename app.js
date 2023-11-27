import { Canvas } from "./Canvas.js";

class App {
  constructor() {
    this.cvs1 = new Canvas();
    this.cvs2 = new Canvas();
    this.ctx1 = this.cvs1.ctx;
    this.ctx2 = this.cvs2.ctx;

    this.container = document.createElement("article");
    this.container.appendChild(this.cvs1.element);
    document.body.appendChild(this.container);

    this.img = new Image();
    this.imgWidth = Canvas.stageWidth;
    this.imgHeight = Canvas.stageHeight;

    /** maximum particle per frame */ this.maxPpf = 1000;
    /** minimum particle per frame */ this.minPpf = 10;
    /** particle per frame */ this.ppf = this.minPpf;
    this.maxScale = 1000;
    this.minScale = 10;
    this.scale = this.maxScale;
    this.step = 15;
    this.modeIndex = 0;

    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));

    this.getImage();
    setTimeout(() => requestAnimationFrame(this.animate.bind(this)), 100);
  }

  handleResize() {
    Canvas.resize();
    this.cvs1.resize();
    this.cvs2.resize();
  }

  getImage() {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = `https://source.unsplash.com/random/?neon,${Math.random()}`;
    img.onload = () => {
      const imgRatio = img.width / img.height;
      const canvasRatio = Canvas.stageWidth / Canvas.stageHeight;

      if (imgRatio < canvasRatio) {
        this.imgWidth = Canvas.stageWidth;
        this.imgHeight = Canvas.stageWidth / imgRatio;
      } else {
        this.imgHeight = Canvas.stageHeight;
        this.imgWidth = Canvas.stageHeight * imgRatio;
      }

      this.img = img;
      this.scale = this.maxScale;
      this.ppf = this.minPpf;
      this.modeIndex++;
      setTimeout(this.getImage.bind(this), 5000);
    };
  }

  drawImage(ctx) {
    ctx.drawImage(
      this.img,
      (Canvas.stageWidth - this.imgWidth) / 2,
      (Canvas.stageHeight - this.imgHeight) / 2,
      this.imgWidth,
      this.imgHeight
    );
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.drawImage(this.ctx2);

    for (let i = 0; i < this.ppf; i++) {
      const [x, y] = this.getRandomXY();
      this.ctx1.strokeStyle = this.getRandomPixelRGBA(this.ctx2, x, y);

      switch (this.modeIndex % 4) {
        case 0:
          this.strokePrarellLine(this.ctx1, x, y);
          break;

        case 1:
          this.strokeCircle(this.ctx1, x, y);
          break;

        case 2:
          this.strokeLine(this.ctx1, x, y);
          break;

        default:
          this.strokeConcentricCircle(this.ctx1, x, y);
          break;
      }
    }

    if (this.scale > this.minScale) this.scale -= this.step;
    if (this.ppf < this.maxPpf) this.ppf += this.step;
  }

  getRandomXY() {
    const x = Math.floor(Math.random() * Canvas.stageWidth);
    const y = Math.floor(Math.random() * Canvas.stageHeight);
    return [x, y];
  }

  getRandomPixelRGBA(ctx, x, y) {
    const pixel = ctx.getImageData(x, y, 1, 1),
      [r, g, b] = pixel.data;
    return `rgba(${r}, ${g}, ${b}, ${0.5})`;
  }

  strokeCircle(ctx, x, y) {
    const randomOffest = Math.random() * 0.4 + 0.8;
    const radius = this.scale * randomOffest;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  strokeConcentricCircle(ctx, x, y) {
    const cx = Canvas.stageWidth / 2;
    const cy = Canvas.stageHeight / 2;
    const dx = cx - x;
    const dy = cy - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan(dy / dx) - (dx >= 0 ? Math.PI : 0);
    const angleOffset = (Math.PI * 2 * (this.scale / distance)) / 5;

    ctx.beginPath();
    ctx.arc(cx, cy, distance, angle - angleOffset, angle + angleOffset);
    ctx.stroke();
  }

  strokeLine(ctx, x, y) {
    const randomOffest = Math.random() * 0.4 + 0.8;
    const radius = this.scale * randomOffest;
    const randomOffestX = Math.random() * 2 - 1;
    const randomOffestY = Math.random() * 2 - 1;
    const dx = radius * randomOffestX;
    const dy = radius * randomOffestY;

    ctx.beginPath();
    ctx.moveTo(x - dx, y - dy);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
  }

  strokePrarellLine(ctx, x, y) {
    const randomOffest = Math.random() * 0.4 + 0.8;
    const radius = this.scale * randomOffest;

    ctx.beginPath();
    ctx.moveTo(x - radius, y - radius);
    ctx.lineTo(x + radius, y + radius);
    ctx.stroke();
  }
}

window.onload = () => {
  const app = new App();
};
