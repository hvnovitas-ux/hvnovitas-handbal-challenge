const questions=[
{q:"Hoeveel spelers staan er per team in het veld?",a:["5","6","7","8"],c:2},
{q:"Hoeveel stappen mag je zetten zonder te stuiten?",a:["2","3","4","5"],c:1},
{q:"Vanaf welke lijn wordt een strafworp genomen?",a:["6 meter","7 meter","9 meter","10 meter"],c:1},
{q:"Hoe lang duurt een tijdstraf?",a:["1 minuut","2 minuten","3 minuten","5 minuten"],c:1},
{q:"Welke kleur draagt HV Novitas?",a:["Blauw","Groen","Oranje","Rood"],c:2},
{q:"Hoe lang duurt een seniorenwedstrijd?",a:["2x20","2x25","2x30","2x35"],c:2},
{q:"Hoeveel team time-outs zijn toegestaan?",a:["1","2","3","4"],c:2},
{q:"Wie verdedigt het doel?",a:["Hoekspeler","Keeper","Cirkelspeler","Coach"],c:1},
{q:"Waar speelt HV Novitas?",a:["Hulst","Terneuzen","Middelburg","Goes"],c:0},
{q:"Wat is de slogan van HV Novitas?",a:["Play Hard","No Stress, Just Handball!","Handball Forever","Orange Power"],c:1}
];
let i=0,s=0;
const quiz=document.getElementById("quiz");
const res=document.getElementById("result");
function render(){
const q=questions[i];
document.getElementById("fill").style.width=((i)/questions.length*100)+"%";
quiz.innerHTML=`<h2>Vraag ${i+1} van ${questions.length}</h2><p>${q.q}</p>`+
q.a.map((x,n)=>`<label><input type='radio' name='r' value='${n}'> ${x}</label>`).join("");
}
render();
document.getElementById("next").onclick=()=>{
let c=document.querySelector("input[name=r]:checked");
if(!c){alert("Kies een antwoord");return;}
if(+c.value===questions[i].c)s++;
i++;
if(i<questions.length){render();}
else{
document.getElementById("fill").style.width="100%";
quiz.innerHTML="";
let rank="🥉 Rookie";
if(s>=8)rank="👑 HV Novitas Master";
else if(s>=6)rank="🥇 Expert";
else if(s>=4)rank="🥈 Talent";
res.innerHTML=`Je score: <b>${s}/${questions.length}</b><br>${rank}<br><br>🧡 No Stress, Just Handball!`;
document.getElementById("next").style.display="none";
}
};