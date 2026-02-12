
const mockData = {
    users: [
        {
            id: 1,
            name: "Maria Silva",
            email: "maria@email.com",
            cpf: "123.456.789-00",
            phone: "(11) 99999-1111",
            address: "Rua das Flores, 123"
        },
        {
            id: 2,
            name: "João Santos",
            email: "joao@email.com",
            cpf: "987.654.321-00",
            phone: "(11) 99999-2222",
            address: "Av. Principal, 456"
        },
        {
            id: 3,
            name: "Ana Costa",
            email: "ana@email.com",
            cpf: "456.789.123-00",
            phone: "(11) 99999-3333",
            address: "Rua do Centro, 789"
        }
    ],
    books: [
        {
            id: 1,
            title: "Dom Casmurro",
            author: "Machado de Assis",
            isbn: "978-85-359-0277-5",
            category: "literatura",
            year: 1899,
            publisher: "Editora Ática",
            pages: 256,
            description: "Dom Casmurro é um romance escrito por Machado de Assis, publicado em 1899. A obra é narrada em primeira pessoa pelo protagonista Bentinho, que conta a história de sua vida e de seu amor por Capitu.",
            image: "images/Dom-Casmurro-Capa-do-Livro-1-machado_de_assis-2900279676.jpg",
            status: "disponivel",
            totalCopies: 5,
            availableCopies: 3,
            loanedCopies: 2
        }
    ],
    loans: [
        {
            id: 1,
            userId: 1,
            bookId: 1,
            loanDate: "2025-11-01",
            dueDate: "2024-12-21",
            status: "active",
            notes: ""
        },
        {
            id: 2,
            userId: 2,
            bookId: 1,
            loanDate: "2025-10-15",
            dueDate: "2025-10-29",
            returnDate: "2025-10-29",
            status: "returned",
            notes: "Devolvido no prazo"
        },
        {
            id: 3,
            userId: 3,
            bookId: 1,
            loanDate: "2025-09-01",
            dueDate: "2025-09-18",
            returnDate: "2025-09-18",
            status: "returned",
            notes: "Devolvido com 3 dias de atraso"
        }
    ]
};

const utils = {
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },

    daysDifference: function(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        return Math.round((secondDate - firstDate) / oneDay);
    },

    getCurrentDate: function() {
        return new Date().toISOString().split('T')[0];
    },

    validateCPF: function(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        return cpf.length === 11;
    },

    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    showNotification: function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    getUserById: function(id) {
        return mockData.users.find(user => user.id === parseInt(id));
    },

    getBookById: function(id) {
        return mockData.books.find(book => book.id === parseInt(id));
    },

    getActiveLoansForUser: function(userId) {
        return mockData.loans.filter(loan => 
            loan.userId === parseInt(userId) && 
            (loan.status === 'active' || loan.status === 'overdue')
        );
    },

    getLoansForBook: function(bookId) {
        return mockData.loans.filter(loan => 
            loan.bookId === parseInt(bookId) && 
            (loan.status === 'active' || loan.status === 'overdue')
        );
    }
};

const storage = {
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Carregar dados
    load: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    remove: function(key) {
        localStorage.removeItem(key);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input.id === 'loanDate' || input.id === 'returnDate') {
            input.value = utils.getCurrentDate();
        }
    });

    const cpfInputs = document.querySelectorAll('input[name="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    });

    const phoneInputs = document.querySelectorAll('input[name="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    });

    const savedUsers = storage.load('library_users');
    const savedBooks = storage.load('library_books');
    const savedLoans = storage.load('library_loans');

    if (savedUsers) mockData.users = savedUsers;
    if (savedBooks) mockData.books = savedBooks;
    if (savedLoans) mockData.loans = savedLoans;
});

function showTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

window.mockData = mockData;
window.utils = utils;
window.storage = storage;
