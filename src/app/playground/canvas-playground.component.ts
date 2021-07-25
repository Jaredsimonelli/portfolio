import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas-playground',
  templateUrl: './canvas-playground.component.html',
  styleUrls: ['./canvas-playground.component.scss']
})
export class CanvasPlaygroundComponent implements OnInit {

  // Canvas constants
  c: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  //FOR PARALLAX
  //content: any;
  //min: number;

  //FOR ANIMATE
  stars = {
    nearStar: {
      width: 3,
      speed: 0.2
    },
    midStar: {
      width: 2,
      speed: 0.1
    },
    farStar: {
      width: 1,
      speed: 0.025
    }
  };

  starArray = [];
  cloudArray = [];

  constructor() { }

  ngOnInit(): void {
    // ---- FOR PARALLAX ----
    //this.c = document.getElementById("responsive-canvas") as HTMLCanvasElement;
    //this.content = document.getElementById('content-container');
    //this.ctx = this.c.getContext("2d");
    //this.min = Math.min(this.c.height, this.c.width);

    //this.ctx = canvasHelper.setUpCanvas(this.c, this.ctx);


    // ---- FOR ANIMATE ----
    //this.c = document.querySelector('canvas');
    //this.c.width = window.innerWidth;
    //this.c.height = window.innerHeight;
    //this.ctx = this.c.getContext('2d');

    //this.starArray = canvasHelper.createStarArray(this.ctx, this.stars);
    //this.animate(this.starArray);

    //this.cloudArray = canvasHelper.createCloudArray(this.ctx, 3);
    //this.animate(this.cloudArray);
  }

}
