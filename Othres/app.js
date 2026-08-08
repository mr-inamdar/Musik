// import function
//import { fetchAllSongs, uploadSong } from "./JS/api.js";
// render components
let topSongsC = document.getElementById('topSongsC');
let trendingSongsC = document.getElementById('trendingSongsC');
let expSongsC = document.getElementById('expSongsC');
export function renderSongs(){
    if (posterSongs) {
        const songItemContainer = document.createElement('div');
        songItemContainer.id = 'trending_songs';
        songItemContainer.innerHTML = `
            <button id="left" class="normal" onclick="prev_pic()">&#10094;</button>
            <button id="right" class="normal" onclick="next_pic()">&#10095;</button>
            <img src=${posterSongs[0].image} alt=${posterSongs[0].image} id="poster_pic">
            <li class="trending_song_item">
                <span>${i+1}</span>
                <img src=${posterSongs[0].image} alt=${posterSongs[0].image}>
                <h5>
                    ${posterSongs[0].title}
                    <div class="subtitel">${posterSongs[0].artist}</div>
                </h5>
                <i class="bi playListPlay bi-play-circle-fill" onclick="activate_song_popup(${posterSongs[0]})"></i>
            </li>
        `;
    }

    topSongs.map((song, i) =>{
        const songItem = document.createElement('div');
        songItem.className = 'trending_song_box';
        songItem.innerHTML = `
            <h1 class="sr_numbar">${i+1}</h1>
            <li class="song_item">
                <div class="img_play">
                    <img src=${song.image} alt=${song.title}>
                    <i class="bi playListPlay bi-play-circle-fill"  onclick="activate_song_popup(${song.song_id})"></i>
                </div>
                <h5>
                    ${song.title} - ${song.album}
                    <div class="subtitle">${song.artist}</div>
                </h5>
            </li>
        `
        topSongsC.appendChild(songItem);
    });

    trendingSongs.map(song =>{
        const songItem = document.createElement('li');
        songItem.className = 'song_item';
        songItem.innerHTML = `
            <div class="img_play">
                <img src=${song.image} alt=${song.title}>
                <i class="bi playListPlay bi-play-circle-fill"  onclick="activate_song_popup(${song.song_id})"></i>
            </div>
            <h5>
                ${song.title} - ${song.album}
                <div class="subtitle">${song.artist}</div>
            </h5>
        `
        trendingSongsC.appendChild(songItem);
    })

    expSongs.map(song =>{
        const songItem = document.createElement('li');
        songItem.className = 'song_item';
        songItem.innerHTML = `
            <div class="img_play">
                <img src=${song.image} alt=${song.title}>
                <i class="bi playListPlay bi-play-circle-fill"  onclick="activate_song_popup(${song.song_id})"></i>
            </div>
            <h5>
                ${song.title} - ${song.album}
                <div class="subtitle">${song.artist}</div>
            </h5>
        `
        expSongsC.appendChild(songItem);
    })
}

// Backend Var
let allSongs = [];
let posterSongs =[];
let topSongs=[];
let trendingSongs =[];
let expSongs =[];




// export async function likeSong(songId){

//     const response = await fetch(`${url}/songs/like/${songId}`,{
//         method:"POST",
//         headers:{
//             Authorization:`Bearer ${localStorage.getItem("token")}`
//         }
//     });
//     if (response.ok) {
//        await fetchAllSongs();   
//     }
// }





const user_avatar = document.getElementById('user_avatar');
const user_name = document.getElementById('user_name');
const addSongBtn = document.getElementById('addSongBtn');


document.addEventListener('DOMContentLoaded', ()=>{

    const userData = localStorage.getItem("user");

    if(userData){

        const user = JSON.parse(userData);


        // if (localStorage.getItem('token')) {
        //     addSongBtn.classList.add('active');
        // }else{
        //     addSongBtn.classList.remove('active');
        // }
        addSongBtn.classList.add('active');

        console.log(user)

        user_name.innerHTML =  user.name;

        user_avatar.textContent = [...user.name][0].toUpperCase();

    }
    else{
        addSongBtn.classList.remove('active');
    }

    allSongs = fetchAllSongs();

     // Top 10 Songs
    posterSongs = allSongs.slice(0, 5);

    // Next 10 Songs
    topSongs = allSongs.slice(10, 20);

    // Next 10 Songs
    trendingSongs = allSongs.slice(20, 30);

    expSongs = allSongs.slice(30, 40);

    renderSongs();
});




let index = 0;
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



// render song
let isPlaylist_song = true;
let random_index = 0;

let gana = new Audio("songs/d1.mp3");
let wave = document.getElementsByClassName("wave")[0];
let play_icon = document.getElementById("master_play_icon");
let palyed_song_ka_pic = document.getElementById("poster_master_play");
let played_song_ka_naam_angreji = document.querySelector("#title marquee #angreji");
let played_song_ka_naam_hindi = document.querySelector("#title marquee #hindi");
let played_song_ka_naam_urdu = document.querySelector("#title marquee #urdu");
let played_song_ke_artist_ka_naam = document.querySelector("#title .subtitle");
let dowload_music = document.getElementById("dowload_music");
let progres_bar = document.getElementById("seek");

function play_audio(song_ki_pic, song_ka_naam_angreji, song_ka_naam_hindi,song_ka_naam_urdu, artist_ka_naam) {
    if (!wave.classList.contains('active')) {
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
function play_next_song() {
    if (isPlaylist_song) {
        gana.src =  playlist_song[playlist_indexing].song;
        dowload_music.setAttribute(`download`, `${playlist_song[playlist_indexing].artist}-${playlist_song[playlist_indexing].en}`);
        dowload_music.href = playlist_song[playlist_indexing].song;
        makeAllBackground();
        Array.from(document.querySelectorAll("#playlist_songs li"))[playlist_indexing].style.background ='rgb(105, 105, 105, 0.1)';
        makeAllPlays();
        playlist_play_icon = document.getElementById(`${playlist_indexing+1}`);
        playlist_play_icon.classList.remove("bi-play-circle-fill");
        playlist_play_icon.classList.add("bi-pause-circle-fill");
        play_audio(playlist_song[playlist_indexing].pic, playlist_song[playlist_indexing].en, playlist_song[playlist_indexing].hi, playlist_song[playlist_indexing].ur, playlist_song[playlist_indexing].artist);
    } else{
        gana.src =  all_songs[random_index].song;
        dowload_music.setAttribute(`download`, `${all_songs[random_index].artist}-${all_songs[random_index].en}`);
        dowload_music.href = all_songs[random_index].song;
        play_audio(all_songs[random_index].pic, all_songs[random_index].en, all_songs[random_index].hi, all_songs[random_index].ur, all_songs[random_index].artist);
    }
}
const makeAllBackground = ()=>{
    Array.from(document.querySelectorAll("#playlist_songs li")).forEach((el)=>{
        el.style.background ='rgb(49, 46, 46)';
    })
}
const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName("playListPlay")).forEach((el)=>{
        el.classList.remove("bi-pause-circle-fill");
        el.classList.add("bi-play-circle-fill");
    })
}
// let canExicute = false;
function togglePlayPause() {
        if (play_icon.classList.contains("bi-play-circle")) {
            if (isPlaylist_song) {
                Array.from(document.querySelectorAll("#playlist_songs li i"))[playlist_indexing].classList.remove("bi-play-circle-fill");
                Array.from(document.querySelectorAll("#playlist_songs li i"))[playlist_indexing].classList.add("bi-pause-circle-fill");
            }
            wave.classList.add("active");
            play_icon.classList.remove("bi-play-circle");
            play_icon.classList.add("bi-pause-circle");
            gana.play();
        } else {
            play_icon.classList.remove("bi-pause-circle");
            play_icon.classList.add("bi-play-circle");
            wave.classList.remove("active");
            makeAllBackground();
            makeAllPlays();
            gana.pause();
        }  
}
const call_play_next_song = () => {
    if (random_index >= all_songs.length) {
        random_index = 0;
    }
    random_index++;
    play_next_song();
}
const play_previous_song = () =>{
    if (random_index <= 0) {
        random_index = all_songs.length -1;
    }else{
        random_index-=2;
    }
    play_next_song();
}
// listen to Events 
// Musiq Duration
let current_time = document.getElementById("current_time");
let current_end = document.getElementById("current_end");
let bar2 = document.getElementById("bar2");
let dot = document.querySelector(".bar .dot");

gana.addEventListener('timeupdate', () => {
    let musiq_curr = gana.currentTime;
    let musiq_dur = gana.duration;
    let mint1 = Math.floor(musiq_dur/60);
    let sec1 = Math.floor(musiq_dur%60);
    if (sec1 < 10) {
        sec1 = `0${sec1}`;
    }
    current_end.innerText = `${mint1}:${sec1}`;

    let mint2 = Math.floor(musiq_curr / 60);
    let sec2 = Math.floor(musiq_curr % 60);
    if (sec2 < 10) {
        sec2 = `0${sec2}`;
    }
    current_time.innerText = `${mint2}:${sec2}`;

    progress = parseInt((gana.currentTime/gana.duration) * 100);
    progres_bar.value = progress;

    let seek_bar = seek.value;
    bar2.style.width = `${seek_bar}%`;
    dot.style.left = `${seek_bar}%`;
});

progres_bar.addEventListener('change', ()=>{
    gana.currentTime = (progres_bar.value  * gana.duration)/100;
});

// Audio System
let vol_icon = document.getElementById("vol_icon");
let vol_input = document.getElementById("vol_input");
let vol_bar = document.getElementsByClassName("vol_bar")[0];
let vol_dot = document.getElementById("vol_dot");

vol_input.addEventListener('change',()=>{
    if (vol_input.value == 0) {
        vol_icon.classList.remove("bi-volume-up-fill");
        vol_icon.classList.remove("bi-volume-down-fill");
        vol_icon.classList.add("bi-volume-mute-fill");
    } else if(vol_input.value <= 50 && vol_input.value > 0){
        vol_icon.classList.remove("bi-volume-up-fill");
        vol_icon.classList.remove("bi-volume-mute-fill");
        vol_icon.classList.add("bi-volume-down-fill");
    }else if(vol_input.value > 50 && vol_input.value <= 100){
        vol_icon.classList.remove("bi-volume-down-fill");
        vol_icon.classList.remove("bi-volume-mute-fill");
        vol_icon.classList.add("bi-volume-up-fill");
    }
    let vol = vol_input.value;
    vol_bar.style.width = `${vol}%`;
    vol_dot.style.left =`${vol}%`;
    gana.volume = vol / 100;
});

function play_music(song_src, song_ki_pic, song_ka_naam_angreji, song_ka_naam_hindi, song_ka_naam_urdu, artist_ka_naam) {
    isPlaylist_song = false;
    closeBtn.click();
    gana.src = song_src;
    dowload_music.setAttribute(`download`, `${artist_ka_naam}-${song_ka_naam_angreji}`);
    dowload_music.href = song_src;
    makeAllBackground();
    makeAllPlays();
    play_audio(song_ki_pic, song_ka_naam_angreji, song_ka_naam_hindi, song_ka_naam_urdu, artist_ka_naam);
}
// song Info System
const SongPopup = document.getElementById("SongPopup");
const closeBtn = document.getElementById("closeBtn");
let popuppic = document.querySelector(".popup-box img");
let naam = document.querySelector(".popup-box #popup_details marquee");
let playButton = document.querySelector(".popup-box #popup_details button");

const activate_song_popup = (img_src, song_ka_naam_angreji, song_ka_naam_hindi, song_ka_naam_urdu, song_src, artist_ka_naam) => {
    popuppic.src = img_src;
    naam.innerHTML = artist_ka_naam + "-" + song_ka_naam_angreji;
    playButton.setAttribute(`onclick`, `play_music("${song_src}", "${img_src}", "${song_ka_naam_angreji}", "${song_ka_naam_hindi}", "${song_ka_naam_urdu}", "${artist_ka_naam}")`);
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

// Playlist Playing
let playlist_song = [
    {"en":"Choote Na Kabhi Tera Daaman", "hi":"तुम्हारा दामन कभी न छूटे", "ur":"چھوٹے نہ کبھی تیرا دامن", "pic":"pics/kgn.webp", "artist":"Milad Raza Qadri","song":"songs/kgn.mp3"},
    {"en":"Jogi-Shaadi Mein Zaroor Aana", "hi":"जोगी-शादी में जरूर आना", "ur":"جوگی-شادی میں ضرور آنا", "pic":"pics/2.jpg", "artist":"Yasser Desai & Aakanksha Sharma","song":"songs/2.mp3"},
    {"en":"Nashe Si Chadh Gayi (From 'Befikre')", "hi":"नशे सी छा गई (फिल्म 'बे फिक्र' से)", "ur":"نشے سی چھا گئی (فلم 'بے فکر' سے)", "pic":"pics/3.jpg", "artist":"Vishal and Sheykhar & Arijit Sing","song":"songs/b2.mp3"},
    {"en":"Dhadak Title Track-Dhadak", "hi":"धड़क शीर्षक गीत - धड़क", "ur":"دھڑک ٹائٹل ٹریک-دھڑک", "pic":"pics/d.jpg", "artist":"Ajay Gogavale & Shreya Ghoshal","song":"songs/d1.mp3"},
    {"en":"Jug Jug Jeeve-Shiddat", "hi":"जुग जुग जिए - शिद्दत", "ur":"جگ جگ جیو - شدت", "pic":"pics/25.jpg", "artist":"Sachet Tandon","song":"songs/25.mp3"},
    {"en":"Tu Hai", "hi":"तू है", "ur":"تو ہے", "pic":"pics/38.jpg", "artist":"Darshan Raval, Prakriti Giri","song":"songs/38.mp3"},
    {"en":"Raanjhanaa-Raanjhanaa", "hi":"रांझणा-रांझणा", "ur":"رانجھنا-رانجھنا", "pic":"pics/7.jpg", "artist":"Jaswinder Singh & Shiraz Uppal","song":"songs/7.mp3"},
    {"en":"Samjhawan-The Bride Of Humpty Sharma", "hi":"समझावन - हम्प्टी शर्मा की दुल्हन", "ur":"سمجھاون-دی برائیڈ آف ہمپٹی شرما", "pic":"pics/8.jpg", "artist":"Dharma Productions","song":"songs/hs2.mp3"},
    {"en":"Vaara Re-Dhadak", "hi":"वारा रे-धड़क", "ur":"وارا ری - دھڑک", "pic":"pics/d.jpg", "artist":"Ajay Gogavale","song":"songs/d2.mp3"},
    {"en":"Jalebi Title Track - Jalebi", "hi":"जलेबी टाइटल ट्रैक - जलेबी", "ur":"جلیبی ٹائٹل ٹریک - جلیبی", "pic":"pics/14.jpg", "artist":"KK, Tanishk Bagchi","song":"songs/j3.mp3"}
]
let playlist_indexing = 3;
Array.from(document.querySelectorAll("#playlist_songs li .playListPlay")).forEach((e)=>{
    e.addEventListener('click', (el)=>{
        let index = el.target.id;
        playlist_indexing = index-1;
        isPlaylist_song = true;
        if (el.target.classList.contains('bi-pause-circle-fill')) {
            el.target.classList.remove("bi-pause-circle-fill");
            el.target.classList.add("bi-play-circle-fill");
            togglePlayPause();
        } else {
            makeAllPlays();
            makeAllBackground();
            Array.from(document.querySelectorAll("#playlist_songs li"))[index-1].style.background ='rgba(58, 58, 91, 0.5)';
            el.target.classList.remove("bi-play-circle-fill");
            el.target.classList.add("bi-pause-circle-fill");
            gana.src = playlist_song[index-1].song;
            dowload_music.setAttribute(`download`, `${playlist_song[index-1].artist}-${playlist_song[index-1].en}`);
            dowload_music.href = playlist_song[index-1].song;
            play_audio(playlist_song[index-1].pic, playlist_song[index-1].en, playlist_song[index-1].hi, playlist_song[index-1].ur, playlist_song[index-1].artist);
        } 
    })
})
// update karna padega
// Shuffle + gana (Audio Element)
let shuffle = document.getElementsByClassName("shuffle")[0];

shuffle.addEventListener('click', ()=>{
    let a = shuffle.innerHTML;
    switch (a) {
        case 'next':
            shuffle.classList.add('bi-repeat-1');
            shuffle.classList.remove('bi-music-note-beamed');
            shuffle.classList.remove('bi-shuffle');
            shuffle.innerHTML = 'repeat';
            break;
        case 'repeat':
            shuffle.classList.add('bi-shuffle');
            shuffle.classList.remove('bi-music-note-beamed');
            shuffle.classList.remove('bi-repeat-1');
            shuffle.innerHTML = 'random';
            break;
        case 'random':
            shuffle.classList.add('bi-music-note-beamed');
            shuffle.classList.remove('bi-repeat-1');
            shuffle.classList.remove('bi-shuffle');
            shuffle.innerHTML = 'next';
            break;
    }
});

const next_musiq = ()=>{
    // index++;
    if (isPlaylist_song) {
        if (playlist_indexing >= playlist_song.length) {
            playlist_indexing = 1;
        } else {
            playlist_indexing++;
        }
        gana.src = playlist_song[playlist_indexing].song;
        dowload_music.setAttribute(`download`, `${playlist_song[playlist_indexing].artist}-${playlist_song[playlist_indexing].en}`);
        dowload_music.href = playlist_song[playlist_indexing].song;
        makeAllBackground();
        Array.from(document.querySelectorAll("#playlist_songs li"))[playlist_indexing+1].style.background ='rgb(105, 105, 105, 0.1)';
        makeAllPlays();
        playlist_play_icon = document.getElementById(`${playlist_indexing+1}`);
        playlist_play_icon.classList.remove("bi-play-circle-fill");
        playlist_play_icon.classList.add("bi-pause-circle-fill");
        play_audio(playlist_song[playlist_indexing].pic, playlist_song[playlist_indexing].en, playlist_song[playlist_indexing].hi, playlist_song[playlist_indexing].ur, playlist_song[playlist_indexing].artist);
    } else {
        gana.src = all_songs[random_index].song;
        dowload_music.setAttribute(`download`, `${all_songs[random_index].artist}-${all_songs[random_index].en}`);
        dowload_music.href = all_songs[random_index].song;
        play_audio(all_songs[random_index].pic, all_songs[random_index].en, all_songs[random_index].hi, all_songs[random_index].ur, all_songs[random_index].artist);
        if (random_index >= all_songs.length) {
            random_index = 1;
        } else {
            random_index++;
        }
    }
   
}
const repeat_musiq = ()=>{
    //index;
    if (isPlaylist_song) {
        playlist_indexing;
        gana.src = playlist_song[playlist_indexing].song;
        dowload_music.setAttribute(`download`, `${playlist_song[playlist_indexing].artist}-${playlist_song[playlist_indexing].en}`);
        dowload_music.href = playlist_song[playlist_indexing].song;
        makeAllBackground();
        Array.from(document.querySelectorAll("#playlist_songs li"))[playlist_indexing+1].style.background ='rgb(105, 105, 105, 0.1)';
        makeAllPlays();
        playlist_play_icon = document.getElementById(`${playlist_indexing+1}`);
        playlist_play_icon.classList.remove("bi-play-circle-fill");
        playlist_play_icon.classList.add("bi-pause-circle-fill");
        play_audio(playlist_song[playlist_indexing].pic, playlist_song[playlist_indexing].en, playlist_song[playlist_indexing].hi, playlist_song[playlist_indexing].ur, playlist_song[playlist_indexing].artist);
    } else {
        gana.src = all_songs[random_index].song;
        dowload_music.setAttribute(`download`, `${all_songs[random_index].artist}-${all_songs[random_index].en}`);
        dowload_music.href = all_songs[random_index].song;
        play_audio(all_songs[random_index].pic, all_songs[random_index].en, all_songs[random_index].hi, all_songs[random_index].ur, all_songs[random_index].artist);
        random_index;
    }
}
const random_musiq = ()=>{
    if (isPlaylist_song) {
        if (playlist_indexing >= playlist_song.length) {
            playlist_indexing = 1;
        } else {
            playlist_indexing = Math.floor((Math.random() * playlist_song.length) + 1);
        }
        gana.src = playlist_song[playlist_indexing].song;
        dowload_music.setAttribute(`download`, `${playlist_song[playlist_indexing].artist}-${playlist_song[playlist_indexing].en}`);
        dowload_music.href = playlist_song[playlist_indexing].song;
        makeAllBackground();
        Array.from(document.querySelectorAll("#playlist_songs li"))[playlist_indexing+1].style.background ='rgb(105, 105, 105, 0.1)';
        makeAllPlays();
        playlist_play_icon = document.getElementById(`${playlist_indexing+1}`);
        playlist_play_icon.classList.remove("bi-play-circle-fill");
        playlist_play_icon.classList.add("bi-pause-circle-fill");
        play_audio(playlist_song[playlist_indexing].pic, playlist_song[playlist_indexing].en, playlist_song[playlist_indexing].hi, playlist_song[playlist_indexing].ur, playlist_song[playlist_indexing].artist);
    } else {
        gana.src = all_songs[random_index].song;
        dowload_music.setAttribute(`download`, `${all_songs[random_index].artist}-${all_songs[random_index].en}`);
        dowload_music.href = all_songs[random_index].song;
        play_audio(all_songs[random_index].pic, all_songs[random_index].en, all_songs[random_index].hi, all_songs[random_index].ur, all_songs[random_index].artist);
        if (random_index >= all_songs.length) {
            random_index = 1;
        } else {
            random_index = Math.floor((Math.random() * all_songs.length) + 1);
        }
    }
}
gana.addEventListener('ended', ()=>{
    let b = shuffle.innerHTML;
    switch (b) {
        case 'repeat':
            repeat_musiq();
            break;
        case 'next':
            next_musiq();
            break;
        case 'random':
            random_musiq();
            break;
    }
});