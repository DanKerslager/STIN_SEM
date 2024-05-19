// script.js

function showForm() {
    document.getElementById("registrationForm").classList.remove("hidden");
}

function hideForm() {
    document.getElementById("registrationForm").classList.add("hidden");
}

export { showForm, hideForm };