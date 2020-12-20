const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.textBaseline = 'middle';
let lettersArray = ['T', 'U', 'N', 'T', 'U', 'N'];
let hue = 0;
let particles = [];
let numberOfParticles = (canvas.width * canvas.height) / 7000;
// let numberOfParticles = 20;

const mouse = {
  x: null,
  y: null,
  radius: 60,
  autopilotAngle: 0,
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

class Particle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = `hsl(${hue}, 100%, 50%)`;
    // this.color = `hsl(0, 3%, 6%)`;
    this.text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.7, Math.PI * 1.7, true);
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.font = this.radius + 'px Verdana';
    ctx.fillText(this.text, this.x - this.radius / 2.7, this.y);
  }

  update() {
    if (mouse.x === undefined && mouse.y === undefined) {
      let newX =
        ((mouse.radius * canvas.width) / 200) *
        Math.sin(mouse.autopilotAngle * (Math.PI / 360));
      let newY =
        ((mouse.radius * canvas.height) / 200) *
        Math.cos(mouse.autopilotAngle * (Math.PI / 360));
      mouse.x = newX + canvas.width / 2;
      mouse.y = newY + canvas.height / 2;
    }
    mouse.autopilotAngle += 0.03;
  }
}

function handleOverlap() {
  let overlapping = false;
  let protection = 500;
  let counter = 0;
  while (particles.length < numberOfParticles && counter < protection) {
    let randomAngle = Math.random() * 2 * Math.PI;
    let randomRadius = mouse.radius * Math.sqrt(Math.random());
    let particle = {
      x: mouse.x + randomRadius * Math.cos(randomAngle),
      y: mouse.y + randomRadius * Math.sin(randomAngle),
      radius: Math.floor(Math.random() * 30) + 10,
    };
    overlapping = false;
    for (let i = 0; i < particles.length; i++) {
      let previousParticle = particles[i];
      let dx = particle.x - previousParticle.x;
      let dy = particle.y - previousParticle.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < particle.radius + previousParticle.radius) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      particles.unshift(new Particle(particle.x, particle.y, particle.radius));
    }
    counter++;
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].update();
  }
  if (particles.length >= numberOfParticles) {
    for (let i = 0; i < 7; i++) {
      particles.pop();
    }
  }
  handleOverlap();
  hue += 3;
}

handleOverlap();
animate();

canvas.addEventListener('mouseleave', function () {
  autoPilot = setInterval(function () {
    mouse.x = undefined;
    mouse.y = undefined;
  }, 100);
});

canvas.addEventListener('mouseenter', function () {
  clearInterval(autoPilot);
  autoPilot = undefined;
});

window.addEventListener('resize', function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  handleOverlap();
});
