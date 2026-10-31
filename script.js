const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", function () {
navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-menu a").forEach(function (link) {
link.addEventListener("click", function () {
navMenu.classList.remove("active");
});
});
const parametros = new URLSearchParams(window.location.search);
const servicio = parametros.get("servicio");

const selectServicio = document.getElementById("servicio");

if (servicio && selectServicio) {

    if (servicio === "hardware") {
        selectServicio.value = "Revisión de Hardware";
    }

    if (servicio === "software") {
        selectServicio.value = "Revisión de Software";
    }

    if (servicio === "dual") {
        selectServicio.value = "Dual Guard";
    }

}
if (servicio === "capacitacion") {
    selectServicio.value = "Aprendizaje y Capacitación";
}