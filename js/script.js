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
    titleInput.value = '';
    authorInput.value = '';
    yearInput.value = '';
    isCompleted.checked = false;
}

function generateId() {
    return +new Date();
}

function isStorageExist() {
    return typeof (Storage) !== undefined;
}

function refreshStorage() {
    const bookListStringified = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, bookListStringified);
}

function addContentToStorage(newBook) {
    bookList.push(newBook);

    refreshStorage();
}

function loadContentFromStorage() {
    const belumDibaca = document.getElementById('belumDibaca');
    belumDibaca.innerHTML = '';
    const selesaiDibaca = document.getElementById('selesaiDibaca');
    selesaiDibaca.innerHTML = '';

    if (localStorage.getItem(STORAGE_KEY) == null) {
        console.log(bookList);
        return;
    }
    bookList = JSON.parse(localStorage.getItem(STORAGE_KEY));
    console.log(bookList);

    for (let book of bookList) {
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
            refreshStorage();
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
            refreshStorage();
            loadContentFromStorage();
        });

        container.append(doneButton, deleteButton);
    }

    return container;
}

function deleteItem(bookId) {
    const bookIndex = findBookIndex(bookId);
    bookList.splice(bookIndex, 1);
    refreshStorage();
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
// render localStorage dulu
// klik submit form
// buku dibuat terus dimasukkan ke localStorage
// render localStorage

// const destroy = document.querySelector('.redButton');

// destroy.addEventListener('click', () => {
//     localStorage.removeItem(STORAGE_KEY);
// });