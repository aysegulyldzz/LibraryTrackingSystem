// Global Değişkenler ve Veri Dizisi
let books = [];
let editingId = null;

// DOM Elementleri
const bookForm = document.getElementById('bookForm');
const bookIdInput = document.getElementById('bookId');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const categoryInput = document.getElementById('category');
const pageCountInput = document.getElementById('pageCount');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancel = document.getElementById('btnCancel');
const formTitle = document.getElementById('formTitle');

const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const filterStatus = document.getElementById('filterStatus');
const sortOrder = document.getElementById('sortOrder');
const btnClearFilters = document.getElementById('btnClearFilters');
const btnSampleData = document.getElementById('btnSampleData');
const btnClearAll = document.getElementById('btnClearAll');

const bookTableBody = document.getElementById('bookTableBody');

const totalCountEl = document.getElementById('totalCount');
const availableCountEl = document.getElementById('availableCount');
const borrowedCountEl = document.getElementById('borrowedCount');
const filteredCountEl = document.getElementById('filteredCount');

// Uygulama Başlangıcı
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();
    render();
});

// Event Listener Tanımlamaları
function setupEventListeners() {
    bookForm.addEventListener('submit', handleFormSubmit);
    btnCancel.addEventListener('click', resetForm);
    
    searchInput.addEventListener('input', render);
    filterCategory.addEventListener('change', render);
    filterStatus.addEventListener('change', render);
    sortOrder.addEventListener('change', render);
    
    btnClearFilters.addEventListener('click', clearFilters);
    btnSampleData.addEventListener('click', addSampleData);
    btnClearAll.addEventListener('click', clearAllBooks);
}

// LocalStorage İşlemleri
function saveToLocalStorage() {
    localStorage.setItem('library_books', JSON.stringify(books));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('library_books');
    if (data) {
        try {
            books = JSON.parse(data);
        } catch (e) {
            books = [];
        }
    }
}

// Form Gönderimi (Ekleme / Güncelleme)
function handleFormSubmit(e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const category = categoryInput.value;
    const pageCount = parseInt(pageCountInput.value);

    // Validasyon Kontrolleri
    if (!title || !author || !category || isNaN(pageCount)) {
        alert('Hiçbir alan boş bırakılamaz!');
        return;
    }
    if (title.length < 2) {
        alert('Kitap adı en az 2 karakter olmalıdır!');
        return;
    }
    if (author.length < 3) {
        alert('Yazar adı en az 3 karakter olmalıdır!');
        return;
    }
    if (pageCount <= 0) {
        alert('Sayfa sayısı pozitif bir tam sayı olmalıdır!');
        return;
    }
    if (pageCount > 5000) {
        alert('Sayfa sayısı 5000’den büyük olamaz!');
        return;
    }

    // Aynı kitap ve yazar kontrolü
    const isDuplicate = books.some(book => 
        book.title.toLowerCase() === title.toLowerCase() && 
        book.author.toLowerCase() === author.toLowerCase() && 
        book.id !== editingId
    );

    if (isDuplicate) {
        alert('Aynı kitap ve aynı yazar ikinci kez eklenemez!');
        return;
    }

    if (editingId === null) {
        // Yeni Kitap Ekleme
        const newBook = {
            id: Date.now().toString(),
            title,
            author,
            category,
            pageCount,
            isBorrowed: false,
            createdAt: Date.now()
        };
        books.push(newBook);
        alert('Kitap başarıyla eklendi.');
    } else {
        // Kitap Güncelleme
        books = books.map(book => {
            if (book.id === editingId) {
                return { ...book, title, author, category, pageCount };
            }
            return book;
        });
        alert('Kitap başarıyla güncellendi.');
        resetForm();
    }

    saveAndRefresh();
    bookForm.reset();
}

// Formu Sıfırlama / Düzenleme İptal
function resetForm() {
    editingId = null;
    formTitle.textContent = 'Yeni Kitap Ekle';
    btnSubmit.textContent = 'Kitap Ekle';
    btnCancel.style.display = 'none';
    bookForm.reset();
}

// Düzenleme Moduna Geçiş
function editBook(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    editingId = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    categoryInput.value = book.category;
    pageCountInput.value = book.pageCount;

    formTitle.textContent = 'Kitap Düzenle';
    btnSubmit.textContent = 'Değişiklikleri Kaydet';
    btnCancel.style.display = 'inline-block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Kitap Silme
function deleteBook(id) {
    if (confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
        books = books.filter(b => b.id !== id);
        if (editingId === id) resetForm();
        saveAndRefresh();
        alert('Kitap silindi.');
    }
}

// Ödünç Ver / İade Al Durum Değiştirme
function toggleBorrowStatus(id) {
    books = books.map(book => {
        if (book.id === id) {
            return { ...book, isBorrowed: !book.isBorrowed };
        }
        return book;
    });
    saveAndRefresh();
}

// Tüm Kayıtları Silme
function clearAllBooks() {
    if (books.length === 0) {
        alert('Zaten kayıtlı kitap yok.');
        return;
    }
    if (confirm('Tüm kitap kayıtlarını silmek istediğinize emin misiniz?')) {
        books = [];
        resetForm();
        saveAndRefresh();
        alert('Tüm kayıtlar silindi.');
    }
}

// Örnek Veri Ekleme
function addSampleData() {
    const sampleBooks = [
        { title: 'Suç ve Ceza', author: 'Fyodor Dostoyevski', category: 'Roman', pageCount: 671 },
        { title: 'Simyacı', author: 'Paulo Coelho', category: 'Roman', pageCount: 184 },
        { title: 'Clean Code', author: 'Robert C. Martin', category: 'Yazılım', pageCount: 464 }
    ];

    let addedCount = 0;
    sampleBooks.forEach(sample => {
        const exists = books.some(b => 
            b.title.toLowerCase() === sample.title.toLowerCase() && 
            b.author.toLowerCase() === sample.author.toLowerCase()
        );
        if (!exists) {
            books.push({
                id: Date.now().toString() + Math.random(),
                ...sample,
                isBorrowed: false,
                createdAt: Date.now()
            });
            addedCount++;
        }
    });

    if (addedCount > 0) {
        saveAndRefresh();
        alert(`${addedCount} adet örnek kitap eklendi.`);
    } else {
        alert('Örnek kitaplar zaten sistemde kayıtlı.');
    }
}

// Filtreleri Temizleme
function clearFilters() {
    searchInput.value = '';
    filterCategory.value = 'Tümü';
    filterStatus.value = 'Tümü';
    sortOrder.value = 'created';
    render();
}

// Kaydet ve Yenile Yardımcısı
function saveAndRefresh() {
    saveToLocalStorage();
    render();
}

// Filtreleme, Sıralama ve Arama Mantığı
function getFilteredAndSortedBooks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = filterCategory.value;
    const selectedStatus = filterStatus.value;
    const selectedSort = sortOrder.value;

    // Filtreleme
    let result = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                              book.author.toLowerCase().includes(searchTerm);
        
        const matchesCategory = selectedCategory === 'Tümü' || book.category === selectedCategory;
        
        const statusText = book.isBorrowed ? 'Ödünç Verildi' : 'Kütüphanede';
        const matchesStatus = selectedStatus === 'Tümü' || statusText === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sıralama (Ana diziyi değiştirmemek için kopya üzerinde işlem yapılır)
    result = [...result].sort((a, b) => {
        if (selectedSort === 'title-az') {
            return a.title.localeCompare(b.title, 'tr');
        } else if (selectedSort === 'title-za') {
            return b.title.localeCompare(a.title, 'tr');
        } else if (selectedSort === 'page-asc') {
            return a.pageCount - b.pageCount;
        } else if (selectedSort === 'page-desc') {
            return b.pageCount - a.pageCount;
        } else {
            return a.createdAt - b.createdAt; // Eklenme sırası
        }
    });

    return result;
}

// Arayüzü Güncelleme (Render)
function render() {
    const processedBooks = getFilteredAndSortedBooks();

    // Tabloyu doldur
    bookTableBody.innerHTML = '';
    if (processedBooks.length === 0) {
        bookTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Kayıt bulunamadı.</td></tr>`;
    } else {
        processedBooks.forEach((book, index) => {
            const statusText = book.isBorrowed ? 'Ödünç Verildi' : 'Kütüphanede';
            const badgeClass = book.isBorrowed ? 'badge badge-borrowed' : 'badge badge-available';
            const borrowButtonText = book.isBorrowed ? 'İade Al' : 'Ödünç Ver';
            const borrowButtonClass = book.isBorrowed ? 'btn btn-success btn-sm' : 'btn btn-warning btn-sm';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHTML(book.title)}</td>
                <td>${escapeHTML(book.author)}</td>
                <td>${escapeHTML(book.category)}</td>
                <td>${book.pageCount}</td>
                <td><span class="${badgeClass}">${statusText}</span></td>
                <td>
                    <button class="${borrowButtonClass}" onclick="toggleBorrowStatus('${book.id}')">${borrowButtonText}</button>
                    <button class="btn btn-primary btn-sm" onclick="editBook('${book.id}')">Düzenle</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteBook('${book.id}')">Sil</button>
                </td>
            `;
            bookTableBody.appendChild(tr);
        });
    }

    // Sayaçları Güncelle
    totalCountEl.textContent = books.length;
    availableCountEl.textContent = books.filter(b => !b.isBorrowed).length;
    borrowedCountEl.textContent = books.filter(b => b.isBorrowed).length;
    filteredCountEl.textContent = processedBooks.length;
}

// XSS Koruması için Basit Escape Fonksiyonu
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}