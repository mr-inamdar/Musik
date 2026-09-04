// const url = "http://localhost:4000";
const url = 'https://musik-ayb8.onrender.com';
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

        return;
    }

    await fetch(`${url}/auth/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            name,
            email,
            password: password.value

        })

    })
    .then(res => res.json())
    .then(data => {

        if (data.success) {

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("Signup & Login Successful");

            window.location.href = "index.html";

        } else {

            alert(data.message);

        }

        submitBtn.disabled = false;
        submitBtn.innerText = "Sign Up";

    })
    .catch(err => {

        console.error(err);

        submitBtn.disabled = false;
        submitBtn.innerText = "Sign Up";

        alert("Server Error");

    });

});