// slider button
let pop_song_right1 = document.getElementById("pop_song_right1");
let pop_song_left1 = document.getElementById("pop_song_left1");
let pop_songs1 = document.querySelector(".pop_songs");

pop_song_right1.addEventListener("click", ()=>{
    pop_songs1.scrollLeft += 330;
})
pop_song_left1.addEventListener("click", ()=>{
    pop_songs1.scrollLeft -= 330;
})

let pop_song_right2 = document.getElementById("pop_song_right2");
let pop_song_left2 = document.getElementById("pop_song_left2");
let pop_songs2 = document.querySelector("#popular_songs1 .pop_songs");

pop_song_right2.addEventListener("click", ()=>{
    pop_songs2.scrollLeft += 330;
})
pop_song_left2.addEventListener("click", ()=>{
    pop_songs2.scrollLeft -= 330;
})
let pop_art_left = document.getElementById("pop_art_left");
let pop_art_right = document.getElementById("pop_art_right");
let pa_container = document.getElementById("pa_container");

pop_art_right.addEventListener("click", ()=>{
    pa_container.scrollLeft += 330;
});
pop_art_left.addEventListener("click", ()=>{
    pa_container.scrollLeft -= 330;
});

let pop_al_left = document.getElementById("pop_al_left");
let pop_al_right = document.getElementById("pop_al_right");
let album_container = document.querySelector("#movie_songs .pop_songs");

pop_al_right.addEventListener("click", ()=>{
    album_container.scrollLeft += 330;
});
pop_al_left.addEventListener("click", ()=>{
    album_container.scrollLeft -= 330;
});
