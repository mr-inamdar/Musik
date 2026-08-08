/* ============================================================
   MUSIC PLAYER SCRIPT — Optimized & Beginner-Friendly Version
   ============================================================
   Is file mein maine ye changes kiye hain:
   1. Repeated code (jo 4 alag jagah copy-paste tha) ko ek hi
      helper function "loadAndPlaySong()" mein daal diya hai.
   2. Har section ke upar comment likha hai ki wo kya karta hai.
   3. Variable/function names same rakhe hain (Hinglish style),
      taaki tumhara baaki HTML/logic bina change kiye chal jaaye.
   4. Kuch chhote bugs bhi fix kiye hain (jaise index galti se
      +1/-1 hona) — neeche "FIXES" comment mein likha hai.
   ============================================================ */


/* ---------------- 1. Basic Variables & DOM Elements ---------------- */

let isPlaylist_song = true;   // true = playlist se gaana baj raha hai, false = "all songs" se
let random_index = 0;

const gana = new Audio("songs/d1.mp3");           // audio player object
const wave = document.getElementsByClassName("wave")[0];
const play_icon = document.getElementById("master_play_icon");
const palyed_song_ka_pic = document.getElementById("poster_master_play");

const played_song_ka_naam_angreji = document.querySelector("#title marquee #angreji");
const played_song_ka_naam_hindi   = document.querySelector("#title marquee #hindi");
const played_song_ka_naam_urdu    = document.querySelector("#title marquee #urdu");
const played_song_ke_artist_ka_naam = document.querySelector("#title .subtitle");

const dowload_music = document.getElementById("dowload_music");
const progres_bar = document.getElementById("seek");


/* ---------------- 2. Playlist Data ---------------- */

const playlist_song = [
    { en: "Choote Na Kabhi Tera Daaman", hi: "तुम्हारा दामन कभी न छूटे", ur: "چھوٹے نہ کبھی تیرا دامن", pic: "pics/kgn.webp", artist: "Milad Raza Qadri", song: "songs/kgn.mp3" },
    { en: "Jogi-Shaadi Mein Zaroor Aana", hi: "जोगी-शादी में जरूर आना", ur: "جوگی-شادی میں ضرور آنا", pic: "pics/2.jpg", artist: "Yasser Desai & Aakanksha Sharma", song: "songs/2.mp3" },
    { en: "Nashe Si Chadh Gayi (From 'Befikre')", hi: "नशे सी छा गई (फिल्म 'बे फिक्र' से)", ur: "نشے سی چھا گئی (فلم 'بے فکر' سے)", pic: "pics/3.jpg", artist: "Vishal and Sheykhar & Arijit Sing", song: "songs/b2.mp3" },
    { en: "Dhadak Title Track-Dhadak", hi: "धड़क शीर्षक गीत - धड़क", ur: "دھڑک ٹائٹل ٹریک-دھڑک", pic: "pics/d.jpg", artist: "Ajay Gogavale & Shreya Ghoshal", song: "songs/d1.mp3" },
    { en: "Jug Jug Jeeve-Shiddat", hi: "जुग जुग जिए - शिद्दत", ur: "جگ جگ جیو - شدت", pic: "pics/25.jpg", artist: "Sachet Tandon", song: "songs/25.mp3" },
    { en: "Tu Hai", hi: "तू है", ur: "تو ہے", pic: "pics/38.jpg", artist: "Darshan Raval, Prakriti Giri", song: "songs/38.mp3" },
    { en: "Raanjhanaa-Raanjhanaa", hi: "रांझणा-रांझणा", ur: "رانجھنا-رانجھنا", pic: "pics/7.jpg", artist: "Jaswinder Singh & Shiraz Uppal", song: "songs/7.mp3" },
    { en: "Samjhawan-The Bride Of Humpty Sharma", hi: "समझावन - हम्प्टी शर्मा की दुल्हन", ur: "سمجھاون-دی برائیڈ آف ہمپٹی شرما", pic: "pics/8.jpg", artist: "Dharma Productions", song: "songs/hs2.mp3" },
    { en: "Vaara Re-Dhadak", hi: "वारा रे-धड़क", ur: "وارا ری - دھڑک", pic: "pics/d.jpg", artist: "Ajay Gogavale", song: "songs/d2.mp3" },
    { en: "Jalebi Title Track - Jalebi", hi: "जलेबी टाइटल ट्रैक - जलेबी", ur: "جلیبی ٹائٹل ٹریک - جلیبی", pic: "pics/14.jpg", artist: "KK, Tanishk Bagchi", song: "songs/j3.mp3" }
];

let playlist_indexing = 3;   // abhi kaunsa gaana selected hai (playlist_song array ka index)


/* ==========================================================
   3. CORE HELPER — sabse important optimization
   ==========================================================
   Pehle ye same 20-25 lines ka code 4 alag functions
   (play_next_song, next_musiq, repeat_musiq, random_musiq)
   mein copy-paste tha. Ab sirf ek function hai jo:
   - audio source set karta hai
   - download button update karta hai
   - list mein highlight + play/pause icon update karta hai
   - naya gaana play karta hai
   Baaki functions bas isko call karte hain. Isse code chhota,
   readable, aur bug-fix karne mein aasan ho gaya hai.
   ========================================================== */

function loadAndPlaySong(song) {
    // 1) audio source set karo
    gana.src = song.song;

    // 2) download button update karo
    dowload_music.setAttribute("download", `${song.artist}-${song.en}`);
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
    play_audio(song.pic, song.en, song.hi, song.ur, song.artist);
}


/* ---------------- 4. Play / Pause Core Function ---------------- */

function play_audio(song_ki_pic, song_ka_naam_angreji, song_ka_naam_hindi, song_ka_naam_urdu, artist_ka_naam) {
    if (!wave.classList.contains("active")) {
        play_icon.classList.remove("bi-play-circle");
        play_icon.classList.add("bi-pause-circle");
        wave.classList.add("active");
    }
    palyed_song_ka_pic.src = song_ki_pic;
    played_song_ka_naam_angreji.innerHTML = song_ka_naam_angreji;
    played_song_ka_naam_hindi.innerHTML = song_ka_naam_hindi;
    played_song_ka_naam_urdu.innerHTML = song_ka_naam_urdu;
    played_song_ke_artist_ka_naam.innerHTML = artist_ka_naam;
    gana.play();
}

// "Next" button ya current gaana khatam hone par agla gaana chalane ke liye
function play_next_song() {
    if (isPlaylist_song) {
        loadAndPlaySong(playlist_song[playlist_indexing]);
    } else {
        loadAndPlaySong(all_songs[random_index]);
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
    if (random_index >= all_songs.length) {
        random_index = 0;
    }
    random_index++;
    play_next_song();
};

const play_previous_song = () => {
    if (random_index <= 0) {
        random_index = all_songs.length - 1;
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

function play_music(song_src, song_ki_pic, song_ka_naam_angreji, song_ka_naam_hindi, song_ka_naam_urdu, artist_ka_naam) {
    isPlaylist_song = false;
    closeBtn.click();

    gana.src = song_src;
    dowload_music.setAttribute("download", `${artist_ka_naam}-${song_ka_naam_angreji}`);
    dowload_music.href = song_src;

    makeAllBackground();
    makeAllPlays();
    play_audio(song_ki_pic, song_ka_naam_angreji, song_ka_naam_hindi, song_ka_naam_urdu, artist_ka_naam);
}


/* ---------------- 11. Song Info Popup ---------------- */

const SongPopup = document.getElementById("SongPopup");
const closeBtn = document.getElementById("closeBtn");
const popuppic = document.querySelector(".popup-box img");
const naam = document.querySelector(".popup-box #popup_details marquee");
const playButton = document.querySelector(".popup-box #popup_details button");

const activate_song_popup = (img_src, song_ka_naam_angreji, song_ka_naam_hindi, song_ka_naam_urdu, song_src, artist_ka_naam) => {
    popuppic.src = img_src;
    naam.innerHTML = `${artist_ka_naam}-${song_ka_naam_angreji}`;
    playButton.setAttribute(
        "onclick",
        `play_music("${song_src}", "${img_src}", "${song_ka_naam_angreji}", "${song_ka_naam_hindi}", "${song_ka_naam_urdu}", "${artist_ka_naam}")`
    );
    SongPopup.style.display = "flex";
};

closeBtn.onclick = () => {
    SongPopup.style.display = "none";
};

window.onclick = (e) => {
    if (e.target === SongPopup) {
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
