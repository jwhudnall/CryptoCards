/*
Notes/Observations:
  - Current codebase will not work if card divs have more than 1 class. Could refactor to include cards in HTML natively, vs. dynamically using JS.
  - Should refactor to incorporate a smooth card flip.
*/

const gameContainer = document.getElementById("game");
const highScoreSpan = document.querySelector('#high-score');
const currentScoreSpan = document.querySelector('#current-score');
const scoreboard = document.querySelector('#scoreboard');
let nextCardClass = null;
let userCanClick = true;
let score = 0;

const images = {
  'algo': 'images/algo.gif',
  'bob': 'images/bob.gif',
  'btc-tunnel': 'images/btc-tunnel.gif',
  'btc': 'images/btc.gif',
  'gibson': 'images/gibson.gif',
  'marley': 'images/marley.gif',
  'matrix': 'images/matrix.gif',
  'monkey': 'images/monkey.gif',
  'skull': 'images/skull.gif',
  'wario': 'images/wario.gif',
};

// Array of image names, each listed twice
const cardNames = Object.keys(images).concat(Object.keys(images));
let shuffledCards = shuffle(cardNames);

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// function createCards(arr) {
//   for (let card of arr) {
//     const newDiv = document.createElement("div");
//     newDiv.classList.add(card);
//     newDiv.setAttribute("data-clicked", false);
//     newDiv.addEventListener("click", handleCardClick);
//     gameContainer.append(newDiv);
//   }
// }
// TODO: Modify so each card contains: scene => card => 2 face Divs
function createCards(arr) {
  for (let card of arr) {
    // Create a div, with class scene
    const scene = document.createElement('div');
    scene.classList.add('scene');
    // create a div, with class card
    const cardObj = document.createElement('div');
    cardObj.classList.add('card');
    // create TWO divs:
    // 1 with classes: card_face card_face-front
    const cardFront = document.createElement('div');
    cardFront.classList.add('card__face', 'card__face-front', card);
    cardFront.setAttribute("data-clicked", false);
    // 2 with classes: card_face card_face-back
    const cardBack = document.createElement('div');
    cardBack.classList.add('card__face', 'card__face-back');
    cardBack.style.backgroundImage = `url(${images[card]})`;
    cardObj.append(cardFront, cardBack);
    // cardObj.classList.add(card);
    cardFront.addEventListener("click", handleCardClick);
    scene.append(cardObj);
    // const newDiv = document.createElement("div");
    // scene.classList.add(card);
    gameContainer.append(scene);
  }
}

function handleCardClick(event) {
  let cardClass = event.target.className.split(' ')[2]; // third class
  let hasBeenClicked = event.target.dataset.clicked;

  if (hasBeenClicked === "false" && userCanClick) {
    updateScore();
    flipCard(event, cardClass);
    checkBoard(event, cardClass);
    checkGameStatus();
  }
}

function updateScore() {
  score++;
  currentScoreSpan.textContent = score;
}

function checkGameStatus() {
  const cardFronts = Array.from(document.querySelectorAll('.card__face-front'));
  if (cardFronts.every(el => el.dataset.clicked === "true")) {
    gameOver();
  }
}

function gameOver() {
  updateLocalStorage();
  let playAgainBtn = document.createElement('button');
  playAgainBtn.textContent = 'Play Again?';
  playAgainBtn.classList.add('btn');
  document.body.append(playAgainBtn);
  window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom

  playAgainBtn.addEventListener('click', function () {
    playGame(playAgainBtn);
    scrollToTop();
  })
}

function scrollToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

function updateLocalStorage() {
  if (!localStorage.score || score < parseInt(localStorage.score)) {
    localStorage.setItem('score', score);
    highScoreSpan.textContent = score;
    displayHighScoreBanner();
  }
}

function displayHighScoreBanner() {
  const banner = document.createElement('span');
  banner.classList.add('high-score-banner');
  banner.textContent = 'New High Score!';
  document.body.append(banner);
}

function playGame(btn) {
  const banner = document.querySelector('.high-score-banner');
  gameContainer.innerHTML = '';
  shuffledCards = shuffle(cardNames);
  createCards(shuffledCards);
  btn.remove();
  if (banner) {
    banner.remove();
  }
  score = 0;
  currentScoreSpan.textContent = 0;
}

function flipCard(event, cardClass) {
  event.target.dataset.clicked = true;
  event.target.parentNode.classList.add('is-flipped');
}

function checkBoard(event, cardClass) {
  if (nextCardClass === cardClass) {
    nextCardClass = null;
    event.target.parentNode.classList.add('is-flipped');
  } else if (nextCardClass === null) {
    nextCardClass = cardClass;
  } else {
    resetFlippedCards(event, cardClass);
  }
}

function resetFlippedCards(event, cardClass) {
  userCanClick = !userCanClick;

  setTimeout(function () {
    const cardsOfNextType = document.getElementsByClassName(nextCardClass);
    event.target.dataset.clicked = false;
    event.target.parentNode.classList.remove('is-flipped');
    for (let card of cardsOfNextType) {
      card.parentNode.classList.remove('is-flipped');
      card.dataset.clicked = false;
    }
    nextCardClass = null;
    userCanClick = !userCanClick;
  }, 2000)
}

function displayHomeScreen() {
  gameContainer.style.display = "none";
  scoreboard.style.display = "none";

  let startSection = document.createElement('section');
  let startBtn = document.createElement('button');
  startSection.classList.add('start-screen');
  startBtn.textContent = "Play";
  startBtn.classList.add('btn');
  startSection.append(startBtn);
  document.body.append(startSection);

  startBtn.addEventListener("click", function () {
    startSection.style.display = "none";
    gameContainer.removeAttribute('style');
    scoreboard.removeAttribute('style');
    document.querySelector('h2').remove();
  })
}

function getHighScore() {
  highScoreSpan.textContent = localStorage.score || "N/A";
}

function startProgram() {
  getHighScore();
  createCards(shuffledCards);
}

startProgram();
displayHomeScreen();