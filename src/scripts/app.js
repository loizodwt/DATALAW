"use strict"


// condition : code du quiz ne se lance qui sur la page du quiz

let quizSection = document.querySelector(".quiz__container");
if (quizSection) {

  /* ---------- QUIZ MAIN CODE ---------- */

  let questionElement = document.querySelector(".quiz__question");
  let vraiBtn = document.querySelector(".quiz__button--vrai");
  let fauxBtn = document.querySelector(".quiz__button--faux");
  let feedbackElement = document.querySelector(".quiz__feedback");
  let skipBtn = document.querySelector(".quiz__button--skip");
  let counterElement = document.querySelector(".quiz__counter");

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
    vraiBtn.style.display = "inline";
    fauxBtn.style.display = "inline";
    vraiBtn.disabled = false;
    fauxBtn.disabled = false;
    counterElement.textContent = `${currentQuestionIndex + 1}/${questionsData.length}`;

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

  /* ---------- QUIZ NAVIGATION ---------- */

  let startBtn = document.querySelector(".quiz__button--start");
  let startSection = document.querySelector(".quiz--start");

  let recapSection = document.querySelector(".quiz--recap");
  let resultElement = document.querySelector(".quiz__result");

  startBtn.addEventListener("click", function () {
    startSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
  });

  function showSummary() {
    quizSection.classList.add("hidden");
    recapSection.classList.remove("hidden");
    resultElement.textContent = `Votre score: ${score}/${questionsData.length}`;

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
    startSection.classList.remove("hidden");

    // Clear recap lists
    recapTrueList.innerHTML = "";
    recapFalseList.innerHTML = "";

    // Reset question counter
    counterElement.textContent = "1/" + questionsData.length;

    // Call showQuestion to display the first question
    showQuestion();
  }

  /* ---------- QUIZ AUTO-CLASS ---------- */

  function parsePeriodeToYear(periode) {
    // Conversion siècle -> année
    if (periode.includes("siècle")) {
      let century = parseInt(periode.match(/\d+/)[0]);
      return (century - 1) * 100;
    } else {
      return parseInt(periode);
    }
  }


  function assignClassBasedOnPeriode(periode, element) {
    if (!periode || !element) return;

    let year = parsePeriodeToYear(periode);
    let periodeClass = "";

    if (year < 1900) {
      periodeClass = "MoyenAge";
    } else if (year >= 1900 && year <= 1999) {
      periodeClass = "two";
    } else if (year >= 2000 && year <= 2009) {
      periodeClass = "three";
    } else if (year >= 2010 && year <= 2019) {
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