```javascript
const questions = [
{
    q: "Hoeveel spelers staan er per team in het veld?",
    a: ["5","6","7","8"],
    c: 2
},
{
    q: "Welke kleur draagt HV Novitas?",
    a: ["Blauw","Groen","Oranje","Rood"],
    c: 2
},
{
    q: "Waar speelt HV Novitas?",
    a: ["Terneuzen","Hulst","Goes","Middelburg"],
    c: 1
},
{
    q: "Hoeveel stappen mag je zetten zonder te stuiten?",
    a: ["2","3","4","5"],
    c: 1
},
{
    q: "Wat is de slogan van HV Novitas?",
    a: ["No Stress, Enjoy!","Play Hard","Orange Power","Handball Forever"],
    c: 0
}
];

let current = 0;
let score = 0;

const quiz = document.getElementById("quiz");
const status = document.getElementById("status");
const vraagnummer = document.getElementById("vraagnummer");
const fill = document.getElementById("fill");
const result = document.getElementById("result");
const next = document.getElementById("next");

document.getElementById("startButton").onclick = function () {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("game").style.display = "block";
    showQuestion();
};

function showQuestion(){

    const q = questions[current];

    status.innerHTML = "🏆 Score: " + score;

    vraagnummer.innerHTML =
        "Vraag " + (current+1) + " / " + questions.length;

    fill.style.width =
        ((current/questions.length)*100) + "%";

    quiz.innerHTML =
        "<h2>"+q.q+"</h2>" +
        q.a.map((antwoord,index)=>
        "<label><input type='radio' name='antwoord' value='"+index+"'> "+antwoord+"</label>"
        ).join("");

}

next.onclick = function(){

    const gekozen =
        document.querySelector("input[name='antwoord']:checked");

    if(!gekozen){
        alert("Kies eerst een antwoord.");
        return;
    }

    if(Number(gekozen.value)===questions[current].c){
        score++;
    }

    current++;

    if(current<questions.length){

        showQuestion();

    }else{

        fill.style.width="100%";

        quiz.innerHTML="";

        result.innerHTML=
        "<h1>🏆 Klaar!</h1>"+
        "<h2>Score: "+score+" / "+questions.length+"</h2>"+
        "<br><h2>🧡 No Stress, Enjoy!</h2>";

        next.style.display="none";

    }

};
```
