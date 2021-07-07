import { Skill, ModalData } from './models';

export const frontEndSkillList: Skill[] = [
  {
    name: 'HTML',
    exp: 4,
    percentage: 85,
  },

  {
    name: 'JS/TS',
    exp: 4,
    percentage: 85,
  },
  {
    name: 'Angular',
    exp: 4,
    percentage: 80,
  },
  {
    name: 'CSS',
    exp: 3,
    percentage: 70,
  },
  {
    name: 'NgRx',
    exp: 3,
    percentage: 65,
  },
  {
    name: 'Node.js',
    exp: 2,
    percentage: 20,
  }
];

//{
//  name: 'CSS',
//    exp: 3.5,
//  },
//{
//  name: 'NgRx',
//    exp: 3.5,
//  },
//{
//  name: 'Node',
//    exp: 2.5,
//  }

export const gameDevSkillList: Skill[] = [
  {
    name: 'Unity',
    exp: 4,
    percentage: 90,
  },
  {
    name: 'C#',
    exp: 3,
    percentage: 70,
  },
  {
    name: 'Unreal',
    exp: 2,
    percentage: 35,
  }

];

export const generalSkillList: Skill[] = [
  {
    name: 'Git',
    exp: 4,
    percentage: 90,
  },
  {
    name: 'C++',
    exp: 3,
    percentage: 60,
  },
  {
    name: 'Python',
    exp: 2,
    percentage: 45,
  },
  {
    name: 'Java',
    exp: 2,
    percentage: 45,
  },
  {
    name: 'C',
    exp: 2,
    percentage: 40,
  },
  {
    name: 'SQL',
    exp: 1,
    percentage: 20,
  },
  {
    name: 'Spring',
    exp: 1,
    percentage: 20,
  }

];

export const pod: ModalData = {
  title: 'Virtual Relaxation Pod',
  body: "Working on a small team of only two developers, I was tasked with curating scenes for (the Cigna Virtual Reality Meditation Pod), including Japanese gardens, beach vacation, and underwater. While no demos are available, please follow the link below to read an article about the project.",
  img: "/assets/img/pod_modal.jpg",
};

export const cfc: ModalData = {
  title: 'Global Fitness Challenge',
  body: "The Global Fitness Challenge is an activities-based employer wellness application designed to promote an active lifestyle through a series of team-based physical activities. I joined this team as a front-end developer but quickly gained the skill set required to function as a full stack developer on the project. This link will take you to the landing page, but unfortunately, this application is not fully available without purchase from employer.",
  img: "/assets/img/cfc_modal.PNG",
};

export const chcp: ModalData = {
  title: 'Cigna Provider Portal',
  body: "The Cigna Provider Portal is an internal insurance claims resource managed by multiple (better if you have a number), global teams, working simultaneously to upgrade and maintain this valuable tool. I lead the front-end development team for Benefits functionality. As this is an internal tool, no link can be provided.",
  img: "/assets/img/chcp_modal.PNG",
};
