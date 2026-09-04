Create DATABASE musik;

use musik;

-- CREATE TABLE users(
--     Name Varchar(40) NOT NULL,
--     UserId INT AUTOINCREMENT PRIMARY KEY,
--     Password Varchar(10),
--     Email Varchar(30)
-- )

-- CREATE TABLE playlist(
--     UserId INT,
--     SongId INT

--     FOREIGN KEY (UserId) REFRENCES users(UserId)
--     FOREIGN KEY (SongId) REFRENCES songs(id)
-- )

-- create table songs(
--     id int autoincrement primary key,
--     title varchar(40) not null,
--     artist varchar(40) not null,
--     album varchar(40) not null,
--     audioFile TEXT,
--     imageFile TEXT
--     uploadBy INT

--     foreign key (uploadBy) refrences users(UserId)
-- )
-- Users Table
CREATE TABLE users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(40) NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);

-- Songs Table
CREATE TABLE songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    album VARCHAR(100),
    cover_url TEXT,
    cover_public_id VARCHAR(255),
    audio_url TEXT NOT NULL,
    audio_public_id VARCHAR(255),
    uploadBy INT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (uploadBy)
        REFERENCES users(UserId)
        ON DELETE CASCADE
);

CREATE TABLE playlists (
    PlaylistId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT UNIQUE,

    FOREIGN KEY (UserId)
        REFERENCES users(UserId)
        ON DELETE CASCADE
);

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

CREATE TABLE song_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    song_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(UserId) ON DELETE CASCADE,

    UNIQUE (song_id, user_id)
);