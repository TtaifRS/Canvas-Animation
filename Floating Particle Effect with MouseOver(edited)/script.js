const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let particleArray = [];
const colors = ['blue', 'white', 'black'];

const maxSize = 10;
const minSize = 0;
const mouseRadius = 20;

let mouse = {
  x: null,
  y: null,
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

//create constructor function for particle
function Particle(x, y, directionX, directionY, size, color) {
  this.x = x;
  this.y = y;
  this.directionX = directionX;
  this.directionY = directionY;
  this.size = size;
  this.color = color;
}

//add draw method to particle protype
Particle.prototype.draw = function () {
  ctx.beginPath();
  //for circle
  ctx.arc(this.x, this.y, this.size, Math.PI * 2, false);
  //for square shape
  // ctx.fillRect(this.x, this.y, this.size, this.size);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.strokeStyle = 'blue';
  ctx.stroke();
};

//add update method to particle protype
Particle.prototype.update = function () {
  if (this.x + this.size * 2 > canvas.width || this.x - this.size * 2 < 0) {
    this.directionX = -this.directionX;
  }
  if (this.y + this.size * 2 > canvas.height || this.y - this.size * 2 < 0) {
    this.directionY = -this.directionY;
  }
  this.x += this.directionX;
  this.y += this.directionY;

  //mouse interactivity
  if (
    mouse.x - this.x < mouseRadius &&
    mouse.x - this.x > -mouseRadius &&
    mouse.y - this.y < mouseRadius &&
    mouse.y - this.y > -mouseRadius
  ) {
    if (this.size < maxSize) {
      this.size += 2;
    }
  } else if (this.size > minSize) {
    this.size -= 0.1;
  }
  if (this.size < 0) {
    this.size = 0;
  }
  this.draw();
};

//create particle array
function init() {
  particleArray = [];
  for (let i = 0; i < 5000; i++) {
    let size = 0;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 0.8 - 0.1;
    let directionY = Math.random() * 0.8 - 0.1;
    let color = colors[Math.floor(Math.random() * colors.length)];

    particleArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

//animate loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
  }
}

init();
animate();

// resize event
window.addEventListener('resize', function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

//remove mouse position perodically
setInterval(function () {
  mouse.x = undefined;
  mouse.y = undefined;
}, 1000);
