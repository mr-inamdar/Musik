
import { uploadSong } from "./api.js";
// Image Preview
const imageInput=document.getElementById("imageInput");
const imagePreview=document.getElementById("imagePreview");

imageInput.addEventListener("change",function(){

const file=this.files[0];

if(file){

    imagePreview.src=URL.createObjectURL(file);
    imagePreview.style.display="block";

}

});

// Audio Preview

const audioInput=document.getElementById("audioInput");
const audioPreview=document.getElementById("audioPreview");

audioInput.addEventListener("change",function(){

    const file=this.files[0];

    if(file){

    audioPreview.src=URL.createObjectURL(file);
    audioPreview.style.display="block";

    }

});

// Simple Validation

document.querySelector("form").addEventListener("submit",function(e){

    if(!imageInput.files.length){

        alert("Please select an image.");
        e.preventDefault();
        return;

    }

    if(!audioInput.files.length){

        alert("Please select an audio file.");
        e.preventDefault();
        return;

    }

});

// Upload Function


async function uploadSongCaller() {

    const formData = new FormData();

    formData.append("title", document.getElementById("titleInp").value);
    formData.append("artist", document.getElementById("artistInp").value);
    formData.append("image", imageInput.files[0]);
    formData.append("audio", audioInput.files[0]);

    if (localStorage.getItem('token')) {
        await uploadSong(formData);
    }
    else{
        window.alert('Login Fisrt');
    }

    window.location.href = 'index.html';

}

const form = document.querySelector(".form-box");
const uploadBtn = document.getElementById("uploadBtn");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    uploadBtn.disabled = true;
    uploadBtn.innerText = "Uploading...";

    try {

        await uploadSongCaller();

    } finally {

        uploadBtn.disabled = false;
        uploadBtn.innerText = "Upload Song";

    }

});