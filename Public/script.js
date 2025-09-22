import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB_PymE3aacSLID0EZduTVTwXfqiC9-lts",
  authDomain: "iqzad-tap-eran-halal-crypto.firebaseapp.com",
  projectId: "iqzad-tap-eran-halal-crypto",
  storageBucket: "iqzad-tap-eran-halal-crypto.firebasestorage.app",
  messagingSenderId: "94523079394",
  appId: "1:94523079394:web:5db9e23146eed248297cbb",
  measurementId: "G-RT0Y3Z9Y24",
  databaseURL: "https://iqzad-tap-eran-halal-crypto-default-rtdb.firebaseio.com/"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

let userId = null;
let tokens = 0;
let energy = 2500;
let playTime = 0;
let timeLeft = 3600;

// Login
document.getElementById("loginBtn").onclick = () => {
  signInWithPopup(auth, provider);
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";
    await loadUser();
  }
});

// Load user data
async function loadUser() {
  const snapshot = await get(child(ref(db), "users/" + userId));
  if (snapshot.exists()) {
    let data = snapshot.val();
    tokens = data.tokens || 0;
    energy = data.energy || 2500;
    playTime = data.playTime || 0;
  }
  updateUI();
}

// Update UI
function updateUI() {
  document.getElementById("tokens").innerText = tokens;
  document.getElementById("energy").innerText = energy;
  document.getElementById("energyValue").innerText = energy;
  document.getElementById("energyBar").style.width = (energy / 2500 * 100) + "%";
  document.getElementById("dailyTime").innerText = `⏰ Daily Play Time: ${formatTime(playTime)} / 01:00:00`;
  document.getElementById("timeLeft").innerText = formatTime(timeLeft);
  document.getElementById("refLink").value = window.location.origin + "?ref=" + userId;
}

// Tap
document.getElementById("tapBtn").onclick = () => {
  if (timeLeft > 0 && energy > 0) {
    tokens++;
    energy--;
    playTime++;
    saveData();
    updateUI();
  } else {
    alert("Time or energy finished!");
  }
};

// Withdraw
function withdrawRequest() {
  window.open("https://forms.gle/WTK4DaWgmuCx6yZR7", "_blank");
}

// Referral
function copyReferral() {
  const refInput = document.getElementById("refLink");
  refInput.select();
  document.execCommand("copy");
  alert("Referral link copied!");
}

// Social tasks
function completeTask(task) {
  tokens += 100;
  saveData();
  updateUI();
  alert(`${task} task completed! +100 points`);
}

// Save
function saveData() {
  set(ref(db, "users/" + userId), {
    tokens,
    energy,
    playTime
  });
}

// Format time
function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Tabs
window.showTab = function (tab) {
  document.querySelectorAll(".tab").forEach(el => el.style.display = "none");
  document.getElementById(tab).style.display = "block";
};
