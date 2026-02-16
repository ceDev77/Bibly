const path = require('path');
const express = require('express');
const session = require('express-session');
const indexRoutes = require('./src/routes/indexRoutes');
const booksRoutes = require('./src/routes/booksRoutes');
const loansRoutes = require('./src/routes/loansRoutes');
const returnsRoutes = require('./src/routes/returnsRoutes');
const usersRoutes = require('./src/routes/usersRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'bibly-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/usuarios', usersRoutes);
app.use('/', indexRoutes);
app.use('/livros', booksRoutes);
app.use('/emprestimos', loansRoutes);
app.use('/devolucoes', returnsRoutes);
app.use('/', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});