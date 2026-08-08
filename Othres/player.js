import { likeSong } from "./api.js";

let songs = [];
let song = [];
let playlistSongs = [];
let currentIndex = 0;
let playlistIdx = 0;
let isPlaying = false;

document.addEventListener('DOMContentLoaded', ()=>{
    // songs = localStorage.getItem('songList');
    songs = localStorage.getItem('PlsylistSongList');
    // currentIndex = localStorage.getItem('currentSongIdx');
    song = localStorage.getItem('currentSong');
})

const audio = new Audio('');
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const songTitle = document.getElementById("songTitle");
const songGenre = document.getElementById("songGenre");
const waveform = document.getElementById("waveform");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const playlistEl = document.getElementById("playlist");
const albumArtImage = document.querySelector("#albumArt img");

// 1. Build Waveform Bars (Original Style)
function buildWaveform(barCount = 40) {
  waveform.innerHTML = "";
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    const height = Math.floor(Math.random() * 22) + 6; // Random bar heights
    bar.style.height = `${height}px`;
    waveform.appendChild(bar);
  }
}

// 2. Highlight Played Bars (Gold Color)
function highlightPlayedBars(progressFraction) {
  const bars = waveform.querySelectorAll(".bar");
  const playedCount = Math.floor(bars.length * progressFraction);
  bars.forEach((bar, i) => {
    bar.classList.toggle("played", i < playedCount);
  });
}


function loadSong(song) {
  songTitle.textContent = song.title;
  songGenre.textContent = song.artist;
  audio.src = song.audio;
  albumArtImage.src = song.image;
  buildWaveform();
  updatePlaylistUI();
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playIcon.className = "bi bi-play-fill";
  } else {
    audio.play();
    playIcon.className = "bi bi-pause-fill";
  }
  isPlaying = !isPlaying;
}

function renderPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, i) => {
    const li = document.createElement("li");
    li.className = `playlist-item ${i === currentIndex ? "active" : ""}`;
    li.innerHTML = `<span>${song.title}</span> <i class="bi bi-play-circle-fill"></i>`;
    li.addEventListener("click", () => {
      currentIndex = i;
      loadSong(songs[currentIndex]);
      isPlaying = false;
      togglePlay();
    });
    playlistEl.appendChild(li);
  });
}

function updatePlaylistUI() {
  const items = playlistEl.querySelectorAll(".playlist-item");
  items.forEach((item, i) => {
    item.classList.toggle("active", i === currentIndex);
  });
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60) || 0;
  const sec = Math.floor(seconds % 60) || 0;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

playBtn.addEventListener("click", togglePlay);

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(songs[currentIndex]);
  isPlaying = false;
  togglePlay();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentIndex]);
  isPlaying = false;
  togglePlay();
});

// Real Audio Progress -> Waveform Update
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progress = audio.currentTime / audio.duration;
    highlightPlayedBars(progress);
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent = formatTime(audio.duration);
  }
});

// Click anywhere on Waveform to seek audio!
waveform.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const rect = waveform.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickFraction = clickX / rect.width;
  audio.currentTime = clickFraction * audio.duration;
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

// Start App
renderPlaylist();
loadSong(song);


// api

const likeBtn = document.getElementById('likeBtn');
const addToPlaylistBtn = document.getElementById('addToPlaylistBtn');

if (likeBtn) {
  likeBtn.addEventListener('click', async ()=>{
      const responce = await likeSong(song.song_id);
  })
}