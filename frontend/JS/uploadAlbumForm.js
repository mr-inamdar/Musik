import { uploadAlbum } from "./api.js";

const albumForm =
    document.getElementById("albumForm");

const albumName =
    document.getElementById("albumName");

const songsContainer =
    document.getElementById("songsContainer");

const addSongBtn =
    document.getElementById("addSongBtn");


let songCount = 0;


// ======================================
// ADD SONG
// ======================================

function addSong() {

    songCount++;


    const songItem =
        document.createElement("div");


    songItem.className = "song-item";


    songItem.innerHTML = `

        <div class="song-header">

            <span class="song-number">
                Song ${songCount}
            </span>

            <button
                type="button"
                class="remove-song"
            >
                ×
            </button>

        </div>


        <!-- SONG TITLE -->

        <input
            type="text"
            class="song-title"
            placeholder="Enter song title"
            required
        >


        <!-- ARTIST -->

        <input
            type="text"
            class="song-artist"
            placeholder="Enter artist name"
            required
        >


        <!-- POSTER -->

        <label class="file-box">

            📷 Click to Upload Song Poster

            <input
                type="file"
                class="song-poster"
                accept="image/*"
                required
            >

        </label>


        <img
            class="poster-preview"
            alt="Song Poster Preview"
        >


        <!-- AUDIO -->

        <label class="file-box">

            🎧 Click to Upload Song Audio

            <input
                type="file"
                class="song-audio"
                accept=".mp3,.wav,.ogg"
                required
            >

        </label>


        <span class="audio-name"></span>

    `;


    // ==================================
    // REMOVE SONG
    // ==================================

    const removeBtn =
        songItem.querySelector(".remove-song");


    removeBtn.addEventListener(
        "click",
        () => {

            const totalSongs =
                songsContainer.querySelectorAll(
                    ".song-item"
                ).length;


            // At least 1 song hona chahiye
            if (totalSongs <= 1) {

                alert(
                    "Album must contain at least one song."
                );

                return;
            }


            songItem.style.animation =
                "songClose .25s ease forwards";


            setTimeout(() => {

                songItem.remove();

                updateSongNumbers();

            }, 250);

        }
    );


    // ==================================
    // POSTER PREVIEW
    // ==================================

    const posterInput =
        songItem.querySelector(".song-poster");


    const posterPreview =
        songItem.querySelector(".poster-preview");


    posterInput.addEventListener(
        "change",
        () => {

            const file =
                posterInput.files[0];


            if (!file) return;


            posterPreview.src =
                URL.createObjectURL(file);


            posterPreview.style.display =
                "block";

        }
    );


    // ==================================
    // AUDIO NAME
    // ==================================

    const audioInput =
        songItem.querySelector(".song-audio");


    const audioName =
        songItem.querySelector(".audio-name");


    audioInput.addEventListener(
        "change",
        () => {

            const file =
                audioInput.files[0];


            if (!file) return;


            audioName.textContent =
                `🎵 ${file.name}`;

        }
    );


    songsContainer.appendChild(songItem);
}


// ======================================
// UPDATE SONG NUMBERS
// ======================================

function updateSongNumbers() {

    const songs =
        songsContainer.querySelectorAll(
            ".song-item"
        );


    songs.forEach(
        (song, index) => {

            song.querySelector(
                ".song-number"
            ).textContent =
                `Song ${index + 1}`;

        }
    );


    songCount = songs.length;
}


// ======================================
// ADD SONG BUTTON
// ======================================

addSongBtn.addEventListener(
    "click",
    () => {

        addSong();

    }
);


// ======================================
// FIRST SONG
// ======================================

addSong();


// ======================================
// SUBMIT
// ======================================

albumForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        const songs =
            songsContainer.querySelectorAll(
                ".song-item"
            );


        if (songs.length === 0) {

            alert(
                "Please add at least one song."
            );

            return;
        }


        const formData =
            new FormData();


        // ==============================
        // ALBUM
        // ==============================

        formData.append(
            "albumName",
            albumName.value.trim()
        );

        let count = 0;


        // ==============================
        // SONGS
        // ==============================

        songs.forEach(
            (song, index) => {

                const title =
                    song.querySelector(
                        ".song-title"
                    ).value.trim();


                const artist =
                    song.querySelector(
                        ".song-artist"
                    ).value.trim();


                const poster =
                    song.querySelector(
                        ".song-poster"
                    ).files[0];


                const audio =
                    song.querySelector(
                        ".song-audio"
                    ).files[0];


                formData.append(
                    `songs[${index}].title`,
                    title
                );


                formData.append(
                    `songs[${index}].artist`,
                    artist
                );


                formData.append(
                    `songs[${index}].poster`,
                    poster
                );


                formData.append(
                    `songs[${index}].audio`,
                    audio
                );

                count++;
            }
        );

        // const responce = await uploadAlbum(formData, count);

        // if (responce.success) {
        //     alert(responce.message);
        //     console.log("vhwvjd")
        // }
        // else{
        //     alert(responce.message)
        //     console.log("vhwvjd2")
        // }
        try {

            const response =
                await uploadAlbum(
                    formData,
                    songs.length
                );

            if (response.success) {

                alert(response.message);

                albumForm.reset();

                songsContainer.innerHTML = "";

                songCount = 0;

                addSong();

                window.location.href =
                    "index.html";

            } else {

                alert(
                    response.message ||
                    "Album upload failed."
                );
            }

        } catch (error) {

            console.error(
                "Album upload error:",
                error
            );

            alert(
                error.message ||
                "Something went wrong."
            );
        }

        // /window.location = 'index.html';

        // ==============================
        // TOKEN
        // ==============================

        // const token =
        //     localStorage.getItem("token");


        // try {

        //     const response =
        //         await fetch(
        //             "http://localhost:4000/albums/upload",
        //             {

        //                 method: "POST",

        //                 headers: {

        //                     Authorization:
        //                         `Bearer ${token}`

        //                 },

        //                 body: formData

        //             }
        //         );


        //     const data =
        //         await response.json();


        //     if (!response.ok) {

        //         throw new Error(
        //             data.message ||
        //             "Album upload failed"
        //         );

        //     }


        //     alert(
        //         "Album uploaded successfully!"
        //     );


        //     // Reset

        //     albumForm.reset();

        //     songsContainer.innerHTML = "";

        //     songCount = 0;

        //     addSong();


        // }
        // catch (error) {

        //     console.error(
        //         "Album upload error:",
        //         error
        //     );


        //     alert(
        //         error.message
        //     );

        // }

    }
);
