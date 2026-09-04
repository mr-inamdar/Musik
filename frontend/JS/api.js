// import { renderSongs } from "./renderFunctions";
// const url = 'http://localhost:4000';
const url = 'https://musik-ayb8.onrender.com';
let allSongs = [];
let allPlaylistSongs = [];
let  allAlbums = [];


export async function fetchAllSongs(){
    await fetch(`${url}/songs`, {

        method: "GET",

        headers: {

            "Content-Type": "application/json",

        }

    })
    .then(res => res.json())
    .then(data => {
            
        allSongs = data.data;

        console.log(data);
        
        
    });

    return allSongs;
}

export async function uploadSong(formData) {
    const response = await fetch(`${url}/songs/upload`, {
        method: 'POST',
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    })

    const data = await response.json();

    if (!response.ok) {
        window.alert(data.message || "Upload failed");
    }
    else{
        window.alert(data.message || "Upload successfull");
        // fetchAllSongs();
    }
}

export async function likeSong(songId){

    const response = await fetch(`${url}/songs/like/${songId}`,{
        method:"POST",
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.json();   
}
export async function unlikeSong(songId){

    const response = await fetch(`${url}/songs/unlike/${songId}`,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.json();   
}

export async function deleteSong(songId) {
    const response = await fetch(`${url}/songs/${songId}`, {
        method: 'DELETE',
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    });
    if (response.ok) {
        return true;
    };
    return false;
}

export async function fetchPlaylistSongs() {
   const response = await fetch(`${url}/playlist`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;
    }

    const data = await response.json();

    allPlaylistSongs = data.data;

    console.log(data);

    return allPlaylistSongs;
}

export async function addToPlaylist(songId) {
    const response = await fetch(`${url}/playlist/${songId}`, {
        method: 'POST',
        headers:{
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    if (response.ok) {
        return true;
    };
    return false;
}

export async function removeFromPlaylist(songId) {
    const response = await fetch(`${url}/playlist/${songId}`, {
        method: 'DELETE',
        headers:{
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    if (response.ok) {
        return true;
    };
    return false;
}

export async function deleteMusikAccount(userId) {
    const response = await fetch(`${url}/auth/${userId}`, {
        method:'DELETE',
        headers:{
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })

    return response.json();
}

export async function updateSong(formData, songId) {
    const responce = await fetch(`${url}/songs/update/${songId}`, {
        method: 'PATCH',
        headers:{
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    });
    return responce.json();
}


export async function verifyPasswoard(enteredPass){
    const responce = await fetch(`${url}/users/verifyPasswoard`, {
        method:'POST',
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({enteredPass})
    });
    return responce.json();
}

export async function uploadAlbum(data, count) {
    const responce = await fetch(`${url}/albums/upload/${count}`,{
        method:'POST',
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("token")}`
        },
        body: data
    });

    return responce.json();
}

// export async function fetchAllAlbums() {
//     await fetch(`${url}/albums`,{
//         method: 'GET',
//         headers:{
//             "Content-Type": "application/json"
//         }
//     })
//     .then(res => res.json())
//     .then(data =>{
//         console.log(data)
//         allAlbums =  data.data
//     });

//     return allAlbums;
// }