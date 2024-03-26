"use strict"

import { gsap } from "gsap";

/* ---------- timeline ---------- */
/*
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
  // Selecting top container and template
  let topContainer = document.querySelector('.top');
  let template = document.querySelector('.top__container');

  // Check if template exists
  if (!template) {
    console.error("Template not found!");
    return;
  }

  // Sort JSON data by "Absurdité" value in descending order
  jsonData.sort((a, b) => b.Absurdité - a.Absurdité);

  // Iterate through JSON data
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
    clone.querySelector('.top__number').textContent = index + 1; // Increment index for numbering
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

  // Remove the template from DOM
  template.remove();
}


// Fetch JSON data and populate HTML
let lawsDataURL = 'assets/data/laws.json';
fetchJSONData(lawsDataURL)
  .then(data => populateHTML(data))
  .catch(error => console.error('Error fetching JSON data:', error));
*/

/* ---------- QUIZ ---------- */
// condition : code du quiz ne se lance qui sur la page du quiz

let quizSection = document.querySelector(".quiz__container");
if (quizSection) {

  let questionElement = document.querySelector(".quiz__question");
  let vraiBtn = document.querySelector(".quiz__button--vrai");
  let fauxBtn = document.querySelector(".quiz__button--faux");
  let feedbackElement = document.querySelector(".quiz__feedback");
  let skipBtn = document.querySelector(".quiz__button--skip");
  let counterElement = document.querySelector(".quiz__compteur--current");

  let currentQuestionIndex = 0;
  let score = 0;
  let questionsData = null;
  let userAnswers = [];

  fetch("../assets/data/questions.json")
    .then((response) => response.json())
    .then((data) => {
      questionsData = data;
      userAnswers = new Array(questionsData.length).fill(null); // Initialize userAnswers array with null values
      showQuestion();
      vraiBtn.addEventListener("click", () => checkAnswer(true, questionsData[currentQuestionIndex]));
      fauxBtn.addEventListener("click", () => checkAnswer(false, questionsData[currentQuestionIndex]));
      skipBtn.addEventListener("click", () => {
        if (userAnswers[currentQuestionIndex] === null) {
          userAnswers[currentQuestionIndex] = null; // Record skipped answer only if not answered already
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questionsData.length) {
          showQuestion();
        } else {
          showSummary();
        }
      });
    });


  function showQuestion() {
    if (!questionElement || currentQuestionIndex >= questionsData.length) {
      return;
    }
    let currentQuestion = questionsData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    feedbackElement.textContent = "";
    vraiBtn.disabled = false;
    fauxBtn.disabled = false;
    counterElement.textContent = `${currentQuestionIndex + 1}`;

    // Assign class based on periode for the current question
    assignClassBasedOnPeriode(currentQuestion.periode, quizSection);
  }

  function checkAnswer(userAnswer, currentQuestion) {
    vraiBtn.disabled = true;
    fauxBtn.disabled = true;

    if (userAnswer === currentQuestion.reponse) {
      feedbackElement.textContent = `Vous avez voté comme le peuple de l'époque: ${currentQuestion.anecdote}`;
      score++;
    } else {
      feedbackElement.textContent = `Vous n'avez pas voté comme le peuple de l'époque: ${currentQuestion.anecdote}`;
    }

    // Record user's answer only if it's not a skip
    if (userAnswer !== null) {
      userAnswers[currentQuestionIndex] = userAnswer;
    }
  }

  // NAVIGATION

  let startBtn = document.querySelector(".quiz__button--start");
  let startSection = document.querySelector(".quiz__intro");
  let recapSection = document.querySelector(".quiz__recap");
  let scoreElement = document.querySelector(".quiz__result--score");
  let percentElement = document.querySelector(".quiz__result--percent span");

  startBtn.addEventListener("click", function () {
    startSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
  });

  function showSummary() {
    // changement de section
    quizSection.classList.add("hidden");
    recapSection.classList.remove("hidden");

    // score
    scoreElement.textContent = `Votre score: ${score}/${questionsData.length}`;
    // pourcentage
    let successPercentage = (score / questionsData.length) * 100;
    percentElement.textContent = `${successPercentage.toFixed(2)}%`;

    populateRecapLists();
  }

  // RECAP

  let recapTrueList = document.querySelector(".quiz__recap__true");
  let recapFalseList = document.querySelector(".quiz__recap__false");

  function populateRecapLists() {
    // Clear existing content in the recap lists
    recapTrueList.innerHTML = "";
    recapFalseList.innerHTML = "";

    // Populate the recap lists with the recap of questions
    let hasTrueQuestions = false;
    let hasFalseQuestions = false;

    questionsData.forEach((question, index) => {
      let listItem = document.createElement("li");
      listItem.textContent = question.question;

      if (userAnswers[index] !== null) {
        let isCorrect = (userAnswers[index] === question.reponse);

        if (question.reponse === true) {
          if (isCorrect) {
            listItem.classList.add("quiz--correct");
          } else {
            listItem.classList.add("quiz--wrong");
          }
          recapTrueList.appendChild(listItem);
          hasTrueQuestions = true;
        } else {
          if (isCorrect) {
            listItem.classList.add("quiz--correct");
          } else {
            listItem.classList.add("quiz--wrong");
          }
          recapFalseList.appendChild(listItem);
          hasFalseQuestions = true;
        }
      } else {
        // For skipped questions, add them to the respective list based on their question type
        if (question.reponse === true) {
          listItem.classList.add("skipped");
          recapTrueList.appendChild(listItem);
          hasTrueQuestions = true;
        } else {
          listItem.classList.add("skipped");
          recapFalseList.appendChild(listItem);
          hasFalseQuestions = true;
        }
      }
    });

    // Append titles only if there are corresponding questions
    if (hasTrueQuestions) {
      let trueTitle = document.createElement("h3");
      trueTitle.classList.add("title");
      trueTitle.textContent = "Les vraies lois";
      recapTrueList.prepend(trueTitle); // Add title before the list
    }

    if (hasFalseQuestions) {
      let falseTitle = document.createElement("h3");
      falseTitle.classList.add("title");
      falseTitle.textContent = "Les légendes urbaines";
      recapFalseList.prepend(falseTitle); // Add title before the list
    }
  }



  // RESET QUIZ

  let restartBtn = document.querySelector(".quiz__button--restart");

  restartBtn.addEventListener("click", restartQuiz);

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;

    // Reset userAnswers array
    userAnswers = new Array(questionsData.length).fill(null);

    // Hide recap section and show start section
    recapSection.classList.add("hidden");
    startSection.classList.remove("hidden");

    // Clear recap lists
    recapTrueList.innerHTML = "";
    recapFalseList.innerHTML = "";

    // Reset question counter
    counterElement.textContent = "1/" + questionsData.length;

    // Call showQuestion to display the first question
    showQuestion();
  }

  // AUTO-CLASS

  function assignClassBasedOnPeriode(periode, element) {
    if (!periode || !element) return;

    let periodeClass = "";

    if (periode <= 1999) {
      periodeClass = "two";
    } else if (periode >= 2000 && periode <= 2009) {
      periodeClass = "three";
    } else if (periode >= 2010 && periode <= 2019) {
      periodeClass = "four";
    } else {
      periodeClass = "five";
    }

    // Remove existing classes
    element.classList.remove("MoyenAge", "two", "three", "four", "five");

    // Add new class
    element.classList.add(periodeClass);
  }

}


/* ---------- WATER EFFECT ---------- */

const canvas = document.querySelector('#canvas');

// condition : ne run que si l'élément canvas existe
if (canvas) {
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

  const ctx = canvas.getContext('2d');
  const ripples = [];

  const height = document.body.clientHeight;
  const width = document.body.clientWidth;

  const rippleStartStatus = 'start';

  const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

  canvas.style.filter = `blur(${canvasSettings.blur}px)`;

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
}


/* ---------- NAVIGATION STICKY ---------- */

const navbar = document.getElementById('navbar');
const graphSection = document.querySelector('.graphique');

// condition : ne run que si la navbar ET le graph existent
if (navbar && graphSection) {
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





  /* ---------- GRAPHIQUE ---------- */

  // condition : ne run que si le grpahique existe
  if (graphSection) {
    //afficher de base europe
    changeData('Europe');

    document.getElementById('btnAfrique').addEventListener('click', function () {
      changeData('Afrique');
    });
    document.getElementById('btnAsie').addEventListener('click', function () {
      changeData('Asie');
    });
    document.getElementById('btnEurope').addEventListener('click', function () {
      changeData('Europe');
    });
    document.getElementById('btnAmérique').addEventListener('click', function () {
      changeData('Amérique');
    });
    document.getElementById('btnOcéanie').addEventListener('click', function () {
      changeData('Océanie');
    });


    var buttons = document.querySelectorAll('.button');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        button.classList.add('clicked');
      });
    });

    window.addEventListener('scroll', toggleStickyNav);
  }




  //GRAPHOU :3

  const ctxm = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctxm, {
    type: 'bar',
  });

  // Common options
  const fontSize = 16;
  const commonFont = {
    size: fontSize
  };

  // bloc pour le fetch
  async function fetchData() {
    try {
      const response = await fetch('../assets/data/data.json');

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données.');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur:', error.message);
    }
  }

  function changeData(continent) {
    fetchData()
      .then(data => {
        const continentData = data.continents[continent];
        createChart(continentData, data.xAxisLabel, data.yAxisLabel);
      });
  }

  function createChart(data, xAxisLabel, yAxisLabel) {

    const chartData = {
      labels: data.map(entry => entry.pays),
      datasets: [{
        label: "Moyenne d'absurdité",
        data: data.map(entry => entry.Absurdité),
        backgroundColor: "#3E2F60"
      }]
    };

    const options = {
      responsive: true, // Ensure chart responsiveness
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      },
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          suggestedMax: 5,
          ticks: {
            font: commonFont
          },
          title: {
            display: true,
            text: xAxisLabel,
            font: commonFont
          }
        },
        y: {
          ticks: {
            font: commonFont
          },
          title: {
            display: true,
            text: yAxisLabel,
            font: commonFont
          }
        }
      },
      plugins: {
        tooltip: {
          bodyFont: commonFont,
          titleFont: commonFont
        }
      },
      onClick: (e) => {
        const canvasPosition = Chart.helpers.getRelativePosition(e, myChart);

        const dataX = myChart.scales.x.getValueForPixel(canvasPosition.x);
        const dataY = myChart.scales.y.getValueForPixel(canvasPosition.y);

        let dataIndex = Math.abs(dataY);

        const loiContainer = document.querySelector('.graphique__lois');

        if (dataIndex >= 0 && dataIndex < data.length) {
          loiContainer.classList.remove('hidden');
          loiContainer.innerHTML = "<h3>Lois aléatoires:</h3><p>" + data[dataIndex].Loi + "</p>";
        } else {
          loiContainer.classList.add('hidden');
        }
      }
    };

    myChart.data = chartData;
    myChart.options = options;
    myChart.update();
  }
}
