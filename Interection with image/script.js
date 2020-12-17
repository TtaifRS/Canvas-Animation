const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

let mouse = {
  x: null,
  y: null,
  radius: 100,
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.x + canvas.clientLeft / 2;
  mouse.y = event.y + canvas.clientTop / 2;
});

function drawImage() {
  let imageWidth = png.width;
  let imageHeight = png.height;
  const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  class Particle {
    constructor(x, y, color, size) {
      this.x = x + canvas.width / 2 - png.width * 2;
      this.y = y + canvas.height / 2 - png.width * 2;
      this.color = color;
      this.size = 2;
      this.baseX = x + canvas.width / 2 - png.width * 2;
      this.baseY = y + canvas.height / 2 - png.width * 2;
      this.density = Math.random() * 10 + 2;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      ctx.fillStyle = this.color;

      //collison detection
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      //max distance, past that the force will be 0
      const maxDistance = 100;
      let force = (maxDistance - distance) / maxDistance;
      if (force < 0) {
        force = 0;
      }

      let directionX = forceDirectionX * force * this.density * 0.6;
      let directionY = forceDirectionY * force * this.density * 0.6;

      if (distance < mouse.radius + this.size) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 20;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 20;
        }
      }
      this.draw();
    }
  }
  function init() {
    particleArray = [];

    for (let y = 0, y2 = data.height; y < y2; y++) {
      for (let x = 0, x2 = data.width; x < x2; x++) {
        if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
          let positionX = x;
          let positionY = y;
          let color =
            'rgb(' +
            data.data[y * 4 * data.width + x * 4] +
            ',' +
            data.data[y * 4 * data.width + x * 4 + 1] +
            ',' +
            data.data[y * 4 * data.width + x * 4 + 2] +
            ')';

          particleArray.push(new Particle(positionX * 4, positionY * 4, color));
        }
      }
    }
  }
  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
  }
  init();
  animate();

  window.addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  });
}

const png = new Image();
// png.src =
//   'data:image/png;base64,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';

png.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAvCAYAAABuWa03AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATYSURBVHgB7ZvdUttGFMfPWclOnLYT8wRRngC4Sphe1H6CwhOApx8zvaq5YzzOYKaGcge5bZsxfYLyBrg35bLOE6C8gZhpywyWzuk5NhBCLH8QLK0/fjNC8q4sm79Xu/9zdoUwo7Sr1QISecActJlbuf19Hx6A2sWpd5mBgmHw0JinWsZE5xGa1s/ui2Pc/pVOYOxwa+c7ZxMsgavVbRJtbgoQ/SiK1rJ7ey24J9X2aQEc3AaGQu8zMKg7LxZcZi7AmEFksIWwUtn4QGyF2XOMObnY2loetaVv8annMjY6Qvf7N+Uu0p2BGUNu8x9jqvKu627ACKjYGcKT+FZ9C4a3ups5wQUvrsIgPoMR0JbNfa53mwip2fkMmDEQILaf5ij6E4akGv61OlTLvsJhDHQ/c4KHRDp4Bx9VMPvu3t4RDAmCsz7EaYHcAb4e1DMrTd3PnODqRCKiogp8XSaiNC+jqAgjwBhvNjoiExfrzsuFXefl83/Mo4XrOpciGvhBxjUHcpWlnhfnaJMJ+9oplzgAi7iyf8+5XM7razw8HOn76WAJBPm4enF+O7tXLVo5xOWb6yMMgXr1OPuoP1j9h0wTZoiO5zYYG79Iy47VdRZdyljBqz47jrngCTMXPGFcsJiwUdkQ+7VIxOcMHBgmnwj97Pf3z3lc1GpeXF2uVvPhAdAE1t2y4PHjQAdPqwWXcOFrGfNXTec+1HHIAceRqK3xyge1ctDeyZVGy31k2+0TSe54veokg1jM1OtN+AQ08gyzeHa3PBddrMnu2OouxQDHWC/2ZNvIgnvGjVcHMAFwG+1PXklrWRp0DgGXpcWfXTS2PLAUDYT2cyu+Hts+aOaHO429R+D8AbbC9Pb60FrBuVHLS966yEAlItjR8Lvv+YBL7TfVGliIfLfj62NrB00s1TQcbt4uY+k2QnbLBqFnTlsGVy2vgW0Q3bgqKwTnRjkf0ZNVNM4i3OpGxA6+Q45a11YQu46kTI3qorT4Qo9L5fm3+jP8tvoOUkPSsESvb5fsZb+0Q3BtsQQZmV9kEVuF/nCOqmsHP7aCBPQ7gin0umYb/9Nk3BGkBEq88FNmpRZXn5rgl43KEoGRBBAPPTDKH7WCEgxxK276UH4IDywmFcG7LVvFHtaF3Hm/DJBxdcaMNk2WNKm4FAa3AfcUe+C1mRbAYhIXXLuSmAHvYUB8ChaTuOBIZhVmmMT7cMfAV4OWBWmQg4B+95g9HOcdkTCJC859+272LyEq3s0Adnw6PJE7w6xPuvgpuBS1gb2n/KQ190y3YqkzyXukmzocGXQP5IebyK7JqlwKg/EHnaPRZhTCa5hQ5lNsCTMXPGHmgifMXPCEsUpwhGgs4b5N2OVS2CnAlJO44GL9YteUyEzOugY5MMUkLzhzv9mYPMNnJ9MsegrJq8GTwQRf/B2+qWxc/lLpmfd2HWN1RrAfySevHLdJEGqo3i+nos84NiTRJVNrVX3td8tR3yOz+QSTSvItXGbjiUYNzdHrbjDxXU0qLiXzTb3W7+GmaSY1W4gQrs2i6OkJLlk/U6ovR8Cb7/vo6Sf1wCdb2j008O+yLmkbtJxtGhjqoaokUQ8ewucy0cxLSJjXZQ/cXbuiW4DQfcCUmM/FQwZoyJd2E4hz8SPIBrnSwyyqHxf/A1i34bdK+bQPAAAAAElFTkSuQmCC';

window.addEventListener('load', (event) => {
  console.log('page has loaded');
  ctx.drawImage(png, 0, 0);
  drawImage();
});
