"use strict"

/* ---------- NAVIGATION PAGE QUIZ ---------- */

let startBtn = document.querySelector(".quizz__button--start");
let startSection = document.querySelector(".quizz--start");
let quizzSection = document.querySelector(".quizz__container");
let recapSection = document.querySelector(".quizz--recap");
let resultElement = document.querySelector(".quizz__result");

startBtn.addEventListener("click", function () {
  startSection.classList.add("hidden");
  quizzSection.classList.remove("hidden");
});

function showSummary() {
  quizzSection.classList.add("hidden");
  recapSection.classList.remove("hidden");
  resultElement.textContent = `Votre score: ${score}/${questionsData.length}`;
}

/* ---------- CODE QUIZ ---------- */

let questionElement = document.querySelector(".quizz__question");
let vraiBtn = document.querySelector(".quizz__button--vrai");
let fauxBtn = document.querySelector(".quizz__button--faux");
let feedbackElement = document.querySelector(".quizz__feedback");
let skipBtn = document.querySelector(".quizz__button--skip");
let counterElement = document.querySelector(".quizz__counter");

let currentQuestionIndex = 0;
let score = 0;
let questionsData = null;

if (questionElement) {
  fetch("../assets/data/questions.json")
    .then((response) => response.json())
    .then((data) => {
      questionsData = data;
      showQuestion();
      vraiBtn.addEventListener("click", () => checkAnswer(true, questionsData[currentQuestionIndex]));
      fauxBtn.addEventListener("click", () => checkAnswer(false, questionsData[currentQuestionIndex]));
      skipBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questionsData.length) {
          showQuestion();
        } else {
          showSummary();
        }
      });
    });
}

function showQuestion() {
  if (!questionElement || currentQuestionIndex >= questionsData.length) {
    return;
  }
  let currentQuestion = questionsData[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  feedbackElement.textContent = "";
  vraiBtn.style.display = "inline";
  fauxBtn.style.display = "inline";
  vraiBtn.disabled = false;
  fauxBtn.disabled = false;
  counterElement.textContent = `${currentQuestionIndex + 1}/${questionsData.length}`;
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
}
/*
function showSummary() {
  questionElement.textContent = `Votre score: ${score}/${questionsData.length}`;
  vraiBtn.style.display = "none";
  fauxBtn.style.display = "none";
  skipBtn.style.display = "none";
  counterElement.style.display = "none";
  feedbackElement.textContent = "";
}
*/


/*
   //GRAPHOU :3

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
     console.log("europe")
   });
   document.getElementById('btnAmérique').addEventListener('click', function () {
     changeData('Amérique');
   });
   document.getElementById('btnOcéanie').addEventListener('click', function () {
     changeData('Océanie');
   });
 */










//GRAPHOU :3
/*
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'bar',
});


// bloc pour le fetch
async function fetchData() {
  try {
    const response = await fetch('../assets/data/laws.json');


    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données.');
    }


    const data = await response.json();


    return data;
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
  console.log(data)
  console.log(data.map(entry => entry.pays))
  console.log(data.map(entry => entry.Absurdité))

  const chartData = {
    labels: data.map(entry => entry.pays),
    datasets: [{
      label: "taux absurdité",
      data: data.map(entry => entry.Absurdité),
      backgroundColor: "red"
    }]
  };

  const options = {
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
          font: {
            family: 'Helvetica',
            size: 20
          },
          color: 'black'
        },
        title: {
          display: true,
          text: xAxisLabel,
          font: {
            family: 'Helvetica',
            size: 20
          },
          color: 'blue'
        }
      },
      y: {
        ticks: {
          font: {
            family: 'Helvetica',
            size: 20
          },
          color: 'blue'
        },
        title: {
          display: true,
          text: yAxisLabel,
          font: {
            family: 'Helvetica',
            size: 20
          },
          color: 'black'
        }
      }
    },
    plugins: {
      tooltip: {
        bodyFont: {
          family: 'Helvetica',
          size: 15
        },
        titleFont: {
          family: 'Helvetica',
          size: 15
        }
      }
    },



  };

  myChart.data = chartData
  myChart.options = options

  myChart.update()

}*/





















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
*/