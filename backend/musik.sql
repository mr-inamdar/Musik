CREATE DATABASE musikkk;
USE musikkk;

-- =========================
-- USERS
-- =========================

CREATE TABLE users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(40) NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);

-- =========================
-- ALBUMS
-- =========================

CREATE TABLE albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,

    albumName VARCHAR(15) NOT NULL,

    uploadedBy INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uploadedBy)
        REFERENCES users(UserId)
        ON DELETE CASCADE
);


-- =========================
-- SONGS
-- =========================

CREATE TABLE songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(20) NOT NULL,

    artist VARCHAR(70) NOT NULL,

    -- NULL = standalone song
    -- value = song belongs to an album
    album_id INT DEFAULT NULL,

    -- Every song has its own poster
    cover_url TEXT,
    cover_public_id VARCHAR(255),

    -- Every song has its own audio
    audio_url TEXT NOT NULL,
    audio_public_id VARCHAR(255),

    uploadBy INT NOT NULL,

    likes INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (album_id)
        REFERENCES albums(album_id)
        ON DELETE SET NULL,

    FOREIGN KEY (uploadBy)
        REFERENCES users(UserId)
        ON DELETE CASCADE
);



-- =========================
-- PLAYLISTS
-- =========================

CREATE TABLE playlists (
    PlaylistId INT AUTO_INCREMENT PRIMARY KEY,

    UserId INT UNIQUE,

    FOREIGN KEY (UserId)
        REFERENCES users(UserId)
        ON DELETE CASCADE
);


-- =========================
-- PLAYLIST SONGS
-- =========================

CREATE TABLE playlist_songs (
    PlaylistId INT,
    SongId INT,

    PRIMARY KEY (PlaylistId, SongId),

    FOREIGN KEY (PlaylistId)
        REFERENCES playlists(PlaylistId)
        ON DELETE CASCADE,

    FOREIGN KEY (SongId)
        REFERENCES songs(song_id)
        ON DELETE CASCADE
);
