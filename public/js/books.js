let currentPage = 1;
let booksPerPage = 12;

document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    updatePagination();
});

function setupEventListeners() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');
    const searchInput = document.getElementById('searchInput');

    if (categoryFilter) categoryFilter.addEventListener('change', filterBooks);
    if (statusFilter) statusFilter.addEventListener('change', filterBooks);
    if (sortBy) sortBy.addEventListener('change', sortBooks);
    if (searchInput) searchInput.addEventListener('input', debounce(searchBooks, 300));
}

function getRenderedBookCards() {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return [];
    return Array.from(booksGrid.querySelectorAll('.book-card, .book-card-large'));
}

function searchBooks() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = (searchInput?.value || '').toLowerCase().trim();
    const cards = getRenderedBookCards();

    cards.forEach((card) => {
        const titleEl = card.querySelector('h3');
        const title = (titleEl?.textContent || '').toLowerCase();
        const visible = !searchTerm || title.includes(searchTerm);
        card.style.display = visible ? '' : 'none';
    });

    currentPage = 1;
    updatePagination();
}

function filterBooks() {
    searchBooks();
}

function sortBooks() {
    searchBooks();
}

function updatePagination() {
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (pageInfo) pageInfo.textContent = `Página ${currentPage}`;
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
}

function changePage() {
    updatePagination();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const bookStyles = `
    .books-grid-large {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }

    .book-card-large {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .book-card-large:hover {
        transform: translateY(-5px);
    }

    .book-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }

    .book-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .book-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .book-card-large:hover .book-overlay {
        opacity: 1;
    }

    .book-info {
        padding: 20px;
    }

    .book-info h3 {
        margin-bottom: 5px;
        color: #2c3e50;
        font-size: 1.1rem;
    }

    .book-author {
        color: #7f8c8d;
        margin-bottom: 10px;
        font-size: 0.9rem;
    }

    .book-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .category-tag {
        background: #667eea;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        text-transform: capitalize;
    }

    .year {
        color: #7f8c8d;
        font-size: 0.8rem;
    }

    .book-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
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

    .availability {
        font-size: 0.8rem;
        color: #7f8c8d;
    }

    .filters-container {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 30px;
    }

    .filters {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }

    .filter-select {
        padding: 8px 12px;
        border: 2px solid #e9ecef;
        border-radius: 5px;
        background: white;
        min-width: 150px;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 40px;
    }

    .page-info {
        font-weight: 500;
        color: #2c3e50;
    }

    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: #7f8c8d;
    }

    .no-results i {
        font-size: 3rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }

    .no-results h3 {
        margin-bottom: 10px;
        color: #2c3e50;
    }

    @media (max-width: 768px) {
        .books-grid-large {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
        
        .filters {
            flex-direction: column;
        }
        
        .filter-select {
            min-width: 100%;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = bookStyles;
document.head.appendChild(styleSheet);
