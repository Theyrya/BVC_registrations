require('dotenv').config();
const bcrypt = require('bcrypt');
const { getPool, sql } = require('./db');

async function run() {
  const pool = await getPool();
  const adminPass = process.env.ADMIN_PASS || 'admin123';
  const adminHash = await bcrypt.hash(adminPass, 10);

  const ddl = `
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
  CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(500) NOT NULL,
    isAdmin BIT DEFAULT 0,
    createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    updatedAt DATETIME2
  );
END

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Courses]') AND type in (N'U'))
BEGIN
  CREATE TABLE Courses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) NOT NULL,
    name NVARCHAR(255) NOT NULL,
    term NVARCHAR(50),
    credits INT DEFAULT 0,
    description NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    updatedAt DATETIME2
  );
END

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Registrations]') AND type in (N'U'))
BEGIN
  CREATE TABLE Registrations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    studentId INT NOT NULL,
    courseId INT NOT NULL,
    term NVARCHAR(50),
    createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (studentId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES Courses(id) ON DELETE CASCADE
  );
END

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Messages]') AND type in (N'U'))
BEGIN
  CREATE TABLE Messages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    subject NVARCHAR(255),
    body NVARCHAR(MAX) NOT NULL,
    createdAt DATETIME2 DEFAULT SYSUTCDATETIME()
  );
END
`;

  try {
    console.log('Running DDL...');
    await pool.request().query(ddl);

    console.log('Ensuring admin user...');
    // show current Users table columns to help debug schema issues
    try {
      const cols = await pool.request().input('tableName', sql.NVarChar, 'Users')
        .query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @tableName");
      console.log('Users table columns:', cols.recordset.map(r => r.COLUMN_NAME));
    } catch (colErr) {
      console.warn('Could not read Users columns:', colErr.message);
    }

    const exists = await pool.request().input('email', sql.NVarChar, 'admin@bvc.local')
      .query('SELECT id FROM Users WHERE email = @email');

    if (exists.recordset.length === 0) {
      // detect password column name (some schemas use passwordHash)
      const colInfo = await pool.request().input('tableName', sql.NVarChar, 'Users')
        .query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @tableName");
      const cols = colInfo.recordset.map(r => r.COLUMN_NAME.toLowerCase());
      const passwordCol = cols.includes('password') ? 'password' : (cols.includes('passwordhash') ? 'passwordHash' : null);

      // if a user with username 'admin' already exists (unique username), update it instead of inserting
      const byUsername = await pool.request().input('username', sql.NVarChar, 'admin')
        .query('SELECT id FROM Users WHERE username = @username');
      if (byUsername.recordset.length > 0) {
        const id = byUsername.recordset[0].id;
        const updReq = pool.request()
          .input('id', sql.Int, id)
          .input('email', sql.NVarChar, 'admin@bvc.local')
          .input('isAdmin', sql.Bit, 1);
        let updSql;
        if (passwordCol) {
          updReq.input('password', sql.NVarChar, adminHash);
          updSql = `UPDATE Users SET email=@email, ${passwordCol}=@password, isAdmin=@isAdmin WHERE id=@id`;
        } else {
          updSql = `UPDATE Users SET email=@email, isAdmin=@isAdmin WHERE id=@id`;
        }
        await updReq.query(updSql);
        console.log('Existing admin user updated');
      } else {
        const insertReq = pool.request()
          .input('username', sql.NVarChar, 'admin')
          .input('email', sql.NVarChar, 'admin@bvc.local')
          .input('isAdmin', sql.Bit, 1);
        let insertSql;
        if (passwordCol) {
          insertReq.input('password', sql.NVarChar, adminHash);
          insertSql = `INSERT INTO Users (username,email,${passwordCol},isAdmin) VALUES (@username,@email,@password,@isAdmin)`;
        } else {
          insertSql = `INSERT INTO Users (username,email,isAdmin) VALUES (@username,@email,@isAdmin)`;
        }
        await insertReq.query(insertSql);
        console.log('Admin user created with email admin@bvc.local and password from ADMIN_PASS or default');
      }
    } else {
      console.log('Admin user already exists');
    }

    // Insert sample course if none
    const c = await pool.request().query('SELECT TOP 1 id FROM Courses');
    if (c.recordset.length === 0) {
      await pool.request()
        .input('code', sql.NVarChar, 'CS101')
        .input('name', sql.NVarChar, 'Intro to Computer Science')
        .input('term', sql.NVarChar, 'Fall')
        .input('credits', sql.Int, 3)
        .input('description', sql.NVarChar, 'Sample course')
        .query('INSERT INTO Courses (code,name,term,credits,description) VALUES (@code,@name,@term,@credits,@description)');
      console.log('Inserted sample course');
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
