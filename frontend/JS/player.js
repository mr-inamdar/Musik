import { addToPlaylist, deleteSong, fetchPlaylistSongs, likeSong, removeFromPlaylist, unlikeSong } from "./api.js";

let songs = [];
let song = null;
let currentIndex = 0;
let isPlaying = false;

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
// const likeBtnSidebar = document.getElementById('likeBtnSidebar');
// const likeBtnTitle = document.getElementById('likeBtnTitle');
const addToPlaylistBtn = document.getElementById('addToPlaylistBtn');
const addToPlaylistBtnIcon = document.querySelector('#addToPlaylistBtn i');
const deleteSongBtn = document.querySelector('.delete-song-btn');
const likeBtn = document.querySelectorAll('#likeBtn i');
const updateSongBtn = document.querySelector('.updateSongBtn');


// 1. DOM Content Loaded - Safe Data Fetching & Initializing
document.addEventListener('DOMContentLoaded', () => {
    try {
        //const storedPlaylist = localStorage.getItem('PlaylistSongList');
        songs = JSON.parse(localStorage.getItem('PlaylistSongList')) || [];
        const storedCurrentSong = localStorage.getItem('currentSong') || [];

        // FIX: Safely parse JSON strings
        //songs = storedPlaylist ? [JSON.parse(storedPlaylist)] : [];
        song = storedCurrentSong ? JSON.parse(storedCurrentSong) : null;

        console.log(typeof(songs), songs);

        // console.log(typeof(song), storedCurrentSong);

        if (song) {
            // // Find index of current song in loaded playlist
            // const foundIdx = songs.findIndex(s => (s.song_id) === (song.song_id));
            // if (foundIdx !== -1) currentIndex = foundIdx;

            // deleteSongBtn
            // if (deleteSongBtn && localStorage.getItem('user')?.name === song.uploadBy) {
            //     deleteSongBtn.classList.add('active');
            // }
            // else{
            //     deleteSongBtn.classList.remove('active');
            // }

            const user = JSON.parse(localStorage.getItem("user"));

            if (deleteSongBtn && updateSongBtn && user && user.name === song.uploadBy) {
                deleteSongBtn.classList.add("activate");
                updateSongBtn.classList.add('activate');
            } else {
                deleteSongBtn.classList.remove("activate");
                updateSongBtn.classList.remove('activate');
            }

            loadSong(song);
        } else if (songs.length > 0 && !song) {
            songs = JSON.parse(localStorage.getItem('PlaylistSongList'));
            song = songs[0];
            loadSong(song);
        }

        renderPlaylist();
    } catch (err) {
        console.error("Error loading song data from localStorage:", err);
    } finally{
        if (songs.length > 0 && song) {
            const isSongInPlaylist = songs?.filter(listSong => {
                return listSong?.song_id === song.song_id;
            });
            console.log(song, songs, isSongInPlaylist)

            if (isSongInPlaylist.length > 0) {
                addToPlaylistBtnIcon.classList.remove('bi-bookmark-plus');
                addToPlaylistBtnIcon.classList.add('bi-bookmark-x');
            } else {
                addToPlaylistBtnIcon.classList.remove('bi-bookmark-x');
                addToPlaylistBtnIcon.classList.add('bi-bookmark-plus');
            }
        }
    }
});

// 2. Build Waveform Bars
function buildWaveform(barCount = 40) {
    if (!waveform) return;
    waveform.innerHTML = "";
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        const height = Math.floor(Math.random() * 22) + 6;
        bar.style.height = `${height}px`;
        waveform.appendChild(bar);
    }
}

// 3. Highlight Played Bars
function highlightPlayedBars(progressFraction) {
    if (!waveform) return;
    const bars = waveform.querySelectorAll(".bar");
    const playedCount = Math.floor(bars.length * progressFraction);
    bars.forEach((bar, i) => {
        bar.classList.toggle("played", i < playedCount);
    });
}

function loadSong(currentSong) {
    if (!currentSong) return;

    if (currentSong.likes > 0) {
        likeBtn.forEach(likeBtn =>{
            likeBtn.classList.remove('bi-heart');
            likeBtn.classList.add('bi-heart-fill');
        });
    }
    else{
        likeBtn.forEach(likeBtn =>{
            likeBtn.classList.remove('bi-heart-fill');
            likeBtn.classList.add('bi-heart');
        });
    }
    
    song = currentSong;
    songTitle.textContent = currentSong.title || "Unknown Title";
    songGenre.textContent = currentSong.artist || "Unknown Artist";
    audio.src = currentSong.audio || "";
    
    if (albumArtImage) {
        albumArtImage.src = currentSong.image || '';
    }
    
    buildWaveform();
    updatePlaylistUI();
}

function togglePlay() {
    if (!audio.src) return;

    if (isPlaying) {
        audio.pause();
        if (playIcon) playIcon.className = "bi bi-play-fill";
    } else {
        audio.play().catch(e => console.log("Audio play error:", e));
        if (playIcon) playIcon.className = "bi bi-pause-fill";
    }
    isPlaying = !isPlaying;
}

function renderPlaylist() {
    if (!playlistEl) return;
    playlistEl.innerHTML = "";
    
    if (!Array.isArray(songs) || songs.length === 0) {
        playlistEl.innerHTML = "<li>No songs in playlist</li>";
        return;
    }

    songs?.forEach((s, i) => {
        const li = document.createElement("li");
        // li.className = `playlist-item ${i === currentIndex ? "active" : ""}`;
        li.className = `playlist-item ${s.song_id === song.song_id ? "active" : ""}`;
        li.innerHTML = `
            <div class="song-info">
                <img src="${s.image}" alt="${s.title}">
                <div class="song-details">
                    <h4>${s.title}</h4>
                    <p>${s.artist}</p>
                </div>
            </div>

            <i class="bi bi-play-circle-fill play-icon"></i>
        `;
        
       const playIcon = li.querySelector(".play-icon");

        playIcon.addEventListener("click", () => {
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

if (playBtn) playBtn.addEventListener("click", togglePlay);

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        if (!songs.length) return;
        currentIndex = (currentIndex + 1) % songs.length;
        loadSong(songs[currentIndex]);
        isPlaying = false;
        togglePlay();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        if (!songs.length) return;
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        loadSong(songs[currentIndex]);
        isPlaying = false;
        togglePlay();
    });
}

// Audio Progress & Waveform Update
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const progress = audio.currentTime / audio.duration;
        highlightPlayedBars(progress);
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
    }
});

// Click on Waveform to seek
if (waveform) {
    waveform.addEventListener("click", (e) => {
        if (!audio.duration) return;
        const rect = waveform.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickFraction = clickX / rect.width;
        audio.currentTime = clickFraction * audio.duration;
    });
}

audio.addEventListener("ended", () => {
    if (nextBtn) nextBtn.click();
});

// Like API Function Handler
async function handleLike() {
    if (song && localStorage.getItem('token')) {
        const response = await likeSong(song.song_id);
        if(response.success){
            window.alert("Song liked!");
            likeBtn.forEach(likeBtn =>{
                likeBtn.classList.remove('bi-heart');
                likeBtn.classList.add('bi-heart-fill');
            });
        }
        else{
            window.alert(response.message);
        }
    }
}
// Like API Function Handler
async function handleUnlike() {
    if (song && localStorage.getItem('token')) {
        const response = await unlikeSong(song.song_id);
        if(response.success){
            window.alert("Song unliked!");
            likeBtn.forEach(likeBtn =>{
                likeBtn.classList.remove('bi-heart-fill');
                likeBtn.classList.add('bi-heart');
            });
        }
        else{
            window.alert(response.message);
        }
    }
}

// if (likeBtnSidebar) likeBtnSidebar.addEventListener('click', handleLike);
// if (likeBtnTitle) likeBtnTitle.addEventListener('click', handleLike);
if (likeBtn) {
    likeBtn.forEach(likeBtn=>{
        likeBtn.addEventListener('click', ()=>{
            if (likeBtn.classList.contains('bi-heart')) {
                handleLike();
            }
            else{
                handleUnlike();
            }
        });
    });
}

async function handleAddSongToPlaylist() {
    if (song && localStorage.getItem('token')) {
        const response = await addToPlaylist(song.song_id);
        console.log(song)
        if (response) {
            alert('Song added sucessfully');
            addToPlaylistBtnIcon.classList.remove('bi-bookmark-plus');
            addToPlaylistBtnIcon.classList.add('bi-bookmark-x');

            const result = await fetchPlaylistSongs();
            if (result) {
                songs = result;
                localStorage.removeItem('PlaylistSongList');
                localStorage.setItem('PlaylistSongList', songs);

                renderPlaylist();
            }
        }
        else{
            alert('Song addeditionfailed');
        }
    }
    else{
        alert('Login First');
    }
}

async function handleRemoveSongFromPlaylist() {
    if (song && localStorage.getItem('token')) {
        const responce = await removeFromPlaylist(song.song_id);
        if (responce) {
            alert('Song deletion sucessfully');
            addToPlaylistBtnIcon.classList.remove('bi-bookmark-x');
            addToPlaylistBtnIcon.classList.add('bi-bookmark-plus');

            const result = await fetchPlaylistSongs();
            if (result) {
                songs = result;
                localStorage.removeItem('PlaylistSongList');
                localStorage.setItem('PlaylistSongList', songs);

                renderPlaylist();
            }
        }
        else{
            alert('login First');
        }
    }
}

if(addToPlaylistBtn) {
    addToPlaylistBtn.addEventListener('click',()=>{
        if (addToPlaylistBtnIcon.classList.contains('bi-bookmark-plus')) {
            handleAddSongToPlaylist();
        }
        else{
            handleRemoveSongFromPlaylist();
        }
    } )
};

async function handleSongDeletion() {
    if (song && localStorage.getItem('token')) {
       const responce = await deleteSong(song.song_id);
        if (responce) {
            window.alert('song deleted sucessfully');
        }
        else{
            window.alert('song deletion failed!');
        }
    }
}

if (deleteSongBtn) {
    deleteSongBtn.addEventListener("click", handleSongDeletion);
}

if (updateSongBtn) {
    updateSongBtn.addEventListener("click", () => {
        if (updateSongBtn.classList.contains("activate")) {
            localStorage.setItem('updateSong', JSON.stringify(song));
            window.location.href = "updateSongPage.html";
        }
    });
}