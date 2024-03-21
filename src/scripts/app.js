"use strict"

// Function to fetch JSON data
async function fetchJSONData(url) {
  try {
    const response = await fetch(url);
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
  const topContainer = document.querySelector('.top');
  const template = document.querySelector('#top-template');

  jsonData.forEach((data, index) => {
    // Clone template content
    const clone = template.content.cloneNode(true);

    // Fill cloned content with data
    clone.querySelector('.top__pays').textContent = data.Pays;
    clone.querySelector('.top__loi').textContent = data.Loi;
    clone.querySelector('.top__date').textContent = `${data.Début} - ${data.Fin}`;
    clone.querySelector('.top__comment').textContent = data.Commentaire;
    clone.querySelector('.top__rating').textContent = `${data.Absurdité} ♥`;

    // Append cloned content to topContainer
    topContainer.appendChild(clone);
  });
}

// Fetch JSON data and populate HTML
const lawsDataURL = '../assets/data/laws.json';
fetchJSONData(lawsDataURL)
  .then(data => populateHTML(data))
  .catch(error => console.error('Error fetching JSON data:', error));



// test initial
/*
document.addEventListener("DOMContentLoaded", function () {
  const questionElement = document.getElementById("question");
  const vraiBtn = document.getElementById("vraiBtn");
  const fauxBtn = document.getElementById("fauxBtn");
  const feedbackElement = document.getElementById("feedback"); // test a ignorer
  const skipBtn = document.getElementById("skipBtn");

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
    const currentQuestion = questionsData[currentQuestionIndex];
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
    const currentQuestion = questions[currentQuestionIndex];
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