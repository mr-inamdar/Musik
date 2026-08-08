// import function
import { fetchAllSongs, fetchPlaylistSongs } from "../frontend/JS/api.js";
import { renderPosterSong, renderSong, renderTopSong } from "../frontend/JS/renderFunctions.js";

/* ---------------- 1. DOM Elements & Global Variables ---------------- */
const playlist = document.getElementById('playlist');
const songs = document.getElementById("songs");
const user_avatar = document.getElementById('user_avatar');
const user_name = document.getElementById('user_name');
const addSongBtn = document.getElementById('addSongBtn');

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

const gana = new Audio();
const wave = document.getElementsByClassName("wave")[0];
const play_icon = document.getElementById("master_play_icon");
const palyed_song_ka_pic = document.getElementById("poster_master_play");
const played_song_ka_naam_angreji = document.querySelector("#title marquee #angreji");
const played_song_ke_artist_ka_naam = document.querySelector("#title .subtitle");
const dowload_music = document.getElementById("dowload_music");
const progres_bar = document.getElementById("seek");

/* ---------------- 2. Initial DOM Load ---------------- */
document.addEventListener('DOMContentLoaded', async () => {
    const userData = localStorage.getItem("user");

    if (userData) {
        try {
            const user = JSON.parse(userData);
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

        if (playlist && songs) {
            if (allPlaylistSongs.length > 0) {
                playlist.style.width = '25%';
                songs.style.width = '75%';
            } else {
                playlist.style.width = '0%';
                songs.style.width = '100%';
            }
        }
        setupPlaylistClickEvents();
    }
});

/* ---------------- 3. Render Dashboard Songs ---------------- */
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
            topSongsC.appendChild(songItem);

            const songPlay = document.getElementById('songPlay');

            if(songPlay){
                songPlay.addEventListener("click", () => {
                    activate_song_popup(song);
                });
            }
        });
    }

    if (trendingSongsC) {
        trendingSongsC.innerHTML = '';
        trendingSongs.forEach(song => {
            const songItem = document.createElement('li');
            songItem.className = 'song_item';
            songItem.innerHTML = renderSong(song);
            trendingSongsC.appendChild(songItem);

            const songPlay = document.getElementById('songPlay');

            if(songPlay){
                songPlay.addEventListener("click", () => {
                    activate_song_popup(song);
                });
            }
        });
    }

    if (expSongsC) {
        expSongsC.innerHTML = '';
        expSongs.forEach(song => {
            const songItem = document.createElement('li');
            songItem.className = 'song_item';
            songItem.innerHTML = renderSong(song);
            expSongsC.appendChild(songItem);

            const songPlay = document.getElementById('songPlay');

            if(songPlay){
                songPlay.addEventListener("click", () => {
                    activate_song_popup(song);
                });
            }
        });
    }
}

function playerPage() {
    // if(isPlaylist_song){
    //     localStorage.setItem('currentSongIdx', playlist_indexing);
    //     localStorage.setItem('songList', allPlaylistSongs);
    // }else{
    //     localStorage.setItem('currentSongIdx', random_index);
    //     localStorage.setItem('songList', allSongs);
    // }
    localStorage.setItem('PlsylistSongList', allPlaylistSongs);
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
    let name = document.querySelector('.trending_song_item h5');

    setTimeout(() => {
        const currentPoster = posterSongs[posterIndex];
        if (pic_tag) pic_tag.src = currentPoster.image || currentPoster.image_url;
        if (numbar) numbar.innerHTML = `0${posterIndex + 1}`;
        if (pic) pic.src = currentPoster.image || currentPoster.image_url;
        if (name) name.innerHTML = currentPoster.title || currentPoster.name;
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
let search_input = document.querySelector("#search_system input");

function renderSearchResults(songs) {
    if (!search_results) return;
    search_results.innerHTML = "";

    if (songs.length === 0) {
        search_results.innerHTML = `<div class="no-result">No Songs Found</div>`;
        search_results.style.display = "block";
        return;
    }

    songs.forEach(song => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${song.image_url || song.image}" alt="">
            <div class="content">
                <h4>${song.title || song.name}</h4>
                <div class="subtitel">${song.artist}</div>
            </div>
            <i class="bi bi-play-circle-fill playListPlay"></i>
        `;

        card.querySelector("i").addEventListener("click", () => {
            activate_song_popup(song);
        });

        search_results.appendChild(card);
    });

    search_results.style.display = "block";
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

    const filteredSongs = allSongs.filter(song => {
        const songTitle = (song.title || song.name || "").toLowerCase();
        const songArtist = (song.artist || "").toLowerCase();
        const songAlbum = (song.album || "").toLowerCase();

        return (
            songTitle.includes(query) ||
            songArtist.includes(query) ||
            songAlbum.includes(query)
        );
    });

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
    const handleSearch = debounce(() => {
        searchSongs(search_input.value);
    }, 250);
    search_input.addEventListener("input", handleSearch);
}

/* ---------------- 6. Audio Player Logic ---------------- */
function loadAndPlaySong(song) {
    if (!song) return;

    localStorage.setItem('currentSong', song);
    
    const audioSrc = song.audio || song.audio_url;
    const songTitle = song.title || song.name;
    const songImg = song.image || song.image_url;

    gana.src = audioSrc;

    if (dowload_music) {
        dowload_music.setAttribute("download", `${song.artist}-${songTitle}.mp3`);
        dowload_music.href = audioSrc;
    }

    if (isPlaylist_song) {
        makeAllBackground();
        makeAllPlays();

        const listItems = document.querySelectorAll("#playlist_songs li");
        if (listItems[playlist_indexing]) {
            listItems[playlist_indexing].style.background = "rgba(105, 105, 105, 0.1)";
        }

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
    
    if (palyed_song_ka_pic) palyed_song_ka_pic.src = song.image || song.image_url;
    if (played_song_ka_naam_angreji) played_song_ka_naam_angreji.innerHTML = song.title || song.name;
    if (played_song_ke_artist_ka_naam) played_song_ke_artist_ka_naam.innerHTML = song.artist;
    
    gana.play();
}

function play_next_song() {
    if (isPlaylist_song) {
        loadAndPlaySong(allPlaylistSongs[playlist_indexing]);
    } else {
        loadAndPlaySong(allSongs[random_index]);
    }
}

const next = document.getElementById('next');

if (next) {
    next.addEventListener('click', play_next_song)
}

const back = document.getElementById('back');

if (back) {
    back.addEventListener('click', play_previous_song)
}

/* ---------------- 7. Playlist UI Helpers ---------------- */
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
        makeAllBackground();
        makeAllPlays();
        gana.pause();
    }
}

if (play_icon) {
    play_icon.addEventListener("click", togglePlayPause);
}

/* ---------------- 8. Non-Playlist Controls ---------------- */
const call_play_next_song = () => {
    random_index++;
    if (random_index >= allSongs.length) random_index = 0;
    play_next_song();
};

const play_previous_song = () => {
    random_index--;
    if (random_index < 0) random_index = allSongs.length - 1;
    play_next_song();
};

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
    isPlaylist_song = false;
    if (closeBtn) closeBtn.click();
    makeAllBackground();
    makeAllPlays();
    loadAndPlaySong(song);
}

const SongPopup = document.getElementById("SongPopup");
const closeBtn = document.getElementById("closeBtn");
const popuppic = document.querySelector(".popup-box img");
const naam = document.querySelector(".popup-box #popup_details marquee");
const playButton = document.querySelector(".popup-box #popup_details button");

let playButtonHandler = null;

function activate_song_popup(song) {
    if (!song) return;
    if (popuppic) popuppic.src = song.image || song.image_url;
    if (naam) naam.innerHTML = `${song.artist || ''} - ${song.title || song.name || ''}`;

    
    
    if (playButton) {
        // Purana listener remove karo takia multiple event fire na ho
        if (playButtonHandler) {
            playButton.removeEventListener('click', playButtonHandler);
        }
        playButtonHandler = () => play_music(song);
        playButton.addEventListener('click', playButtonHandler);
    }
    
    if (SongPopup) SongPopup.style.display = "flex";
};

if (closeBtn) {
    closeBtn.onclick = () => {
        if (SongPopup) SongPopup.style.display = "none";
    };
}

window.onclick = (e) => {
    if (e.target === SongPopup) {
        SongPopup.style.display = "none";
    }
};

/* ---------------- 12. Playlist Click Handler Fix ---------------- */
function setupPlaylistClickEvents() {
    document.querySelectorAll("#playlist_songs li .playListPlay").forEach((iconEl) => {
        iconEl.addEventListener("click", (el) => {
            const clickedIndex = Number(el.target.id) - 1; 
            playlist_indexing = clickedIndex;
            isPlaylist_song = true;

            if (el.target.classList.contains("bi-pause-circle-fill")) {
                togglePlayPause();
            } else {
                makeAllPlays();
                makeAllBackground();
                
                const listItems = document.querySelectorAll("#playlist_songs li");
                if (listItems[clickedIndex]) {
                    listItems[clickedIndex].style.background = "rgba(58, 58, 91, 0.5)";
                }
                
                el.target.classList.remove("bi-play-circle-fill");
                el.target.classList.add("bi-pause-circle-fill");

                loadAndPlaySong(allPlaylistSongs[clickedIndex]);
            }
        });
    });
}

/* ---------------- 13. Shuffle Modes Logic ---------------- */
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
    if (isPlaylist_song) {
        playlist_indexing = playlist_indexing >= allPlaylistSongs.length - 1 ? 0 : playlist_indexing + 1;
    } else {
        random_index = random_index >= allSongs.length - 1 ? 0 : random_index + 1;
    }
    play_next_song();
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