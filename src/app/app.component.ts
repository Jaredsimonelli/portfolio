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
  min: number;

  fontEndSkills: Skill[] = frontEndSkillList;
  generalSkills: Skill[] = generalSkillList;
  gameDevSkills: Skill[] = gameDevSkillList;

  currentActive = 1;
  skillsSectionLoaded = false;
  expSectionLoaded = false;
  showProgressBar = true;

  homeOffset: number;
  skillsOffset: number;
  expOffset: number;
  contactOffset: number;

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
    this.homeOffset = this.getOffset(document.getElementById('scrollToHome').getBoundingClientRect().top);
    this.skillsOffset = this.getOffset(document.getElementById('scrollToSkills').getBoundingClientRect().top);
    this.expOffset = this.getOffset(document.getElementById('scrollToExperience').getBoundingClientRect().top);
    this.contactOffset = this.getOffset(document.getElementById('scrollToContact').getBoundingClientRect().top);
  }

  getOffset(top: number) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return top + scrollTop;
  }

  @HostListener('window:scroll', ['$event'])
  checkOffsetTop() {
    let yOffset = window.pageYOffset;

    if (yOffset >= this.homeOffset && yOffset < this.skillsOffset) {
      this.currentActive = 1;
    } else if (yOffset >= this.skillsOffset && yOffset < this.expOffset) {
      this.currentActive = 2;
    } else if (yOffset >= this.expOffset && yOffset < this.contactOffset) {
      this.currentActive = 3;
    } else if (yOffset >= this.contactOffset) {
      this.currentActive = 4;
    } else {
      this.currentActive = 1;
    }

    console.log('y offset:  ' + yOffset);

    console.log('home:  ' + this.homeOffset);
    console.log('skill:  ' + this.skillsOffset);
    console.log('exp:  ' + this.expOffset);
    console.log('contact:  ' + this.contactOffset);

    // TODO: make this a ratio of screen width since current ratio not working
    // Skills section animation
    if (yOffset + (this.skillsOffset / 1.45) >= this.skillsOffset && yOffset + (this.skillsOffset / 3.6) < this.expOffset) {
      if (!this.skillsSectionLoaded) {
        const sHeader = document.getElementById('sHeader');
        const sContainer = document.getElementById('sContainer');

        sHeader.classList.remove("hidden");
        sHeader.classList.add("slide-right");

        sContainer.classList.remove("hidden");
        sContainer.classList.add("slide-left");

        this.loadProgressBars();
      }
    }

    // Experience section animation
    if (yOffset + (this.expOffset / 2.9) >= this.expOffset && yOffset < this.contactOffset - (this.contactOffset / 37.5)) {
      if (!this.expSectionLoaded) {
        this.expSectionLoaded = true;

        const eHeader = document.getElementById('eHeader');
        const eContainer = document.getElementById('eContainer');

        eHeader.classList.remove("hidden");
        eHeader.classList.add("slide-left");

        eContainer.classList.remove("hidden");
        eContainer.classList.add("slide-right");
      }
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
    for (let i = 1; i <= num; i++) {
      items.push(i);
    }
    return items;
  }

  loadProgressBars() {
    this.skillsSectionLoaded = true;

    this.animateProgressBars(this.fontEndSkills, "barFront");
    this.animateProgressBars(this.generalSkills, "barGen");
    this.animateProgressBars(this.gameDevSkills, "barGame");
  }

  animateProgressBars(list: Skill[], elementName: string) {
    for (let k = 0; k < list.length; k++) {
      const percentage = list[k].percentage;
      let i = 0;

      if (i === 0) {
        i = 1;
        const elementId = elementName + k;
        const elem = document.getElementById(elementId);
        const id = setInterval(frontFrame, 30);

        let width = 1;
        function frontFrame() {
          if (width >= percentage) {
            clearInterval(id);
            i = 0;
          } else {
            width++;
            elem.style.width = width + "%";
            elem.innerHTML = width * 1 + '%';
          }
        }
      }
    }
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
