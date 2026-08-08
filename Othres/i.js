// import function
import { fetchAllSongs, fetchPlaylistSongs } from "../frontend/JS/api.js";
import { renderPosterSong, renderSong, renderTopSong } from "../frontend/JS/renderFunctions.js";
// playlist
const playlist = document.getElementById('playlist');
let allPlaylistSongs = [];

// songs
const songs = document.getElementById("songs");


// Backend Var
let allSongs = [];
let posterSongs =[];
let topSongs=[];
let trendingSongs =[];
let expSongs =[];

const user_avatar = document.getElementById('user_avatar');
const user_name = document.getElementById('user_name');
const addSongBtn = document.getElementById('addSongBtn');


document.addEventListener('DOMContentLoaded', async ()=>{

    const userData = localStorage.getItem("user");

    if(userData){

        const user = JSON.parse(userData);

        addSongBtn.classList.add('active');

        console.log(user)

        user_name.innerHTML =  user.name;

        user_avatar.textContent = [...user.name][0].toUpperCase();

    }
    else{
        addSongBtn.classList.remove('active');
    }

    allSongs = await fetchAllSongs();

    console.log(allSongs);

    // Poster Songs (0-4)
    posterSongs = allSongs.slice(0, 5);

    // Top Songs (5-14)
    topSongs = allSongs.slice(5, 15);

    // Trending Songs (15-24)
    trendingSongs = allSongs.slice(15, 25);

    // Explore Songs (25-34)
    expSongs = allSongs.slice(25, 35);

    console.log({
        posterSongs,
        topSongs,
        trendingSongs,
        expSongs
    });

    renderSongs();

    if (localStorage.getItem('token')) {
        allPlaylistSongs = await fetchPlaylistSongs();

        if (allPlaylistSongs.length > 0) {
            playlist.style.width = '25%';
            songs.style.width = '75%';
        }
        else{
            playlist.style.width = '0%';
            songs.style.width = '100%';
        }
    }
});

let index = 0;
let topSongsC = document.getElementById('topSongsC');
let trendingSongsC = document.getElementById('trendingSongsC');
let expSongsC = document.getElementById('expSongsC');
function renderSongs(){
    if (posterSongs || posterSongs.length > 0) {
        let trending_songs = document.getElementById('trending_songs');
        
        trending_songs.innerHTML = renderPosterSong(posterSongs[0], index);

        document.getElementById("left").addEventListener("click", prev_pic);
        document.getElementById("right").addEventListener("click", next_pic);

        document.getElementById("posterPlay").addEventListener("click", () => {
            activate_song_popup(posterSongs[0]);
        });
        
    }

    topSongs.map((song, i) =>{
        const songItem = document.createElement('div');
        songItem.className = 'trending_song_box';
        songItem.innerHTML = renderTopSong(song,i);
        topSongsC.appendChild(songItem);
    });

    trendingSongs.map(song =>{
        const songItem = document.createElement('li');
        songItem.className = 'song_item';
        songItem.innerHTML = renderSong(song);
        trendingSongsC.appendChild(songItem);
    })

    expSongs.map(song =>{
        const songItem = document.createElement('li');
        songItem.className = 'song_item';
        songItem.innerHTML = renderSong(song);
        expSongsC.appendChild(songItem);
    })
};

function playerPage(){
    window.location.href='player.html';
}

let pic_tag = document.getElementById('poster_pic');
let numbar = document.querySelector('.trending_song_item span');
let pic = document.querySelector('.trending_song_item img');
let name = document.querySelector('.trending_song_item h5');
let iTag = document.querySelector(".trending_song_item i");

function updatePic(){
    // pic_tag.style.opacity = 0;
    setTimeout(() =>{
        pic_tag.src = posterSongs[index].image;
        numbar.innerHTML = `0${index+1}`;
        pic.src = posterSongs[index].image;
        name.innerHTML = posterSongs[index].title;
        iTag.setAttribute("onclick", posterSongs[index]);
        // pic_tag.style.opacity = 1;
    }, 500);
}
function next_pic() {
    index = (index+1) % posterSongs.length;
    updatePic();
}

function prev_pic() {
    index = (index - 1 + posterSongs.length) % posterSongs.length;
    updatePic();
}
// autopic updation
setInterval(next_pic, 60000);


let search_results = document.querySelector("#search_system .search_results");
let search_input = document.querySelector("#search_system input");

function renderSearchResults(songs) {

    search_results.innerHTML = "";

    if (songs.length === 0) {

        search_results.innerHTML = `
            <div class="no-result">
                No Songs Found
            </div>
        `;

        search_results.style.display = "block";

        return;

    }

    songs.forEach(song => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${song.image_url}" alt="">

            <div class="content">

                <h4>${song.title}</h4>

                <div class="subtitel">
                    ${song.artist}
                </div>

            </div>

            <i class="bi bi-play-circle-fill playListPlay"></i>
        `;

        card.querySelector("i").addEventListener("click", () => {

            activate_song_popup(

                song.image_url,

                song.title,

                song.audio_url,

                song.artist

            );

        });

        search_results.appendChild(card);

    });

    search_results.style.display = "block";

}


function searchSongs(query) {

    query = query.trim().toLowerCase();

    if (!query) {

        search_results.innerHTML = "";
        search_results.style.display = "none";
        return;

    }

    const filteredSongs = allSongs.filter(song => {

        return (
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            (song.album && song.album.toLowerCase().includes(query))
        );

    });

    renderSearchResults(filteredSongs);

}

function debounce(fn, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            fn(...args);

        }, delay);

    };

}
const handleSearch = debounce(() => {

    searchSongs(search_input.value);

}, 250);

search_input.addEventListener("input", handleSearch);


// Playlist 
// Audio Play System

/* ---------------- 1. Basic Variables & DOM Elements ---------------- */

let isPlaylist_song = false;   // true = playlist se gaana baj raha hai, false = "all songs" se
let playlist_indexing = 0;

let random_index = 0;

const gana = new Audio("");           // audio player object
const wave = document.getElementsByClassName("wave")[0];
const play_icon = document.getElementById("master_play_icon");
const palyed_song_ka_pic = document.getElementById("poster_master_play");

const played_song_ka_naam_angreji = document.querySelector("#title marquee #angreji");
const played_song_ke_artist_ka_naam = document.querySelector("#title .subtitle");

const dowload_music = document.getElementById("dowload_music");
const progres_bar = document.getElementById("seek");

function loadAndPlaySong(song) {
    // 1) audio source set karo
    gana.src = song.audio;

    // 2) download button update karo
    dowload_music.setAttribute("download", `${song.artist}-${song.title}`);
    dowload_music.href = song.song;

    // 3) agar playlist se baj raha hai, to list mein highlight/icon update karo
    if (isPlaylist_song) {
        makeAllBackground();
        makeAllPlays();

        const listItems = document.querySelectorAll("#playlist_songs li");
        listItems[playlist_indexing].style.background = "rgb(105, 105, 105, 0.1)";

        // FIX: id humesha "index + 1" hai (list 1 se start hoti hai)
        const playlist_play_icon = document.getElementById(`${playlist_indexing + 1}`);
        playlist_play_icon.classList.remove("bi-play-circle-fill");
        playlist_play_icon.classList.add("bi-pause-circle-fill");
    }

    // 4) actual gaana play karo
    play_audio(song);
}


/* ---------------- 4. Play / Pause Core Function ---------------- */

function play_audio(song) {
    if (!wave.classList.contains("active")) {
        play_icon.classList.remove("bi-play-circle");
        play_icon.classList.add("bi-pause-circle");
        wave.classList.add("active");
    }
    palyed_song_ka_pic.src = song.image;
    played_song_ka_naam_angreji.innerHTML = song.title;
    played_song_ke_artist_ka_naam.innerHTML = song.artist;
    gana.play();
}

// "Next" button ya current gaana khatam hone par agla gaana chalane ke liye
function play_next_song() {
    if (isPlaylist_song) {
        loadAndPlaySong(allPlaylistSongs[playlist_indexing]);
    } else {
        loadAndPlaySong(allSongs[random_index]);
    }
}


/* ---------------- 5. Playlist UI Helpers ---------------- */

const makeAllBackground = () => {
    document.querySelectorAll("#playlist_songs li").forEach((el) => {
        el.style.background = "rgb(49, 46, 46)";
    });
};

const makeAllPlays = () => {
    document.querySelectorAll(".playListPlay").forEach((el) => {
        el.classList.remove("bi-pause-circle-fill");
        el.classList.add("bi-play-circle-fill");
    });
};


/* ---------------- 6. Master Play / Pause Button ---------------- */

function togglePlayPause() {
    if (play_icon.classList.contains("bi-play-circle")) {
        // abhi paused hai -> play karo
        if (isPlaylist_song) {
            const icons = document.querySelectorAll("#playlist_songs li i");
            icons[playlist_indexing].classList.remove("bi-play-circle-fill");
            icons[playlist_indexing].classList.add("bi-pause-circle-fill");
        }
        wave.classList.add("active");
        play_icon.classList.remove("bi-play-circle");
        play_icon.classList.add("bi-pause-circle");
        gana.play();
    } else {
        // abhi baj raha hai -> pause karo
        play_icon.classList.remove("bi-pause-circle");
        play_icon.classList.add("bi-play-circle");
        wave.classList.remove("active");
        makeAllBackground();
        makeAllPlays();
        gana.pause();
    }
}


/* ---------------- 7. "All Songs" (Non-Playlist) Navigation ---------------- */

const call_play_next_song = () => {
    if (random_index >= allSongs.length) {
        random_index = 0;
    }
    random_index++;
    play_next_song();
};

const play_previous_song = () => {
    if (random_index <= 0) {
        random_index = allSongs.length - 1;
    } else {
        random_index -= 2;
    }
    play_next_song();
};


/* ---------------- 8. Progress Bar (Seek) ---------------- */

const current_time = document.getElementById("current_time");
const current_end = document.getElementById("current_end");
const bar2 = document.getElementById("bar2");
const dot = document.querySelector(".bar .dot");

// Chhota helper: seconds ko "0:05" jaise format mein convert karta hai
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    if (seconds < 10) seconds = `0${seconds}`;
    return `${minutes}:${seconds}`;
}

gana.addEventListener("timeupdate", () => {
    current_end.innerText = formatTime(gana.duration);
    current_time.innerText = formatTime(gana.currentTime);

    const progress = parseInt((gana.currentTime / gana.duration) * 100);
    progres_bar.value = progress;

    // seek bar ka visual (line + dot) update karo
    const seek_bar = progres_bar.value;
    bar2.style.width = `${seek_bar}%`;
    dot.style.left = `${seek_bar}%`;
});

progres_bar.addEventListener("change", () => {
    gana.currentTime = (progres_bar.value * gana.duration) / 100;
});


/* ---------------- 9. Volume Control ---------------- */

const vol_icon = document.getElementById("vol_icon");
const vol_input = document.getElementById("vol_input");
const vol_bar = document.getElementsByClassName("vol_bar")[0];
const vol_dot = document.getElementById("vol_dot");

vol_input.addEventListener("change", () => {
    const vol = vol_input.value;

    // volume ke hisaab se sahi icon dikhao (mute / low / high)
    vol_icon.classList.remove("bi-volume-up-fill", "bi-volume-down-fill", "bi-volume-mute-fill");
    if (vol == 0) {
        vol_icon.classList.add("bi-volume-mute-fill");
    } else if (vol <= 50) {
        vol_icon.classList.add("bi-volume-down-fill");
    } else {
        vol_icon.classList.add("bi-volume-up-fill");
    }

    vol_bar.style.width = `${vol}%`;
    vol_dot.style.left = `${vol}%`;
    gana.volume = vol / 100;
});


/* ---------------- 10. Direct Song Play (from popup) ---------------- */

function play_music(song) {
    isPlaylist_song = false;
    closeBtn.click();
    gana.src = song.audio;
    //dowload_music.setAttribute(`download`, `${song.artist}-${song.name}`);
    dowload_music.href = song.audio;
    dowload_music.href = song.audio;
    dowload_music.setAttribute("download", `${song.artist}-${song.title}.mp3`);
    makeAllBackground();
    makeAllPlays();
    play_audio(song);
}


/* ---------------- 11. Song Info Popup ---------------- */

const SongPopup = document.getElementById("SongPopup");
const closeBtn = document.getElementById("closeBtn");
const popuppic = document.querySelector(".popup-box img");
const naam = document.querySelector(".popup-box #popup_details marquee");
const playButton = document.querySelector(".popup-box #popup_details button");

const activate_song_popup = (song) => {
    popuppic.src = song.image;
    naam.innerHTML = song.artist + "-" + song.name;
    // playButton.setAttribute(`onclick`, `play_music(${song})`);
    playButton.addEventListener('click', ()=>{
        play_music(song);
    })
    SongPopup.style.display = "flex";
};

closeBtn.onclick = () =>{
  SongPopup.style.display = "none";
};

window.onclick = (e) =>{
  if(e.target === SongPopup) {
    SongPopup.style.display = "none";
  }
};

/* ---------------- 12. Playlist Item Click (li ke andar play icon) ---------------- */

document.querySelectorAll("#playlist_songs li .playListPlay").forEach((iconEl) => {
    iconEl.addEventListener("click", (el) => {
        const clickedIndex = Number(el.target.id) - 1;  // list ID 1 se start hoti hai
        playlist_indexing = clickedIndex;
        isPlaylist_song = true;

        if (el.target.classList.contains("bi-pause-circle-fill")) {
            // pehle se baj raha tha -> pause karo
            el.target.classList.remove("bi-pause-circle-fill");
            el.target.classList.add("bi-play-circle-fill");
            togglePlayPause();
        } else {
            // naya gaana play karo
            makeAllPlays();
            makeAllBackground();
            document.querySelectorAll("#playlist_songs li")[clickedIndex].style.background = "rgba(58, 58, 91, 0.5)";
            el.target.classList.remove("bi-play-circle-fill");
            el.target.classList.add("bi-pause-circle-fill");

            loadAndPlaySong(playlist_song[clickedIndex]);
        }
    });
});


/* ---------------- 13. Shuffle / Repeat / Next Mode Toggle Button ---------------- */

const shuffle = document.getElementsByClassName("shuffle")[0];

// Teeno modes ki settings ek jagah — naya mode add karna ho to bas yahan add karo
const SHUFFLE_MODES = {
    next:   { nextLabel: "repeat", addClass: "bi-repeat-1",        removeClasses: ["bi-music-note-beamed", "bi-shuffle"] },
    repeat: { nextLabel: "random", addClass: "bi-shuffle",         removeClasses: ["bi-music-note-beamed", "bi-repeat-1"] },
    random: { nextLabel: "next",   addClass: "bi-music-note-beamed", removeClasses: ["bi-repeat-1", "bi-shuffle"] }
};

shuffle.addEventListener("click", () => {
    const currentMode = shuffle.innerHTML;
    const modeConfig = SHUFFLE_MODES[currentMode];

    if (modeConfig) {
        shuffle.classList.add(modeConfig.addClass);
        shuffle.classList.remove(...modeConfig.removeClasses);
        shuffle.innerHTML = modeConfig.nextLabel;
    }
});


/* ---------------- 14. Next / Repeat / Random Song Logic ---------------- */

function next_musiq() {
    if (isPlaylist_song) {
        playlist_indexing = playlist_indexing >= playlist_song.length - 1 ? 0 : playlist_indexing + 1;
    } else {
        random_index = random_index >= all_songs.length - 1 ? 0 : random_index + 1;
    }
    play_next_song();
}

function repeat_musiq() {
    // index change nahi hota, wahi gaana dobara play hota hai
    play_next_song();
}

function random_musiq() {
    if (isPlaylist_song) {
        playlist_indexing = Math.floor(Math.random() * playlist_song.length);
    } else {
        random_index = Math.floor(Math.random() * all_songs.length);
    }
    play_next_song();
}

// Gaana khatam hone par shuffle-mode ke hisaab se agla step decide karo
gana.addEventListener("ended", () => {
    const mode = shuffle.innerHTML;
    if (mode === "repeat") repeat_musiq();
    else if (mode === "next") next_musiq();
    else if (mode === "random") random_musiq();
});

