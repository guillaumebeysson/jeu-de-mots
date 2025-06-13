let mots = [];
let motIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

let isSoundEnabled = true;
const sonValider = new Audio("valider.mp3");
const sonPasser = new Audio("passer.mp3");
const sonTerminer = new Audio("terminer.mp3");

let motsValides = [];
let motsPasses = [];

const wordDisplay = document.getElementById("wordDisplay");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const validateBtn = document.getElementById("validateBtn");
const passBtn = document.getElementById("passBtn");
const scoreDisplay = document.getElementById("score");

fetch("mots_lexique_10000.json")
    .then(res => res.json())
    .then(data => {
        mots = data.mots;
    });

function showNextWord() {
    if (mots.length === 0) return;
    const randomIndex = Math.floor(Math.random() * mots.length);
    wordDisplay.textContent = mots[randomIndex];
}


function startGame() {
    lancerPleinEcran();

    motIndex = 0;
    score = 0;
    timeLeft = 30;
    document.getElementById("progressBar").style.width = "100%";
    motsValides = [];
    motsPasses = [];
    document.getElementById("historique").classList.add("hidden");
    showNextWord();
    scoreDisplay.textContent = `Score : ${score}`;
    scoreDisplay.classList.add("hidden");
    validateBtn.classList.remove("hidden");
    passBtn.classList.remove("hidden");
    startBtn.classList.add("hidden");

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        const progress = (timeLeft / 30) * 100;
        document.getElementById("progressBar").style.width = progress + "%";

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}


function validateWord() {
    if (isSoundEnabled) sonValider.play();
    motsValides.push(wordDisplay.textContent);
    score++;
    scoreDisplay.textContent = `Score : ${score}`;
    motIndex++;
    showNextWord();
}

function passWord() {
    if (isSoundEnabled) sonPasser.play();
    motsPasses.push(wordDisplay.textContent);
    motIndex++;
    showNextWord();
}

function endGame() {
    if (isSoundEnabled) sonTerminer.play();

    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
            console.warn("Erreur lors de la sortie du plein écran :", err);
        });
    }

    clearInterval(timer);
    wordDisplay.textContent = "Temps écoulé !";
    validateBtn.classList.add("hidden");
    passBtn.classList.add("hidden");
    startBtn.classList.remove("hidden");
    scoreDisplay.classList.remove("hidden");

    // Affichage de l'historique
    const historiqueDiv = document.getElementById("historique");
    historiqueDiv.innerHTML = `
    <h3>Mots validés (${motsValides.length})</h3>
    <ul>${motsValides.map(m => `<li>✅ ${m}</li>`).join('')}</ul>
    <h3>Mots passés (${motsPasses.length})</h3>
    <ul>${motsPasses.map(m => `<li>❌ ${m}</li>`).join('')}</ul>
  `;
    historiqueDiv.classList.remove("hidden");
}

function lancerPleinEcran() {
    const element = document.documentElement; // ou document.body

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(); // Safari
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // IE/Edge
    }
}

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

const soundToggle = document.getElementById("soundToggle");

soundToggle.addEventListener("click", () => {
    isSoundEnabled = !isSoundEnabled;
    soundToggle.textContent = isSoundEnabled ? "🔊" : "🔇";
});

startBtn.addEventListener("click", startGame);
validateBtn.addEventListener("click", validateWord);
passBtn.addEventListener("click", passWord);
