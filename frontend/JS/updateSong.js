import { updateSong } from "./api.js";

const coverInput = document.getElementById("coverInput");
const coverPreview = document.getElementById("coverPreview");

coverInput.addEventListener("change", () => {

    const file = coverInput.files[0];

    if (!file) return;

    coverPreview.src = URL.createObjectURL(file);

});

// Example existing song data
let song = null;

document.addEventListener('DOMContentLoaded', ()=>{
    song = JSON.parse(localStorage.getItem('updateSong')) || null;

    console.log(song);

    if (song) {
        document.getElementById("title").value = song.title;
        document.getElementById("artist").value = song.artist;
        document.getElementById("album").value = song.album;
        coverPreview.src = song.image;
    }

})
document.querySelector(".update-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (title.value !== song.title)
        formData.append("title", title.value);

    if (artist.value !== song.artist)
        formData.append("artist", artist.value);

    if (album.value !== song.album)
        formData.append("album", album.value);

    if (coverInput.files.length)
        formData.append("image", coverInput.files[0]);

    const responce = await updateSong(formData, song.song_id);

    if (responce.success) {
        window.alert(responce.message);
        localStorage.removeItem('updateSong');
        window.location.href = 'index.html';
    }
    else{
        window.alert(responce.message);
        localStorage.removeItem('updateSong');
        history.back();
    }

    // fetch(`/songs/update/${song.song_id}`, {
    //     method: "PATCH",
    //     headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`
    //     },
    //     body: formData
    // });
});

// document.querySelector(".update-form").addEventListener("submit", e => {

//     e.preventDefault();

//     const updatedSong = {
//         title: title.value,
//         artist: artist.value,
//         album: album.value,
//         image: coverInput.files[0]
//     };

//     console.log(updatedSong);

//     // fetch(...) API call here

// });

document.querySelector(".cancel-btn").addEventListener("click", () => {

    history.back();

});