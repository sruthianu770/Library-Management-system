// ============================================
// LIBRARY MANAGEMENT SYSTEM
// ============================================


// ============================================
// INITIAL BOOK DATA
// ============================================

const defaultBooks = [
    {
        id: 1,
        title: "The C Programming Language",
        author: "Brian Kernighan",
        category: "Programming",
        year: 1988,
        status: "Available",
        member: ""
    },

    {
        id: 2,
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        category: "Programming",
        year: 2008,
        status: "Available",
        member: ""
    },

    {
        id: 3,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "Science",
        year: 1988,
        status: "Issued",
        member: "Rahul"
    },

    {
        id: 4,
        title: "Introduction to Algorithms",
        author: "Thomas Cormen",
        category: "Programming",
        year: 2009,
        status: "Available",
        member: ""
    }
];


// ============================================
// LOAD BOOKS FROM LOCAL STORAGE
// ============================================

let books =
    JSON.parse(localStorage.getItem("libraryBooks"))
    || defaultBooks;


// ============================================
// DOM ELEMENTS
// ============================================

const bookTableBody =
    document.getElementById("bookTableBody");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const bookForm =
    document.getElementById("bookForm");

const issueModal =
    document.getElementById("issueModal");

const issueForm =
    document.getElementById("issueForm");

const closeModal =
    document.getElementById("closeModal");

const issueBookId =
    document.getElementById("issueBookId");

const memberName =
    document.getElementById("memberName");


// ============================================
// SAVE BOOKS
// ============================================

function saveBooks() {

    localStorage.setItem(
        "libraryBooks",
        JSON.stringify(books)
    );

}


// ============================================
// DISPLAY BOOKS
// ============================================

function displayBooks(bookList = books) {

    bookTableBody.innerHTML = "";

    if (bookList.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }

    emptyMessage.style.display = "none";


    bookList.forEach(book => {

        const row =
            document.createElement("tr");


        let actionButton = "";


        if (book.status === "Available") {

            actionButton = `
                <button
                    class="action-btn issue-btn"
                    onclick="openIssueModal(${book.id})"
                    title="Issue Book"
                >
                    <i class="fas fa-arrow-right"></i>
                </button>
            `;

        } else {

            actionButton = `
                <button
                    class="action-btn return-btn"
                    onclick="returnBook(${book.id})"
                    title="Return Book"
                >
                    <i class="fas fa-rotate-left"></i>
                </button>
            `;

        }


        row.innerHTML = `

            <td>${book.id}</td>

            <td>
                <strong>${escapeHTML(book.title)}</strong>

                ${
                    book.member
                    ? `<br>
                       <small>
                       Issued to: ${escapeHTML(book.member)}
                       </small>`
                    : ""
                }

            </td>

            <td>${escapeHTML(book.author)}</td>

            <td>${escapeHTML(book.category)}</td>

            <td>${book.year}</td>

            <td>

                <span class="status
                    ${book.status.toLowerCase()}">

                    ${book.status}

                </span>

            </td>

            <td>

                ${actionButton}

                <button
                    class="action-btn delete-btn"
                    onclick="deleteBook(${book.id})"
                    title="Delete Book"
                >
                    <i class="fas fa-trash"></i>
                </button>

            </td>

        `;


        bookTableBody.appendChild(row);

    });

}


// ============================================
// UPDATE STATISTICS
// ============================================

function updateStatistics() {

    const total =
        books.length;

    const available =
        books.filter(
            book => book.status === "Available"
        ).length;

    const issued =
        books.filter(
            book => book.status === "Issued"
        ).length;


    const members =
        new Set(
            books
                .filter(book => book.member)
                .map(book => book.member.toLowerCase())
        ).size;


    document.getElementById("totalBooks")
        .textContent = total;

    document.getElementById("availableBooks")
        .textContent = available;

    document.getElementById("issuedBooks")
        .textContent = issued;

    document.getElementById("totalMembers")
        .textContent = members;

}


// ============================================
// ADD BOOK
// ============================================

bookForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title =
        document.getElementById("bookTitle")
            .value.trim();

    const author =
        document.getElementById("author")
            .value.trim();

    const category =
        document.getElementById("category")
            .value;

    const year =
        Number(
            document.getElementById("year")
                .value
        );


    if (!title || !author || !category || !year) {

        alert("Please fill in all fields.");

        return;

    }


    const currentYear =
        new Date().getFullYear();


    if (year < 1000 || year > currentYear) {

        alert(
            `Please enter a valid year between 1000 and ${currentYear}.`
        );

        return;

    }


    const newId =
        books.length > 0
            ? Math.max(...books.map(book => book.id)) + 1
            : 1;


    const newBook = {

        id: newId,

        title: title,

        author: author,

        category: category,

        year: year,

        status: "Available",

        member: ""

    };


    books.push(newBook);

    saveBooks();

    displayBooks();

    updateStatistics();

    bookForm.reset();


    alert("Book added successfully!");


    document.getElementById("books")
        .scrollIntoView({
            behavior: "smooth"
        });

});


// ============================================
// SEARCH BOOKS
// ============================================

searchInput.addEventListener("input", function() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredBooks =
        books.filter(book =>

            book.title
                .toLowerCase()
                .includes(searchTerm)

            ||

            book.author
                .toLowerCase()
                .includes(searchTerm)

            ||

            book.category
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(book.year)
                .includes(searchTerm)

        );


    displayBooks(filteredBooks);

});


// ============================================
// OPEN ISSUE MODAL
// ============================================

function openIssueModal(id) {

    const book =
        books.find(book => book.id === id);


    if (!book) {
        return;
    }


    if (book.status !== "Available") {

        alert("This book is already issued.");

        return;

    }


    issueBookId.value = id;

    memberName.value = "";

    issueModal.classList.add("show");

    memberName.focus();

}


// ============================================
// CLOSE MODAL
// ============================================

closeModal.addEventListener("click", function() {

    issueModal.classList.remove("show");

});


window.addEventListener("click", function(event) {

    if (event.target === issueModal) {

        issueModal.classList.remove("show");

    }

});


// ============================================
// ISSUE BOOK
// ============================================

issueForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const id =
        Number(issueBookId.value);

    const member =
        memberName.value.trim();


    if (!member) {

        alert("Please enter the member name.");

        return;

    }


    const book =
        books.find(book => book.id === id);


    if (!book) {

        alert("Book not found.");

        return;

    }


    book.status = "Issued";

    book.member = member;


    saveBooks();

    displayBooks();

    updateStatistics();


    issueModal.classList.remove("show");


    alert(
        `"${book.title}" has been issued to ${member}.`
    );

});


// ============================================
// RETURN BOOK
// ============================================

function returnBook(id) {

    const book =
        books.find(book => book.id === id);


    if (!book) {
        return;
    }


    const confirmation =
        confirm(
            `Return "${book.title}"?`
        );


    if (!confirmation) {
        return;
    }


    book.status = "Available";

    book.member = "";


    saveBooks();

    displayBooks();

    updateStatistics();


    alert("Book returned successfully!");

}


// ============================================
// DELETE BOOK
// ============================================

function deleteBook(id) {

    const book =
        books.find(book => book.id === id);


    if (!book) {
        return;
    }


    const confirmation =
        confirm(
            `Are you sure you want to delete "${book.title}"?`
        );


    if (!confirmation) {
        return;
    }


    books =
        books.filter(book => book.id !== id);


    saveBooks();

    displayBooks();

    updateStatistics();


    alert("Book deleted successfully!");

}


// ============================================
// SECURITY HELPER
// Prevent HTML injection when displaying
// user-entered text.
// ============================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================
// CURRENT YEAR
// ============================================

document.getElementById("currentYear")
    .textContent = new Date().getFullYear();


// ============================================
// INITIAL LOAD
// ============================================

displayBooks();

updateStatistics();