let current = 0;
let score = 0;

const startScreen = document.getElementById("startScreen");
const game = document.getElementById("game");
const finishScreen = document.getElementById("finishScreen");
const leaderboard = document.getElementById("leaderboard");

const quiz = document.getElementById("quiz");
const status = document.getElementById("status");
const vraagnummer = document.getElementById("vraagnummer");
const fill = document.getElementById("fill");

document.getElementById("startButton").onclick = () => {
    current = 0;
    score = 0;

    startScreen.style.display = "none";
    finishScreen.style.display = "none";
    leaderboard.style.display = "none";
    game.style.display = "block";

    showQuestion();
};

function showQuestion() {

    const q = questions[current];

    status.textContent = "🏆 Score: " + score;
    vraagnummer.textContent = "Vraag " + (current + 1) + " / " + questions.length;
    fill.style.width = ((current / questions.length) * 100) + "%";

    quiz.innerHTML = `
        <h2>${q.q}</h2>

        ${q.a.map((antwoord, index) => `
            <label class="antwoord">
                <input type="radio" name="antwoord" value="${index}">
                ${antwoord}
            </label>
        `).join("")}
    `;

}

document.getElementById("next").onclick = () => {

    const gekozen = document.querySelector("input[name='antwoord']:checked");

    if (!gekozen) {
        alert("Kies eerst een antwoord.");
        return;
    }

    if (Number(gekozen.value) === questions[current].c) {
        score++;
    }

    current++;

    if (current < questions.length) {
        showQuestion();
        return;
    }

    game.style.display = "none";
    finishScreen.style.display = "block";

    let titel = "💪 Rookie";
    let sterren = "⭐☆☆☆☆";
    let bericht = "Blijf trainen, dan haal je de volgende keer meer punten!";

    if (score === 30) {
        titel = "👑 HV NOVITAS MASTER";
        sterren = "⭐⭐⭐⭐⭐";
        bericht = "🎉 PERFECT! Je hebt alle vragen goed!";
    } else if (score >= 27) {
        titel = "🥇 Handbalexpert";
        sterren = "⭐⭐⭐⭐☆";
        bericht = "Fantastisch! Je kent de handbalregels uitstekend.";
    } else if (score >= 21) {
        titel = "🥈 Gevorderd";
        sterren = "⭐⭐⭐☆☆";
        bericht = "Heel goed gedaan! Je weet veel van handbal.";
    } else if (score >= 11) {
        titel = "🥉 Beginner";
        sterren = "⭐⭐☆☆☆";
        bericht = "Leuke score! Nog even oefenen.";
    }

    document.getElementById("finalScore").innerHTML = `
        <h2>🏆 HV NOVITAS HANDBAL CHALLENGE</h2>
        <h1>${score} / ${questions.length}</h1>
        <h2>${titel}</h2>
        <h3>${sterren}</h3>
        <p>${bericht}</p>
        <h3>🧡 No Stress, Enjoy!</h3>
    `; if (score === 30 && typeof confetti === "function") {
        confetti({
            particleCount: 250,
            spread: 180,
            origin: { y: 0.6 }
        });
    }

};

document.getElementById("saveScore").onclick = function () {

    const naam = document.getElementById("playerName").value.trim();

    if (naam === "") {
        alert("Vul eerst je naam in.");
        return;
    }

    if (typeof saveOnlineScore !== "function") {
        alert("Firebase is nog niet verbonden.");
        return;
    }

    saveOnlineScore(naam, score);

    alert("🏆 Score opgeslagen!");

};

document.getElementById("showLeaderboard").onclick = function () {

    startScreen.style.display = "none";
    finishScreen.style.display = "none";
    game.style.display = "none";
    leaderboard.style.display = "block";

    if (typeof loadLeaderboard === "function") {
        loadLeaderboard();
    }

};

const showLeaderboard2 = document.getElementById("showLeaderboard2");

if (showLeaderboard2) {

    showLeaderboard2.onclick = function () {

        finishScreen.style.display = "none";
        leaderboard.style.display = "block";

        if (typeof loadLeaderboard === "function") {
            loadLeaderboard();
        }

    };

}

document.getElementById("backHome").onclick = function () {

    leaderboard.style.display = "none";
    finishScreen.style.display = "none";
    game.style.display = "none";
    startScreen.style.display = "block";

};

const backHome2 = document.getElementById("backHome2");

if (backHome2) {

    backHome2.onclick = function () {

        leaderboard.style.display = "none";
        finishScreen.style.display = "none";
        game.style.display = "none";
        startScreen.style.display = "block";

    };

}

console.log("🏆 HV Novitas Quiz v1.1 geladen");
