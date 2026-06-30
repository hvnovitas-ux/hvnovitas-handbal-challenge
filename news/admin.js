import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push
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

document.getElementById("publish").addEventListener("click", () => {

    const title = document.getElementById("title").value.trim();
    const text = document.getElementById("text").value.trim();

    if (!title || !text) {
        alert("Vul een titel en een bericht in.");
        return;
    }

   push(ref(db, "news"), {
    title,
    text,
    created: Date.now(),
    date: new Date().toLocaleDateString("nl-NL"),
    time: new Date().toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit"
    })
});

    document.getElementById("melding").textContent =
        "✅ Nieuwsbericht opgeslagen!";

    document.getElementById("title").value = "";
    document.getElementById("text").value = "";

});
