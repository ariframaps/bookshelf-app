let bookList = [];
const STORAGE_KEY = 'bookshelf-storage';

document.addEventListener("DOMContentLoaded", () => {
    if (isStorageExist()) {
        loadContentFromStorage();
    }

    const addBook_form = document.getElementById("addBook-form");

    addBook_form.addEventListener("submit", (e) => {
        e.preventDefault();
        addBook();
    });

    const search_form = document.getElementById("search-container");
    search_form.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput').value;
        loadContentFromStorage(true, searchInput);
    });
});

function addBook() {
    const id = generateId();
    const titleInput = document.getElementById("titleInput").value;
    const authorInput = document.getElementById("authorInput").value;
    const yearInput = document.getElementById("yearInput").value;
    const isCompleted = document.getElementById('isCompleteCheck').checked;

    const newBook = {
        id: id,
        title: titleInput,
        author: authorInput,
        year: yearInput,
        isCompleted: isCompleted
    }

    addContentToStorage(newBook);
    loadContentFromStorage();
    document.getElementById("titleInput").value = '';
    document.getElementById("authorInput").value = '';
    document.getElementById("yearInput").value = '';
    document.getElementById("isCompleteCheck").checked = false;
    // isCompleted = false;
}

function generateId() {
    return +new Date();
}

function isStorageExist() {
    return typeof (Storage) !== undefined;
}

function updateLocalStorage() {
    const bookListStringified = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, bookListStringified);
}

function addContentToStorage(newBook) {
    bookList.push(newBook);
    updateLocalStorage();
}

function loadContentFromStorage(isSearching = false, searchInput = '') {
    const belumDibaca = document.getElementById('belumDibaca');
    belumDibaca.innerHTML = '';
    const selesaiDibaca = document.getElementById('selesaiDibaca');
    selesaiDibaca.innerHTML = '';

    if (localStorage.getItem(STORAGE_KEY) == null) {
        return;
    }
    bookList = JSON.parse(localStorage.getItem(STORAGE_KEY));
    bookListLoaded = bookList;

    if (isSearching) {
        bookListLoaded = bookList.filter(book => book.title.includes(searchInput));
    }

    for (let book of bookListLoaded) {
        const item = makeItem(book);
        if (book.isCompleted) {
            selesaiDibaca.appendChild(item);
        } else {
            belumDibaca.appendChild(item);
        }
    }
}

function makeItem(book) {
    const judul = document.createElement('h3');
    judul.innerText = book.title;

    const penulis = document.createElement('p');
    penulis.innerText = `Penulis: ${book.author}`;

    const tahun = document.createElement('p');
    tahun.innerText = `Tahun: ${book.year}`;

    const container = document.createElement('div');
    container.classList.add('item');
    container.append(judul, penulis, tahun);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Hapus';
    deleteButton.classList.add('redButton');
    deleteButton.addEventListener('click', () => {
        deleteItem(book.id);
        loadContentFromStorage();
    });

    if (book.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum dibaca';
        undoButton.classList.add('greenButton');

        undoButton.addEventListener('click', () => {
            const bookItem = findBook(book.id);
            bookItem.isCompleted = false;
            updateLocalStorage();
            loadContentFromStorage();
        });

        container.append(undoButton, deleteButton);
    } else {
        const doneButton = document.createElement('button');
        doneButton.innerText = 'Selesai dibaca';
        doneButton.classList.add('greenButton');

        doneButton.addEventListener('click', () => {
            const bookItem = findBook(book.id);
            bookItem.isCompleted = true;
            updateLocalStorage();
            loadContentFromStorage();
        });

        container.append(doneButton, deleteButton);
    }

    return container;
}

function deleteItem(bookId) {
    const bookIndex = findBookIndex(bookId);

    // const customDialog = document.getElementById('custom-dialog');
    // customDialog.style.visibility = 'visible';



    bookList.splice(bookIndex, 1);
    updateLocalStorage();
    loadContentFromStorage();
}

function findBookIndex(bookId) {
    for (const index in bookList) {
        if (bookList[index].id == bookId) return index;
    }
}

function findBook(bookId) {
    for (const book of bookList) {
        if (book.id == bookId) return book;
    }
}