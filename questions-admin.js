import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getDatabase, ref, onValue, push, set, update, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { questions as originalQuestions } from "./questions.js";

// Gebruik dezelfde Firebase Auth als het Novitas-CMS, maar toon de login hier.
// Er is bewust geen redirect naar /cms/login.html.
const cmsConfig = {
  apiKey: "AIzaSyDWYYS09i4YN9tnCmAzeiicD9T4YZ3a6HE",
  authDomain: "hv-novitas-beheer.firebaseapp.com",
  databaseURL: "https://hv-novitas-beheer-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hv-novitas-beheer",
  storageBucket: "hv-novitas-beheer.appspot.com",
  messagingSenderId: "71716605241",
  appId: "1:71716605241:web:b7e87d680b7499421a6ce8"
};
const challengeConfig = {
  apiKey: "AIzaSyBCUZeWMIxIz__7TfNG_b0V47H_pYFPyQ",
  authDomain: "hv-novitas-handbal-challenge.firebaseapp.com",
  databaseURL: "https://hv-novitas-handbal-challenge-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hv-novitas-handbal-challenge",
  storageBucket: "hv-novitas-handbal-challenge.firebasestorage.app",
  messagingSenderId: "707710141199",
  appId: "1:707710141199:web:ba304ce4e5f653d0afb47a"
};
const authApp = getApps().find(a => a.name === "novitasCmsAuth") || initializeApp(cmsConfig, "novitasCmsAuth");
const challengeApp = getApps().find(a => a.name === "novitasChallengeAdmin") || initializeApp(challengeConfig, "novitasChallengeAdmin");
const auth = getAuth(authApp);
const db = getDatabase(challengeApp);
const $ = id => document.getElementById(id);
let questions = [];
let unsubscribe = null;
let currentUser = null;

function say(message, error = false) {
  $("message").textContent = message;
  $("message").style.color = error ? "#b42318" : "#187044";
}
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function normalize(data) {
  return Object.entries(data || {}).map(([id, q]) => ({
    id, q: String(q.q || ""),
    a: Array.isArray(q.a) ? q.a.slice(0,4).map(String) : ["","","",""],
    c: Number.isInteger(Number(q.c)) ? Number(q.c) : 0
  }));
}
function render() {
  const term = $("searchInput").value.trim().toLowerCase();
  const shown = questions.filter(q => [q.q, ...q.a].join(" ").toLowerCase().includes(term));
  $("count").textContent = "(" + questions.length + ")";
  $("questionList").innerHTML = shown.length ? shown.map((q,i) =>
    '<article class="qcard"><h3>'+(i+1)+'. '+esc(q.q)+'</h3><div class="options">'+
    q.a.map((a,j)=>'<div class="opt '+(j===q.c?'correct':'')+'">'+(j===q.c?'✓ ':'')+esc(a)+'</div>').join('')+
    '</div><div class="actions"><button type="button" class="secondary" data-edit="'+esc(q.id)+'">✏️ Bewerken</button>'+
    '<button type="button" class="danger" data-delete="'+esc(q.id)+'">🗑 Verwijderen</button></div></article>').join('')
    : '<p class="muted">'+(questions.length?'Geen vragen gevonden.':'Nog geen vragen in de database.')+'</p>';
}
function resetForm() {
  $("questionForm").reset(); $("questionId").value = "";
  $("formTitle").textContent = "➕ Nieuwe vraag toevoegen";
  $("saveButton").textContent = "Vraag opslaan"; $("cancelEdit").hidden = true;
}
function editQuestion(id) {
  const q = questions.find(item => item.id === id); if (!q) return;
  $("questionId").value = id; $("questionText").value = q.q;
  q.a.forEach((a,i) => $("answer"+i).value = a || "");
  const radio = document.querySelector('input[name="correct"][value="'+q.c+'"]');
  if (radio) radio.checked = true;
  $("formTitle").textContent = "✏️ Vraag aanpassen";
  $("saveButton").textContent = "Wijzigingen opslaan"; $("cancelEdit").hidden = false;
  window.scrollTo({top:0,behavior:"smooth"});
}
function beginAdmin(user) {
  currentUser = user; $("loginPanel").hidden = true; $("adminArea").hidden = false;
  $("userInfo").textContent = "Ingelogd: " + (user.displayName || user.email || "beheerder");
  if (unsubscribe) unsubscribe();
  unsubscribe = onValue(ref(db,"questions"), snap => {
    questions = normalize(snap.val()); render(); say("Vragen geladen.");
  }, err => {
    console.error(err); say("Vragen laden mislukt. Controleer de database-regels van de challenge.", true);
  });
}
function showLogin() {
  currentUser = null; if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  $("loginPanel").hidden = false; $("adminArea").hidden = true; $("userInfo").textContent = "Niet ingelogd";
}
$("loginForm").addEventListener("submit", async e => {
  e.preventDefault(); $("loginButton").disabled = true; say("Inloggen…");
  try {
    const credential = await signInWithEmailAndPassword(auth, $("loginEmail").value.trim(), $("loginPassword").value);
    beginAdmin(credential.user); say("Je bent ingelogd.");
  } catch (err) {
    console.error(err);
    const messages = {
      "auth/invalid-credential":"E-mailadres of wachtwoord klopt niet.",
      "auth/invalid-email":"Vul een geldig e-mailadres in.",
      "auth/too-many-requests":"Te veel pogingen. Probeer het later opnieuw.",
      "auth/network-request-failed":"Geen verbinding. Controleer je internet."
    };
    say(messages[err.code] || ("Inloggen mislukt ("+err.code+"). Controleer je CMS-account."), true);
  } finally { $("loginButton").disabled = false; }
});
onAuthStateChanged(auth, user => user ? beginAdmin(user) : showLogin());
$("logoutButton").addEventListener("click", async () => {
  try { await signOut(auth); say("Je bent uitgelogd."); }
  catch (err) { console.error(err); say("Uitloggen mislukt.", true); }
});
$("questionForm").addEventListener("submit", async e => {
  e.preventDefault(); if (!currentUser) { say("Log eerst in.", true); return; }
  const q = $("questionText").value.trim();
  const a = [0,1,2,3].map(i => $("answer"+i).value.trim());
  const correct = document.querySelector('input[name="correct"]:checked');
  if (!q || a.some(x=>!x) || !correct) { say("Vul alle velden in en kies het juiste antwoord.", true); return; }
  const id = $("questionId").value, payload = {q,a,c:Number(correct.value),updatedAt:Date.now()};
  $("saveButton").disabled = true;
  try {
    if (id) { await update(ref(db,"questions/"+id),payload); say("Vraag aangepast."); }
    else { payload.createdAt=Date.now(); await set(push(ref(db,"questions")),payload); say("Nieuwe vraag toegevoegd."); }
    resetForm();
  } catch (err) { console.error(err); say("Opslaan mislukt. Controleer of de challenge-database schrijven toestaat.", true); }
  finally { $("saveButton").disabled = false; }
});
$("questionList").addEventListener("click", async e => {
  const edit = e.target.closest("[data-edit]"), del = e.target.closest("[data-delete]");
  if (edit) editQuestion(edit.dataset.edit);
  if (del) {
    const q = questions.find(item=>item.id===del.dataset.delete);
    if (!q || !confirm("Vraag verwijderen?\n\n"+q.q)) return;
    try { await remove(ref(db,"questions/"+q.id)); say("Vraag verwijderd."); if ($("questionId").value===q.id) resetForm(); }
    catch (err) { console.error(err); say("Verwijderen mislukt. Controleer de challenge-database-regels.", true); }
  }
});
$("cancelEdit").addEventListener("click",resetForm);
$("searchInput").addEventListener("input",render);
$("refreshButton").addEventListener("click",render);
$("importButton").addEventListener("click",async()=>{
  if (!currentUser) { say("Log eerst in.",true); return; }
  if (!Array.isArray(originalQuestions)||!originalQuestions.length) { say("Geen quizvragen gevonden.",true); return; }
  if (questions.length&&!confirm("Er staan al "+questions.length+" vragen in de database. Alleen ontbrekende vraagteksten worden toegevoegd. Doorgaan?")) return;
  $("importButton").disabled=true;
  try {
    const known=new Set(questions.map(q=>q.q.trim().toLowerCase()));
    const missing=originalQuestions.filter(q=>!known.has(String(q.q||"").trim().toLowerCase()));
    if (!missing.length) { say("Alle quizvragen staan al in de database."); return; }
    for (const q of missing) await set(push(ref(db,"questions")),{q:String(q.q),a:q.a.slice(0,4).map(String),c:Number(q.c)||0,createdAt:Date.now(),importedFrom:"questions.js"});
    say(missing.length+" vragen geïmporteerd.");
  } catch(err) { console.error(err); say("Importeren mislukt. Controleer de challenge-database-regels.",true); }
  finally { $("importButton").disabled=false; }
});
