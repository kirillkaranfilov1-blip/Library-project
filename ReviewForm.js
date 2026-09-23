const openReviewForm = document.querySelector("#openReviewForm");
const closeReviewForm = document.querySelector("#closeReviewForm");
const reviewFormBox = document.querySelector("#reviewFormBox");

openReviewForm.addEventListener("click", () => {
    reviewFormBox.classList.add("show");
    openReviewForm.style.display = "none";

    reviewFormBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

closeReviewForm.addEventListener("click", () => {
    reviewFormBox.classList.remove("show");
    openReviewForm.style.display = "block";
});