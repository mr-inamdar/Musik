// import function
import { deleteMusikAccount, fetchAllSongs, fetchPlaylistSongs, verifyPasswoard } from "./api.js";
import { renderPosterSong, renderSong, renderTopSong, renderPlaylistSong } from "./renderFunctions.js";

/* ---------------- 1. DOM Elements & Global Variables ---------------- */
const playlist = document.getElementById('playlist');
const songs = document.getElementById("songs");
const user_avatar = document.getElementById('user_avatar');
const user_name = document.getElementById('user_name');
const addSongBtn = document.getElementById('addSongBtn');
const media_query_for_mobile = window.matchMedia("(max-width: 499px)");

let isDeleteMode = false;

// Backend Data Arrays
let allSongs = [];
let allPlaylistSongs = [];
let posterSongs = [];
let topSongs = [];
let trendingSongs = [];
let expSongs = [];

// Audio & Player Control Variables
let isPlaylist_song = false; 
let playlist_indexing = 0;
let random_index = 0;
let posterIndex = 0;

function updateMediaSession(song) {
    if ("mediaSession" in navigator) {

        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: song.album,
            artwork: [
                {
                    src: song.image,
                    sizes: "96x96",
                    type: "image/jpeg"
                },
                {
                    src: song.image,
                    sizes: "192x192",
                    type: "image/jpeg"
                },
                {
                    src: song.image,
                    sizes: "512x512",
                    type: "image/jpeg"
                }
            ]
        });

        // Play
        navigator.mediaSession.setActionHandler("play", () => {
            gana.play();
        });

        navigator.mediaSession.setActionHandler("pause", () => {
            gana.pause();
        });

        // Next
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            call_play_next_song();
        });

        // Previous
        navigator.mediaSession.setActionHandler("previoustrack", () => {
            play_previous_song();
        });
    }
}

const gana = new Audio();
const wave = document.getElementsByClassName("wave")[0];
const play_icon = document.getElementById("master_play_icon");
const palyed_song_ka_pic = document.getElementById("poster_master_play");
const played_song_ka_naam_angreji = document.querySelector("#title marquee #angreji");
const played_song_ke_artist_ka_naam = document.querySelector("#title .subtitle");
const dowload_music = document.getElementById("dowload_music");
const progres_bar = document.getElementById("seek");
const loginBtn = document.getElementById('loginBtn');
const signinBtn = document.getElementById('signinBtn');
// play_system
const play_system = document.getElementById('play_system');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const sub_main = document.getElementById('sub_main');

/* ---------------- 2. Initial DOM Load ---------------- */
document.addEventListener('DOMContentLoaded', async () => {
    if (loginBtn && localStorage.getItem('token')) {
        loginBtn.innerText = 'Logout';
        signinBtn.innerText = 'Delete Account';
        isDeleteMode = true;

        loginBtn.href = 'index.html';
        signinBtn.href = 'index.html';
    }
    else if(loginBtn && !localStorage.getItem('token')){
        loginBtn.innerText = 'Login';
        signinBtn.innerText = 'Sign In';

        isDeleteMode = false;

        loginBtn.href = 'login.html';
        signinBtn.href = 'singup.html';
    }
    // const token = localStorage.getItem("token");
    // console.log(JSON.parse(atob(token.split(".")[1])));

    if (localStorage.getItem("user")) {
        const userData = localStorage.getItem("user");

        try {
            const user = JSON.parse(userData);
            console.log(user)
            if (addSongBtn) addSongBtn.classList.add('active');
            if (user_name) user_name.innerHTML = user.name || "";
            if (user_avatar && user.name) user_avatar.textContent = [...user.name][0].toUpperCase();
        } catch (e) {
            console.error("Failed to parse user data", e);
        }
    } else {
        if (addSongBtn) addSongBtn.classList.remove('active');
    }

    // Fetch songs from API
    allSongs = await fetchAllSongs() || [];

    // Slice songs for various sections safely
    posterSongs = allSongs.slice(0, 5);
    topSongs = allSongs.slice(5, 15);
    trendingSongs = allSongs.slice(15, 25);
    expSongs = allSongs.slice(25, 35);

    renderSongs();

    if (localStorage.getItem('token')) {
        allPlaylistSongs = await fetchPlaylistSongs() || [];

        if (playlist && songs && !media_query_for_mobile.matches) {
            if (allPlaylistSongs.length > 0) {
                playlist.style.width = '25%';
                playlist.style.opacity = '1';
                songs.style.width = '75%';
                songs.style.opacity = '1';
                renderPlaylist();
            } else {
                playlist.style.width = '0%';
                playlist.style.opacity = '0';
                songs.style.width = '100%';
                songs.style.opacity = '1';
            }
        }
        setupPlaylistClickEvents();
    }

    console.log(allSongs, allPlaylistSongs);
});

/* ---------------- 3. Render Dashboard Songs (Fixed Loop Selectors) ---------------- */
function renderSongs() {
    if (posterSongs && posterSongs.length > 0) {
        let trending_songs = document.getElementById('trending_songs');
        if (trending_songs) {
            trending_songs.innerHTML = renderPosterSong(posterSongs[0], posterIndex);

            const leftBtn = document.getElementById("left");
            const rightBtn = document.getElementById("right");
            const posterPlay = document.getElementById("posterPlay");

            if (leftBtn) leftBtn.addEventListener("click", prev_pic);
            if (rightBtn) rightBtn.addEventListener("click", next_pic);
            if (posterPlay) {
                posterPlay.addEventListener("click", () => {
                    activate_song_popup(posterSongs[posterIndex]);
                });
            }
        }
    }

    const topSongsC = document.getElementById('topSongsC');
    const trendingSongsC = document.getElementById('trendingSongsC');
    const expSongsC = document.getElementById('expSongsC');

    if (topSongsC) {
        topSongsC.innerHTML = '';
        topSongs.forEach((song, i) => {
            const songItem = document.createElement('div');
            songItem.className = 'trending_song_box';
            songItem.innerHTML = renderTopSong(song, i);
            
            // FIX: Querying inside element instead of getElementById
            const songPlay = songItem.querySelector('.bi-play-circle-fill') || songItem.querySelector('i');
            if (songPlay) {
                songPlay.addEventListener("click", () => activate_song_popup(song));
            }
            topSongsC.appendChild(songItem);
        });
    }

    if (trendingSongsC) {
        trendingSongsC.innerHTML = '';
        trendingSongs.forEach(song => {
            const songItem = document.createElement('li');
            songItem.className = 'song_item';
            songItem.innerHTML = renderSong(song);

            const songPlay = songItem.querySelector('.bi-play-circle-fill') || songItem.querySelector('i');
            if (songPlay) {
                songPlay.addEventListener("click", () => activate_song_popup(song));
            }
            trendingSongsC.appendChild(songItem);
        });
    }

    if (expSongsC) {
        expSongsC.innerHTML = '';
        expSongs.forEach(song => {
            const songItem = document.createElement('li');
            songItem.className = 'song_item';
            songItem.innerHTML = renderSong(song);

            const songPlay = songItem.querySelector('.bi-play-circle-fill') || songItem.querySelector('i');
            if (songPlay) {
                songPlay.addEventListener("click", () => activate_song_popup(song));
            }
            expSongsC.appendChild(songItem);
        });
    }
}

function renderPlaylist(){
    const playlist_songs = document.getElementById('playlist_songs');
    if (playlist_songs) {
        playlist_songs.innerHTML = '';

        allPlaylistSongs?.forEach((song, i) =>{
            let playlistSongli = document.createElement('li');

            playlistSongli.innerHTML = renderPlaylistSong(song, i);

            playlist_songs.appendChild(playlistSongli);
        });
        
    }
}

function playerPage() {
    // FIX: JSON.stringify is required for objects/arrays in localStorage
    if (localStorage.getItem('token')) {
        localStorage.setItem('PlaylistSongList', JSON.stringify(allPlaylistSongs));
    }
    window.location.href = 'player.html';
}

const div2 = document.getElementById('div2');
if (div2) {
    div2.addEventListener('click', playerPage);
}

/* ---------------- 4. Poster Slider Logic ---------------- */
function updatePic() {
    if (!posterSongs || posterSongs.length === 0) return;
    
    let pic_tag = document.getElementById('poster_pic');
    let numbar = document.querySelector('.trending_song_item span');
    let pic = document.querySelector('.trending_song_item img');
    let name = document.querySelector('.trending_song_item h5 span');
    let artist = document.querySelector('.trending_song_item h5 .subtitel');

    setTimeout(() => {
        const currentPoster = posterSongs[posterIndex];
        if (pic_tag) pic_tag.src = currentPoster.image;
        if (numbar) numbar.innerHTML = `0${posterIndex + 1}`;
        if (pic) pic.src = currentPoster.image;
        if (name) name.innerText = currentPoster.title;
        if (artist) artist.innerHTML = currentPoster.artist;
    }, 300);
}

function next_pic() {
    if (!posterSongs.length) return;
    posterIndex = (posterIndex + 1) % posterSongs.length;
    updatePic();
}

function prev_pic() {
    if (!posterSongs.length) return;
    posterIndex = (posterIndex - 1 + posterSongs.length) % posterSongs.length;
    updatePic();
}

setInterval(next_pic, 60000);

/* ---------------- 5. Search Functionality ---------------- */
let search_results = document.querySelector("#search_system .search_results");
let search_input = document.getElementById("search_inp");

function renderSearchResults(songs) {
    if (!search_results) return;
    search_results.innerHTML = "";

    if (songs.length === 0) {
        search_results.innerHTML = `<div class="no-result">No Songs Found</div>`;
        search_results.style.display = "block";
        return;
    }
    console.log(search_results.innerHTML)

    songs.forEach(song => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src=${song.image} alt='${song.title}'>
            <div class="content">
                <h4>${song.title}</h4>
                <div class="subtitel">${song.artist}</div>
            </div>
            <i class="bi bi-play-circle-fill playListPlay"></i>
        `;

        card.querySelector("i").addEventListener("click", () => {
            activate_song_popup(song);
        });

        search_results.appendChild(card);
    });
    console.log(search_results.innerHTML);

    search_results.style.display = "flex";
}

function searchSongs(query) {
    query = query.trim().toLowerCase();
    if (!query) {
        if (search_results) {
            search_results.innerHTML = "";
            search_results.style.display = "none";
        }
        return;
    }
    console.log(query)

    const filteredSongs = allSongs?.filter(song => {
        const songTitle = (song?.title || '').toLowerCase();
        const songArtist = (song?.artist || "").toLowerCase();
        const songAlbum = (song?.album || "").toLowerCase();

        return (
            songTitle.includes(query) ||
            songArtist.includes(query) ||
            songAlbum.includes(query)
        );
    });
    console.log(filteredSongs)
    renderSearchResults(filteredSongs);
}

function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { fn(...args); }, delay);
    };
}

if (search_input) {
    const handleSearch = () => {
        searchSongs(search_input.value);
        console.log(search_input.value)
    }
    // search_input.addEventListener("input", handleSearch);
    search_input.addEventListener('keyup', handleSearch);
}

/* ---------------- 6. Audio Player Logic ---------------- */
function loadAndPlaySong(song) {
    if (!song) return;

    // FIX: Stringify object before saving
    localStorage.setItem('currentSong', JSON.stringify(song));
    
    const audioSrc = song.audio;
    const songTitle = song.title;

    gana.src = audioSrc;

    if (dowload_music) {
        dowload_music.setAttribute("download", `${song.artist}-${songTitle}.mp3`);
        dowload_music.href = audioSrc;
    }

    if (isPlaylist_song) {
        // makeAllBackground();
        makeAllPlays();

        // const listItems = document.querySelectorAll("#playlist_songs li");
        // if (listItems[playlist_indexing]) {
        //     listItems[playlist_indexing].style.background = "rgba(105, 105, 105, 0.1)";
        // }

        const playlist_play_icon = document.getElementById(`${playlist_indexing + 1}`);
        if (playlist_play_icon) {
            playlist_play_icon.classList.remove("bi-play-circle-fill");
            playlist_play_icon.classList.add("bi-pause-circle-fill");
        }
    }

    play_audio(song);
}

function play_audio(song) {
    if (wave && !wave.classList.contains("active")) {
        wave.classList.add("active");
    }
    if (play_icon) {
        play_icon.classList.remove("bi-play-circle");
        play_icon.classList.add("bi-pause-circle");
    }
    
    if (palyed_song_ka_pic) palyed_song_ka_pic.src = song.image;
    if (played_song_ka_naam_angreji) played_song_ka_naam_angreji.innerHTML = song.title + '-' + song.album;
    if (played_song_ke_artist_ka_naam) played_song_ke_artist_ka_naam.innerHTML = song.artist;

    updateMediaSession(song);
    
    gana.play();
}

function play_next_song() {
    if (isPlaylist_song) {
        loadAndPlaySong(allPlaylistSongs[playlist_indexing]);
    } else {
        loadAndPlaySong(allSongs[random_index]);
    }
}

/* ---------------- 7. Non-Playlist Next/Back Controls Fix ---------------- */
const call_play_next_song = () => {
    if (isPlaylist_song) {
        playlist_indexing = (playlist_indexing + 1) % allPlaylistSongs.length;
    } else {
        random_index = (random_index + 1) % allSongs.length;
    }
    play_next_song();
};

const play_previous_song = () => {
    if (isPlaylist_song) {
        playlist_indexing = (playlist_indexing - 1 + allPlaylistSongs.length) % allPlaylistSongs.length;
    } else {
        random_index = (random_index - 1 + allSongs.length) % allSongs.length;
    }
    play_next_song();
};

const next = document.getElementById('next');
if (next) {
    next.addEventListener('click', call_play_next_song);
}

const back = document.getElementById('back');
if (back) {
    back.addEventListener('click', play_previous_song);
}

/* ---------------- 8. Playlist UI Helpers ---------------- */
// const makeAllBackground = () => {
//     document.querySelectorAll("#playlist_songs li").forEach((el) => {
//         el.style.background = "rgb(49, 46, 46)";
//     });
// };

const makeAllPlays = () => {
    document.querySelectorAll(".playListPlay").forEach((el) => {
        el.classList.remove("bi-pause-circle-fill");
        el.classList.add("bi-play-circle-fill");
    });
};

function togglePlayPause() {
    if (gana.paused || gana.currentTime <= 0) {
        if (isPlaylist_song) {
            const icons = document.querySelectorAll("#playlist_songs li i");
            if (icons[playlist_indexing]) {
                icons[playlist_indexing].classList.remove("bi-play-circle-fill");
                icons[playlist_indexing].classList.add("bi-pause-circle-fill");
            }
        }
        if (wave) wave.classList.add("active");
        if (play_icon) {
            play_icon.classList.remove("bi-play-circle");
            play_icon.classList.add("bi-pause-circle");
        }
        gana.play();
    } else {
        if (play_icon) {
            play_icon.classList.remove("bi-pause-circle");
            play_icon.classList.add("bi-play-circle");
        }
        if (wave) wave.classList.remove("active");
        // makeAllBackground();
        makeAllPlays();
        gana.pause();
    }
}

if (play_icon) {
    play_icon.addEventListener("click", togglePlayPause);
}

/* ---------------- 9. Seek bar & Duration ---------------- */
const current_time = document.getElementById("current_time");
const current_end = document.getElementById("current_end");
const bar2 = document.getElementById("bar2");
const dot = document.querySelector(".bar .dot");

function formatTime(totalSeconds) {
    if (isNaN(totalSeconds)) return "0:00";
    const minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    if (seconds < 10) seconds = `0${seconds}`;
    return `${minutes}:${seconds}`;
}

gana.addEventListener("timeupdate", () => {
    if (current_end) current_end.innerText = formatTime(gana.duration);
    if (current_time) current_time.innerText = formatTime(gana.currentTime);

    if (progres_bar && gana.duration) {
        const progress = parseInt((gana.currentTime / gana.duration) * 100);
        progres_bar.value = progress;

        if (bar2) bar2.style.width = `${progress}%`;
        if (dot) dot.style.left = `${progress}%`;
    }
});

if (progres_bar) {
    progres_bar.addEventListener("change", () => {
        if (gana.duration) {
            gana.currentTime = (progres_bar.value * gana.duration) / 100;
        }
    });
}

/* ---------------- 10. Volume Controls ---------------- */
const vol_icon = document.getElementById("vol_icon");
const vol_input = document.getElementById("vol_input");
const vol_bar = document.getElementsByClassName("vol_bar")[0];
const vol_dot = document.getElementById("vol_dot");

if (vol_input) {
    vol_input.addEventListener("input", () => {
        const vol = vol_input.value;

        if (vol_icon) {
            vol_icon.classList.remove("bi-volume-up-fill", "bi-volume-down-fill", "bi-volume-mute-fill");
            if (vol == 0) {
                vol_icon.classList.add("bi-volume-mute-fill");
            } else if (vol <= 50) {
                vol_icon.classList.add("bi-volume-down-fill");
            } else {
                vol_icon.classList.add("bi-volume-up-fill");
            }
        }

        if (vol_bar) vol_bar.style.width = `${vol}%`;
        if (vol_dot) vol_dot.style.left = `${vol}%`;
        gana.volume = vol / 100;
    });
}

/* ---------------- 11. Modal / Popup Direct Play ---------------- */
function play_music(song) {
    play_system.classList.add('active');
    media_query_for_mobile.matches ? sub_main.style.height = '67%':sub_main.style.height = '75%';
    isPlaylist_song = false;
    if (closeBtn) closeBtn.click();
    // makeAllBackground();
    makeAllPlays();
    loadAndPlaySong(song);
}

const SongPopup = document.getElementById("SongPopup");
const popupBox = document.querySelector('.popup-box');
const closeBtn = document.getElementById("closeBtn");
const popuppic = document.querySelector(".popup-box img");
const naam = document.querySelector(".popup-box #popup_details marquee");
const playButton = document.querySelector(".popup-box #popup_details button");

let playButtonHandler = null;

function activate_song_popup(song) {
    if (!song) return;
    search_results.style.display = "none";
    if (popuppic) popuppic.src = song.image || song.image_url;
    if (naam) naam.innerHTML = `${song.artist || ''} - ${song.title || song.name || ''} - ${song.album}`;

    if (playButton) {
        if (playButtonHandler) {
            playButton.removeEventListener('click', playButtonHandler);
        }
        playButtonHandler = () => play_music(song);
        playButton.addEventListener('click', playButtonHandler);
    }
    
    if (SongPopup) SongPopup.style.display = "flex";
    popupBox.style.width = '70vw';
    popupBox.style.height = '60vh';
}

if (closeBtn) {
    closeBtn.onclick = () => {
        if (SongPopup) SongPopup.style.display = "none";
        popupBox.style.width = '0';
        popupBox.style.height = '0';
    };
}

window.onclick = (e) => {
    if (e.target === SongPopup) {
        SongPopup.style.display = "none";
        popupBox.style.width = '0';
        popupBox.style.height = '0';
    }
};

/* ---------------- 12. Playlist Click Handler ---------------- */
function setupPlaylistClickEvents() {
    document.querySelectorAll("#playlist_songs li .playListPlay").forEach((iconEl) => {
        iconEl.addEventListener("click", (el) => {
            play_system.classList.add('active');
            media_query_for_mobile.matches? sub_main.style.height = '67%': sub_main.style.height = '75%';
            const clickedIndex = Number(el.target.id); 
            playlist_indexing = clickedIndex;
            isPlaylist_song = true;

            if (el.target.classList.contains("bi-pause-circle-fill")) {
                togglePlayPause();
            } else {
                makeAllPlays();
                // makeAllBackground();
                
                // const listItems = document.querySelectorAll("#playlist_songs li");
                // if (listItems[clickedIndex]) {
                //     listItems[clickedIndex].style.background = "rgba(58, 58, 91, 0.5)";
                // }
                
                el.target.classList.remove("bi-play-circle-fill");
                el.target.classList.add("bi-pause-circle-fill");

                loadAndPlaySong(allPlaylistSongs[clickedIndex]);
            }
        });
    });
}

/* ---------------- 13. Shuffle & Auto-play Next Logic ---------------- */
const shuffle = document.getElementsByClassName("shuffle")[0];

const SHUFFLE_MODES = {
    next:   { nextLabel: "repeat", addClass: "bi-repeat-1", removeClasses: ["bi-music-note-beamed", "bi-shuffle"] },
    repeat: { nextLabel: "random", addClass: "bi-shuffle", removeClasses: ["bi-music-note-beamed", "bi-repeat-1"] },
    random: { nextLabel: "next", addClass: "bi-music-note-beamed", removeClasses: ["bi-repeat-1", "bi-shuffle"] }
};

if (shuffle) {
    shuffle.addEventListener("click", () => {
        const currentMode = shuffle.innerHTML.trim();
        const modeConfig = SHUFFLE_MODES[currentMode];

        if (modeConfig) {
            shuffle.classList.add(modeConfig.addClass);
            shuffle.classList.remove(...modeConfig.removeClasses);
            shuffle.innerHTML = modeConfig.nextLabel;
        }
    });
}

function next_musiq() {
    call_play_next_song();
}

function repeat_musiq() {
    play_next_song();
}

function random_musiq() {
    if (isPlaylist_song) {
        playlist_indexing = Math.floor(Math.random() * allPlaylistSongs.length);
    } else {
        random_index = Math.floor(Math.random() * allSongs.length);
    }
    play_next_song();
}

gana.addEventListener("ended", () => {
    const mode = shuffle ? shuffle.innerHTML.trim() : "next";
    if (mode === "repeat") repeat_musiq();
    else if (mode === "random") random_musiq();
    else next_musiq();
});

loginBtn.addEventListener('click', ()=>{
    if ((!isDeleteMode || loginBtn.innerText.trim().toLowerCase().includes(('Logout').trim().toLowerCase())) && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('PlaylistSongList');
    }
});

const deletion_popup = document.getElementById('deletion_popup');
const deletion_popupC = document.getElementById('deletion_popupC');
const PassConfirmInp = document.getElementById('PassConfirmInp');
const checkPass = document.getElementById('checkPass');
const deletionCloseBtn = document.getElementById('deletionCloseBtn');

async function handleDeleteAccount() {
    if (localStorage.getItem('token')) {
        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);

        const responce = await deleteMusikAccount(user.id);

        if (responce.success) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('PlaylistSongList');
            window.alert('Account deleted Sucessfully');
            window.location.href = 'index.html';
        }
        else{
            window.alert(`Account deletion Failed! ${responce.message}`);
        }
    }
    else{
        window.alert('Login First')
    }
}
// async function isDeletionConfirm(){
//     if (localStorage.getItem('token')) {
//         const PassConfirmInpValue = PassConfirmInp.value;
//         const responce = await verifyPasswoard(PassConfirmInpValue);

//         if (responce.success) {
//             checkPass.innerText = 'Delete Account';
//             window.alert('Passwoard Confirmed!');
//             await handleDeleteAccount();
//         }
//         else{
//             checkPass.innerText = 'Delete Account';
//             window.alert(responce.message);
//             deletionCloseBtn.click();
//         } 
//     }
// }
// checkPass?.addEventListener('click', ()=>{
//     deletion_popup.style.display = 'none';
//     deletion_popupC.style.width = '0';
//     deletion_popupC.style.height = '0';
// });

async function isDeletionConfirm() {
    if (!localStorage.getItem('token')) {
        window.alert('Login First');
        return;
    }

    const enteredPass = PassConfirmInp.value.trim();

    if (!enteredPass) {
        window.alert('Enter your password');
        return;
    }

    checkPass.innerText = 'Loading...';
    checkPass.disabled = true;

    try {
        const response = await verifyPasswoard(enteredPass);

        if (response.success) {
            window.alert('Password Confirmed!');

            await handleDeleteAccount();
        } else {
            window.alert(response.message);

            deletion_popup.style.display = 'none';
            deletion_popupC.style.width = '0';
            deletion_popupC.style.height = '0';
        }

    } catch (error) {
        console.error('Password verification error:', error);
        window.alert('Something went wrong while verifying your password.');
    } finally {
        checkPass.innerText = 'Delete Account';
        checkPass.disabled = false;
    }
}

checkPass?.addEventListener('click', async () => {
    await isDeletionConfirm();
    checkPass.innerText = 'Loading...'; 
});

deletionCloseBtn?.addEventListener('click', ()=>{
    deletion_popup.style.display = 'none';
    deletion_popupC.style.width = '0';
    deletion_popupC.style.height = '0';
    PassConfirmInp.value = '';
});

signinBtn.addEventListener('click', (e) => {
    if (
        (isDeleteMode ||
        signinBtn.innerText.trim().toLowerCase().includes("delete account".toLowerCase()))
        && localStorage.getItem('token')
    ) {
        e.preventDefault();

        deletion_popup.style.display = 'flex';
        deletion_popupC.style.width = '70vw';
        deletion_popupC.style.height = '60vh';
    }
});

// signinBtn.addEventListener('click', (e)=>{
//     if ((isDeleteMode || signinBtn.innerText.trim().toLowerCase().includes(('Delete Account').trim().toLowerCase())) && localStorage.getItem('token')) {
//         e.preventDefault();
//         deletion_popup.style.display = 'flex';
//         deletion_popupC.style.width = '70vw';
//         deletion_popupC.style.height = '60vh';
//         checkPass?.addEventListener('click', async()=>{
//             await isDeletionConfirm();
//             checkPass.innerText = 'Loading...';   
//         });    
//     }
// });

if (closePlayerBtn) {
    closePlayerBtn.addEventListener('click', ()=>{
        play_system.classList.remove('active');
        media_query_for_mobile.matches? sub_main.style.height = '80%': sub_main.style.height = '88%';
        gana.pause();
        // makeAllBackground();
        makeAllPlays();
    });
}
gana.addEventListener("play", () => {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
    }
});

gana.addEventListener("pause", () => {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
    }
});

let options = document.getElementById("options");

function display_nav_bar(){
    if (media_query_for_mobile.matches && options){
        // const options = document.getElementById("options");
        // options.style.right = "0px";
        options.style.opacity = "1";
        
    }
}
function close_nav_bar(){
    if (media_query_for_mobile.matches && options){
        // const options = document.getElementById("options");
        // options.style.right = "-200px";
        options.style.opacity = "0";
    }
}
document.getElementById('close')?.addEventListener('click', close_nav_bar);
document.getElementById('mobile_list_icon')?.addEventListener('click', display_nav_bar);
// Handle hash change and screen size
// function handleHashChange() {
//   const isMobile = media_query_for_mobile.matches;
//   const hash = location.hash;

//   if (isMobile) {
//     switch (hash) {
//       case "#playlist":
//         showSection({ playList: true });
//         break;
//       case "#search":
//         showSection({ search: true });
//         break;
//       default:
//         showSection({ home: true });
//         break;
//     }
//   } else {
//     // Desktop view: show all except search
//     showSection({ desktop: true });
//   }
// }
// const playlist = document.getElementById("playlist");
// const songs = document.getElementById("songs");

// Handle hash change and screen size
function handleHashChange() {
  const isMobile = media_query_for_mobile.matches;
  const hash = location.hash;

  if (isMobile) {
    switch (hash) {
      case "#playlist":
        showSection({ playList: true });
        break;
      default:
        showSection({ home: true });
        break;
    }
  } else {
    // Desktop view: show all except search
    showSection({ desktop: true });
  }
}

// Show/hide sections based on flags
function showSection({ playList = false, search = false, home = false, desktop = false }) {
    if(songs){
        songs.style.width = (home || desktop) ? "100%" : "0%";
        songs.style.opacity = (home || desktop) ? "1" : "0";
    }
    if(playlist){
        playlist.style.width = (playList) ? "100%" : "0%";
        playlist.style.opacity = (playList) ? "1" : "0";
    }
  if (playList) {
    renderPlaylist();
  }
}
// Navigation functions
function display_playlist_page() {
  if (media_query_for_mobile.matches) window.location.hash = "#playlist";
}
function display_home_page() {
  if (media_query_for_mobile.matches) location.hash = "";
}

document.getElementById('ur_library')?.addEventListener('click', display_playlist_page);
document.getElementById('home')?.addEventListener('click', display_home_page);
// Event listeners
window.addEventListener("load", handleHashChange);
window.addEventListener("hashchange", handleHashChange);
media_query_for_mobile.addEventListener("change", handleHashChange)
