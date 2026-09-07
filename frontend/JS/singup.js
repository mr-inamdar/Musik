// const url = "http://localhost:4000";

import { singIn } from "./api.js";

// const url = 'https://musik-ayb8.onrender.com';
const submitBtn = document.getElementById("submitBtn");

document.getElementById("signupForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Please Wait...";

    const name = document.getElementById("nameInp").value;
    const email = document.getElementById("emailInp").value;
    const password = document.getElementById("passwordInp");
    const confirmPassword = document.getElementById("confirmPasswordInp");

    if (password.value !== confirmPassword.value) {

        alert("Password and Confirm Password do not match.");

        password.value = "";
        confirmPassword.value = "";

        // Button reset
        submitBtn.disabled = false;
        submitBtn.innerText = "Sign Up";

        return;
    }

    try {

        await singIn(
            name,
            email,
            password.value
        );

    } catch (error) {

        console.error("Signup error:", error);

        alert(
            error.message || "Something went wrong. Please try again."
        );

    } finally {

        submitBtn.disabled = false;
        submitBtn.innerText = "Sign Up";

    }

});