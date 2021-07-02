import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as canvasHelper from './helpers/canvas-helper';
import { Skill } from './data/models';
import { frontEndSkillList, gameDevSkillList, generalSkillList } from './data/constants';

import { faLaptopCode, faGamepad, faCodeBranch, faBars } from '@fortawesome/free-solid-svg-icons';

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
  hamburgerBars = faBars;

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

  hamburgerLinks: HTMLElement;


  contactForm: FormGroup;

  ngOnInit() {
    this.contactForm = new FormGroup({
      name: new FormControl("", Validators.required),
      message: new FormControl("", Validators.required)
    });

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
  }


  ngAfterViewInit() {
    this.homeOffset = this.getOffset(document.getElementById('scrollToHome').getBoundingClientRect().top);
    this.skillsOffset = this.getOffset(document.getElementById('scrollToSkills').getBoundingClientRect().top);
    this.expOffset = this.getOffset(document.getElementById('scrollToExperience').getBoundingClientRect().top);
    this.contactOffset = this.getOffset(document.getElementById('scrollToContact').getBoundingClientRect().top);

    this.hamburgerLinks = document.getElementById("links");
  }

  getOffset(top: number) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return top + scrollTop;
  }

  
  // FOR ANIMATE
  //@HostListener('resize', ['$event'])
  //resize(event) {
  //  // Browser resizing, reinitialize stars
  //  this.c.width = window.innerWidth;
  //  this.c.height = window.innerHeight;
  //  this.starArray = canvasHelper.createStarArray(this.ctx, this.stars);
  //  this.animate(this.starArray);
  //}


  //FOR PARALLAX
  //@HostListener('mousemove', ['$event'])
  //onMousemove(event: MouseEvent) {
  //  this.content.style.transition = 'none';
  //  this.content.style.top = -(event.clientY / 20) + 'px';
  //  this.content.style.left = -(event.clientX / 20) + 'px';
  //}

  //@HostListener('mouseout', ['$event'])
  //mouseIsOut(event) {
  //  this.content.style.transition = 'all 0.33s ease';
  //  this.content.style.top = '0px';
  //  this.content.style.left = '0px';
  //}

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

    // Skills section animation
    if (yOffset >= 100  && yOffset < this.expOffset - 100) {
      if (!this.skillsSectionLoaded) {
        //const sHeader = document.getElementById('sHeader');
        //const sContainer = document.getElementById('sContainer');

        //sHeader.classList.remove("hidden");
        //sHeader.classList.add("slide-right");

        //sContainer.classList.remove("hidden");
        //sContainer.classList.add("slide-left");

        this.loadProgressBars();
      }
    }

    // Experience section animation
    //if (yOffset >= ((this.expOffset - this.skillsOffset) + 100) && yOffset < this.contactOffset - 100) {
    //  if (!this.expSectionLoaded) {
    //    this.expSectionLoaded = true;

    //    const eHeader = document.getElementById('eHeader');
    //    const eContainer = document.getElementById('eContainer');

    //    eHeader.classList.remove("hidden");
    //    eHeader.classList.add("slide-left");

    //    eContainer.classList.remove("hidden");
    //    eContainer.classList.add("slide-right");
    //  }
    //}
  }

  changeTab(tab: string) {
    localStorage.setItem("oldTab", localStorage.getItem("newTab") || '');
    localStorage.setItem("newTab", tab);

    let newTab = localStorage.getItem("newTab");
    let oldTab = localStorage.getItem("oldTab");

    document.getElementById(newTab).className += " active";
    document.getElementById(oldTab).className = "nav-link";

    this.hamburgerLinks.style.display = "none";
  }

  toggleHamburgerNavLinks() {
    if (this.hamburgerLinks.style.display === "block") {
      this.hamburgerLinks.style.display = "none";
    } else {
      this.hamburgerLinks.style.display = "block";
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const link = "mailto:jaredsimonelliportfolio@gmail.com"
        + "?cc="
        + "&subject=" + encodeURIComponent("Email from " + this.contactForm.value.name)
        + "&body=" + encodeURIComponent(this.contactForm.value.message)
        ;

      window.location.href = link;
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
    } else if (type === 'linkedin') {
      window.open("https://linkedin.com/in/jared-simonelli-605289b9", "_blank");
    }
    // TODO: remove before deployment
    //else if (type === 'git') {
    //  window.open("https://github.com/Jaredsimonelli", "_blank");
    //}
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

  // loop to call update function on each star
  animate(starArray: any) {
    requestAnimationFrame(() => this.animate(starArray));

    this.ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (var star of starArray) {
      star.update();
    }
  }


  get name() { return this.contactForm.get('name'); }
  get message() { return this.contactForm.get('message'); }
}


