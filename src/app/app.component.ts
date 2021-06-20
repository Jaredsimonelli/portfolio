import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Skill } from './data/models';
import { frontEndSkillList, gameDevSkillList, generalSkillList } from './data/constants';

import { faLaptopCode, faGamepad, faCodeBranch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  // Icons
  fontEndImg = faLaptopCode;
  gameDevIcon = faGamepad;
  generalIcon = faCodeBranch;

  c: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  min: Number;

  fontEndSkills: Skill[] = frontEndSkillList;
  gameDevSkills: Skill[] = gameDevSkillList;
  generalSkills: Skill[] = generalSkillList;

  currentActive = 1;

  homeOffset: Number;
  skillsOffset: Number;
  expOffset: Number;
  contactOffset: Number;

  contactForm: FormGroup;

  ngOnInit() {
    this.contactForm = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", [
        Validators.required,
        Validators.email,
      ]),
      message: new FormControl("", Validators.required)
    });
    //this.c = document.getElementById("responsive-canvas") as HTMLCanvasElement;
    //this.ctx = this.c.getContext("2d");

    //this.min = Math.min(this.c.height, this.c.width);

    //this.setUpCanvas();
  }

  ngAfterViewInit() {
    this.homeOffset = document.getElementById('scrollToHome').getBoundingClientRect().top;
    this.skillsOffset = document.getElementById('scrollToSkills').getBoundingClientRect().top;
    this.expOffset = document.getElementById('scrollToExperience').getBoundingClientRect().top;
    this.contactOffset = document.getElementById('scrollToContact').getBoundingClientRect().top;
  }

  @HostListener('window:scroll', ['$event'])
  checkOffsetTop() {
    if (window.pageYOffset >= this.homeOffset && window.pageYOffset < this.skillsOffset) {
      this.currentActive = 1;
    } else if (window.pageYOffset >= this.skillsOffset && window.pageYOffset < this.expOffset) {
      this.currentActive = 2;
    } else if (window.pageYOffset >= this.expOffset && window.pageYOffset < this.contactOffset) {
      this.currentActive = 3;
    } else if (window.pageYOffset >= this.contactOffset) {
      this.currentActive = 4;
    } else {
      this.currentActive = 1;
    }
  }

  changeTab(tab: string) {
    // Store
    localStorage.setItem("oldTab", localStorage.getItem("newTab") || '');
    localStorage.setItem("newTab", tab);

    // Retrieve
    let newTab = localStorage.getItem("newTab");
    let oldTab = localStorage.getItem("oldTab");

    document.getElementById(newTab).className += " active";
    document.getElementById(oldTab).className = "nav-link";
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  openLink(type: string) {
    if (type === 'pod') {
      window.open(
        "https://www.medicaldaily.com/new-virtual-relaxation-pod-uses-oculus-rift-technology-enhance-mindfulness-370494", "_blank");
    } else if (type === 'cfc') {
      window.open("https://cigna.globalfitnesschallenge.com/", "_blank");
    }
  }

  createRange(num: number) {
    const items: number[] = [];
    for (var i = 1; i <= num; i++) {
      items.push(i);
    }
    return items;
  }

  setUpCanvas() {
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

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }
}
