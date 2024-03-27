"use strict"

import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

/* ---------- timeline ---------- */

const timeline = document.querySelector(".timeline");

// condition : ne run que si la timeline existe
if (timeline) {
  const sections = gsap.utils.toArray(".timeline > div");

  let totalWidth = 0;
  sections.forEach((section) => {
    const sectionStyles = getComputedStyle(section);
    totalWidth += section.offsetWidth + parseInt(sectionStyles.marginLeft) + parseInt(sectionStyles.marginRight);
  });

  gsap.to(sections, {
    x: () => {
      return -(totalWidth - timeline.offsetWidth);
    },
    ease: "none",
    scrollTrigger: {
      trigger: ".timeline",
      pin: true,
      start: "top top",
      scrub: 1,
      end: () => {
        return "+=" + (totalWidth - timeline.offsetWidth);
      },
      snap: {
        snapTo: "labels",
        duration: { min: 0.1, max: 0.3 },
        delay: 0.2,
      },
      onLeaveBack: (self) => {
        if (self.progress === 1 && window.innerWidth < 768) {
          self.scroll(self.start - 50);
        }
      }
    },
  });

  // Draggable icons
  gsap.registerPlugin(Draggable);

  Draggable.create(".singapour__grab", {
    bounds: ".timeline__3",
  });

  Draggable.create(".singapour__modal", {
    bounds: ".timeline__3",
  });

  // Boutons modale Singapour
  let closeButton = document.getElementById("close");
  let singapourWindow = document.querySelector(".singapour__modal");
  let datalawsIcon = document.querySelector(".singapour__datalaws");

  closeButton.addEventListener("click", reduce);

  function reduce() {
    singapourWindow.classList.add("reduced");
  }

  datalawsIcon.addEventListener("dblclick", toggleVisibility);

  function toggleVisibility() {
    singapourWindow.classList.toggle("reduced");
  }
}


/* ---------- QUIZ ---------- */

// condition : code du quiz ne se lance qui sur la page du quiz
let quizSection = document.querySelector(".quiz__container");
if (quizSection) {


  let questionElement = document.querySelector(".quiz__question");
  let vraiBtn = document.querySelector(".quiz__button--vrai");
  let fauxBtn = document.querySelector(".quiz__button--faux");
  let feedbackElement = document.querySelector(".quiz__feedback");
  let skipBtn = document.querySelector(".quiz__button--skip");
  let counterElement = document.querySelector(".quiz__counter--current");
  let counterTotal = document.querySelector(".quiz__counter--total");

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
    vraiBtn.style.display = "flex";
    fauxBtn.style.display = "flex";
    vraiBtn.disabled = false;
    fauxBtn.disabled = false;
    counterElement.textContent = `${currentQuestionIndex + 1}`;
    counterTotal.textContent = `/ ${questionsData.length}`;

    // Update country and date elements
    let countryElement = document.querySelector(".quiz__h2");
    let dateElement = document.querySelector(".quiz__date");
    countryElement.textContent = currentQuestion.pays;
    dateElement.textContent = currentQuestion.periode;

    // Assign class based on periode for the current question
    assignClassBasedOnPeriode(currentQuestion.periode, quizSection);
  }


  function checkAnswer(userAnswer, currentQuestion) {
    // vraiBtn.classList.add = "hidden";
    // fauxBtn.classList.add = "hidden";
    vraiBtn.style.display = "none";
    fauxBtn.style.display = "none";

    if (userAnswer === currentQuestion.reponse) {
      feedbackElement.textContent = "Vous avez voté comme le peuple de l'époque: " + currentQuestion.anecdote;
      score++;
    } else {
      feedbackElement.textContent = "Vous n'avez pas voté comme le peuple de l'époque: " + currentQuestion.anecdote;
    }

    // Record user's answer only if it's not a skip
    if (userAnswer !== null) {
      userAnswers[currentQuestionIndex] = userAnswer;
    }
  }

  /* ---------- NAVIGATION ---------- */

  let recapSection = document.querySelector(".quiz--recap");
  let scoreElement = document.querySelector(".quiz__result--score");
  let percentElement = document.querySelector(".quiz__result--percent span");

  function showSummary() {
    quizSection.classList.add("hidden");
    recapSection.classList.remove("hidden");

    // score
    scoreElement.textContent = "Votre score: " + score + "/" + questionsData.length;
    // pourcentage
    let successPercentage = (score / questionsData.length) * 100;
    percentElement.textContent = `${successPercentage.toFixed(2)}%`;

    populateRecapLists();
  }

  /* ---------- RECAP ---------- */

  let recapTrueList = document.querySelector(".quiz--recap__true");
  let recapFalseList = document.querySelector(".quiz--recap__false");

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
            listItem.classList.add("correct");
          } else {
            listItem.classList.add("wrong");
          }
          recapTrueList.appendChild(listItem);
          hasTrueQuestions = true;
        } else {
          if (isCorrect) {
            listItem.classList.add("correct");
          } else {
            listItem.classList.add("wrong");
          }
          recapFalseList.appendChild(listItem);
          hasFalseQuestions = true;
        }
      } else {
        // For skipped questions, add them to the respective list based on their question type
        if (question.reponse === true) {
          recapTrueList.appendChild(listItem);
          hasTrueQuestions = true;
        } else {
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



  /* ---------- RESET QUIZ ---------- */

  let restartBtn = document.querySelector(".quiz__button--restart");

  restartBtn.addEventListener("click", restartQuiz);

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;

    // Reset userAnswers array
    userAnswers = new Array(questionsData.length).fill(null);

    // Hide recap section and show start section
    recapSection.classList.add("hidden");
    // startSection.classList.remove("hidden");
    quizSection.classList.remove("hidden");

    // Clear recap lists
    recapTrueList.innerHTML = "";
    recapFalseList.innerHTML = "";

    // Reset question counter
    counterElement.textContent = "1/" + questionsData.length;

    // Call showQuestion to display the first question
    showQuestion();
  }

  /* ---------- QUIZ AUTO-CLASS ---------- */

  function assignClassBasedOnPeriode(periode, element) {
    if (!periode || !element) return;

    let periodeClass = "";

    if (periode <= 1999) {
      periodeClass = "two";
    } else if (periode >= 2000 && periode <= 2009) {
      periodeClass = "three";
    } else if (periode >= 2010) {
      periodeClass = "four";
    }

    // Remove existing classes
    element.classList.remove("two", "three", "four");

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
    strokeColor: [137, 137, 218],
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

  canvas.width = width * canvasSettings.ratio;
  canvas.height = height * canvasSettings.ratio;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

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


console.log('Agrandissez la fenêtre');
function showThings() {
  fetch('../assets/fonts/marge.txt')
    .then(function (response) {
      return response.text()
    })
    .then(function (text) {
      console.log(text)
    });
}

showThings()

/* ---------- ANIMATION LOGO ---------- */

let logoContainer = document.getElementById("logo-container");
let logoTexts = document.querySelectorAll("#logo-text");

logoContainer.addEventListener("mouseover", function () {
  logoTexts.forEach(logoText => {
    let text = logoText.textContent;
    let textLength = text.length;
    let randomIndices = [];
    const fontArray = ["satoshi", "w9", "pix", "gensco", "ortica", "valiant", "livingstone", "elite"];

    // Generate random indices for characters to change
    while (randomIndices.length < Math.min(4, textLength)) {
      let randomIndex = Math.floor(Math.random() * textLength);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }

    // Change font for random characters
    let newText = "";
    for (let i = 0; i < textLength; i++) {
      if (randomIndices.includes(i)) {
        const randomFont = fontArray[Math.floor(Math.random() * fontArray.length)];
        newText += `<span class='${randomFont}'>` + text[i] + "</span>";
      } else {
        newText += text[i];
      }
    }

    logoText.innerHTML = newText;
  });
});