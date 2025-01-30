const question = "Ce qui ne se ...... pas se perd !";
const answer = "partage";
let currentAnswer = "";

document.querySelector("#question-text").innerHTML = question;

// 1. Create answer slots
const nbrSlot = answer.length;
const slotsContainer = document.querySelector(".answer-slots");
for (let i = 0; i < nbrSlot; i++) {
  const slotElement = document.createElement("div");
  slotElement.className = "slot";
  slotElement.dataset.slotIndex = i;
  slotsContainer.appendChild(slotElement);
}

// 2. Create the letters (button)
const answerLetters = answer.toUpperCase().split("");
const randomLetters = [];
const rest = 15 - answer.length;
for (let i = 0; i < rest; i++) {
  const l = getRandomLetter();
  randomLetters.push(l);
}

const allLetters = [...answerLetters, ...randomLetters];

// 3. Shuffle the letters
allLetters.sort(() => Math.random() - 0.5);

const lettersContainer = document.querySelector("#letters-grid");
for (let l of allLetters) {
  const letterBtn = document.createElement("button");
  letterBtn.className = "letter-btn";
  letterBtn.innerText = l;

  // Add event listeners
  letterBtn.addEventListener("click", function () {
    if (currentAnswer.length >= answer.length) {
      return;
    }
    currentAnswer += l;
    const slotIndex = currentAnswer.length - 1;
    const slot = document.querySelector(`[data-slot-index="${slotIndex}"].slot`);
    
    slot.innerHTML = l;
    slot.style.animation = "appear 0.2s ease-out";
    letterBtn.classList.add("used");

    // Check game status
    if (currentAnswer === answer.toUpperCase()) {
      playWinSound(); // Joue le son de victoire
      animateWin();
    } else if (currentAnswer.length === answer.length) {
      animateShake(); // Vibre les cases avant d'afficher "Try again :(" 
    }
  });

  // Add it to the parent
  lettersContainer.append(letterBtn);
}

function getRandomLetter() {
  const randomNumber = Math.floor(Math.random() * 26);
  return String.fromCharCode(randomNumber + 65);
}

const undoBtn = document.querySelector("#undo-btn");
undoBtn.addEventListener("click", function () {
  if (currentAnswer.length === 0) return;

  const lastLetter = currentAnswer[currentAnswer.length - 1];
  currentAnswer = currentAnswer.slice(0, -1);

  const lastSlotIndex = currentAnswer.length;
  const lastSlot = document.querySelector(`[data-slot-index="${lastSlotIndex}"].slot`);
  
  lastSlot.style.animation = "fadeOut 0.2s ease-out";
  setTimeout(() => {
    lastSlot.innerHTML = "";
  }, 200);

  const usedButtons = document.querySelectorAll(".letter-btn.used");
  for (let btn of usedButtons) {
    if (btn.innerText === lastLetter) {
      btn.classList.remove("used");
      break;
    }
  }
});

function playWinSound() {
  const winSound = new Audio("win-sound.mp3");
  winSound.play();
}

function animateWin() {
  const slots = document.querySelectorAll(".slot");
  slots.forEach((slot, index) => {
    setTimeout(() => {
      slot.style.backgroundColor = "#2ecc71";
      slot.style.transform = "scale(1.2)";
      setTimeout(() => {
        slot.style.transform = "scale(1)";
      }, 200);
    }, index * 150);
  });
  setTimeout(() => {
    alert("Correct!");
  }, slots.length * 150 + 300);
}

function animateShake() {
  const slots = document.querySelectorAll(".slot");
  slots.forEach(slot => {
    slot.style.animation = "shake 0.3s ease";
  });
  setTimeout(() => {
    alert("Try again : (");
  }, 400);
}
