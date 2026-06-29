import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    query,
    orderByChild,
    limitToLast,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBCUZeWMIxIz__7TfNG_b0V47H_pYFPyQ",
    authDomain: "hv-novitas-handbal-challenge.firebaseapp.com",
    databaseURL: "https://hv-novitas-handbal-challenge-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hv-novitas-handbal-challenge",
    storageBucket: "hv-novitas-handbal-challenge.firebasestorage.app",
    messagingSenderId: "707710141199",
    appId: "1:707710141199:web:ba304ce4e5f653d0afb47a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.saveOnlineScore = function (name, score) {

    push(ref(db, "scores"), {
        name: name,
        score: score,
        month: new Date().toISOString().substring(0, 7),
        created: Date.now()
    });

};

window.loadLeaderboard = function () {

    const lijst = document.getElementById("leaderboardList");

    const q = query(
    ref(db, "scores"),
    orderByChild("score"),
    limitToLast(500)
    );

    onValue(q, (snapshot) => {

        let scores = [];

        const huidigeMaand = new Date().toISOString().substring(0,7);

snapshot.forEach((item) => {

    const score = item.val();

    if (score.month === huidigeMaand) {
        scores.push(score);
    }

});

        const besteScores = {};

scores.forEach((p) => {

    const naam = p.name.trim().toLowerCase();

    if (!besteScores[naam] || p.score > besteScores[naam].score) {
        besteScores[naam] = p;
    }

});

scores = Object.values(besteScores);

scores.sort((a, b) => b.score - a.score);

scores = scores.slice(0, 10);

const hoogsteScore = scores.length > 0 ? scores[0].score : 0;

scores.sort((a, b) => b.score - a.score);

        const hoogsteScore = scores.length > 0 ? scores[0].score : 0;

let html = `
<h2>🏆 HV NOVITAS MAANDRANGLIJST</h2>

<p><strong>👑 Hoogste score: ${hoogsteScore} / 30</strong></p>

${hoogsteScore === 30 ? "<p>🔥 Perfecte score!</p>" : ""}

<p><strong>👥 Deelnemers deze maand: ${scores.length}</strong></p>

<table>
    <tr>
        <th>#</th>
        <th>Naam</th>
        <th>Score</th>
    </tr>
`;
        scores.forEach((p, i) => {

    let plaats = i + 1;

    if (i === 0) plaats = "🥇";
    else if (i === 1) plaats = "🥈";
    else if (i === 2) plaats = "🥉";

    html += `
    <tr>
        <td>${plaats}</td>
        <td>${p.name}</td>
        <td>${p.score} / 30</td>
    </tr>
    `;

});

        html += "</table>";

        lijst.innerHTML = html;

    });

};

console.log("🔥 Firebase verbonden");
