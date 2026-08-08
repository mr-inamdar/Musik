/* ==========================================================================
   UPLOADSONGFORM.JS
   ==========================================================================
   Ye file 3 kaam karti hai:
   1. Jab user image choose kare -> uska preview dikhana + filename likhna
   2. Jab user audio choose kare -> uska player preview dikhana + filename
   3. Form submit hone par basic validation + demo "uploading" state
   ========================================================================== */

const uploadForm = document.getElementById("uploadForm");
const uploadBtn = document.getElementById("uploadBtn");

const titleInp = document.getElementById("titleInp");
const artistInp = document.getElementById("artistInp");

/* ---------------- 1. Image Upload + Preview ---------------- */
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const imageFileLabel = document.getElementById("imageFileLabel");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    // filename box mein dikhao
    imageFileLabel.textContent = file.name;

    // browser mein hi preview dikhane ke liye temporary URL banao
    const previewUrl = URL.createObjectURL(file);
    imagePreview.src = previewUrl;
    imagePreview.style.display = "block";
});

/* ---------------- 2. Audio Upload + Preview ---------------- */
const audioInput = document.getElementById("audioInput");
const audioPreview = document.getElementById("audioPreview");
const audioFileLabel = document.getElementById("audioFileLabel");

audioInput.addEventListener("change", () => {
    const file = audioInput.files[0];
    if (!file) return;

    audioFileLabel.textContent = file.name;

    const previewUrl = URL.createObjectURL(file);
    audioPreview.src = previewUrl;
    audioPreview.style.display = "block";
});

/* ---------------- 3. Form Submit ---------------- */
uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (titleInp.value.trim().length === 0) {
        titleInp.focus();
        alert("Please enter a song title");
        return;
    }
    if (artistInp.value.trim().length === 0) {
        artistInp.focus();
        alert("Please enter an artist name");
        return;
    }
    if (imageInput.files.length === 0) {
        alert("Please choose a song image");
        return;
    }

    // ---- Yahan se asli upload API call hogi (jaise FormData + fetch) ----
    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";

    setTimeout(() => {
        // TODO: real upload logic yahan lagao, jaise:
        // const formData = new FormData(uploadForm);
        // await fetch("/upload-song", { method: "POST", body: formData });

        uploadBtn.textContent = "Upload Song";
        uploadBtn.disabled = false;
        alert("Demo: song uploaded! (Yahan real API call jodni hai)");
        uploadForm.reset();
        imagePreview.style.display = "none";
        audioPreview.style.display = "none";
        imageFileLabel.textContent = "Click to upload image";
        audioFileLabel.textContent = "Click to upload audio";
    }, 1400);
});
