import { db } from "./firebase.js";
import { ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const fileInput = document.getElementById("logo");
const list = document.getElementById("sponsorList");

console.log("🧡 SPONSORS MODULE LOADED");

// UPLOAD
document.getElementById("saveSponsor").addEventListener("click", async () => {

    const file = fileInput.files[0];
    if (!file) return alert("Selecteer een logo");

    const reader = new FileReader();

    reader.onload = async () => {

        await push(ref(db, "sponsors"), {
            imageUrl: reader.result,
            created: Date.now()
        });

        fileInput.value = "";
    };

    reader.readAsDataURL(file);
});

// LOAD
onValue(ref(db, "sponsors"), (snapshot) => {

    const data = snapshot.val();

    if (!list) return;

    if (!data) {
        list.innerHTML = "Geen sponsors";
        return;
    }

    list.innerHTML = Object.entries(data).map(([id, s]) => `
        <div style="display:inline-block; margin:10px; text-align:center;">

            <img src="${s.imageUrl}" style="height:60px; background:white; padding:5px; border-radius:8px;">

            <br>

            <button onclick="deleteSponsor('${id}')">Verwijder</button>

        </div>
    `).join("");
});

// DELETE
window.deleteSponsor = async (id) => {
    await remove(ref(db, "sponsors/" + id));
};
