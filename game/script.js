const ROUNDS = [
  {
    id: 1,
    name: "Ronde 1: D-A-P-U-R-S",
    letters: ["D", "A", "P", "U", "R", "S"],
    words: ["DAPUR", "PADUS", "PADU", "RUPA", "RUSA", "SUAP", "APUS", "DUA", "PAS", "DUS"],
  },
  {
    id: 2,
    name: "Ronde 2: B-A-N-G-S-A",
    letters: ["B", "A", "N", "G", "S", "A"],
    words: ["BANGSA", "BAGAN", "BAGAS", "SABAN", "BANG", "NAGA", "SAGA", "BANA", "GAS", "PAS"],
  },
  {
    id: 3,
    name: "Ronde 3: K-E-R-T-A-S",
    letters: ["K", "E", "R", "T", "A", "S"],
    words: ["KERTAS", "KARET", "KERAS", "RETAS", "SERAK", "KERA", "SETA", "RAK", "ERA", "TAS"],
  },
];

const state = {
  roundIndex: 0,
  score: 0,
  foundWords: [],
  letters: [],
  selectedIndices: [],
};

const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const roundSelect = document.getElementById("round-select");
const startButton = document.getElementById("start-button");

const roundText = document.getElementById("round-text");
const scoreText = document.getElementById("score-text");
const progressText = document.getElementById("progress-text");
const answerSlots = document.getElementById("answer-slots");
const tilesPool = document.getElementById("tiles");
const feedback = document.getElementById("feedback");
const wordsGrid = document.getElementById("words-grid");

const checkButton = document.getElementById("check-button");
const shuffleButton = document.getElementById("shuffle-button");
const clearButton = document.getElementById("clear-button");
const skipButton = document.getElementById("skip-button");

const finalScore = document.getElementById("final-score");
const finalNote = document.getElementById("final-note");
const restartButton = document.getElementById("restart-button");

function showScreen(screen) {
  setupScreen.hidden = screen !== setupScreen;
  gameScreen.hidden = screen !== gameScreen;
  resultScreen.hidden = screen !== resultScreen;
}

function setFeedback(text, type = "") {
  feedback.textContent = text;
  feedback.className = "feedback-text";
  if (type === "good") {
    feedback.classList.add("feedback-good");
  } else if (type === "bad") {
    feedback.classList.add("feedback-bad");
  }
}

function populateRoundSelect() {
  roundSelect.innerHTML = "";
  ROUNDS.forEach((round, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${round.name} (${round.words.length} kata)`;
    roundSelect.appendChild(option);
  });
}

function updateStats() {
  const currentRound = ROUNDS[state.roundIndex];
  roundText.textContent = `${state.roundIndex + 1}/${ROUNDS.length}`;
  scoreText.textContent = state.score;
  progressText.textContent = `${state.foundWords.length}/${currentRound.words.length}`;
}

function renderWordsGrid() {
  const currentRound = ROUNDS[state.roundIndex];
  wordsGrid.innerHTML = "";

  currentRound.words.forEach((word) => {
    const chip = document.createElement("div");
    if (state.foundWords.includes(word)) {
      chip.className = "word-chip word-chip-found";
      chip.textContent = `${word} (+${word.length * 10})`;
    } else {
      chip.className = "word-chip word-chip-hidden";
      chip.textContent = `${word.length} huruf`;
    }
    wordsGrid.appendChild(chip);
  });
}

function renderTiles() {
  answerSlots.innerHTML = "";
  state.selectedIndices.forEach((letterIndex, slotPosition) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile tile-selected";
    button.textContent = state.letters[letterIndex];
    button.title = "Klik untuk membatalkan huruf ini";
    button.addEventListener("click", () => unselectLetter(slotPosition));
    answerSlots.appendChild(button);
  });

  tilesPool.innerHTML = "";
  state.letters.forEach((char, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = char;

    // Nonaktifkan huruf jika sudah berada di kotak jawaban
    if (state.selectedIndices.includes(index)) {
      button.className = "tile tile-used";
      button.disabled = true;
    } else {
      button.className = "tile tile-available";
      button.title = "Klik untuk memasukkan huruf";
      button.addEventListener("click", () => selectLetter(index));
    }

    tilesPool.appendChild(button);
  });
}

function startRound(index) {
  state.roundIndex = index;
  state.foundWords = [];
  state.selectedIndices = [];
  // Gandakan array huruf ronde ini agar aman dimanipulasi
  state.letters = [...ROUNDS[index].letters];

  updateStats();
  renderTiles();
  renderWordsGrid();
  setFeedback("Pilih huruf di bawah untuk mulai menyusun kata.");
}

function selectLetter(letterIndex) {
  state.selectedIndices.push(letterIndex);
  renderTiles();
}

function unselectLetter(slotPosition) {
  state.selectedIndices.splice(slotPosition, 1);
  renderTiles();
}

function resetSelection() {
  state.selectedIndices = [];
  renderTiles();
}

// Algoritma Fisher-Yates untuk mengacak urutan elemen array secara merata
function shuffleLetters() {
  resetSelection();
  for (let i = state.letters.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = state.letters[i];
    state.letters[i] = state.letters[randomIndex];
    state.letters[randomIndex] = temp;
  }
  renderTiles();
}

function checkAnswer() {
  const currentRound = ROUNDS[state.roundIndex];
  const guess = state.selectedIndices.map((i) => state.letters[i]).join("");

  if (guess.length === 0) {
    setFeedback("Susun huruf terlebih dahulu sebelum mengirim tebakan.", "bad");
    return;
  }

  if (state.foundWords.includes(guess)) {
    setFeedback(`Kata "${guess}" sudah kamu temukan sebelumnya.`, "bad");
    resetSelection();
    return;
  }

  if (currentRound.words.includes(guess)) {
    state.foundWords.push(guess);
    const points = guess.length * 10;
    state.score += points;

    resetSelection();
    renderWordsGrid();
    updateStats();

    if (state.foundWords.length === currentRound.words.length) {
      setFeedback("Hebat! Semua kata pada ronde ini berhasil ditemukan!", "good");
    } else {
      setFeedback(`Benar! Kata "${guess}" ditemukan (+${points} poin).`, "good");
    }
  } else {
    setFeedback(`Kata "${guess}" tidak ada dalam daftar target ronde ini.`, "bad");
  }
}

function nextRound() {
  if (state.roundIndex + 1 < ROUNDS.length) {
    startRound(state.roundIndex + 1);
  } else {
    finishGame();
  }
}

function finishGame() {
  finalScore.textContent = state.score;
  finalNote.textContent = `Selamat! Kamu telah menyelesaikan seluruh ronde dengan perolehan skor ${state.score} poin.`;
  showScreen(resultScreen);
}

startButton.addEventListener("click", () => {
  const selectedIndex = parseInt(roundSelect.value, 10) || 0;
  state.score = 0;
  showScreen(gameScreen);
  startRound(selectedIndex);
});

checkButton.addEventListener("click", checkAnswer);
shuffleButton.addEventListener("click", shuffleLetters);
clearButton.addEventListener("click", resetSelection);
skipButton.addEventListener("click", nextRound);

restartButton.addEventListener("click", () => {
  showScreen(setupScreen);
});

populateRoundSelect();
showScreen(setupScreen);
