
let selectedUser = null;
let selectedBook = null;

document.addEventListener('DOMContentLoaded', function() {
    setupLoanTabs();
    setupNewLoanForm();
    loadActiveLoans();
    loadLoanHistory();
    checkPreselectedBook();
});

function setupLoanTabs() {
}

function showLoanTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    const selectedTab = document.getElementById(`${tabName}-loan`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const activeButton = document.querySelector(`[onclick="showLoanTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function setupNewLoanForm() {
    const newLoanForm = document.getElementById('newLoanForm');
    if (newLoanForm) {
        newLoanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processNewLoan();
        });
    }

    const loanDateInput = document.getElementById('loanDate');
    const returnDateInput = document.getElementById('returnDate');
    
    if (loanDateInput && returnDateInput) {
        const today = utils.getCurrentDate();
        const returnDate = new Date();
        
        loanDateInput.value = today;
        returnDateInput.value = returnDate.toISOString().split('T')[0];
    }
}

function checkPreselectedBook() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('book');
    
    if (bookId) {
        const book = utils.getBookById(parseInt(bookId));
        if (book) {
            selectBook(book);
        }
    }
}

function searchUser() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const resultsDiv = document.getElementById('userResults');
    
    if (searchTerm.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    const users = mockData.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.cpf.includes(searchTerm)
    );
    
    if (users.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">Nenhum usuário encontrado</div>';
        return;
    }
    
    resultsDiv.innerHTML = users.map(user => `
        <div class="search-result-item" onclick="selectUser(${user.id})">
            <div class="user-info">
                <strong>${user.name}</strong>
                <p>${user.email}</p>
                <small>CPF: ${user.cpf}</small>
            </div>
        </div>
    `).join('');
}

function searchBook() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    const resultsDiv = document.getElementById('bookResults');
    
    if (searchTerm.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    const books = mockData.books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.includes(searchTerm)
    ).filter(book => book.availableCopies > 0);
    
    if (books.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">Nenhum livro disponível encontrado</div>';
        return;
    }
    
    resultsDiv.innerHTML = books.map(book => `
        <div class="search-result-item" onclick="selectBook(${book.id})">
            <img src="${book.image}" alt="${book.title}">
            <div class="book-info">
                <strong>${book.title}</strong>
                <p>${book.author}</p>
                <small>ISBN: ${book.isbn} | ${book.availableCopies} disponíveis</small>
            </div>
        </div>
    `).join('');
}

function selectUser(userId) {
    const user = utils.getUserById(userId);
    if (!user) return;
    
    selectedUser = user;
    
    // Atualizar interface
    document.getElementById('selectedUserName').textContent = user.name;
    document.getElementById('selectedUserEmail').textContent = user.email;
    document.getElementById('selectedUserCPF').textContent = `CPF: ${user.cpf}`;
    document.getElementById('selectedUser').style.display = 'block';
    
    // Limpar busca
    document.getElementById('userSearch').value = '';
    document.getElementById('userResults').innerHTML = '';
}

function selectBook(bookId) {
    const book = typeof bookId === 'object' ? bookId : utils.getBookById(bookId);
    if (!book) return;
    
    selectedBook = book;
    
    // Atualizar interface
    document.getElementById('selectedBookImage').src = book.image;
    document.getElementById('selectedBookTitle').textContent = book.title;
    document.getElementById('selectedBookAuthor').textContent = book.author;
    document.getElementById('selectedBookISBN').textContent = `ISBN: ${book.isbn}`;
    document.getElementById('selectedBook').style.display = 'block';
    
    // Limpar busca
    document.getElementById('bookSearch').value = '';
    document.getElementById('bookResults').innerHTML = '';
}

function clearSelectedUser() {
    selectedUser = null;
    document.getElementById('selectedUser').style.display = 'none';
}

function clearSelectedBook() {
    selectedBook = null;
    document.getElementById('selectedBook').style.display = 'none';
}

function clearLoanForm() {
    clearSelectedUser();
    clearSelectedBook();
    document.getElementById('newLoanForm').reset();
    
    const today = utils.getCurrentDate();
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14);
    
    document.getElementById('loanDate').value = today;
    document.getElementById('returnDate').value = returnDate.toISOString().split('T')[0];
}

function processNewLoan() {
    if (!selectedUser) {
        utils.showNotification('Selecione um usuário', 'error');
        return;
    }
    
    if (!selectedBook) {
        utils.showNotification('Selecione um livro', 'error');
        return;
    }
    
    const loanDate = document.getElementById('loanDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const notes = document.getElementById('loanNotes').value;
    
    if (!loanDate || !returnDate) {
        utils.showNotification('Preencha as datas do empréstimo', 'error');
        return;
    }
    
    if (new Date(returnDate) <= new Date(loanDate)) {
        utils.showNotification('A data de devolução deve ser posterior à data do empréstimo', 'error');
        return;
    }
    
    const newLoan = {
        id: Date.now(),
        userId: selectedUser.id,
        bookId: selectedBook.id,
        loanDate: loanDate,
        dueDate: returnDate,
        status: 'active',
        notes: notes,
        createdAt: new Date().toISOString()
    };
    
    mockData.loans.push(newLoan);
    storage.save('library_loans', mockData.loans);
    
    selectedBook.availableCopies--;
    selectedBook.loanedCopies++;
    if (selectedBook.availableCopies === 0) {
        selectedBook.status = 'emprestado';
    }
    storage.save('library_books', mockData.books);
    
    utils.showNotification(`Empréstimo realizado com sucesso! ID: ${newLoan.id}`, 'success');
    
    clearLoanForm();
    
    loadActiveLoans();
}

function loadActiveLoans() {
    const tableBody = document.getElementById('activeLoansTable');
    if (!tableBody) return;
    
    const activeLoans = mockData.loans.filter(loan => 
        loan.status === 'active' || loan.status === 'overdue'
    );
    
    if (activeLoans.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Nenhum empréstimo ativo encontrado</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = activeLoans.map(loan => {
        const user = utils.getUserById(loan.userId);
        const book = utils.getBookById(loan.bookId);
        const isOverdue = new Date(loan.dueDate) < new Date();
        const status = isOverdue ? 'overdue' : 'active';
        
        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <strong>${user ? user.name : 'Usuário não encontrado'}</strong>
                        <small>${user ? user.email : ''}</small>
                    </div>
                </td>
                <td>
                    <div class="book-cell">
                        <strong>${book ? book.title : 'Livro não encontrado'}</strong>
                        <small>${book ? book.author : ''}</small>
                    </div>
                </td>
                <td>${utils.formatDate(loan.loanDate)}</td>
                <td>${utils.formatDate(loan.dueDate)}</td>
                <td><span class="status-badge ${status}">${status === 'overdue' ? 'Atrasado' : 'Ativo'}</span></td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="processReturn(${loan.id})">
                        <i class="fas fa-undo"></i> Devolver
                    </button>
                    ${status === 'active' ? 
                        `<button class="btn btn-secondary btn-sm" onclick="renewLoan(${loan.id})">
                            <i class="fas fa-refresh"></i> Renovar
                        </button>` : 
                        `<button class="btn btn-warning btn-sm" onclick="sendReminder(${loan.id})">
                            <i class="fas fa-bell"></i> Lembrete
                        </button>`
                    }
                </td>
            </tr>
        `;
    }).join('');
}

function loadLoanHistory() {
    const tableBody = document.getElementById('historyTable');
    if (!tableBody) return;
    
    const completedLoans = mockData.loans.filter(loan => 
        loan.status === 'returned' || loan.status === 'late-return'
    );
    
    if (completedLoans.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Nenhum histórico de empréstimo encontrado</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = completedLoans.map(loan => {
        const user = utils.getUserById(loan.userId);
        const book = utils.getBookById(loan.bookId);
        
        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <strong>${user ? user.name : 'Usuário não encontrado'}</strong>
                        <small>${user ? user.email : ''}</small>
                    </div>
                </td>
                <td>
                    <div class="book-cell">
                        <strong>${book ? book.title : 'Livro não encontrado'}</strong>
                        <small>${book ? book.author : ''}</small>
                    </div>
                </td>
                <td>${utils.formatDate(loan.loanDate)}</td>
                <td>${loan.returnDate ? utils.formatDate(loan.returnDate) : '-'}</td>
                <td><span class="status-badge ${loan.status}">${loan.status === 'returned' ? 'Devolvido' : 'Devolvido com Atraso'}</span></td>
                <td>${loan.notes || '-'}</td>
            </tr>
        `;
    }).join('');
}

function processReturn(loanId) {
    window.location.href = `returns.html?loan=${loanId}`;
}

function renewLoan(loanId) {
    const loan = mockData.loans.find(l => l.id === loanId);
    if (!loan) {
        utils.showNotification('Empréstimo não encontrado', 'error');
        return;
    }
    
    const newDueDate = new Date(loan.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);
    
    loan.dueDate = newDueDate.toISOString().split('T')[0];
    loan.renewalCount = (loan.renewalCount || 0) + 1;
    
    storage.save('library_loans', mockData.loans);
    
    utils.showNotification('Empréstimo renovado com sucesso!', 'success');
    loadActiveLoans();
}

function sendReminder(loanId) {
    const loan = mockData.loans.find(l => l.id === loanId);
    if (!loan) {
        utils.showNotification('Empréstimo não encontrado', 'error');
        return;
    }
    
    const user = utils.getUserById(loan.userId);
    const book = utils.getBookById(loan.bookId);
    
    utils.showNotification(`Lembrete enviado para ${user.name} sobre "${book.title}"`, 'success');
}

function searchActiveLoans() {
    const searchTerm = document.getElementById('activeLoansSearch').value.toLowerCase();
}

function filterHistory() {
}
