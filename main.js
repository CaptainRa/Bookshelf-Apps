const bookshelf = [];
const RENDER_EVENT = 'render-bookshelf';

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()){
        loadDataFromStorage();
    }
});

function addBook(){
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const yearS = (document.getElementById('inputBookYear').value);
    const year = Number(yearS);

    const generateID = generateId();
    const bookObject = generateBookObject(generateID,title,author,year, false);

    bookshelf.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId(){
    return +new Date();
}

function generateBookObject(id, title,author,year, isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(bookshelf);
    const unreadBook = document.getElementById('incompleteBookshelfList');
    unreadBook.innerHTML='';

    const doneRead = document.getElementById('completeBookshelfList');
    doneRead.innerHTML = '';

    for (const bookItem of bookshelf) {
        const bookElement = makeBookshelf(bookItem);
        //unreadBook.append(bookElement);
        if (!bookItem.isComplete)
            unreadBook.append(bookElement);
        else
            doneRead.append(bookElement);
    }
});

function makeBookshelf(bookObject) {
    
    const title = document.createElement('h2');
    title.innerText = bookObject.title;
    
    const author = document.createElement('p');
    author.innerText = 'Penulis: '+ `${bookObject.author}`;

    const year = document.createElement('p');
    year.innerText = 'Tahun: '+`${bookObject.year}`;
    
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book_item');
    bookContainer.append(title,author,year);
    
    const container = document.createElement('div');
    container.classList.add('book_item');
    container.append(bookContainer);
    container.setAttribute('id', `bookshelf-${bookObject.id}`);

    if (bookObject.isComplete){
        const undo = document.createElement('button');
        undo.innerText="Belum Selesai Dibaca";
        undo.classList.add('green');
        
        undo.addEventListener('click', function(){
            undoBookFromDone(bookObject.id);
        });

        const trash = document.createElement('button');
        trash.innerText = "Hapus Buku";
        trash.classList.add('red');
        trash.addEventListener('click', function(){
            removeBook(bookObject.id);
            window.alert('Buku akan dihapus dari daftar!');
        });

        container.append(undo,trash);
    } else {
        const done = document.createElement('button');
        done.innerText = "Selesai Dibaca";
        done.classList.add('green');
        
        done.addEventListener('click', function(){
            window.alert('Selamat! Anda telah menyelesaikan satu buku!')
            addBookToDone(bookObject.id);
        });
        
        const trash = document.createElement('button');
        trash.innerText = "Hapus Buku";
        trash.classList.add('red');
        trash.addEventListener('click', function(){
            removeBook(bookObject.id);
            window.alert('Buku akan dihapus dari daftar!');
        });
        
        container.append(done, trash);
    }
    
    function addBookToDone(bookId){
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = true;

        document.dispatchEvent(new Event (RENDER_EVENT));
        saveData();
    }
    
    function findBook(bookId){
        for (const bookItem of bookshelf){
            if (bookItem.id === bookId){
                return bookItem;
            }
        }
        return null;
    }

    function removeBook(bookId){
        const bookTarget = findBookIndex(bookId);
        
        if (bookTarget === -1) return;
        
        bookshelf.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function undoBookFromDone(bookId){
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBookIndex(bookId){
        for (const index in bookshelf){
            if (bookshelf[index].id === bookId){
                return index;
            }
        }
        return -1;
    }
 
    return container;
}

function saveData(){
    if (isStorageExist()){
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist(){
    if (typeof(Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null){
        for (const book of data){
            bookshelf.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}