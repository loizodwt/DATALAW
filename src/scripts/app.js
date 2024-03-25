"use strict";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


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











// Scroll horizontal, à priori il n'y a pas besoin d'y toucher
gsap.registerPlugin(ScrollTrigger);

const timeline = document.querySelector(".timeline");
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
