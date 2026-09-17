const booksGrid = document.querySelector("#booksGrid");
const search = document.querySelector("#search");
const searchButton = document.querySelector(".search-box button");
const pagination = document.querySelector("#pagination");
const sortBooks = document.querySelector("#sortBooks");


const API_URL = "https://openlibrary.org/search.json";

const booksPerPage = 12;
let currentPage = 1;
let currentQuery = "subject:fiction";
let totalPages = 1;


async function getBooks(query = currentQuery, page = 1) {
    booksGrid.innerHTML = `
        <div class="loading">
            Загрузка книг...
        </div>
    `;

    pagination.innerHTML = "";

    try {
        const url = new URL(API_URL);

        url.searchParams.set("q", query);

        url.searchParams.set(
            "fields",
            "key,title,author_name,first_publish_year,cover_i,subject,ratings_average,ratings_count"
        );

        url.searchParams.set("limit", booksPerPage);
        url.searchParams.set("page", page);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Ошибка загрузки книг");
        }

        const data = await response.json();

        currentPage = page;
        currentQuery = query;

        totalPages = Math.ceil(data.numFound / booksPerPage);

        renderBooks(data.docs);
        renderPagination();

    } catch (error) {
        console.error(error);

        booksGrid.innerHTML = `
            <div class="error">
                Не удалось загрузить книги
            </div>
        `;
    }
}
function renderBooks(books) {
    if (!books.length) {
        booksGrid.innerHTML = `
            <div class="error">
                Книги не найдены
            </div>
        `;

        return;
    }

    const sortedBooks = [...books];

    if (sortBooks.value === "popular") {
        sortedBooks.sort((a, b) => {
            return (b.ratings_count || 0) - (a.ratings_count || 0);
        });
    }

    if (sortBooks.value === "rating") {
        sortedBooks.sort((a, b) => {
            return (b.ratings_average || 0) - (a.ratings_average || 0);
        });
    }

    if (sortBooks.value === "title") {
        sortedBooks.sort((a, b) => {
            return (a.title || "").localeCompare(
                b.title || "",
                "ru"
            );
        });
    }

    if (sortBooks.value === "year") {
        sortedBooks.sort((a, b) => {
            return (b.first_publish_year || 0) -
                   (a.first_publish_year || 0);
        });
    }

    booksGrid.innerHTML = "";

    sortedBooks.forEach(book => {

        const title = book.title || "Без названия";

        const author = book.author_name
            ? book.author_name[0]
            : "Автор неизвестен";

        const year = book.first_publish_year || "—";

        const rating = book.ratings_average
            ? book.ratings_average.toFixed(1)
            : "—";

        const cover = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : "";

        const genre = book.subject?.[0] || "Книга";

        const bookCard = document.createElement("article");

        bookCard.className = "book-card";

        bookCard.innerHTML = `
            <div class="book-cover">

                ${
                    cover
                        ? `<img
                            class="book-image"
                            src="${cover}"
                            alt="${title}"
                        >`
                        : `<div class="no-cover">BOOK</div>`
                }

            </div>

            <div class="book-content">

                <span class="book-genre">
                    ${genre}
                </span>

                <h3 title="${title}">
                    ${title}
                </h3>

                <p class="book-author">
                    ${author}
                </p>

                <div class="book-bottom">

                    <div class="rating">
                        ★ ${rating}
                    </div>

                    <span>
                        ${year}
                    </span>

                </div>

            </div>
        `;

        booksGrid.appendChild(bookCard);
    });
}


function renderPagination() {
    pagination.innerHTML = "";

    if (totalPages <= 1) {
        return;
    }

    const prevButton = document.createElement("button");

    prevButton.className = "page-button";
    prevButton.textContent = "←";
    prevButton.disabled = currentPage === 1;

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            getBooks(currentQuery, currentPage - 1);
        }
    });

    pagination.appendChild(prevButton);


    const maxVisiblePages = 5;

    let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
    );

    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(
            1,
            endPage - maxVisiblePages + 1
        );
    }


    if (startPage > 1) {
        addPageButton(1);

        if (startPage > 2) {
            addDots();
        }
    }


    for (let page = startPage; page <= endPage; page++) {
        addPageButton(page);
    }


    if (endPage < totalPages) {

        if (endPage < totalPages - 1) {
            addDots();
        }

        addPageButton(totalPages);
    }


    const nextButton = document.createElement("button");

    nextButton.className = "page-button";
    nextButton.textContent = "→";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            getBooks(currentQuery, currentPage + 1);
        }
    });

    pagination.appendChild(nextButton);
}


function addPageButton(page) {
    const button = document.createElement("button");

    button.className = "page-button";

    if (page === currentPage) {
        button.classList.add("active");
    }

    button.textContent = page;

    button.addEventListener("click", () => {
        if (page !== currentPage) {
            getBooks(currentQuery, page);
        }
    });

    pagination.appendChild(button);
}


function addDots() {
    const dots = document.createElement("span");

    dots.className = "pagination-dots";
    dots.textContent = "...";

    pagination.appendChild(dots);
}


function searchBooks() {
    const value = search.value.trim();

    currentPage = 1;

    if (!value) {
        getBooks("subject:fiction", 1);
        return;
    }

    getBooks(value, 1);
}


searchButton.addEventListener("click", searchBooks);


search.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchBooks();
    }
});

sortBooks.addEventListener("change", () => {
    getBooks(currentQuery, currentPage);
});
getBooks();