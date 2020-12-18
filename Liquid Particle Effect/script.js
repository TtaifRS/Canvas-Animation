const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
  x: undefined,
  y: undefined,
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

class Button {
  constructor(x, y, width, height, baseX) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.baseX = x;
  }

  update() {
    let directionX = 2.2;

    if (
      mouse.x < this.x + this.width &&
      mouse.x > this.x &&
      mouse.y < this.y + this.height &&
      mouse.y > this.y &&
      this.x > this.baseX - 50
    ) {
      //animate button to the left
      this.x -= directionX;
      this.width += directionX;
    } else if (this.x < this.baseX) {
      this.x += directionX;
      this.width -= directionX;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  }
}

const buttons = [];
function createButton() {
  for (let i = 0; i < 5; i++) {
    let topMargin = 158;
    let buttomMargin = 5;
    let x = 150;
    let y = topMargin + (50 + buttomMargin) * i;
    let height = 50;
    let width = 200;

    buttons.push(new Button(x, y, width, height));
  }
}
createButton();

//handle water particles
class Particle {
  constructor(x, y, size, weight) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.weight = weight;
    this.followingRight = false;
  }
  update() {
    //collison between particle/mouse
    if (
      this.x > mouse.x - 50 &&
      this.x < mouse.x + 50 &&
      this.y > mouse.y - 5 &&
      this.y < mouse.y + 5
    ) {
      this.x -= this.weight;
      this.y += this.weight;
      this.followingRight = true;
    }
    // collision between particle/button
    for (let i = 0; i < buttons.length; i++) {
      if (
        this.x < buttons[i].x + buttons[i].width &&
        this.x > buttons[i].x &&
        this.y < buttons[i].y + buttons[i].height &&
        this.y > buttons[i].y
      ) {
        this.weight = 0;
        if (!this.followingRight) {
          this.x -= 0.5;
        } else {
          this.x += 0.5;
        }
      } else {
        this.weight += 0.009;
      }
    }
    if (this.y > canvas.height) {
      this.y = 0 - this.size;
      this.x = Math.random() * 60 + 200;
      this.weight = Math.random() * 0.5 + 1;
      this.followingRight = false;
    }
    this.y += this.weight;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(128,197,222,1)';
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particleArray = [];
const numberOfParicles = 80;
function createParticles() {
  for (let i = 0; i < numberOfParicles; i++) {
    let x = Math.random() * 60 + 200;
    let y = Math.random() * canvas.height;
    let size = Math.random() * 20 + 5;
    let weight = Math.random() * 0.5 + 1;

    particleArray.push(new Particle(x, y, size, weight));
  }
}
createParticles();

//draw button
function drawButtons() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].update();
    // buttons[i].draw();
  }
}

//draw particles
function drawParticle() {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();
  }
}

//animate canvas
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawButtons();
  drawParticle();
}
animate();

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
