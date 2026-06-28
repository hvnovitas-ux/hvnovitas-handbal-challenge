const questions = [
{q:"Hoeveel spelers staan er per team in het veld?",a:["5","6","7","8"],c:2},
{q:"Hoeveel stappen zonder stuiten?",a:["2","3","4","5"],c:1},
{q:"Strafworp vanaf?",a:["6 m","7 m","9 m","10 m"],c:1},
{q:"Tijdstraf duurt?",a:["1","2","3","5"],c:1},
{q:"Kleur HV Novitas?",a:["Blauw","Groen","Oranje","Rood"],c:2},
{q:"Waar speelt HV Novitas?",a:["Hulst","Goes","Middelburg","Terneuzen"],c:0},
{q:"Wie verdedigt het doel?",a:["Keeper","Coach","Hoek","Cirkel"],c:0},
{q:"Speelduur senioren?",a:["2x20","2x25","2x30","2x35"],c:2},
{q:"Aantal team time-outs?",a:["1","2","3","4"],c:2},
{q:"Slogan HV Novitas?",a:["No Stress, Enjoy!","Play Hard","Orange Power","Handball Forever"],c:0},
{q:"Welke lijn is gestippeld?",a:["6 m","7 m","9 m","Middenlijn"],c:2},
{q:"Mag een keeper scoren?",a:["Ja","Nee","Alleen strafworp","Alleen laatste minuut"],c:0},
{q:"Hoeveel punten voor winst?",a:["1","2","3","0"],c:1},
{q:"Welke bal gebruikt heren?",a:["Maat 1","Maat 2","Maat 3","Maat 4"],c:2},
{q:"Welke sport is HV Novitas?",a:["Volleybal","Handbal","Basketbal","Korfbal"],c:1}
];

let i = 0;
let score = 0;

const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const fill = document.getElementById("fill");
const status = document.getElementById("status");

function render(){

    const q = questions[i];

    fill.style.width = (i / questions.length * 100) + "%";

    status.innerHTML =
    `🏆 Score: ${score} | Vraag ${i+1} van ${questions.length}`;

    quiz.innerHTML =
    `<h2>${q.q}</h2>` +
    q.a.map((x,n)=>
    `<label><input type="radio" name="r" value="${n}"> ${x}</label>`
    ).join("");

}

document.getElementById("startButton").onclick = function(){

    document.getElementById("startScreen").style.display = "none";
    document.getElementById("game").style.display = "block";

    render();

};

document.getElementById("next").onclick = function(){

    let gekozen = document.querySelector("input[name='r']:checked");

    if(!gekozen){

        alert("Kies een antwoord.");

        return;

    }

    if(Number(gekozen.value) === questions[i].c){

        score++;

    }

    i++;

    if(i < questions.length){

        render();

        return;

    }

    fill.style.width = "100%";

    let procent = Math.round(score / questions.length * 100);

    let rang = "🥉 Rookie";

    if(score >= 13) rang = "👑 Handbal Master";
    else if(score >= 10) rang = "🥇 Expert";
    else if(score >= 7) rang = "🥈 Talent";

    quiz.innerHTML = "";

    result.innerHTML = `
        <h1>🏆 Gefeliciteerd!</h1>
        <h2>${score} / ${questions.length}</h2>
        <h3>${procent}% goed</h3>
        <h2>${rang}</h2>
        <p>🧡 <b>No Stress, Enjoy!</b></p>
        <button onclick="location.reload()">
            🔄 Speel opnieuw
        </button>
    `;

    document.getElementById("next").style.display = "none";

};
