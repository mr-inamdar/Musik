-- Create DATABASE musik;

-- use musik;
-- -- Users Table
-- CREATE TABLE users (
--     UserId INT AUTO_INCREMENT PRIMARY KEY,
--     Name VARCHAR(40) NOT NULL,
--     Email VARCHAR(50) NOT NULL UNIQUE,
--     Password VARCHAR(255) NOT NULL
-- );

-- -- Songs Table
-- CREATE TABLE songs (
--     song_id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(100) NOT NULL,
--     artist VARCHAR(100) NOT NULL,
--     album VARCHAR(100),
--     cover_url TEXT,
--     cover_public_id VARCHAR(255),
--     audio_url TEXT NOT NULL,
--     audio_public_id VARCHAR(255),
--     uploadBy INT NOT NULL,
--     likes INT DEFAULT 0,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--     ON UPDATE CURRENT_TIMESTAMP,

--     FOREIGN KEY (uploadBy)
--         REFERENCES users(UserId)
--         ON DELETE CASCADE
-- );

-- CREATE TABLE playlists (
--     PlaylistId INT AUTO_INCREMENT PRIMARY KEY,
--     UserId INT UNIQUE,

--     FOREIGN KEY (UserId)
--         REFERENCES users(UserId)
--         ON DELETE CASCADE
-- );

-- CREATE TABLE playlist_songs (
--     PlaylistId INT,
--     SongId INT,

--     PRIMARY KEY (PlaylistId, SongId),

--     FOREIGN KEY (PlaylistId)
--         REFERENCES playlists(PlaylistId)
--         ON DELETE CASCADE,

--     FOREIGN KEY (SongId)
--         REFERENCES songs(song_id)
--         ON DELETE CASCADE
-- );

-- CREATE TABLE song_likes (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     song_id INT NOT NULL,
--     user_id INT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
--     FOREIGN KEY (user_id) REFERENCES users(UserId) ON DELETE CASCADE,

--     UNIQUE (song_id, user_id)
-- );

-- CREATE TABLE Albums (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     albumName VARCHAR(50) NOT NULL
-- )

CREATE DATABASE musik;
USE musik;

-- Users
CREATE TABLE users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(40) NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);

-- Albums
CREATE TABLE albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    albumName VARCHAR(15) NOT NULL,
    cover_url TEXT,
    cover_public_id VARCHAR(150),

    uploadedBy INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uploadedBy)
        REFERENCES users(UserId)
        ON DELETE CASCADE
);

-- Songs
CREATE TABLE songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(30) NOT NULL,
    artist VARCHAR(100) NOT NULL,

    album_id INT,

    audio_url TEXT NOT NULL,
    audio_public_id VARCHAR(150),

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

-- Playlists
CREATE TABLE playlists (
    PlaylistId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT UNIQUE,

    FOREIGN KEY (UserId)
        REFERENCES users(UserId)
        ON DELETE CASCADE
);

-- Playlist Songs
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

-- Song Likes
CREATE TABLE song_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    song_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (song_id)
        REFERENCES songs(song_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(UserId)
        ON DELETE CASCADE,

    UNIQUE (song_id, user_id)
);