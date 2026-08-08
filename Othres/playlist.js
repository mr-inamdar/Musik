// const url = 'http://localhost:4000';

// let allPlaylistSongs = [];
// fetch(`${url}/playlist`, {
//     method: 'GET',
//     headers:{
//         "Content-Type": "application/json",

//         "Authorization": `Bearer ${localStorage.getItem("token")}`
//     }
// })
// .then(res => res.json())
// .then(data =>{
//     if (!data.success) {
//        return window.alert(data.message) 
//     }

//     allPlaylistSongs = data.songs;
// });