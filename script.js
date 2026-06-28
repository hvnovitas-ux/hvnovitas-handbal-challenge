```javascript
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
{q:"Wat is de slogan van HV Novitas?",a:["Play Hard","No Stress, Just Handball!","Orange Power","Handball Forever"],c:1},
{q:"Welke lijn is gestippeld?",a:["6 meter","7 meter","9 meter","Middenlijn"],c:2},
{q:"Mag een keeper scoren?",a:["Ja","Nee","Alleen uit strafworp","Alleen laatste minuut"],c:0},
{q:"Hoeveel punten krijg je voor een overwinning?",a:["1","2","3","0"],c:1},
{q:"Welke balmaat gebruiken heren?",a:["1","2","3","4"],c:2},
{q:"Welke sport speelt HV Novitas?",a:["Volleybal","Handbal","Basketbal","Korfbal"],c:1}
];

let i=0;
let score=0;

const quiz=document.getElementById("quiz");
const result=document.getElementById("result");

function render(){

document.getElementById("fill").style.width=((i/questions.length)*100)+"%";

const q=questions[i];

quiz.innerHTML=`
<h2>🏆 Vraag ${i+1} van ${questions.length}</h2>

<p><b>Score:</b> ${score}</p>

<p>${q.q}</p>

${q.a.map((a,n)=>`
<label>
<input type="radio" name="r" value="${n}">
${a}
</label>
`).join("")}
`;

}

document.getElementById("startButton").onclick=function(){

document.getElementById("startScreen").style.display="none";
document.getElementById("game").style.display="block";

render();

}

document.getElementById("next").onclick=function(){

let gekozen=document.querySelector("input[name=r]:checked");

if(!gekozen){

alert("Kies eerst een antwoord.");

return;

}

if(Number(gekozen.value)===questions[i].c){

score++;

}

i++;

if(i<questions.length){

render();

return;

}

let procent=Math.round(score/questions.length*100);

let rang="🥉 Rookie";

if(score>=13) rang="👑 Handbal Master";
else if(score>=10) rang="🥇 Expert";
else if(score>=7) rang="🥈 Talent";

quiz.innerHTML="";

document.getElementById("fill").style.width="100%";

result.innerHTML=`
<h1>🏆 Gefeliciteerd!</h1>

<h2>${score} / ${questions.length}</h2>

<h3>${procent}% goed</h3>

<h2>${rang}</h2>

<button onclick="location.reload()">
🔄 Speel opnieuw
</button>
`;

document.getElementById("next").style.display="none";

}
```
