const reviewForm = document.querySelector("#reviewForm");
const reviewBook = document.querySelector("#reviewBook");
const reviewText = document.querySelector("#reviewText");
const reviewList = document.querySelector("#reviewList");
const reviewsSort = document.querySelector("#reviewsSort");
const stars = document.querySelectorAll("#stars button");
const ratingValue = document.querySelector("#ratingValue");

let myBooks = JSON.parse(localStorage.getItem("myBooks")) || [];
let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

let selectedRating = 0;

const readBooks = myBooks.filter(
book => book.status === "read"
);

function loadBooks() {
reviewBook.innerHTML = `         <option value="">
            Выберите прочитанную книгу         </option>
    `;


if (readBooks.length === 0) {
    reviewBook.innerHTML += `
        <option value="" disabled>
            Нет прочитанных книг
        </option>
    `;

    return;
}

readBooks.forEach((book, index) => {
    const option = document.createElement("option");

    option.value = index;
    option.textContent = book.title;

    reviewBook.appendChild(option);
});


}

stars.forEach(star => {
star.addEventListener("click", () => {


    selectedRating = Number(
        star.dataset.rating
    );

    stars.forEach(item => {
        const rating = Number(
            item.dataset.rating
        );

        item.classList.toggle(
            "active",
            rating <= selectedRating
        );
    });

    ratingValue.textContent =
        `${selectedRating} из 5`;
});


});

reviewForm.addEventListener("submit", event => {
event.preventDefault();


if (!reviewBook.value) {
    alert("Выберите прочитанную книгу");
    return;
}

if (selectedRating === 0) {
    alert("Поставьте оценку книге");
    return;
}

const text = reviewText.value.trim();

if (!text) {
    alert("Напишите отзыв");
    return;
}

const book =
    readBooks[Number(reviewBook.value)];

const newReview = {
    id: Date.now(),
    bookKey: book.key,
    bookTitle: book.title,
    author: book.author || "Автор неизвестен",
    cover: book.cover || "",
    username: "Kirill",
    rating: selectedRating,
    text: text,
    date: new Date().toLocaleDateString(
        "ru-RU"
    )
};

reviews.unshift(newReview);

localStorage.setItem(
    "reviews",
    JSON.stringify(reviews)
);

reviewForm.reset();

selectedRating = 0;

stars.forEach(star => {
    star.classList.remove("active");
});

ratingValue.textContent =
    "Выберите оценку";

renderReviews();


});

function renderReviews() {
reviewList.innerHTML = "";


if (reviews.length === 0) {
    reviewList.innerHTML = `
        <div class="empty-reviews">
            <h3>Пока нет отзывов</h3>
            <p>
                Стань первым, кто оставит отзыв о прочитанной книге.
            </p>
        </div>
    `;

    return;
}

let sortedReviews = [...reviews];

if (reviewsSort.value === "high") {
    sortedReviews.sort(
        (a, b) => b.rating - a.rating
    );
}

if (reviewsSort.value === "low") {
    sortedReviews.sort(
        (a, b) => a.rating - b.rating
    );
}

sortedReviews.forEach(review => {

    const reviewCard =
        document.createElement("article");

    reviewCard.className =
        "review-card";

    const fullStars =
        "★".repeat(review.rating);

    const emptyStars =
        "☆".repeat(5 - review.rating);

    reviewCard.innerHTML = `
        <div class="review-head">

            <div class="review-user">

                <div class="user-avatar">
                    ${review.username.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h3>
                        ${review.username}
                    </h3>

                    <span>
                        ${review.date}
                    </span>
                </div>

            </div>

            <div class="review-rating">
                ${fullStars}${emptyStars}
            </div>

        </div>

        <div class="review-book">

            <div class="mini-cover">

                ${
                    review.cover
                        ? `<img src="${review.cover}" alt="${review.bookTitle}">`
                        : "BOOK"
                }

            </div>

            <div>
                <h4>
                    ${review.bookTitle}
                </h4>

                <p>
                    ${review.author}
                </p>
            </div>

        </div>

        <p class="review-text">
            ${review.text}
        </p>
    `;

    reviewList.appendChild(reviewCard);
});


}

reviewsSort.addEventListener(
"change",
renderReviews
);

loadBooks();
renderReviews();
