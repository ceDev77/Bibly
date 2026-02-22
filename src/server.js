const path = require('path');
const express = require('express');
const session = require('express-session');
const indexRoutes = require('./routes/indexRoutes');
const booksRoutes = require('./routes/booksRoutes');
const loansRoutes = require('./routes/loansRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoutes');
const balanceRoutes = require('./routes/balanceRoutes');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login');
  }
  next();
}

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'bibly-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/usuarios', usersRoutes);
app.use('/', usersRoutes);
app.use('/', indexRoutes);
app.use('/livros', booksRoutes);
app.use('/emprestimos', loansRoutes);
app.use('/', authRoutes);
app.use('/', requireAdmin, balanceRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);
});