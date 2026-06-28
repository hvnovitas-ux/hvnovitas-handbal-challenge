
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
    query,
    orderByChild,
    limitToLast
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "JOUW_API_KEY",
    authDomain: "hv-novitas-handbal-challenge.firebaseapp.com",
    databaseURL: "https://hv-novitas-handbal-challenge-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hv-novitas-handbal-challenge",
    storageBucket: "hv-novitas-handbal-challenge.firebasestorage.app",
    messagingSenderId: "707710141199",
    appId: "JOUW_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.saveScore = function(name, score) {

    push(ref(db, "scores"), {
        name: name,
        score: score,
        month: new Date().toISOString().slice(0,7),
        created: Date.now()
    });

};

window.loadLeaderboard = function() {

    const lijst = document.getElementById("leaderboardList");

    const q = query(
        ref(db,"scores"),
        orderByChild("score"),
        limitToLast(10)
    );

    onValue(q,(snapshot)=>{

        let data=[];

        snapshot.forEach(item=>{
            data.push(item.val());
        });

        data.sort((a,b)=>b.score-a.score);

        let html="<table>";
        html+="<tr><th>#</th><th>Naam</th><th>Score</th></tr>";

        data.forEach((p,i)=>{

            html+=`
            <tr>
                <td>${i+1}</td>
                <td>${p.name}</td>
                <td>${p.score}</td>
            </tr>
            `;

        });

        html+="</table>";

        lijst.innerHTML=html;

    });

}

