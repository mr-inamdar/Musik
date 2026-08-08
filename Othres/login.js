/* ==========================================================================
   LOGIN.JS — form validation aur password show/hide
   ========================================================================== */

const loginForm = document.getElementById("loginForm");
const emailInp = document.getElementById("emailInp");
const passwordInp = document.getElementById("passwordInp");
const submitBtn = document.getElementById("submitBtn");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

/* ---------------- 1. Password Show/Hide Toggle ---------------- */
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInp.type === "password";
    passwordInp.type = isPassword ? "text" : "password";

    // icon ko bhi eye <-> eye-slash mein badlo
    togglePassword.innerHTML = isPassword
        ? `<i class="bi bi-eye-slash"></i>`
        : `<i class="bi bi-eye"></i>`;
});

/* ---------------- 2. Chhota helper: field par error dikhana/hatana ---------------- */
function setFieldError(inputEl, errorEl, message) {
    inputEl.closest(".input-wrap").classList.add("has-error");
    errorEl.textContent = message;
    errorEl.classList.add("show");
}

function clearFieldError(inputEl, errorEl) {
    inputEl.closest(".input-wrap").classList.remove("has-error");
    errorEl.classList.remove("show");
}

/* Simple email pattern check (basic hai, backend par bhi zaroor validate karna) */
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ---------------- 3. Form Submit Handling ---------------- */
loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // demo ke liye page reload nahi karne denge

    let isFormValid = true;

    // Email check
    if (!isValidEmail(emailInp.value.trim())) {
        setFieldError(emailInp, emailError, "Please enter a valid email address");
        isFormValid = false;
    } else {
        clearFieldError(emailInp, emailError);
    }

    // Password check
    if (passwordInp.value.trim().length === 0) {
        setFieldError(passwordInp, passwordError, "Password is required");
        isFormValid = false;
    } else {
        clearFieldError(passwordInp, passwordError);
    }

    if (!isFormValid) return;

    // ---- Yahan se asli login API call hogi ----
    // Abhi ke liye ek demo "loading" state dikha rahe hain:
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    setTimeout(() => {
        // TODO: fetch("/login", { method: "POST", body: ... }) yahan lagao
        submitBtn.textContent = "Login";
        submitBtn.disabled = false;
        alert("Demo: login successful! (Yahan real API call jodni hai)");
    }, 1200);
});
