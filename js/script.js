let bookList = [];
const STORAGE_KEY = 'bookshelf-storage';

document.addEventListener("DOMContentLoaded", () => {
    // cek apakah terdapat web storage di browser user
    if (isStorageExist()) {
        loadContentFromStorage();
    }

    // menghilangkan placeholder saat fokus ke input dan mengembalikannya saat blur
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

    // menambahkan buku saat form masukkan buku baru di submit
    const addBook_form = document.getElementById("addBook-form");
    addBook_form.addEventListener("submit", (e) => {
        e.preventDefault();
        addBook();
        const searchInput = document.getElementById('searchInput').value;
        loadContentFromStorage(searchInput);
    });

    // menampilkan buku sesuai dengan pencarian user saat submit kolom pencarian
    const search_form = document.getElementById("search-container");
    search_form.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput').value;
        loadContentFromStorage(searchInput);
    });
});

// fungsi merubah localStorage untuk dimasukkan ke array bookList dan merender buku di tampilan
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

// fungsi menambahkan buku baru
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
        year: parseInt(yearInput),
        isCompleted: isCompleted
    }

    addContentToStorage(newBook);
    document.getElementById("titleInput").value = '';
    document.getElementById("authorInput").value = '';
    document.getElementById("yearInput").value = '';
    document.getElementById("isCompleteCheck").checked = false;
}

// fungsi membuat elemen untuk buku baru agar bisa ditampilkan di rak buku
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

// fungsi menghapus item buku
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

// fungsi mengedit buku
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
}

// fungsi mencari buku dan mengembalikan index
function findBookIndex(bookId, bookListLoaded) {
    for (const index in bookListLoaded) {
        if (bookListLoaded[index].id == bookId) return index;
    }
}

// fungsi mencari buku dan mengembalikan objek buku
function findBook(bookId, bookListLoaded) {
    for (const book of bookListLoaded) {
        if (book.id == bookId) return book;
    }
}

// fungsi membuat id unik
function generateId() {
    return +new Date();
}

// fungsi mengecek web storage apakah ada di browser
function isStorageExist() {
    return typeof (Storage) !== undefined;
}

// fungsi update localStorage dengan cara membuat stringify dari array bookList dan set item localStorage
function updateLocalStorage() {
    const bookListStringified = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, bookListStringified);
}

// fungsi menambahkan buku baru di array bookList dan update ke localStorage
function addContentToStorage(newBook) {
    bookList.push(newBook);
    updateLocalStorage();
}