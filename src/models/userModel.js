const { getDb } = require('./database');

async function createUser({ name, email, password, role }) {
  const db = await getDb();

  const result = await db.run(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)` ,
    [name, email, password, role]
  );

  const created = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', [result.lastID]);
  return created;
}

async function findByEmail(email) {
  const db = await getDb();
  
  const user = await db.get(
    'SELECT id, name, email, password, role FROM users WHERE email = ?',
    [email]
  );
  
  return user;
}

async function findAllUsers() {
  const db = await getDb();
  
  const users = await db.all('SELECT * FROM users ORDER BY name');
  
  return users;
}

module.exports = {
  createUser,
  findByEmail,
  findAllUsers
};
