const questions = [
{q:"Hoeveel spelers staan er per team in het veld?",a:["5","6","7","8"],c:2},
{q:"Hoeveel stappen mag je zetten zonder te stuiten?",a:["2","3","4","5"],c:1},
{q:"Vanaf welke lijn wordt een strafworp genomen?",a:["6 m","7 m","9 m","10 m"],c:1},
{q:"Hoe lang duurt een tijdstraf?",a:["1","2","3","5"],c:1},
{q:"Welke kleur draagt HV Novitas?",a:["Blauw","Groen","Oranje","Rood"],c:2},
{q:"Waar speelt HV Novitas?",a:["Hulst","Goes","Middelburg","Terneuzen"],c:0},
{q:"Wie verdedigt het doel?",a:["Keeper","Coach","Hoek","Cirkel"],c:0},
{q:"Hoe lang duurt een seniorenwedstrijd?",a:["2x20","2x25","2x30","2x35"],c:2},
{q:"Hoeveel team time-outs zijn toegestaan?",a:["1","2","3","4"],c:2},
{q:"Wat is de slogan van HV Novitas?",a:["No Stress, Enjoy!","Play Hard","Orange Power","Handball Forever"],c:0},
{q:"Welke lijn is gestippeld?",a:["6 meter","7 meter","9 meter","Middenlijn"],c:2},
{q:"Mag een keeper scoren?",a:["Ja","Nee","Alleen uit strafworp","Alleen laatste minuut"],c:0},
{q:"Hoeveel punten krijg je voor een overwinning?",a:["1","2","3","0"],c:1},
{q:"Welke balmaat gebruiken heren?",a:["1","2","3","4"],c:2},
{q:"Welke sport speelt HV Novitas?",a:["Volleybal","Handbal","Basketbal","Korfbal"],c:1}
];

let i = 0;
let score = 0;

const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

function render() {

    const q = questions[i];

    document.getElementById("fill").style.width =
        ((i / questions.length) * 100) + "%";

    quiz.innerHTML = `
        <h2>🏆 Vraag ${i+1} van ${questions.length}</h2>

        <p><b>Score:</b> ${score}</p>

        <p>${q.q}</p>

        ${q.a.map((antwoord,n)=>`
        <label>
            <input type="radio" name="r" value="${n}">
            ${antwoord}
        </label>
        `).join("")}
    `;
}
document.getElementById("startButton").onclick = function(){

    document.getElementById("startScreen").style.display="none";
    document.getElementById("game").style.display="block";

    render();

}

document.getElementById("next").onclick = function(){

    let gekozen =
    document.querySelector("input[name=r]:checked");

    if(!gekozen){

        alert("Kies eerst een antwoord.");

        return;

    }

    let goed = Number(gekozen.value) === questions[i].c;

    if(goed){

        score++;

        quiz.innerHTML += `
        <div style="
        background:#0b8f2d;
        color:white;
        padding:15px;
        margin-top:20px;
        border-radius:10px;
        text-align:center;
        font-size:24px;
        font-weight:bold;">
        🥅 GOAL!<br>
        +1 punt
        </div>`;

    }else{

        const juiste =
        questions[i].a[questions[i].c];

        quiz.innerHTML += `
        <div style="
        background:#b00020;
        color:white;
        padding:15px;
        margin-top:20px;
        border-radius:10px;
        text-align:center;
        font-size:22px;">
        ❌ Helaas...<br><br>
        Juiste antwoord:<br>
        <b>${juiste}</b>
        </div>`;

    }

    document.getElementById("next").disabled = true;

    setTimeout(function(){

        i++;

        document.getElementById("next").disabled = false;

        if(i < questions.length){

            render();

        }else{

            eindeQuiz();

        }

    },1200);

}
function eindeQuiz(){

    quiz.innerHTML = "";

    document.getElementById("fill").style.width = "100%";

    let procent =
    Math.round((score / questions.length) * 100);

    let titel = "";
    let medaille = "";
    let kleur = "";

    if(score >= 15){

        titel = "👑 HANDBAL LEGENDE";
        medaille = "🏆🏆🏆";
        kleur = "#FFD700";

    }
    else if(score >= 13){

        titel = "👑 HANDBAL MASTER";
        medaille = "🥇";
        kleur = "#FFD700";

    }
    else if(score >= 10){

        titel = "🥇 EXPERT";
        medaille = "🥇";
        kleur = "#ffb400";

    }
    else if(score >= 7){

        titel = "🥈 TALENT";
        medaille = "🥈";
        kleur = "#c0c0c0";

    }
    else{

        titel = "🥉 ROOKIE";
        medaille = "🥉";
        kleur = "#cd7f32";

    }

    result.innerHTML = `

    <div style="
    text-align:center;
    padding:30px;">

        <h1 style="color:${kleur};font-size:52px;">
            ${medaille}
        </h1>

        <h2>${titel}</h2>

        <h1>${score} / ${questions.length}</h1>

        <h3>${procent}% goed</h3>

        <p style="
        font-size:22px;
        color:#ff9800;">
        🧡 No Stress, Enjoy!
        </p>

        <button onclick="location.reload()">
        🔄 Speel opnieuw
        </button>

    </div>

    `;

    document.getElementById("next").style.display="none";

}
