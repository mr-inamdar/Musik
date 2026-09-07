import { login } from "./api.js";

// const url = 'http://localhost:4000';
// const url = 'https://musik-ayb8.onrender.com';
const submitBtn = document.getElementById("submitBtn");

document.getElementById("loginForm").addEventListener("submit", async (e)=>{

    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Please Wait...";

    const email=document.getElementById("emailInp").value;
    const password=document.getElementById("passwordInp").value;

    try{
        await login(email, password);
    }catch(error){
        console.error("Signup error:", error);

        alert(
            error.message || "Something went wrong. Please try again."
        );
    }
    finally{
        submitBtn.disabled = false;
        submitBtn.innerText = "Login";
    }

});