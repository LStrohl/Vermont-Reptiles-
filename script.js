// ===================== WACK A TURTLE =====================
// Load saved score (if it exists)
var score = 0;

var savedScore = localStorage.getItem("lastScore");
if (savedScore !== null) {
  score = Number(savedScore);
}
var moleIndex = -1;
var moleTimer;
var squaresOfDivsAsArray = [];
var secondsPassed = 0;
var totalTime = 30;

function drawGameGridWithFlexbox() {
  var grid = document.getElementById("grid");
  grid.innerHTML = "";
  squaresOfDivsAsArray = [];

  for (var i = 1; i <= 9; i++) {
    var square = document.createElement("div");
    square.id = "square-" + i;
    square.classList.add("square");
    square.addEventListener("click", handleClickOnSquare);
    grid.appendChild(square);
    squaresOfDivsAsArray.push(square);
  }
}

function handleClickOnSquare(event) {
  var clickedSquare = event.target;

  if (clickedSquare.textContent === "🐢") {
    score++;
    document.getElementById("score").textContent = score;
    removeMole();
  }
}

function showMole() {
  removeMole();
  moleIndex = Math.floor(Math.random() * 9);

  var moleSquare = squaresOfDivsAsArray[moleIndex];
  moleSquare.classList.add("mole");
  moleSquare.textContent = "🐢";
}

function removeMole() {
  if (moleIndex !== -1) {
    var moleSquare = squaresOfDivsAsArray[moleIndex];
    moleSquare.classList.remove("mole");
    moleSquare.textContent = "";
    moleIndex = -1;
  }
}

function startGame() {
  clearInterval(moleTimer);
  score = 0;
  secondsPassed = 0;

  // show last saved score from previous game
  var savedScore = localStorage.getItem("lastScore");

  if (savedScore !== null) {
    document.getElementById("message").textContent =
      "Last game score: " + savedScore;
  } else {
    document.getElementById("message").textContent = "";
  }

  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = totalTime;


  drawGameGridWithFlexbox();
  moleTimer = setInterval(runGameLoop, 1000);
}
function runGameLoop() {
  if (secondsPassed >= totalTime) {
    clearInterval(moleTimer);
    removeMole();

    localStorage.setItem("lastScore", score);

    document.getElementById("message").textContent =
      "⏱️ Game Over! Final Score: " + score;
    return;
  }

  showMole();
  secondsPassed++;
  document.getElementById("time").textContent = totalTime - secondsPassed;
}

// ===================== FUN FACTS =====================

const facts = [
  "Turtles have existed for over 200 million years.",
  "Some snakes can detect heat using special pits.",
  "Salamanders can regenerate body parts."
];

// ===================== HERP RESULTS =====================

const herpResults = {
  Snake: {
    message: "🐍 You're a Snake! Mysterious and smart.",
    extra: "You think before you act."
  },
  Lizard: {
    message: "🦎 You're a Lizard! Fast and adaptable.",
    extra: "You adjust quickly to anything."
  },
  Turtle: {
    message: "🐢 You're a Turtle! Calm and steady.",
    extra: "Slow and steady wins your race."
  }
};

function showFact() {
  const randomIndex = Math.floor(Math.random() * facts.length);
  document.getElementById("factText").textContent = facts[randomIndex];
}

// ===================== MATCH THE SPECIES (FIXED ONLY HERE) =====================

const questions = [
  {
    image: "pics/milksnake.jpg",
    name: "Eastern Milksnake",
    options: ["Eastern Milksnake", "Common Watersnake", "Spotted Salamander"]
  },
  {
    image: "pics/rattlesnake.webp",
    name: "Timber Rattlesnake",
    options: ["Diamondback Rattlesnake", "Rat Snake", "Timber Rattlesnake"]
  },
  {
    image: "pics/smoothgreen.jpg",
    name: "Smooth Greensnake",
    options: ["Vine Snake", "Smooth Greensnake", "Bullfrog"]
  },
  {
    image: "pics/ringneck.jpg",
    name: "Ringneck Snake",
    options: ["Ringneck Snake", "Garter Snake", "Ribbon Snake"]
  }
];

let matchScore = 0;
let currentQuestionIndex = 0;
let selectedOption = "";
let answered = false;

function loadQuestion() {
  const imageContainer = document.getElementById("image");
  const optionsContainer = document.getElementById("options");
  const feedback = document.getElementById("feedback");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  if (!imageContainer || !optionsContainer || !feedback || !nextBtn || !submitBtn) {
    return; // prevents crash if page not ready
  }

  selectedOption = "";
  answered = false;

  const question = questions[currentQuestionIndex];

  imageContainer.innerHTML = `<img src="${question.image}" class="match-img">`;
  optionsContainer.innerHTML = "";

  question.options.forEach(option => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("match-name");
    optionElement.textContent = option;

    optionElement.onclick = function (event) {
      selectOption(option, event);
    };

    optionsContainer.appendChild(optionElement);
  });

  feedback.textContent = "";
  nextBtn.style.display = "none";
  submitBtn.style.display = "inline-block";
}

function selectOption(option, event) {
  if (answered) return;

  selectedOption = option;

  document.querySelectorAll(".match-name").forEach(opt => {
    opt.classList.remove("selected");
  });

  event.target.classList.add("selected");
}

function checkAnswer() {
  if (answered) return;

  const feedback = document.getElementById("feedback");

  if (!selectedOption) {
    feedback.textContent = "Please select an answer!";
    return;
  }

  answered = true;

  const question = questions[currentQuestionIndex];

  if (selectedOption === question.name) {
    matchScore++;
    feedback.textContent = "Correct! Great job!";
    feedback.className = "correct";
  } else {
    feedback.textContent = "Wrong! The correct answer was " + question.name;
    feedback.className = "wrong";
  }

  document.getElementById("nextBtn").style.display = "inline-block";
  document.getElementById("submitBtn").style.display = "none";
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    document.getElementById("image").innerHTML = "";
    document.getElementById("options").innerHTML = "";
    document.getElementById("feedback").textContent =
      "Game over! Your score is " + matchScore + "/" + questions.length;

    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("submitBtn").style.display = "none";
    document.getElementById("restartBtn").style.display = "inline-block";
  }
}

// ✅ SAFE START (this is the ONLY init fix)
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("image") && document.getElementById("options")) {
    loadQuestion();
  }

  const submitBtn = document.getElementById("submitBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (submitBtn) submitBtn.addEventListener("click", checkAnswer);
  if (nextBtn) nextBtn.addEventListener("click", nextQuestion);
});

function restartGame() {
  matchScore = 0;
  currentQuestionIndex = 0;

  document.getElementById("restartBtn").style.display = "none";

  loadQuestion();
}

const form = document.getElementById("surveyForm");

if (form) {
  form.addEventListener("submit", function(e){
    e.preventDefault();

    let reason = document.getElementById("reason").value.trim();
    let knowledge = document.querySelector('input[name="knowledge"]:checked');
    let favorite = document.getElementById("favorite").value;
    let message = document.getElementById("resultMessage");

    // ✅ VALIDATION
    if (reason === "" || !knowledge || favorite === "") {
      message.textContent = "Please fill out all fields!";
      message.style.color = "red";
      return;
    }

    // ✅ PERSONALIZED RESULT (THIS replaces your old message.textContent)
    let resultData = herpResults[favorite];

let result = resultData.message + " " + resultData.extra;

    // optional extra detail from radio
    if (knowledge.value === "No") {
      result += " (and just starting your herp journey!)";
    }

    message.textContent = result;
    message.style.color = "green";

    form.reset();
  });
}
