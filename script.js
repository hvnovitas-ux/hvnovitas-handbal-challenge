let current = 0;
let score = 0;

const startScreen = document.getElementById("startScreen");
const game = document.getElementById("game");
const finishScreen = document.getElementById("finishScreen");

const quiz = document.getElementById("quiz");
const status = document.getElementById("status");
const vraagnummer = document.getElementById("vraagnummer");
const fill = document.getElementById("fill");

document.getElementById("startButton").onclick = () => {
    startScreen.style.display = "none";
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
        ${q.a.map((antwoord,index)=>`
            <label>
                <input type="radio" name="antwoord" value="${index}">
                ${antwoord}
            </label>
        `).join("")}
    `;
}

document.getElementById("next").onclick = () => {

    const gekozen = document.querySelector("input[name='antwoord']:checked");

    if(!gekozen){
        alert("Kies eerst een antwoord.");
        return;
    }

    if(Number(gekozen.value) === questions[current].c){
        score++;
    }

    current++;

    if(current < questions.length){
        showQuestion();
        return;
    }

    game.style.display = "none";
    finishScreen.style.display = "block";

    document.getElementById("finalScore").innerHTML = `
        <h2>🏆 Je score</h2>
        <h1>${score} / ${questions.length}</h1>
        <h3>🧡 No Stress, Enjoy!</h3>
    `;
};
```javascript
// ==========================
// SCORE OPSLAAN
// ==========================

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
```
