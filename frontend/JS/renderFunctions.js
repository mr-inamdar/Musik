export function renderPosterSong(posterSong, i){
    return `
            <button id="left" class="normal">&#10094;</button>
            <button id="right" class="normal">&#10095;</button>
            <img src=${posterSong.image} alt=${posterSong.image} id="poster_pic">
            <li class="trending_song_item">
                <span>${String(i + 1).padStart(2, "0")}</span>
                <img src=${posterSong.image} alt=${posterSong.image}>
                <h5>
                    <span>${posterSong.title}</span>
                    <div class="subtitel">${posterSong.artist}</div>
                </h5>
                <i class="bi playListPlay bi-play-circle-fill" id='posterPlay'></i>
            </li>
        `;
};

export function renderTopSong(song, i){
    return `
            <h1 class="sr_numbar">${String(i + 1).padStart(2, "0")}</h1>
            <li class="song_item">
                <div class="img_play">
                    <img src=${song.image} alt=${song.title}>
                    <i class="bi playListPlay bi-play-circle-fill" id='songPlay'></i>
                </div>
                <h5>
                    ${song.title} - ${song.album}
                    <div class="subtitle">${song.artist}</div>
                </h5>
            </li>
        `;
}

export function renderSong(song){
    return `
            <div class="img_play">
                <img src=${song.image} alt=${song.title}>
                <i class="bi playListPlay bi-play-circle-fill" id='songPlay'></i>
            </div>
            <h5>
                ${song.title} - ${song.album}
                <div class="subtitle">${song.artist}</div>
            </h5>
        `;
}

export function renderPlaylistSong(song, i){
    return `
        <span>${String(i + 1).padStart(2, "0")}</span>
        <img src=${song.image} alt='${song.title}'>
        <h5>
            ${song.title} - ${song.album}
            <div class="subtitel">${song.artist}</div>
        </h5>
        <i class="bi playListPlay bi-play-circle-fill" id="${i}"></i>
    `;
}
