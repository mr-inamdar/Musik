import { updateAlbum } from "./api.js";


const albumNameInput = document.getElementById("albumName");

const albumSongsContainer =
    document.getElementById("albumSongsContainer");

const newSongsContainer =
    document.getElementById("newSongsContainer");

const songCountElement =
    document.getElementById("songCount");

const uploadedBy = document.getElementById("uploadedBy");

const addNewSongBtn =
    document.getElementById("addNewSongBtn");

const saveAlbumBtn =
    document.getElementById("saveAlbumBtn");

const cancelBtn =
    document.getElementById("cancelBtn");


let album = null;


// ======================================
// NEW SONGS ARRAY
// ======================================

let newSongs = [];


// ======================================
// LOAD ALBUM
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    album =
        JSON.parse(
            localStorage.getItem("updateAlbum")
        ) || null;


    console.log("Update Album:", album);


    if (!album) {

        alert("Album data not found.");

        history.back();

        return;

    }


    loadAlbumData();

});


// ======================================
// LOAD ALBUM DATA
// ======================================

function loadAlbumData() {

    albumNameInput.value =
        album.albumName || "";


    uploadedBy.innerText = album.songs.uploadBy || "You";


    const songs =
        album.songs || [];


    songCountElement.innerText =
        songs.length;


    renderExistingSongs(songs);

}


// ======================================
// EXISTING SONGS
// ======================================

function renderExistingSongs(songs) {

    albumSongsContainer.innerHTML = "";


    songs.forEach((song, index) => {

        const songCard =
            document.createElement("div");


        songCard.className =
            "song-edit-card";


        const poster =
            song.image ||
            song.cover_url ||
            song.coverUrl ||
            "https://placehold.co/120x120";


        songCard.innerHTML = `

            <div class="song-cover-wrapper">

                <img
                    src="${poster}"
                    id="cover-${index}"
                    alt="Song Cover"
                >

                <label
                    for="poster-${index}"
                    class="song-cover-btn"
                >

                    <i class="bi bi-camera-fill"></i>

                </label>

                <input
                    type="file"
                    id="poster-${index}"
                    class="song-poster-input"
                    accept="image/*"
                    hidden
                >

            </div>


            <div class="song-fields">

                <div class="song-input">

                    <label>
                        Song Title
                    </label>

                    <input
                        type="text"
                        class="song-title"
                        value="${escapeHTML(song.title || "")}"
                        placeholder="Song title"
                    >

                </div>


                <div class="song-input">

                    <label>
                        Artist
                    </label>

                    <input
                        type="text"
                        class="song-artist"
                        value="${escapeHTML(song.artist || "")}"
                        placeholder="Artist name"
                    >

                </div>

            </div>

        `;


        albumSongsContainer.appendChild(
            songCard
        );


        const posterInput =
            songCard.querySelector(
                ".song-poster-input"
            );


        posterInput.addEventListener(
            "change",
            () => {

                const file =
                    posterInput.files[0];


                if (!file) return;


                const preview =
                    document.getElementById(
                        `cover-${index}`
                    );


                preview.src =
                    URL.createObjectURL(file);

            }
        );

    });

}


// ======================================
// ADD NEW SONG
// ======================================

addNewSongBtn.addEventListener(
    "click",
    () => {

        const newSong = {

            id: Date.now(),

            title: "",

            artist: "",

            poster: null,

            audio: null

        };


        newSongs.push(newSong);


        renderNewSongs();

    }
);


// ======================================
// RENDER NEW SONGS
// ======================================

function renderNewSongs() {

    newSongsContainer.innerHTML = "";


    newSongs.forEach(
        (song, index) => {

            const card =
                document.createElement("div");


            card.className =
                "new-song-card";


            card.innerHTML = `

                <span class="new-song-badge">
                    New Song
                </span>


                <!-- POSTER -->

                <div
                    class="new-song-cover-wrapper"
                >

                    <img
                        src="https://placehold.co/120x120"
                        id="new-cover-${index}"
                        alt="New Song Cover"
                    >


                    <label
                        for="new-poster-${index}"
                        class="new-song-cover-btn"
                    >

                        <i class="bi bi-camera-fill"></i>

                    </label>


                    <input
                        type="file"
                        id="new-poster-${index}"
                        class="new-song-poster"
                        accept="image/*"
                        hidden
                    >

                </div>


                <!-- FIELDS -->

                <div class="new-song-fields">


                    <div class="new-song-input">

                        <label>
                            Song Title
                        </label>

                        <input
                            type="text"
                            class="new-title"
                            placeholder="Enter song title"
                        >

                    </div>


                    <div class="new-song-input">

                        <label>
                            Artist
                        </label>

                        <input
                            type="text"
                            class="new-artist"
                            placeholder="Enter artist name"
                        >

                    </div>


                    <!-- AUDIO -->

                    <div class="new-song-audio">

                        <label>
                            Audio File
                        </label>

                        <input
                            type="file"
                            class="new-audio"
                            accept="audio/*"
                        >


                        <div
                            class="audio-file-name"
                        >

                            <i class="bi bi-music-note-beamed"></i>

                            <span>
                                No audio selected
                            </span>

                        </div>

                    </div>

                </div>


                <!-- REMOVE -->

                <button
                    type="button"
                    class="remove-new-song"
                    title="Remove song"
                >

                    <i class="bi bi-trash3"></i>

                </button>

            `;


            newSongsContainer.appendChild(
                card
            );


            // =================================
            // TITLE
            // =================================

            const titleInput =
                card.querySelector(
                    ".new-title"
                );


            titleInput.value =
                song.title;


            titleInput.addEventListener(
                "input",
                () => {

                    song.title =
                        titleInput.value;

                }
            );


            // =================================
            // ARTIST
            // =================================

            const artistInput =
                card.querySelector(
                    ".new-artist"
                );


            artistInput.value =
                song.artist;


            artistInput.addEventListener(
                "input",
                () => {

                    song.artist =
                        artistInput.value;

                }
            );


            // =================================
            // POSTER
            // =================================

            const posterInput =
                card.querySelector(
                    ".new-song-poster"
                );


            posterInput.addEventListener(
                "change",
                () => {

                    const file =
                        posterInput.files[0];


                    if (!file) return;


                    song.poster = file;


                    const preview =
                        card.querySelector(
                            `#new-cover-${index}`
                        );


                    preview.src =
                        URL.createObjectURL(
                            file
                        );

                }
            );


            // =================================
            // AUDIO
            // =================================

            const audioInput =
                card.querySelector(
                    ".new-audio"
                );


            const audioName =
                card.querySelector(
                    ".audio-file-name span"
                );


            audioInput.addEventListener(
                "change",
                () => {

                    const file =
                        audioInput.files[0];


                    if (!file) return;


                    song.audio = file;


                    audioName.innerText =
                        file.name;

                }
            );


            // =================================
            // REMOVE
            // =================================

            const removeBtn =
                card.querySelector(
                    ".remove-new-song"
                );


            removeBtn.addEventListener(
                "click",
                () => {

                    newSongs.splice(
                        index,
                        1
                    );


                    renderNewSongs();

                }
            );

        }
    );

}


// ======================================
// SAVE ALBUM
// ======================================

saveAlbumBtn.addEventListener(
"click",
async () => {
    if (!album) return;

    saveAlbumBtn.disabled = true;
    saveAlbumBtn.innerText = "Updating...";

    try {

        const formData = new FormData();

        // ==================================
        // ALBUM NAME
        // ==================================

        const newAlbumName =
            albumNameInput.value.trim();

        if (
            newAlbumName &&
            newAlbumName != album.albumName
        ) {
            formData.append(
                "albumName",
                newAlbumName
            );
        }


        // ==================================
        // EXISTING SONGS
        // ==================================

        const songCards =
            document.querySelectorAll(
                ".song-edit-card"
            );

        songCards.forEach(
            (card, index) => {

                const originalSong =
                    album.songs[index];

                if (!originalSong) return;


                const titleInput =
                    card.querySelector(
                        ".song-title"
                    );

                const artistInput =
                    card.querySelector(
                        ".song-artist"
                    );

                const posterInput =
                    card.querySelector(
                        ".song-poster-input"
                    );


                const title =
                    titleInput
                        ? titleInput.value.trim()
                        : "";

                const artist =
                    artistInput
                        ? artistInput.value.trim()
                        : "";


                // ==========================
                // TITLE
                // ==========================

                if (
                    title !==
                    (originalSong.title || "")
                ) {

                    formData.append(
                        `songs[${index}].title`,
                        title
                    );

                }


                // ==========================
                // ARTIST
                // ==========================

                if (
                    artist !==
                    (originalSong.artist || "")
                ) {

                    formData.append(
                        `songs[${index}].artist`,
                        artist
                    );

                }


                // ==========================
                // POSTER
                // ==========================

                if (
                    posterInput &&
                    posterInput.files &&
                    posterInput.files.length > 0
                ) {

                    formData.append(
                        `songs[${index}].poster`,
                        posterInput.files[0]
                    );

                }

            }
        );


        // ==================================
        // NEW SONGS
        // ==================================

        newSongs.forEach(
            (song, index) => {

                if (!song.title?.trim()) {

                    throw new Error(
                        `Please enter title for new song ${index + 1}.`
                    );

                }


                if (!song.artist?.trim()) {

                    throw new Error(
                        `Please enter artist for new song ${index + 1}.`
                    );

                }


                if (!song.poster) {

                    throw new Error(
                        `Please select poster for new song ${index + 1}.`
                    );

                }


                if (!song.audio) {

                    throw new Error(
                        `Please select audio for new song ${index + 1}.`
                    );

                }


                formData.append(
                    `newSong[${index}].title`,
                    song.title.trim()
                );


                formData.append(
                    `newSong[${index}].artist`,
                    song.artist.trim()
                );


                formData.append(
                    `newSong[${index}].poster`,
                    song.poster
                );


                formData.append(
                    `newSong[${index}].audio`,
                    song.audio
                );

            }
        );


        // ==================================
        // COUNTS
        // ==================================

        const existingSongCount = album.songs.length;

        const newSongCount = newSongs.length;


        console.log(
            "Existing Songs:",
            existingSongCount
        );

        console.log(
            "New Songs:",
            newSongCount
        );

        console.log('dete', formData);

        let isEmpty = true;

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                if (value.size > 0) isEmpty = false;
            } else if (value.trim() !== "") {
                isEmpty = false;
            }
        }

        if (localStorage.getItem('token') && !isEmpty) {
            console.log(localStorage.getItem('token'))
            const response = await updateAlbum(album.album_id, existingSongCount, newSongCount, formData);    
    

            if (response?.success) {

                alert(
                    response.message ||
                    "Album updated successfully"
                );


                localStorage.removeItem(
                    "updateAlbum"
                );


                window.location.href =
                    "index.html";

                return;
            }


            alert(
                response?.message ||
                "Album update failed"
            );

        }
        else{
            alert('You dont did Any change');
        }


    } catch (error) {

        console.error(
            "Update Album Error:",
            error
        );


        alert(
            error.message ||
            "Server Error"
        );

    } finally{
        saveAlbumBtn.disabled = false;
        saveAlbumBtn.innerText = "Save Changes";
        window.location = 'index.html'
    }

});


// ======================================
// CANCEL
// ======================================

cancelBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "updateAlbum"
        );

        history.back();

    }
);


// ======================================
// ESCAPE HTML
// ======================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}