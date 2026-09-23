const burger = document.querySelector("#burger");
const navMenu = document.querySelector("#navMenu");

burger.addEventListener("click", () => {
const isOpen = navMenu.classList.toggle("active");

```
burger.classList.toggle("active", isOpen);
burger.setAttribute("aria-expanded", isOpen);
burger.setAttribute(
    "aria-label",
    isOpen ? "Закрыть меню" : "Открыть меню"
);
```

});

navMenu.querySelectorAll("a").forEach(link => {
link.addEventListener("click", () => {
navMenu.classList.remove("active");
burger.classList.remove("active");
burger.setAttribute("aria-expanded", "false");
burger.setAttribute("aria-label", "Открыть меню");
});
});

document.addEventListener("click", event => {
if (!burger.contains(event.target) && !navMenu.contains(event.target)) {
navMenu.classList.remove("active");
burger.classList.remove("active");
burger.setAttribute("aria-expanded", "false");
burger.setAttribute("aria-label", "Открыть меню");
}
});

window.addEventListener("resize", () => {
if (window.innerWidth > 768) {
navMenu.classList.remove("active");
burger.classList.remove("active");
burger.setAttribute("aria-expanded", "false");
}
});
