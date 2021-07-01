// ------ PARALLAX ------
export function setUpCanvas(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  c.width = c.clientWidth;
  c.height = c.clientHeight;

  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.strokeStyle = '#039BE5';
  ctx.moveTo(100, 100);
  ctx.lineTo(125, 100);
  ctx.lineTo(112, 125);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#F57F17';
  ctx.moveTo(250, 150);
  ctx.lineTo(275, 150);
  ctx.lineTo(275, 175);
  ctx.lineTo(250, 175);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#E040FB';
  ctx.moveTo(500, 300);
  ctx.lineTo(525, 300);
  ctx.lineTo(512, 325);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#FF80AB';
  ctx.moveTo(750, 250);
  ctx.lineTo(775, 250);
  ctx.lineTo(775, 275);
  ctx.lineTo(750, 275);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#00BCD4';
  ctx.moveTo(1000, 150);
  ctx.lineTo(1025, 150);
  ctx.lineTo(1012, 175);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#00BCD4';
  ctx.moveTo(500, 250);
  ctx.lineTo(525, 250);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#EEFF41';
  ctx.moveTo(1100, 250);
  ctx.lineTo(1125, 250);
  ctx.closePath();
  ctx.stroke();
};




// ------ STAR ANIMATION ------
export class Star {
  x;
  y;
  width;
  speed;
  ctx;

  constructor(x, y, width, speed, ctx) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.speed = speed;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(this.x, this.y, this.width, this.width);
  }

  update() {
    // check bounds
    console.log('here');
    if (this.x + this.width > innerWidth) {
      this.x = 0;
    }
    this.x += this.speed;

    this.draw();
  }
}

// clear starArray and generate 3 layers of stars randomly
export function createStarArray(ctx: CanvasRenderingContext2D, stars: any) {
  const starArray = [];

  // nearest stars
  for (let i = 0; i < 50; ++i) {
    const x = Math.random() * (innerWidth - stars.nearStar.width);
    const y = Math.random() * (innerHeight - stars.nearStar.width);
    starArray.push(new Star(x, y, stars.nearStar.width, stars.nearStar.speed, ctx));
  }

  // mid-distance stars
  for (let i = 0; i < 100; ++i) {
    const x = Math.random() * (innerWidth - stars.midStar.width);
    const y = Math.random() * (innerHeight - stars.midStar.width);
    starArray.push(new Star(x, y, stars.midStar.width, stars.midStar.speed, ctx));
  }

  // farthest stars
  for (let i = 0; i < 350; ++i) {
    const x = Math.random() * (innerWidth - stars.farStar.width);
    const y = Math.random() * (innerHeight - stars.farStar.width);
    starArray.push(new Star(x, y, stars.farStar.width, stars.farStar.speed, ctx));
  }

  return starArray;
}

// loop to call update function on each star
export function animate(starArray: any) {
  requestAnimationFrame(() => this.animate);
  this.ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (var star of starArray) {
    star.update();
  }
}
