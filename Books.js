const booksGrid = document.querySelector(".my-books-grid");
const filters = document.querySelectorAll(".my-filter");
const stats = document.querySelectorAll(".my-stat strong");

let myBooks = JSON.parse(localStorage.getItem("myBooks")) || [];

myBooks = myBooks.map(book => ({
...book,
status: book.status || "unread"
}));

saveBooks();

function saveBooks() {
localStorage.setItem("myBooks", JSON.stringify(myBooks));
}

function getStatusText(status) {
if (status === "read") {
return "Прочитано";
}

if (status === "reading") {
    return "В процессе";
}

return "Не прочитано";

}

function renderBooks(filter = "all") {
booksGrid.innerHTML = "";

let books = [...myBooks];

if (filter === "read") {
    books = books.filter(book => book.status === "read");
}

if (filter === "reading") {
    books = books.filter(book => book.status === "reading");
}

if (filter === "unread") {
    books = books.filter(book => book.status === "unread");
}

if (books.length === 0) {
    booksGrid.innerHTML = `
        <div class="empty-books">
            <h3>Книг пока нет</h3>
            <p>
                Добавь книгу из каталога, чтобы она появилась здесь.
            </p>
            <a href="index.html">
                Перейти в каталог
            </a>
        </div>
    `;

    return;
}

books.forEach(book => {
    const index = myBooks.indexOf(book);

    const bookCard = document.createElement("article");
    bookCard.className = "book-card";

    const statusText = getStatusText(book.status);

    bookCard.innerHTML = `
        <div class="book-cover">

            ${
                book.cover
                    ? `
                        <img
                            class="book-image"
                            src="${book.cover}"
                            alt="${book.title || "Книга"}"
                        >
                    `
                    : `
                        <span>BOOK</span>
                    `
            }

            <div class="book-status ${book.status}">
                ${statusText}
            </div>

        </div>

        <div class="book-content">

            <span class="book-genre">
                ${book.genre || "Книга"}
            </span>

            <h3 title="${book.title || "Без названия"}">
                ${book.title || "Без названия"}
            </h3>

            <p class="book-author">
                ${book.author || "Автор неизвестен"}
            </p>

            <div class="book-bottom">

                <div class="rating">
                    ★ ${book.rating || "—"}
                </div>

                <span>
                    ${book.year || "—"}
                </span>

            </div>

            <div class="book-actions">

                <select class="status-select">
                    <option value="unread" ${book.status === "unread" ? "selected" : ""}>
                        Не прочитано
                    </option>

                    <option value="reading" ${book.status === "reading" ? "selected" : ""}>
                        В процессе
                    </option>

                    <option value="read" ${book.status === "read" ? "selected" : ""}>
                        Прочитано
                    </option>
                </select>

                <button
                    class="delete-book"
                    type="button"
                >
                    Удалить
                </button>

            </div>

        </div>
    `;

    const statusSelect =
        bookCard.querySelector(".status-select");

    const deleteButton =
        bookCard.querySelector(".delete-book");

    statusSelect.addEventListener("change", () => {
        myBooks[index].status = statusSelect.value;

        saveBooks();
        updateStats();
        renderBooks(filter);
    });

    deleteButton.addEventListener("click", () => {
        myBooks.splice(index, 1);

        saveBooks();
        updateStats();
        renderBooks(filter);
    });

    booksGrid.appendChild(bookCard);
});

}

function updateStats() {
const total = myBooks.length;

const read = myBooks.filter(
    book => book.status === "read"
).length;

const reading = myBooks.filter(
    book => book.status === "reading"
).length;

const unread = myBooks.filter(
    book => book.status === "unread"
).length;

if (stats[0]) {
    stats[0].textContent = total;
}

if (stats[1]) {
    stats[1].textContent = read;
}

if (stats[2]) {
    stats[2].textContent = reading;
}

if (stats[3]) {
    stats[3].textContent = unread;
}

}

filters.forEach((button, index) => {
button.addEventListener("click", () => {

    filters.forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");

    if (index === 0) {
        renderBooks("all");
    }

    if (index === 1) {
        renderBooks("read");
    }

    if (index === 2) {
        renderBooks("reading");
    }

    if (index === 3) {
        renderBooks("unread");
    }
});

});

updateStats();
renderBooks();