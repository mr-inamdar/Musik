/* ==========================================================================
   SINGUP.JS — signup form validation
   ========================================================================== */

const signupForm = document.getElementById("signupForm");
const nameInp = document.getElementById("nameInp");
const emailInp = document.getElementById("emailInp");
const passwordInp = document.getElementById("passwordInp");
const confirmPasswordInp = document.getElementById("confirmPasswordInp");
const submitBtn = document.getElementById("submitBtn");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const matchHint = document.getElementById("matchHint");

/* ---------------- 1. Password Show/Hide (dono fields ke liye) ---------------- */
function setupPasswordToggle(toggleBtnId, inputEl) {
    const toggleBtn = document.getElementById(toggleBtnId);
    toggleBtn.addEventListener("click", () => {
        const isPassword = inputEl.type === "password";
        inputEl.type = isPassword ? "text" : "password";
        toggleBtn.innerHTML = isPassword
            ? `<i class="bi bi-eye-slash"></i>`
            : `<i class="bi bi-eye"></i>`;
    });
}
setupPasswordToggle("togglePassword1", passwordInp);
setupPasswordToggle("togglePassword2", confirmPasswordInp);

/* ---------------- 2. Error helpers ---------------- */
function setFieldError(inputEl, errorEl, message) {
    inputEl.closest(".input-wrap").classList.add("has-error");
    errorEl.textContent = message;
    errorEl.classList.add("show");
}
function clearFieldError(inputEl, errorEl) {
    inputEl.closest(".input-wrap").classList.remove("has-error");
    errorEl.classList.remove("show");
}
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ---------------- 3. Live "password match" check ---------------- */
function checkPasswordsMatch() {
    if (confirmPasswordInp.value.length === 0) {
        matchHint.classList.remove("show", "ok", "error");
        return;
    }

    const isMatching = passwordInp.value === confirmPasswordInp.value;
    matchHint.classList.add("show");
    matchHint.classList.toggle("ok", isMatching);
    matchHint.classList.toggle("error", !isMatching);
    matchHint.innerHTML = isMatching
        ? `<i class="bi bi-check-circle"></i> Passwords match`
        : `<i class="bi bi-x-circle"></i> Passwords do not match`;
}

passwordInp.addEventListener("input", checkPasswordsMatch);
confirmPasswordInp.addEventListener("input", checkPasswordsMatch);

/* ---------------- 4. Form Submit ---------------- */
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let isFormValid = true;

    if (nameInp.value.trim().length === 0) {
        setFieldError(nameInp, nameError, "Please enter your name");
        isFormValid = false;
    } else {
        clearFieldError(nameInp, nameError);
    }

    if (!isValidEmail(emailInp.value.trim())) {
        setFieldError(emailInp, emailError, "Please enter a valid email address");
        isFormValid = false;
    } else {
        clearFieldError(emailInp, emailError);
    }

    if (passwordInp.value.length < 6) {
        setFieldError(passwordInp, passwordError, "Password must be at least 6 characters");
        isFormValid = false;
    } else {
        clearFieldError(passwordInp, passwordError);
    }

    if (passwordInp.value !== confirmPasswordInp.value) {
        checkPasswordsMatch();
        isFormValid = false;
    }

    if (!isFormValid) return;

    // ---- Yahan se asli signup API call hogi ----
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account...";

    setTimeout(() => {
        // TODO: fetch("/signup", { method: "POST", body: ... }) yahan lagao
        submitBtn.textContent = "Sign Up";
        submitBtn.disabled = false;
        alert("Demo: account created! (Yahan real API call jodni hai)");
    }, 1200);
});
