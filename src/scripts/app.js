"use strict"

// Function to convert text formatted as "20ᵉ siècle" to its associated year (e.g., "20ᵉ siècle" -> 1900)
function convertCenturyToYear(text) {
  let century = parseInt(text);
  if (!isNaN(century)) {
    return (century - 1) * 100;
  }
  return null;
}

// Function to extract the year from a date string, ignoring the day and text (e.g., "5 octobre 2019" -> 2019)
function extractYearFromDate(dateString) {
  if (typeof dateString === 'string') {
    let yearRegex = /\b\d{4}\b/;
    let match = dateString.match(yearRegex);
    if (match) {
      return parseInt(match[0]);
    }
  }
  return null;
}


// Function to determine the class based on the "Début" value
function getClassForYear(year) {
  if (year >= 2020) {
    return 'five'; // For years 2020 and above
  }
  if (year >= 2010 && year <= 2019) {
    return 'four';
  }
  if (year >= 2000 && year <= 2009) {
    return 'three';
  }
  if (year >= 1900 && year <= 1999) {
    return 'two';
  }
  return 'MoyenAge'; // Default for years before 1900
}




// Function to fetch JSON data
async function fetchJSONData(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    return [];
  }
}

// Function to populate HTML with JSON data
function populateHTML(jsonData) {
  let topContainer = document.querySelector('.top');
  let template = document.querySelector('.top__container');

  // Sort JSON data by "Absurdité" value in descending order
  jsonData.sort((a, b) => b.Absurdité - a.Absurdité);

  jsonData.forEach((data, index) => {
    // Clone template content
    let clone = template.cloneNode(true);

    // Extract year from "Début" value
    let year;
    if (typeof data.Début === 'string' && data.Début.includes('ᵉ siècle')) {
      year = convertCenturyToYear(data.Début);
    } else {
      year = extractYearFromDate(data.Début);
    }

    // Assign class based on year
    if (year !== null) {
      clone.classList.add(getClassForYear(year));
    }

    // Fill cloned content with data
    clone.querySelector('.top__number').textContent = '';
    clone.querySelector('.top__pays').textContent = data.Pays;
    clone.querySelector('.top__loi').textContent = data.Loi;
    clone.querySelector('.top__date').textContent = `${data.Début} - ${data.Fin}`;
    clone.querySelector('.top__comment').textContent = data.Commentaire;
    clone.querySelector('.top__rating').textContent = `${data.Absurdité} 🤡`;

    // Show cloned content
    clone.classList.remove('hidden');

    // Append cloned content to topContainer
    topContainer.appendChild(clone);
  });

  // Remove the template
  template.remove();
}


// Fetch JSON data and populate HTML
let lawsDataURL = '../assets/data/laws.json';
fetchJSONData(lawsDataURL)
  .then(data => populateHTML(data))
  .catch(error => console.error('Error fetching JSON data:', error));


// test initial
/*
document.addEventListener("DOMContentLoaded", function () {
  let questionElement = document.getElementById("question");
  let vraiBtn = document.getElementById("vraiBtn");
  let fauxBtn = document.getElementById("fauxBtn");
  let feedbackElement = document.getElementById("feedback"); // test a ignorer
  let skipBtn = document.getElementById("skipBtn");

  let currentQuestionIndex = 0;
  let score = 0;
  let isQuestionDisplayed = false;

  let questionsData = null; // pour stocker les données hihi

  // peuti fetch qui va chercher les infos sur le doc questions.json
  fetch("/assets/data/questions.json")
    .then((response) => response.json())
    .then((data) => {
      questionsData = data;
      showQuestion();

      vraiBtn.addEventListener("click", () => checkAnswer(true, questionsData));
      fauxBtn.addEventListener("click", () =>
        checkAnswer(false, questionsData)
      );
      skipBtn.addEventListener("click", showSummary);
    });

  function showQuestion() {
    // Modification ici
    let currentQuestion = questionsData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    feedbackElement.textContent = ""; // réinitialisation de la réponse
    vraiBtn.style.display = "inline"; // affichage et désaffichaaage des boutons
    fauxBtn.style.display = "inline";
    isQuestionDisplayed = true;

    // Activer les boutons
    vraiBtn.disabled = false;
    fauxBtn.disabled = false;
  }

  function checkAnswer(userAnswer, questions) {
    let currentQuestion = questions[currentQuestionIndex];
    vraiBtn.disabled = true; // désactive les boutons pendant le delai chiant de la reponse
    fauxBtn.disabled = true;
    if (userAnswer === currentQuestion.reponse) {
      feedbackElement.textContent = "YE!";
      feedbackElement.style.color = "green";
      score++;
    } else {
      feedbackElement.textContent = `NAAAAAAN ${currentQuestion.anecdote}`;
      feedbackElement.style.color = "red";
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      setTimeout(() => {
        showQuestion(questions[currentQuestionIndex]);
        feedbackElement.textContent = "";
      }, 1000);
    } else {
      showSummary();
    }
  }

  function showSummary() {
    questionElement.textContent = `Quizz terminé score: ${score}/${currentQuestionIndex} :3`;
    vraiBtn.style.display = "none";
    fauxBtn.style.display = "none";
    skipBtn.style.display = "none";
    feedbackElement.textContent = "";
  }
});
*/


//water effect

const rippleSettings = {
  maxSize: 100,
  animationSpeed: 5,
  strokeColor: [49, 54, 135],
};

const canvasSettings = {
  blur: 8,
  ratio: 1,
};

function Coords(x, y) {
  this.x = x || null;
  this.y = y || null;
}

const Ripple = function Ripple(x, y, circleSize, ctx) {
  this.position = new Coords(x, y);
  this.circleSize = circleSize;
  this.maxSize = rippleSettings.maxSize;
  this.opacity = 1;
  this.ctx = ctx;
  this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
    ${Math.floor(rippleSettings.strokeColor[1])},
    ${Math.floor(rippleSettings.strokeColor[2])},
    ${this.opacity})`;

  this.animationSpeed = rippleSettings.animationSpeed;
  this.opacityStep = (this.animationSpeed / (this.maxSize - circleSize)) / 2;
};

Ripple.prototype = {
  update: function update() {
    this.circleSize = this.circleSize + this.animationSpeed;
    this.opacity = this.opacity - this.opacityStep;
    this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
      ${Math.floor(rippleSettings.strokeColor[1])},
      ${Math.floor(rippleSettings.strokeColor[2])},
      ${this.opacity})`;
  },
  draw: function draw() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.arc(this.position.x, this.position.y, this.circleSize, 0,
      2 * Math.PI);
    this.ctx.stroke();
  },
  setStatus: function setStatus(status) {
    this.status = status;
  },
};

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const ripples = [];

const height = document.body.clientHeight;
const width = document.body.clientWidth;

const rippleStartStatus = 'start';

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

canvas.style.filter = `blur(${canvasSettings.blur}px)`;

// canvas.width = width * canvasSettings.ratio;
// canvas.height = height * canvasSettings.ratio;

// canvas.style.width = `${width}px`;
// canvas.style.height = `${height}px`;

let animationFrame;



// Function which is executed on mouse hover on canvas
const canvasMouseOver = (e) => {
  const x = e.clientX * canvasSettings.ratio;
  const y = e.clientY * canvasSettings.ratio;
  ripples.unshift(new Ripple(x, y, 2, ctx));
};

const animation = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const length = ripples.length;
  for (let i = length - 1; i >= 0; i -= 1) {
    const r = ripples[i];

    r.update();
    r.draw();

    if (r.opacity <= 0) {
      ripples[i] = null;
      delete ripples[i];
      ripples.pop();
    }
  }
  animationFrame = window.requestAnimationFrame(animation);
};

animation();
canvas.addEventListener('mousemove', canvasMouseOver);







import { gsap } from "gsap";

document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.getElementById('navbar');
  const graphSection = document.querySelector('.graph');

  let isSticky = false;

  function toggleStickyNav() {
    if (window.scrollY >= graphSection.offsetTop && !isSticky) {
      gsap.to(navbar, { 
        duration: 0.3, 
        y: 0, 
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        ease: 'power2.out'
      });
      isSticky = true;
    } else if (window.scrollY < graphSection.offsetTop && isSticky) {
      gsap.to(navbar, { 
        duration: 0.3, 
        y: 0, 
        position: 'relative',
        top: 'auto',
        width: '100%',
        zIndex: 'auto',
        ease: 'power2.out'
      });
      isSticky = false;
    }
  }

  window.addEventListener('scroll', toggleStickyNav);
});



