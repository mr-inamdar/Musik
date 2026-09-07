CREATE DATABASE musikkk;
USE musikkk;


-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,

    Name VARCHAR(40) NOT NULL,

    Email VARCHAR(50) NOT NULL UNIQUE,

    Password VARCHAR(255) NOT NULL
);


-- =========================================
-- COVERS
-- =========================================
-- All cover/poster files are stored here

CREATE TABLE covers (
    cover_id INT AUTO_INCREMENT PRIMARY KEY,

    cover_url TEXT NOT NULL,

    cover_public_id VARCHAR(255) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- ALBUMS
-- =========================================

CREATE TABLE albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,

    albumName VARCHAR(100) NOT NULL,

    uploadedBy INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uploadedBy)
        REFERENCES users(UserId)
        ON DELETE CASCADE
);


-- =========================================
-- ALBUM COVERS
-- =========================================
-- One common cover for an album

CREATE TABLE album_covers (
    album_id INT PRIMARY KEY,

    cover_id INT NOT NULL UNIQUE,

    FOREIGN KEY (album_id)
        REFERENCES albums(album_id)
        ON DELETE CASCADE,

    FOREIGN KEY (cover_id)
        REFERENCES covers(cover_id)
        ON DELETE CASCADE
);


-- =========================================
-- SONGS
-- =========================================

CREATE TABLE songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(100) NOT NULL,

    artist VARCHAR(100) NOT NULL,

    album_id INT DEFAULT NULL,

    audio_url TEXT NOT NULL,

    audio_public_id VARCHAR(255) NOT NULL UNIQUE,

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


-- =========================================
-- SONG COVERS
-- =========================================
-- Only standalone songs get an entry here

CREATE TABLE song_covers (
    song_id INT PRIMARY KEY,

    cover_id INT NOT NULL UNIQUE,

    FOREIGN KEY (song_id)
        REFERENCES songs(song_id)
        ON DELETE CASCADE,

    FOREIGN KEY (cover_id)
        REFERENCES covers(cover_id)
        ON DELETE CASCADE
);


-- =========================================
-- PLAYLISTS
-- =========================================

CREATE TABLE playlists (
    PlaylistId INT AUTO_INCREMENT PRIMARY KEY,

    UserId INT NOT NULL UNIQUE,

    FOREIGN KEY (UserId)
        REFERENCES users(UserId)
        ON DELETE CASCADE
);


-- =========================================
-- PLAYLIST SONGS
-- =========================================

CREATE TABLE playlist_songs (
    PlaylistId INT NOT NULL,

    SongId INT NOT NULL,

    PRIMARY KEY (PlaylistId, SongId),

    FOREIGN KEY (PlaylistId)
        REFERENCES playlists(PlaylistId)
        ON DELETE CASCADE,

    FOREIGN KEY (SongId)
        REFERENCES songs(song_id)
        ON DELETE CASCADE
);