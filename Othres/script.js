/* ==========================================================================
   MUSIC2D — SCRIPT
   ==========================================================================
   Ye file dashboard ko interactive banati hai:
   1. Play / Pause button          -> turntable ghumta hai + tonearm move hota hai
   2. Next / Previous button       -> demo songs list mein switch karta hai
   3. Shuffle button               -> on/off highlight
   4. Like (+) button              -> counter badhata hai
   5. Waveform bars                -> random height ke bars generate karta hai
   6. Progress timer               -> play hone par time aage badhta hai
   7. Category pills               -> active pill switch karta hai
   8. Favorite playlist play btns  -> click par "now playing" update karta hai

   NOTE: Ye ek DEMO player hai (real audio file attach nahi hai). Agar tumhe
   real gaane bajane hain, to neeche "REAL AUDIO LAGANE KE LIYE" wala section
   padho — bas ek <audio> tag add karke uska src badalna hoga.
   ========================================================================== */

/* ---------------- 1. Demo Songs Data (yahan apne gaane daal sakte ho) ---------------- */
const songs = [
  { title: "The Suffering", genre: "Classic", duration: "3:35", startAt: "1:54" },
  { title: "Neon Nights", genre: "90s", duration: "4:02", startAt: "0:00" },
  { title: "Quiet Static", genre: "Instrumental", duration: "2:48", startAt: "0:00" },
  { title: "Modern Ruin", genre: "New", duration: "3:16", startAt: "0:00" },
];

let currentSongIndex = 0;
let isPlaying = true;       // page load par "playing" state dikhaya gaya hai (screenshot jaisa)
let likeCount = 392;

/* ---------------- 2. DOM Elements pakadna (ek jagah rakhna easy debug ke liye) ---------------- */
const turntable = document.getElementById("turntable");
const vinylDisc = document.getElementById("vinylDisc");
const tonearm = document.getElementById("tonearm");

const songTitleEl = document.getElementById("songTitle");
const songGenreEl = document.getElementById("songGenre");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

const likeBtn = document.getElementById("likeBtn");
const likeCountEl = document.getElementById("likeCount");

const waveform = document.getElementById("waveform");
const categoryPills = document.getElementById("categoryPills");
const playlistList = document.getElementById("playlistList");


/* ==========================================================================
   3. WAVEFORM BARS BANANA
   ========================================================================== */
function buildWaveform(barCount = 40) {
  waveform.innerHTML = ""; // purani bars hatao
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    // random height taaki asli waveform jaisa dikhe
    const height = Math.floor(Math.random() * 22) + 6; // 6px se 28px tak
    bar.style.height = `${height}px`;
    waveform.appendChild(bar);
  }
  highlightPlayedBars(0.55); // demo ke liye kuch bars "played" (white) dikha do
}

// progress% ke hisaab se bars ko white color do (played portion)
function highlightPlayedBars(progressFraction) {
  const bars = waveform.querySelectorAll(".bar");
  const playedCount = Math.floor(bars.length * progressFraction);
  bars.forEach((bar, i) => {
    bar.classList.toggle("played", i < playedCount);
  });
}


/* ==========================================================================
   4. SONG INFO UPDATE KARNA (jab next/prev/play dabaya jaaye)
   ========================================================================== */
function renderCurrentSong() {
  const song = songs[currentSongIndex];
  songTitleEl.textContent = song.title;
  songGenreEl.textContent = song.genre;
  currentTimeEl.textContent = song.startAt;
  totalTimeEl.textContent = song.duration;
  buildWaveform();
}

function playPauseUI(playing) {
  isPlaying = playing;

  // icon badlo
  playIcon.classList.toggle("bi-pause-fill", playing);
  playIcon.classList.toggle("bi-play-fill", !playing);

  // turntable ka animation chalu/band karo
  vinylDisc.style.animationPlayState = playing ? "running" : "paused";
  turntable.classList.toggle("playing", playing);
}


/* ==========================================================================
   5. EVENT LISTENERS — button clicks yahan handle hote hain
   ========================================================================== */

// Play / Pause toggle
playBtn.addEventListener("click", () => {
  playPauseUI(!isPlaying);
});

// Next song
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  renderCurrentSong();
  playPauseUI(true); // naya gaana select hote hi play kar do
});

// Previous song
prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  renderCurrentSong();
  playPauseUI(true);
});

// Shuffle button — bas visually highlight on/off karta hai
shuffleBtn.addEventListener("click", () => {
  shuffleBtn.classList.toggle("active");
});

// Like (+) button — click karne par counter badhta hai
likeBtn.addEventListener("click", () => {
  likeCount++;
  likeCountEl.textContent = likeCount;
});

// Category pills — sirf ek active rahega
categoryPills.addEventListener("click", (e) => {
  const clickedPill = e.target.closest(".pill");
  if (!clickedPill) return;

  categoryPills.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
  clickedPill.classList.add("active");

  // OPTIONAL: yahan tum apna filter logic likh sakte ho, jaise:
  // filterSongsByCategory(clickedPill.dataset.cat);
});

// Favorite playlist ke play buttons
playlistList.addEventListener("click", (e) => {
  const btn = e.target.closest(".pl-play-btn");
  if (!btn) return;

  // sabse pehle sab buttons se "active" hatao
  playlistList.querySelectorAll(".pl-play-btn").forEach((b) => {
    b.classList.remove("active");
    b.innerHTML = `<i class="bi bi-play-fill"></i>`;
  });

  // clicked button ko active + pause icon do
  btn.classList.add("active");
  btn.innerHTML = `<i class="bi bi-pause-fill"></i>`;

  // demo ke liye playlist ka naam turntable ke title mein dikha do
  const playlistName = btn.closest(".playlist-item").querySelector(".pl-name").textContent;
  songTitleEl.textContent = playlistName;
  playPauseUI(true);
});


/* ==========================================================================
   6. DEMO PROGRESS TIMER
   ==========================================================================
   Chunki humare paas real audio file nahi hai, ye timer sirf visual demo ke
   liye current time ko har second thoda aage badhata hai jab "playing" ho.
   ========================================================================== */
let demoSeconds = 114; // 1:54 = 114 seconds (screenshot ke shuruaati time se match)

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  let s = totalSeconds % 60;
  if (s < 10) s = `0${s}`;
  return `${m}:${s}`;
}

setInterval(() => {
  if (!isPlaying) return;

  demoSeconds++;
  currentTimeEl.textContent = formatTime(demoSeconds);

  // agar 3:35 (215 sec) tak pahunch gaya to next song par chala jao
  if (demoSeconds >= 215) {
    demoSeconds = 0;
    nextBtn.click();
  }

  // waveform ka "played" portion bhi update karo
  const progress = demoSeconds / 215;
  highlightPlayedBars(progress);
}, 1000);


/* ---------------- 7. Page load par shuruaati state set karo ---------------- */
buildWaveform();
playPauseUI(true); // screenshot mein gaana already "playing" state mein hai


/* ==========================================================================
   REAL AUDIO LAGANE KE LIYE (optional upgrade):
   ==========================================================================
   1. HTML mein "index.html" ke andar body ke end mein ye line add karo:
        <audio id="audioPlayer" src="songs/song1.mp3"></audio>

   2. Yahan script.js mein top par ye line add karo:
        const audioPlayer = document.getElementById("audioPlayer");

   3. playPauseUI() function ke andar ye add karo:
        if (playing) { audioPlayer.play(); } else { audioPlayer.pause(); }

   4. nextBtn/prevBtn click par:
        audioPlayer.src = songs[currentSongIndex].songSrc;
        audioPlayer.play();

   Isse demo timer (setInterval wala) hata kar audioPlayer ka असली
   'timeupdate' event use kar sakte ho — jaisa humne pehle wali music
   player script mein dekha tha.
   ========================================================================== */
