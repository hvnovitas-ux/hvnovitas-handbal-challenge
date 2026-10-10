import { saveOnlineScore, loadLeaderboard } from "./firebase.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

const questionConfig = {
  apiKey: "AIzaSyBCUZeWMIxIz__7TfNG_b0V47H_pYFPyQ",
  authDomain: "hv-novitas-handbal-challenge.firebaseapp.com",
  databaseURL: "https://hv-novitas-handbal-challenge-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hv-novitas-handbal-challenge",
  storageBucket: "hv-novitas-handbal-challenge.firebasestorage.app",
  messagingSenderId: "707710141199",
  appId: "1:707710141199:web:ba304ce4e5f653d0afb47a"
};
const questionApp = getApps().find(a => a.name === "novitasQuizQuestions") || initializeApp(questionConfig, "novitasQuizQuestions");
const questionDb = getDatabase(questionApp);

let current = 0;
let score = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let quizQuestions = [];
let loadedQuestions = [...questions];

async function refreshQuizQuestions() {
  try {
    const snapshot = await get(ref(questionDb, "questions"));
    if (snapshot.exists()) {
      const rows = Object.values(snapshot.val()).filter(q => q && typeof q.q === "string" && Array.isArray(q.a) && q.a.length >= 4 && Number.isInteger(Number(q.c)));
      if (rows.length) loadedQuestions = rows.map(q => ({ q: q.q, a: q.a.slice(0, 4).map(String), c: Number(q.c) }));
    }
  } catch (error) {
    console.warn("Databasevragen niet beschikbaar; standaardvragen blijven actief.", error);
  }
}

const startScreen = document.getElementById("startScreen");
const game = document.getElementById("game");
const finishScreen = document.getElementById("finishScreen");
const leaderboard = document.getElementById("leaderboard");
const quiz = document.getElementById("quiz");
const status = document.getElementById("status");
const vraagnummer = document.getElementById("vraagnummer");
const fill = document.getElementById("fill");

document.getElementById("startButton").onclick = async () => {
  current = 0;
  score = 0;
  await refreshQuizQuestions();
  quizQuestions = shuffle([...loadedQuestions]).slice(0, Math.min(30, loadedQuestions.length));
  startScreen.style.display = "none";
  finishScreen.style.display = "none";
  leaderboard.style.display = "none";
  game.style.display = "block";
  showQuestion();
};

function showQuestion() {
  const q = quizQuestions[current];
  status.textContent = "🏆 Score: " + score;
  vraagnummer.textContent = "Vraag " + (current + 1) + " / " + quizQuestions.length;
  fill.style.width = ((current / quizQuestions.length) * 100) + "%";
  quiz.innerHTML = `<h2>${q.q}</h2>${q.a.map((antwoord, index) => `<label class="antwoord"><input type="radio" name="antwoord" value="${index}"> ${antwoord}</label>`).join("")}`;
}

document.getElementById("next").onclick = () => {
  const gekozen = document.querySelector("input[name='antwoord']:checked");
  if (!gekozen) { alert("Kies eerst een antwoord."); return; }
  if (Number(gekozen.value) === quizQuestions[current].c) score++;
  current++;
  if (current < quizQuestions.length) { showQuestion(); return; }
  game.style.display = "none";
  finishScreen.style.display = "block";
  let titel = "💪 Rookie", sterren = "⭐☆☆☆☆", bericht = "Blijf trainen, dan haal je de volgende keer meer punten!";
  if (score === quizQuestions.length) { titel = "👑 HV NOVITAS MASTER"; sterren = "⭐⭐⭐⭐⭐"; bericht = "🎉 PERFECT! Je hebt alle vragen goed!"; }
  else if (score >= Math.ceil(quizQuestions.length * .9)) { titel = "🥇 Handbalexpert"; sterren = "⭐⭐⭐⭐☆"; bericht = "Fantastisch! Je kent de handbalregels uitstekend."; }
  else if (score >= Math.ceil(quizQuestions.length * .7)) { titel = "🥈 Gevorderd"; sterren = "⭐⭐⭐☆☆"; bericht = "Heel goed gedaan! Je weet veel van handbal."; }
  else if (score >= Math.ceil(quizQuestions.length * .36)) { titel = "🥉 Beginner"; sterren = "⭐⭐☆☆☆"; bericht = "Leuke score! Nog even oefenen."; }
  document.getElementById("finalScore").innerHTML = `<h2>🏆 HV NOVITAS HANDBAL CHALLENGE</h2><h1>${score} / ${quizQuestions.length}</h1><h2>${titel}</h2><h3>${sterren}</h3><p>${bericht}</p><h3>🧡 No Stress, Enjoy!</h3>`;
  if (score === quizQuestions.length && typeof confetti === "function") confetti({particleCount:250,spread:180,origin:{y:0.6}});
};

const verbodenWoorden = ["fuck","fok","hoer","kut","lul","tering","kanker","shit","bitch","nazi"];
document.getElementById("saveScore").onclick = async function () {
  let naam = document.getElementById("playerName").value.trim().toLowerCase().replace(/\s+/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
  if (naam.length < 2 || naam.length > 20) { alert("Naam moet tussen de 2 en 20 tekens bevatten."); return; }
  if (!/^[a-zA-ZÀ-ÿ0-9 _-]+$/.test(naam)) { alert("Gebruik alleen letters, cijfers, spaties, - en _"); return; }
  if (verbodenWoorden.some(woord => naam.toLowerCase().includes(woord))) { alert("Gebruik een nette naam."); return; }
  try { await saveOnlineScore(naam, score); alert("🏆 Score opgeslagen!"); }
  catch (error) { console.error("Firebase fout bij opslaan score:", error); alert("De score kon niet worden opgeslagen. Controleer de Firebase-database en probeer opnieuw."); }
};

document.getElementById("showLeaderboard").onclick = function () {
  startScreen.style.display = "none"; finishScreen.style.display = "none"; game.style.display = "none"; leaderboard.style.display = "block"; loadLeaderboard();
};
const showLeaderboard2 = document.getElementById("showLeaderboard2");
if (showLeaderboard2) showLeaderboard2.onclick = function () { finishScreen.style.display = "none"; leaderboard.style.display = "block"; loadLeaderboard(); };
document.getElementById("backHome").onclick = function () { leaderboard.style.display = "none"; finishScreen.style.display = "none"; game.style.display = "none"; startScreen.style.display = "block"; };
const backHome2 = document.getElementById("backHome2");
if (backHome2) backHome2.onclick = function () { leaderboard.style.display = "none"; finishScreen.style.display = "none"; game.style.display = "none"; startScreen.style.display = "block"; };
console.log("🏆 HV Novitas Quiz – dynamische vragen");
