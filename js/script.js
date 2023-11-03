let bookList = [];
const STORAGE_KEY = 'bookshelf-storage';

document.addEventListener("DOMContentLoaded", () => {
    if (isStorageExist()) {
        loadContentFromStorage();
    }

    const inputs = document.querySelectorAll('input[type="text"]');
    for (let input of inputs) {
        const placeholder = input.placeholder;
        input.addEventListener("focus", () => {
            input.removeAttribute('placeholder');
        });
        input.addEventListener("blur", () => {
            input.setAttribute('placeholder', placeholder);
        });
    }

    const addBook_form = document.getElementById("addBook-form");
    addBook_form.addEventListener("submit", (e) => {
        e.preventDefault();
        addBook();
        const searchInput = document.getElementById('searchInput').value;
        loadContentFromStorage(searchInput);
    });

    const search_form = document.getElementById("search-container");
    search_form.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput').value;
        loadContentFromStorage(searchInput);
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
    document.getElementById("titleInput").value = '';
    document.getElementById("authorInput").value = '';
    document.getElementById("yearInput").value = '';
    document.getElementById("isCompleteCheck").checked = false;
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

function loadContentFromStorage(searchInput = '') {
    const belumDibaca = document.getElementById('belumDibaca');
    belumDibaca.innerHTML = '';
    const selesaiDibaca = document.getElementById('selesaiDibaca');
    selesaiDibaca.innerHTML = '';

    if (localStorage.getItem(STORAGE_KEY) == null) {
        return;
    }
    bookList = JSON.parse(localStorage.getItem(STORAGE_KEY));
    let bookListLoaded = bookList.filter(book => book.title.includes(searchInput));

    for (let book of bookListLoaded) {
        const item = makeItem(book, bookListLoaded);
        if (book.isCompleted) {
            selesaiDibaca.appendChild(item);
        } else {
            belumDibaca.appendChild(item);
        }
    }
}

function makeItem(book, bookListLoaded) {
    const judul = document.createElement('h3');
    judul.innerText = book.title;

    const penulis = document.createElement('p');
    penulis.innerText = `Penulis: ${book.author}`;

    const tahun = document.createElement('p');
    tahun.innerText = `Tahun: ${book.year}`;

    const container = document.createElement('div');
    container.classList.add('item');
    container.setAttribute('id', book.id);
    container.append(judul, penulis, tahun);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Hapus';
    deleteButton.classList.add('redButton');
    deleteButton.addEventListener('click', () => {
        const isSure = confirm('Anda yakin ingin menghapus buku?');
        if (isSure) {
            deleteItem(book.id, bookListLoaded);
        }
    });

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('editButton');
    editButton.addEventListener('click', () => {
        editBook(book.id, bookListLoaded);
    });

    if (book.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum dibaca';
        undoButton.classList.add('greenButton');

        undoButton.addEventListener('click', () => {
            const bookItem = findBook(book.id, bookListLoaded);
            bookItem.isCompleted = false;
            updateLocalStorage();

            const searchInput = document.getElementById('searchInput').value;
            loadContentFromStorage(searchInput);
        });

        container.append(undoButton, deleteButton, editButton);
    } else {
        const doneButton = document.createElement('button');
        doneButton.innerText = 'Selesai dibaca';
        doneButton.classList.add('greenButton');

        doneButton.addEventListener('click', () => {
            const bookItem = findBook(book.id, bookListLoaded);
            bookItem.isCompleted = true;
            updateLocalStorage();

            const searchInput = document.getElementById('searchInput').value;
            loadContentFromStorage(searchInput);
        });

        container.append(doneButton, deleteButton, editButton);
    }

    return container;
}

function deleteItem(bookId, bookListLoaded) {
    const item = document.getElementById(bookId);
    item.innerHTML = 'Buku berhasil dihapus';

    setTimeout(() => {
        const bookLoadedFind = findBook(bookId, bookListLoaded);
        const bookIndex = findBookIndex(bookLoadedFind.id, bookList);
        bookList.splice(bookIndex, 1);

        updateLocalStorage();

        const searchInput = document.getElementById('searchInput').value;
        loadContentFromStorage(searchInput);
    }, 2000);
}

function editBook(bookId, bookListLoaded) {
    const bookFind = findBook(bookId, bookListLoaded);
    const bookEdited = findBook(bookFind.id, bookList);

    const title = prompt("Judul buku");
    const author = prompt("Penulis buku");
    const tahun = prompt("Tahun rilis");

    if ((title == null || '') || (author == null || '') || (tahun == null || '')) {
        alert('Gagal update buku, data tidak boleh ada yang kosong');
    } else {
        bookEdited.title = title;
        bookEdited.author = author;
        bookEdited.tahun = tahun;

        updateLocalStorage();
        const searchInput = document.getElementById('searchInput').value;
        loadContentFromStorage(searchInput);
    }


    // const item = document.getElementById(bookId);
    // const addBookContainer = document.getElementById('addBook-container');
    // const actionStatus = document.getElementById('action-status');
    // const titleInput = document.getElementById("titleInput");
    // const authorInput = document.getElementById("authorInput");
    // const yearInput = document.getElementById("yearInput");
    // const isCompleted = document.getElementById('isCompleteLabel');
    // const submitButton = document.getElementById("submitButton");
    // const submitEdit = document.getElementById("submitEdit");

    // const bookFind = findBook(bookId, bookListLoaded);
    // const bookEdited = findBook(bookFind.id, bookList);

    // const addBookContainerTemp = addBookContainer.style.backgroundColor;
    // const actionStatusTemp = actionStatus.innerText;
    // const itemTemp = item.style.backgroundColor;

    // addBookContainer.style.backgroundColor = "#b43111";
    // item.style.backgroundColor = "#f8e7dc";
    // actionStatus.innerText = "Edit Buku";
    // titleInput.value = bookEdited.title;
    // authorInput.value = bookEdited.author;
    // yearInput.value = bookEdited.year;
    // isCompleted.style.visibility = "hidden";
    // submitEdit.style.visibility = "visible";
    // submitButton.style.visibility = "hidden";
    // submitButton.disabled = true;

    // submitEdit.addEventListener("click", () => {
    //     console.log(bookEdited);

    // bookEdited.title = titleInput.value;
    // bookEdited.author = authorInput.value;
    // bookEdited.year = yearInput.value;

    // addBookContainer.style.backgroundColor = addBookContainerTemp;
    // item.style.backgroundColor = itemTemp;
    // actionStatus.innerText = actionStatusTemp;
    // titleInput.value = '';
    // authorInput.value = '';
    // yearInput.value = '';
    // isCompleted.style.visibility = "visible";
    // submitEdit.style.visibility = "hidden";
    // submitButton.style.visibility = "visible";
    // submitButton.disabled = false;

    // updateLocalStorage();

    // const searchInput = document.getElementById('searchInput').value;
    // loadContentFromStorage(searchInput);
    // });
}

function findBookIndex(bookId, bookListLoaded) {
    for (const index in bookListLoaded) {
        if (bookListLoaded[index].id == bookId) return index;
    }
}

function findBook(bookId, bookListLoaded) {
    for (const book of bookListLoaded) {
        if (book.id == bookId) return book;
    }
}

const submitEdit = document.getElementById("submitEdit");
submitEdit.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
});
