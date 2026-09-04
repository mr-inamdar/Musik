const url = 'http://localhost:4000';
// const url = 'https://musik-ayb8.onrender.com';
const submitBtn = document.getElementById("submitBtn");

document.getElementById("loginForm").addEventListener("submit",(e)=>{

    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Please Wait...";

    const email=document.getElementById("emailInp").value;
    const password=document.getElementById("passwordInp").value;

    fetch(`${url}/auth/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
    })
    .then(res=>res.json())
    .then(data=>{

       if (data.success) {

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("Login Successful");

            window.location.href = "index.html";

        } else {

            alert(data.message);

        }

        submitBtn.disabled = false;
        submitBtn.innerText = "Login";


    })
    .catch(err => {

        console.error(err);

        submitBtn.disabled = false;
        submitBtn.innerText = "Login";

        alert("Server Error");

    });

});