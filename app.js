"use strict";



document.addEventListener("DOMContentLoaded", function () {
  const questionElement = document.getElementById("question");
  const vraiBtn = document.getElementById("vraiBtn");
  const fauxBtn = document.getElementById("fauxBtn");
  const feedbackElement = document.getElementById("feedback");
  const nextBtn = document.getElementById("nextBtn");
  const counterElement = document.getElementById("counter");
  const contexte = document.getElementById("contexte");

  let currentQuestionIndex = 0;
  let score = 0;
  let questionsData = null;

  fetch("/assets/data/questions.json")
    .then((response) => response.json())
    .then((data) => {
      questionsData = data;
      showQuestion();
      vraiBtn.addEventListener("click", () => checkAnswer(true, questionsData[currentQuestionIndex]));
      fauxBtn.addEventListener("click", () => checkAnswer(false, questionsData[currentQuestionIndex]));
      nextBtn.addEventListener("click", () => {
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
    const currentQuestion = questionsData[currentQuestionIndex];
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
      feedbackElement.textContent = "Vous avez voté comme le peuple de l'époque";
      score++;
    } else {
      feedbackElement.textContent = `Vous n'avez pas voté comme le peuple de l'époque : ${currentQuestion.anecdote}`;
    }
  }

  function showSummary() {
    questionElement.textContent = `Récap score: ${score}/${questionsData.length}`;
    vraiBtn.style.display = "none";
    fauxBtn.style.display = "none";
    nextBtn.style.display = "none";
    counterElement.style.display = "none";
    contexte.style.display = "none";
    feedbackElement.textContent = "";
  }




//GRAPHOU :3

    //afficher de base europe
    changeData('Europe');

    document.getElementById('btnAfrique').addEventListener('click', function() {
      changeData('Afrique');
    });
    document.getElementById('btnAsie').addEventListener('click', function() {
      changeData('Asie');
    });
    document.getElementById('btnEurope').addEventListener('click', function() {
      changeData('Europe');
      console.log("europe")
    });
    document.getElementById('btnAmérique').addEventListener('click', function() {
      changeData('Amérique');
    });
    document.getElementById('btnOcéanie').addEventListener('click', function() {
      changeData('Océanie');
    });







});












//GRAPHOU :3

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'bar',
});


// bloc pour le fetch
async function fetchData() {
  try {
    const response = await fetch('/assets/data/data.json');


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
  
}






document.addEventListener('DOMContentLoaded', function() {
  gsap.registerPlugin(ScrollTrigger);

  // Define the timeline section
  const timelineSection = document.querySelector('.timeline');

  // Animate the timeline section on scroll
  gsap.to(timelineSection, {
    x: '0%', // Move the section to the center of the screen
    opacity: 1, // Make it fully visible
    duration: 1, // Animation duration
    ease: 'power2.inOut', // Animation easing
    scrollTrigger: {
      trigger: timelineSection,
      start: 'top center', // Start the animation when the top of the section reaches the center of the viewport
      end: 'bottom center', // End the animation when the bottom of the section reaches the center of the viewport
      scrub: true, // Smoothly animate the position and opacity
      markers: true // Enable markers for visualization (remove this in production)
    }
  });
});
