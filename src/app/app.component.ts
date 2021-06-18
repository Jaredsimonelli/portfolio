import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  c: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  min: Number;

  ngOnInit() {
    this.c = document.getElementById("responsive-canvas") as HTMLCanvasElement;
    this.ctx = this.c.getContext("2d");

    this.min = Math.min(this.c.height, this.c.width);

    this.setUpCanvas();
  }

  setUpCanvas = () => {
    // Feed the size back to the canvas.
    this.c.width = this.c.clientWidth;
    this.c.height = this.c.clientHeight;

    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#039BE5';
    this.ctx.moveTo(100, 100);
    this.ctx.lineTo(125, 100);
    this.ctx.lineTo(112, 125);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#F57F17';
    this.ctx.moveTo(250, 150);
    this.ctx.lineTo(275, 150);
    this.ctx.lineTo(275, 175);
    this.ctx.lineTo(250, 175);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#E040FB';
    this.ctx.moveTo(500, 300);
    this.ctx.lineTo(525, 300);
    this.ctx.lineTo(512, 325);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#FF80AB';
    this.ctx.moveTo(750, 250);
    this.ctx.lineTo(775, 250);
    this.ctx.lineTo(775, 275);
    this.ctx.lineTo(750, 275);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#00BCD4';
    this.ctx.moveTo(1000, 150);
    this.ctx.lineTo(1025, 150);
    this.ctx.lineTo(1012, 175);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#00BCD4';
    this.ctx.moveTo(500, 250);
    this.ctx.lineTo(525, 250);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#EEFF41';
    this.ctx.moveTo(1100, 250);
    this.ctx.lineTo(1125, 250);
    this.ctx.closePath();
    this.ctx.stroke();

  };
}
