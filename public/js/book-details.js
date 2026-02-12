
let currentBookId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadBookDetails();
    setupTabs();
});

function loadBookDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    currentBookId = parseInt(urlParams.get('id'));
    
    if (!currentBookId) {
        utils.showNotification('não encontrado', 'error');
        window.location.href = 'books.html';
        return;
    }
    
    const book = utils.getBookById(currentBookId);
    
    if (!book) {
        utils.showNotification('não encontrado', 'error');
        window.location.href = 'books.html';
        return;
    }
    
    displayBookDetails(book);
}

function displayBookDetails(book) {
    document.title = `${book.title} - Bibly`;
    
    document.getElementById('bookImage').src = book.image;
    document.getElementById('bookImage').alt = book.title;
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;
    
    document.getElementById('bookISBN').textContent = book.isbn;
    document.getElementById('bookCategory').textContent = book.category;
    document.getElementById('bookCategory').className = `category-tag ${book.category}`;
    document.getElementById('bookYear').textContent = book.year;
    document.getElementById('bookPublisher').textContent = book.publisher;
    document.getElementById('bookPages').textContent = book.pages;
    
    const statusElement = document.getElementById('bookStatus');
    statusElement.textContent = getStatusText(book.status);
    statusElement.className = `status-badge ${book.status}`;
    
    document.getElementById('bookDescription').textContent = book.description;
    
    document.getElementById('totalCopies').textContent = book.totalCopies;
    document.getElementById('availableCopies').textContent = book.availableCopies;
    document.getElementById('loanedCopies').textContent = book.loanedCopies;
    
    updateActionButtons(book);
}

function getStatusText(status) {
    const statusMap = {
        'disponivel': 'Disponível',
        'emprestado': 'Emprestado',
        'reservado': 'Reservado'
    };
    return statusMap[status] || status;
}

function updateActionButtons(book) {
    const loanButton = document.querySelector('button[onclick="requestLoan()"]');
    
    if (book.availableCopies > 0) {
        loanButton.disabled = false;
        loanButton.innerHTML = '<i class="fas fa-handshake"></i> Solicitar Empréstimo';
        loanButton.className = 'btn btn-primary btn-full';
    } else {
        loanButton.disabled = true;
        loanButton.innerHTML = '<i class="fas fa-times"></i> Indisponível';
        loanButton.className = 'btn btn-secondary btn-full';
    }
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(tabName);
        });
    });
}

function requestLoan() {
    const book = utils.getBookById(currentBookId);
    
    if (!book || book.availableCopies === 0) {
        utils.showNotification('não disponível para empréstimo', 'error');
        return;
    }
    
    window.location.href = `loans.html?book=${currentBookId}`;
}

function addToWishlist() {
    const book = utils.getBookById(currentBookId);
    
    if (!book) {
        utils.showNotification('Erro ao adicionar aos favoritos', 'error');
        return;
    }
    
    let wishlist = storage.load('library_wishlist') || [];
    
    if (wishlist.includes(currentBookId)) {
        utils.showNotification('Livro já está nos seus favoritos', 'error');
        return;
    }
    
    wishlist.push(currentBookId);
    storage.save('library_wishlist', wishlist);
    
    utils.showNotification(`"${book.title}" foi adicionado aos seus favoritos!`, 'success');
    
    const wishlistButton = document.querySelector('button[onclick="addToWishlist()"]');
    wishlistButton.innerHTML = '<i class="fas fa-heart"></i> Adicionado aos Favoritos';
    wishlistButton.disabled = true;
}

const bookDetailsStyles = `
    .breadcrumb {
        margin-bottom: 20px;
        font-size: 0.9rem;
        color: #7f8c8d;
    }

    .breadcrumb a {
        color: #667eea;
        text-decoration: none;
    }

    .breadcrumb a:hover {
        text-decoration: underline;
    }

    .book-details-container {
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        overflow: hidden;
    }

    .book-details-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 40px;
        padding: 40px;
    }

    .book-image-section {
        text-align: center;
    }

    .book-cover-large {
        width: 100%;
        max-width: 300px;
        height: 400px;
        object-fit: cover;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        margin-bottom: 30px;
    }

    .book-actions {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .book-info-section {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .book-header h1 {
        color: #2c3e50;
        margin-bottom: 10px;
        font-size: 2.5rem;
        line-height: 1.2;
    }

    .book-author {
        font-size: 1.3rem;
        color: #667eea;
        font-weight: 500;
    }

    .book-meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }

    .meta-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .meta-item strong {
        color: #2c3e50;
        font-size: 0.9rem;
    }

    .meta-item span {
        color: #7f8c8d;
    }

    .category-tag {
        display: inline-block;
        color: #ffffff;
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.8rem;
        text-transform: capitalize;
        width: fit-content;
        border: 1px solid #2c3e50;
    }

    .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        width: fit-content;
    }

    .status-badge.disponivel {
        background: #d4edda;
        color: #155724;
    }

    .status-badge.emprestado {
        background: #f8d7da;
        color: #721c24;
    }

    .status-badge.reservado {
        background: #fff3cd;
        color: #856404;
    }

    .book-description h3,
    .book-availability h3 {
        color: #2c3e50;
        margin-bottom: 15px;
        font-size: 1.3rem;
    }

    .book-description p {
        line-height: 1.6;
        color: #555;
        text-align: justify;
    }

    .availability-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .availability-item {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #555;
    }

    .availability-item i {
        color: #667eea;
        width: 20px;
    }

    .book-additional-info {
        border-top: 1px solid #e9ecef;
        padding: 40px;
    }

    .tabs {
        display: flex;
        border-bottom: 2px solid #e9ecef;
        margin-bottom: 30px;
    }

    .tab-button {
        background: none;
        border: none;
        padding: 15px 25px;
        cursor: pointer;
        font-size: 1rem;
        color: #7f8c8d;
        border-bottom: 3px solid transparent;
        transition: all 0.3s ease;
    }

    .tab-button.active,
    .tab-button:hover {
        color: #667eea;
        border-bottom-color: #667eea;
    }

    .tab-content {
        display: none;
    }

    .tab-content.active {
        display: block;
    }

    .reviews-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
    }

    .rating-summary {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .stars {
        color: #ffc107;
    }

    .review-item {
        padding: 20px;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        margin-bottom: 15px;
    }

    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .review-stars {
        color: #ffc107;
    }

    .review-item p {
        margin-bottom: 10px;
        line-height: 1.5;
    }

    .review-item small {
        color: #7f8c8d;
    }

    .history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        margin-bottom: 10px;
    }

    .history-status.returned {
        color: #28a745;
        font-weight: 500;
    }

    .similar-books-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
    }

    .similar-book {
        text-align: center;
        padding: 15px;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        transition: transform 0.3s ease;
    }

    .similar-book:hover {
        transform: translateY(-5px);
    }

    .similar-book img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .similar-book h4 {
        font-size: 0.9rem;
        margin-bottom: 5px;
        color: #2c3e50;
    }

    .similar-book p {
        font-size: 0.8rem;
        color: #7f8c8d;
        margin-bottom: 10px;
    }

    .btn-sm {
        padding: 6px 12px;
        font-size: 0.8rem;
    }

    @media (max-width: 768px) {
        .book-details-grid {
            grid-template-columns: 1fr;
            padding: 20px;
        }
        
        .book-header h1 {
            font-size: 2rem;
        }
        
        .book-meta {
            grid-template-columns: 1fr;
        }
        
        .tabs {
            flex-wrap: wrap;
        }
        
        .tab-button {
            flex: 1;
            min-width: 120px;
        }
        
        .similar-books-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = bookDetailsStyles;
document.head.appendChild(styleSheet);
