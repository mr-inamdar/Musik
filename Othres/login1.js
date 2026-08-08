const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

const url = 'http://localhost:4000';

toggle.addEventListener("click", () => {

    if(password.type === "password"){

        password.type = "text";
        toggle.classList.replace("ri-eye-line","ri-eye-off-line");

    }else{

        password.type = "password";
        toggle.classList.replace("ri-eye-off-line","ri-eye-line");

    }

});

document.getElementById("loginForm").addEventListener("submit",(e)=>{

    e.preventDefault();

    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;

    console.log({
        email,
        password
    });

    fetch(`${url}/auth/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
    })
    .then(res=>res.json())
    .then(data=>{

        localStorage.setItem(

            "token",

            data.token

        );
    });

});