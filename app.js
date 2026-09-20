
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

        totalPages = Math.ceil(
            data.numFound / booksPerPage
        );

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

            return (
                (b.ratings_count || 0) -
                (a.ratings_count || 0)
            );

        });
    }


    if (sortBooks.value === "rating") {

        sortedBooks.sort((a, b) => {

            return (
                (b.ratings_average || 0) -
                (a.ratings_average || 0)
            );

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

            return (
                (b.first_publish_year || 0) -
                (a.first_publish_year || 0)
            );

        });
    }


    booksGrid.innerHTML = "";


    sortedBooks.forEach(book => {

        const title =
            book.title || "Без названия";


        const author =
            book.author_name
                ? book.author_name.join(", ")
                : "Автор неизвестен";


        const year =
            book.first_publish_year || "—";


        const rating =
            book.ratings_average
                ? book.ratings_average.toFixed(1)
                : "—";


        const ratingsCount =
            book.ratings_count || 0;


        const cover =
            book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "";


        const genre =
            book.subject?.[0] || "Книга";


        const bookCard =
            document.createElement("article");


        bookCard.className =
            "book-card";


        bookCard.innerHTML = `

            <div class="book-cover">

                ${
                    cover

                    ?

                    `<img
                        class="book-image"
                        src="${cover}"
                        alt="${title}"
                    >`

                    :

                    `<div class="no-cover">
                        BOOK
                    </div>`
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


        bookCard.addEventListener(
            "click",
            () => openBookModal(book)
        );


        booksGrid.appendChild(bookCard);

    });
}


function renderPagination() {

    pagination.innerHTML = "";


    if (totalPages <= 1) {
        return;
    }


    const prevButton =
        document.createElement("button");


    prevButton.className =
        "page-button";


    prevButton.textContent =
        "←";


    prevButton.disabled =
        currentPage === 1;


    prevButton.addEventListener(
        "click",
        () => {

            if (currentPage > 1) {

                getBooks(
                    currentQuery,
                    currentPage - 1
                );

            }

        }
    );


    pagination.appendChild(
        prevButton
    );


    const maxVisiblePages = 5;


    let startPage = Math.max(
        1,
        currentPage -
        Math.floor(maxVisiblePages / 2)
    );


    let endPage =
        startPage +
        maxVisiblePages -
        1;


    if (endPage > totalPages) {

        endPage = totalPages;

        startPage = Math.max(
            1,
            endPage -
            maxVisiblePages +
            1
        );

    }


    if (startPage > 1) {

        addPageButton(1);


        if (startPage > 2) {
            addDots();
        }

    }


    for (
        let page = startPage;
        page <= endPage;
        page++
    ) {

        addPageButton(page);

    }


    if (endPage < totalPages) {

        if (
            endPage <
            totalPages - 1
        ) {

            addDots();

        }


        addPageButton(
            totalPages
        );

    }


    const nextButton =
        document.createElement("button");


    nextButton.className =
        "page-button";


    nextButton.textContent =
        "→";


    nextButton.disabled =
        currentPage === totalPages;


    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentPage <
                totalPages
            ) {

                getBooks(
                    currentQuery,
                    currentPage + 1
                );

            }

        }
    );


    pagination.appendChild(
        nextButton
    );
}


function addPageButton(page) {

    const button =
        document.createElement("button");


    button.className =
        "page-button";


    if (page === currentPage) {

        button.classList.add(
            "active"
        );

    }


    button.textContent =
        page;


    button.addEventListener(
        "click",
        () => {

            if (
                page !== currentPage
            ) {

                getBooks(
                    currentQuery,
                    page
                );

            }

        }
    );


    pagination.appendChild(
        button
    );
}


function addDots() {

    const dots =
        document.createElement("span");


    dots.className =
        "pagination-dots";


    dots.textContent =
        "...";


    pagination.appendChild(
        dots
    );
}


function searchBooks() {

    const value =
        search.value.trim();


    currentPage = 1;


    if (!value) {

        getBooks(
            "subject:fiction",
            1
        );

        return;
    }


    getBooks(
        value,
        1
    );
}


searchButton.addEventListener(
    "click",
    searchBooks
);


search.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            searchBooks();
        }

    }
);


sortBooks.addEventListener(
    "change",
    () => {

        getBooks(
            currentQuery,
            currentPage
        );

    }
);



function openBookModal(book) {

    const title =
        book.title ||
        "Без названия";


    const author =
        book.author_name
            ? book.author_name.join(", ")
            : "Автор неизвестен";


    const year =
        book.first_publish_year ||
        "Неизвестно";


    const rating =
        book.ratings_average
            ? book.ratings_average.toFixed(1)
            : "Нет рейтинга";


    const ratingsCount =
        book.ratings_count ||
        0;


    const subjects =
        book.subject
            ? book.subject
                .slice(0, 5)
                .join(", ")
            : "Жанр неизвестен";


    const cover =
        book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "";


    const modal =
        document.createElement("div");


    modal.className =
        "book-modal";


    modal.innerHTML = `

        <div class="book-modal-overlay"></div>


        <div class="book-modal-content">

            <button
                class="book-modal-close"
                type="button"
            >
                ×
            </button>


            <div class="modal-book">


                <div class="modal-cover">

                    ${
                        cover

                        ?

                        `<img
                            src="${cover}"
                            alt="${title}"
                        >`

                        :

                        `<div class="no-cover">
                            BOOK
                        </div>`
                    }

                </div>



                <div class="modal-info">


                    <span class="modal-genre">
                        ${subjects}
                    </span>


                    <h2>
                        ${title}
                    </h2>


                    <p class="modal-author">
                        ${author}
                    </p>



                    <div class="modal-details">


                        <div>

                            <span>
                                Год публикации
                            </span>

                            <strong>
                                ${year}
                            </strong>

                        </div>



                        <div>

                            <span>
                                Рейтинг
                            </span>

                            <strong>
                                ★ ${rating}
                            </strong>

                        </div>



                        <div>

                            <span>
                                Оценок
                            </span>

                            <strong>
                                ${ratingsCount.toLocaleString("ru-RU")}
                            </strong>

                        </div>


                    </div>



                    <button
                        class="add-book-btn"
                        type="button"
                    >
                        + Добавить в мои книги
                    </button>


                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    document.body.style.overflow =
        "hidden";


    const closeButton =
        modal.querySelector(
            ".book-modal-close"
        );


    const overlay =
        modal.querySelector(
            ".book-modal-overlay"
        );


    const addButton =
        modal.querySelector(
            ".add-book-btn"
        );


    closeButton.addEventListener(
        "click",
        closeModal
    );


    overlay.addEventListener(
        "click",
        closeModal
    );


    addButton.addEventListener(
        "click",
        () => {

            let myBooks =
                JSON.parse(
                    localStorage.getItem(
                        "myBooks"
                    )
                ) || [];


            const alreadyAdded =
                myBooks.some(
                    item =>
                        item.key === book.key
                );


            if (alreadyAdded) {

                addButton.textContent =
                    "✓ Уже в моих книгах";

                addButton.classList.add(
                    "added"
                );

                return;
            }


            myBooks.push({

                key:
                    book.key,

                title:
                    title,

                author:
                    author,

                year:
                    year,

                rating:
                    rating,

                ratingsCount:
                    ratingsCount,

                cover:
                    cover,

                genre:
                    subjects

            });


            localStorage.setItem(
                "myBooks",
                JSON.stringify(
                    myBooks
                )
            );


            addButton.textContent =
                "✓ Добавлено в мои книги";


            addButton.classList.add(
                "added"
            );

        }
    );


    function closeModal() {

        modal.classList.add(
            "closing"
        );


        setTimeout(
            () => {

                modal.remove();

                document.body.style.overflow =
                    "";

            },
            250
        );

    }

}



const stats =
    document.querySelectorAll(
        ".stat strong"
    );


const counters = [
    1200,
    450,
    890,
    4.8
];


function startCounter(
    element,
    target,
    duration = 1800
) {

    const startTime =
        performance.now();


    function update(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime) /
                duration,
                1
            );


        const ease =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const value =
            target * ease;


        if (target === 4.8) {

            element.textContent =
                value.toFixed(1);

        } else {

            element.textContent =
                Math.floor(value)
                    .toLocaleString("ru-RU")
                + "+";

        }


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );
}


const statsObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        stats.forEach(
                            (stat, index) => {

                                startCounter(
                                    stat,
                                    counters[index]
                                );

                            }
                        );


                        statsObserver.disconnect();

                    }

                }
            );

        },
        {
            threshold: 0.3
        }
    );


const statsSection =
    document.querySelector(
        ".stats"
    );


if (statsSection) {

    statsObserver.observe(
        statsSection
    );

}


getBooks();
