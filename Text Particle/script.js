const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let paricleArray = [];

let adjustX = canvas.width / 35;
let adjustY = canvas.height / 35;

let mouse = {
  x: null,
  y: null,
  radius: 70,
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText('TAIF', 0, 25);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 40 + 5;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y != this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}
console.log(textCoordinates);
function init() {
  paricleArray = [];
  // for (let i = 0; i < 500; i++) {
  //   let x = Math.random() * canvas.width;
  //   let y = Math.random() * canvas.height;
  //   paricleArray.push(new Particle(x, y));
  // }
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        paricleArray.push(new Particle(positionX * 10, positionY * 10));
      }
    }
  }
}

init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < paricleArray.length; i++) {
    paricleArray[i].draw();
    paricleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}

animate();

function connect() {
  let opacityValue = 0.5;
  for (let a = 0; a < paricleArray.length; a++) {
    for (let b = a; b < paricleArray.length; b++) {
      let dx = paricleArray[a].x - paricleArray[b].x;
      let dy = paricleArray[a].y - paricleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 20) {
        opacityValue = 1 - distance / 20;
        ctx.strokeStyle = `rgba(255,255,255,${opacityValue})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(paricleArray[a].x, paricleArray[a].y);
        ctx.lineTo(paricleArray[b].x, paricleArray[b].y);
        ctx.stroke();
      }
    }
  }
}

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
  animate();
});

// * basic
// const canvas = document.getElementById('canvas1');
// const ctx = canvas.getContext('2d');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let paricleArray = [];

// let mouse = {
//   x: null,
//   y: null,
//   radius: 150,
// };

// window.addEventListener('mousemove', function (event) {
//   mouse.x = event.x;
//   mouse.y = event.y;
// });

// ctx.fillStyle = 'white';
// ctx.font = '30px Verdana';
// ctx.fillText('T', 0, 40);
// const data = ctx.getImageData(0, 0, 100, 100);

// class Particle {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.size = 3;
//     this.baseX = this.x;
//     this.baseY = this.y;
//     this.density = Math.random() * 30 + 1;
//   }
//   draw() {
//     ctx.beginPath();
//     ctx.fillStyle = 'white';
//     ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//     ctx.closePath();
//     ctx.fill();
//   }
//   update() {
//     let dx = mouse.x - this.x;
//     let dy = mouse.y - this.y;
//     let distance = Math.sqrt(dx * dx + dy * dy);
//     if (distance < 100) {
//       this.size = 10;
//     } else {
//       this.size = 3;
//     }
//   }
// }

// function init() {
//   paricleArray = [];
//   for (let i = 0; i < 500; i++) {
//     let x = Math.random() * canvas.width;
//     let y = Math.random() * canvas.height;
//     paricleArray.push(new Particle(x, y));
//   }
//   //   paricleArray.push(new Particle(50, 50));
//   //   paricleArray.push(new Particle(80, 50));
// }

// init();

// function animate() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   for (let i = 0; i < paricleArray.length; i++) {
//     paricleArray[i].draw();
//     paricleArray[i].update();
//   }
//   requestAnimationFrame(animate);
// }

// animate();
