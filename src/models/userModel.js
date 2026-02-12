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

module.exports = {
  createUser,
};
