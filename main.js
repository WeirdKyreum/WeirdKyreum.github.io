// Switches visible screen by adding/removing 'active' class
function showScreen(id) {
  // Reset quiz if leaving quiz screen
  if (document.getElementById('quiz')?.classList.contains('active') && id !== 'quiz') {
    resetQuiz();
  }

  // Hide all screens
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));

  // Show the target screen
  document.getElementById(id).classList.add('active');

  // If switching to game screen, show Start button and reset game
  if (id === 'game') {
    startGameBtn.style.display = 'inline-block';
    restartButton.style.display = 'none';
    stopGame(); // clears ongoing game if still running
  }
}

// Resets all quiz answers and feedback text
function resetQuiz() {
  document.querySelectorAll('#quiz input[type="radio"]').forEach(el => el.checked = false);
  scorebox.textContent = "Not submitted";
}

// ===== QUIZ FUNCTIONALITY =====
const btnSubmit = document.querySelector("#btnSubmit");
const scorebox = document.querySelector("#scorebox");
const corrAnsArray = ["Rhythm Game", "Namco", "Japan"]; // Adjust this array to match correct answers

btnSubmit.addEventListener("click", () => {
  let score = 0;
  for (let i = 0; i < corrAnsArray.length; i++) {
    const selected = document.querySelector(`input[name="q${i + 1}"]:checked`);
    if (selected?.value === corrAnsArray[i]) score++;
  }
  scorebox.textContent = "Score: " + score;
});

// ===== GAME FUNCTIONALITY =====

// Select DOM elements for game UI
const noteContainer = document.getElementById('noteContainer');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const flash = document.getElementById('flash');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');
const startGameBtn = document.getElementById('startGameBtn');

let score = 0;
let lives = 5;
let notes = [];
let gameOver = true;
let gameTime = 120;
let spawnTimeout;
let timerInterval;

// Updates score and lives in the UI
function updateUI() {
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
}

// Shows a coloured flash effect
function triggerFlash(colour) {
  flash.style.backgroundColor = colour;
  flash.classList.add('show');
  setTimeout(() => flash.classList.remove('show'), 100);
}

// Reduces a life and checks for game over
function loseLife() {
  lives--;
  updateUI();
  if (lives <= 0) endGame();
}

// Spawns a note that moves from right to left across the screen
function spawnNote() {
  // Do not spawn a note if the game has ended
  if (gameOver) return;

  // Create a new div element to act as the note
  const note = document.createElement('div');
  note.classList.add('note'); // Apply base note styling

  // Randomly assign the note to be red ('A') or blue ('D')
  const isRed = Math.random() < 0.5;
  note.classList.add(isRed ? 'red' : 'blue'); // Add red or blue class for styling
  note.textContent = isRed ? 'A' : 'D';       // Show 'A' or 'D' based on colour

  // Position the note offscreen to the right initially
  note.style.left = `900px`; // Start x-position in pixels
  noteContainer.appendChild(note); // Add the note to the screen
  notes.push(note); // Track the note in our notes array

  // Define how fast the note moves (in pixels per frame)
  const speed = 2;

  // Animate the note by moving it left every ~16 milliseconds
  // 16ms = ~60 frames per second (1000ms / 60 ≈ 16.67), which gives smooth animation
  const interval = setInterval(() => {
    // If the game ends mid-animation, stop and remove the note
    if (gameOver) {
      clearInterval(interval);
      note.remove();
      return;
    }

    // Get the note's current x-position
    const currentLeft = parseFloat(note.style.left);

    // Move the note slightly leftward by decreasing its left value
    note.style.left = `${currentLeft - speed}px`;

    // Get the horizontal position of the note and hit zone (for collision check)
    const noteLeft = note.getBoundingClientRect().left;
    const hitZone = document.getElementById('hitZone').getBoundingClientRect();

    // If the right edge of the note is entirely past the hit zone (i.e. player missed it)
    if (noteLeft + 100 < hitZone.left) {
      clearInterval(interval);       // Stop the animation for this note
      note.remove();                 // Remove the note from the DOM
      notes = notes.filter(n => n !== note); // Remove it from our tracking array
      triggerFlash('red');          // Flash red to indicate a miss
      loseLife();                   // Deduct one life from the player
    }
  }, 16); // Run this movement logic every 16ms (~60 FPS)

  // Store the interval on the note element for later clearing (e.g. on game reset)
  note._interval = interval;

  // Schedule the next note to spawn after a random delay (between 700ms and 2000ms)
  spawnTimeout = setTimeout(
    spawnNote,
    Math.random() * (2000 - 700) + 700
  );
}


// Handles keypress input (A/D)
function handleKeyPress(e) {
  if (gameOver) return;

  const key = e.key.toUpperCase();
  const hitZone = document.getElementById('hitZone').getBoundingClientRect();

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const rect = note.getBoundingClientRect();
    const expectedKey = note.textContent;

    const isFullyInsideHitZone = (
      rect.left >= hitZone.left &&
      rect.right <= hitZone.right
    );

    // If key press matches the note fully inside hit zone
    if (isFullyInsideHitZone && key === expectedKey) {
      score++;
      updateUI();
      triggerFlash('white');
      clearInterval(note._interval);
      note.remove();
      notes.splice(i, 1);
      return;
    }
  }

  // Wrong key or not in hit zone
  triggerFlash('purple');
}

// Starts countdown timer
function startTimer() {
  timerInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(timerInterval);
      return;
    }

    gameTime--;
    timerDisplay.textContent = gameTime;

    if (gameTime <= 0) {
      endGame();
    }
  }, 1000);
}

// Ends game, clears intervals and shows restart button
function endGame() {
  gameOver = true;
  clearTimeout(spawnTimeout);
  clearInterval(timerInterval);
  notes.forEach(note => {
    clearInterval(note._interval);
    note.remove();
  });
  notes = [];
  restartButton.style.display = 'inline-block';
  startGameBtn.style.display = 'inline-block';
}

// Stops the game and clears notes and timers
function stopGame() {
  gameOver = true;
  clearTimeout(spawnTimeout);
  clearInterval(timerInterval);
  notes.forEach(note => {
    clearInterval(note._interval);
    note.remove();
  });
  notes = [];
  restartButton.style.display = 'none';
}

// Starts a new game
function initMinigame() {
  if (!gameOver) return;

  score = 0;
  lives = 5;
  gameTime = 60;
  gameOver = false;
  updateUI();
  timerDisplay.textContent = gameTime;
  flash.classList.remove('show');
  restartButton.style.display = 'none';

  notes.forEach(note => {
    clearInterval(note._interval);
    note.remove();
  });
  notes = [];
  clearTimeout(spawnTimeout);
  spawnNote();
  startTimer();
}

// Key listener for 'A' and 'D' key input
document.addEventListener('keydown', handleKeyPress);

// Restarts game when button clicked
restartButton.addEventListener('click', () => {
  restartButton.style.display = 'none';
  startGameBtn.style.display = 'none';
  initMinigame();
});

// Starts game when start button clicked
startGameBtn.addEventListener('click', () => {
  startGameBtn.style.display = 'none';
  restartButton.style.display = 'none';
  initMinigame();
});











// const noteContainer = document.getElementById('noteContainer');
// const scoreDisplay = document.getElementById('score');
// const livesDisplay = document.getElementById('lives');
// const flash = document.getElementById('flash');
// const timerDisplay = document.getElementById('timer');
// const restartButton = document.getElementById('restartButton');

// const menu = document.getElementById('menu');
// const game = document.querySelector('.game');
// const ui = document.querySelector('.ui');

// let score = 0;
// let lives = 5;
// let notes = [];
// let gameOver = false;
// let gameTime = 60;
// let spawnTimeout;
// let timerInterval;

// function updateUI() {
//   scoreDisplay.textContent = score;
//   livesDisplay.textContent = lives;
// }

// function triggerFlash(colour) {
//   flash.style.backgroundColor = colour;
//   flash.classList.add('show');
//   setTimeout(() => flash.classList.remove('show'), 100);
// }

// function loseLife() {
//   lives--;
//   updateUI();
//   if (lives <= 0) endGame();
// }

// function spawnNote() {
//   if (gameOver) return;

//   const note = document.createElement('div');
//   note.classList.add('note');
//   const isRed = Math.random() < 0.5;
//   note.classList.add(isRed ? 'red' : 'blue');
//   note.textContent = isRed ? 'A' : 'D';

//   const spawnX = 900;
//   note.style.left = `${spawnX}px`;
//   noteContainer.appendChild(note);
//   notes.push(note);

//   const speed = 2;

//   const interval = setInterval(() => {
//     if (gameOver) {
//       clearInterval(interval);
//       note.remove();
//       return;
//     }

//     const currentLeft = parseFloat(note.style.left);
//     note.style.left = `${currentLeft - speed}px`;

//     const noteLeft = note.getBoundingClientRect().left;
//     const hitZone = document.getElementById('hitZone').getBoundingClientRect();

//     if (noteLeft + 100 < hitZone.left) {
//       clearInterval(interval);
//       note.remove();
//       notes = notes.filter(n => n !== note);
//       triggerFlash('red');
//       loseLife();
//     }
//   }, 16);

//   note._interval = interval;

//   const nextSpawn = Math.random() * (2000 - 700) + 700;
//   spawnTimeout = setTimeout(spawnNote, nextSpawn);
// }

// function handleKeyPress(e) {
//   if (gameOver) return;

//   const key = e.key.toUpperCase();
//   const hitZone = document.getElementById('hitZone').getBoundingClientRect();

//   for (let i = 0; i < notes.length; i++) {
//     const note = notes[i];
//     const rect = note.getBoundingClientRect();
//     const expectedKey = note.textContent;

//     const isFullyInsideHitZone = (
//       rect.left >= hitZone.left &&
//       rect.right <= hitZone.right
//     );

//     if (isFullyInsideHitZone && key === expectedKey) {
//       score++;
//       updateUI();
//       triggerFlash('white');

//       clearInterval(note._interval);
//       note.remove();
//       notes.splice(i, 1);
//       return;
//     }
//   }

//   // Missed the note
//   triggerFlash('purple');
// }

// function startTimer() {
//   timerInterval = setInterval(() => {
//     if (gameOver) {
//       clearInterval(timerInterval);
//       return;
//     }

//     gameTime--;
//     timerDisplay.textContent = gameTime;

//     if (gameTime <= 0) {
//       endGame();
//     }
//   }, 1000);
// }

// function endGame() {
//   gameOver = true;
//   clearTimeout(spawnTimeout);
//   clearInterval(timerInterval);
//   notes.forEach(note => {
//     clearInterval(note._interval);
//     note.remove();
//   });
//   notes = [];
//   restartButton.style.display = 'inline-block';
// }

// function restartGame() {
//   score = 0;
//   lives = 5;
//   gameTime = 60;
//   gameOver = false;
//   updateUI();
//   timerDisplay.textContent = gameTime;
//   flash.classList.remove('show');
//   restartButton.style.display = 'none';
//   notes.forEach(note => {
//     clearInterval(note._interval);
//     note.remove();
//   });
//   notes = [];
//   clearTimeout(spawnTimeout);
//   clearInterval(timerInterval);
//   spawnNote();
//   startTimer();
// }

// // Start / Restart game button event
// restartButton.addEventListener('click', restartGame);

// // Key press event for gameplay
// document.addEventListener('keydown', handleKeyPress);

// // Menu button handlers
// document.getElementById('btnMinigame').addEventListener('click', () => {
//   menu.style.display = 'none';
//   game.style.display = 'block';
//   ui.style.display = 'flex';
//   restartGame();
// });

// document.getElementById('btnStory').addEventListener('click', () => {
//   alert('Story mode coming soon!');
// });

// document.getElementById('btnQuiz').addEventListener('click', () => {
//   alert('Quiz mode coming soon!');
// });

// document.getElementById('btnQRcode').addEventListener('click', () => {
//   alert('QR code feature coming soon!');
// });



// const noteContainer = document.getElementById('noteContainer');
// const scoreDisplay = document.getElementById('score');
// const livesDisplay = document.getElementById('lives');
// const flash = document.getElementById('flash');
// const timerDisplay = document.getElementById('timer');
// const restartButton = document.getElementById('restartButton');

// let score = 0;
// let lives = 5;
// let notes = [];
// let gameOver = false;
// let gameTime = 60;
// let spawnTimeout;

// function updateUI() {
//   scoreDisplay.textContent = score;
//   livesDisplay.textContent = lives;
// }

// function triggerFlash(colour) {
//   flash.style.backgroundColor = colour;
//   flash.classList.add('show');
//   setTimeout(() => flash.classList.remove('show'), 100);
// }

// function loseLife() {
//   lives--;
//   updateUI();
//   if (lives <= 0) endGame();
// }

// function spawnNote() {
//   if (gameOver) return;

//   const note = document.createElement('div');
//   note.classList.add('note');
//   const isRed = Math.random() < 0.5;
//   note.classList.add(isRed ? 'red' : 'blue');
//   note.textContent = isRed ? 'A' : 'D';

//   const spawnX = 900;
//   note.style.left = `${spawnX}px`;
//   noteContainer.appendChild(note);
//   notes.push(note);

//   const speed = 2;

//   const interval = setInterval(() => {
//     if (gameOver) {
//       clearInterval(interval);
//       note.remove();
//       return;
//     }

//     const currentLeft = parseFloat(note.style.left);
//     note.style.left = `${currentLeft - speed}px`;

//     const noteLeft = note.getBoundingClientRect().left;
//     const hitZone = document.getElementById('hitZone').getBoundingClientRect();

//     if (noteLeft + 100 < hitZone.left) {
//       clearInterval(interval);
//       note.remove();
//       notes = notes.filter(n => n !== note);
//       triggerFlash('red');
//       loseLife();
//     }
//   }, 16);

//   note._interval = interval;

//   const nextSpawn = Math.random() * (2000 - 700) + 700;
//   spawnTimeout = setTimeout(spawnNote, nextSpawn);
// }

// function handleKeyPress(e) {
//   if (gameOver) return;

//   const key = e.key.toUpperCase();
//   const hitZone = document.getElementById('hitZone').getBoundingClientRect();

//   for (let i = 0; i < notes.length; i++) {
//     const note = notes[i];
//     const rect = note.getBoundingClientRect();
//     const expectedKey = note.textContent;

//     const isFullyInsideHitZone = (
//       rect.left >= hitZone.left &&
//       rect.right <= hitZone.right
//     );

//     if (isFullyInsideHitZone && key === expectedKey) {
//       score++;
//       updateUI();
//       triggerFlash('white');

//       clearInterval(note._interval);
//       note.remove();
//       notes.splice(i, 1);
//       return;
//     }
//   }

//   // Missed the note
//   triggerFlash('purple');
// }
  
// function startTimer() {
//   const interval = setInterval(() => {
//     if (gameOver) {
//       clearInterval(interval);
//       return;
//     }

//     gameTime--;
//     timerDisplay.textContent = gameTime;

//     if (gameTime <= 0) {
//       endGame();
//     }
//   }, 1000);
// }

// function endGame() {
//   gameOver = true;
//   clearTimeout(spawnTimeout);
//   notes.forEach(note => {
//     clearInterval(note._interval);
//     note.remove();
//   });
//   notes = [];
//   restartButton.style.display = 'inline-block';
// }

// function restartGame() {
//   score = 0;
//   lives = 5;
//   gameTime = 60;
//   gameOver = false;
//   updateUI();
//   timerDisplay.textContent = gameTime;
//   flash.classList.remove('show');
//   restartButton.style.display = 'none';
//   notes.forEach(note => {
//     clearInterval(note._interval);
//     note.remove();
//   });
//   notes = [];
//   clearTimeout(spawnTimeout);
//   spawnNote();
//   startTimer();
// }

// document.addEventListener('keydown', handleKeyPress);
// restartButton.addEventListener('click', restartGame);

// // Start game on load
// spawnNote();
// startTimer();





