const mysql = require('mysql2/promise');
require('dotenv/config');

// Criando pool de conexões com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  connectionLimit: 10, // número máximo de conexões permitidas
});

  const executeQuery = async (query, params = []) => {
    let connection;
  
    try {
      connection = await pool.getConnection();
      const results = await connection.query({
        sql: query,
        values: flatten(params),
      });
      connection.release();
      return results[0];
    } catch (error) {
      console.log(error);
      return error
    }
  
    // throw new Error(`Failed to connect to database after ${attempts} attempts.`);
  };

  
  const flatten = (arr) => {
    return arr.reduce((acc, val) => {
      if (Array.isArray(val)) {
        return acc.concat(flatten(val));
      } else {
        return acc.concat(val);
      }
    }, []);
  };

  
module.exports = {
  executeQuery: executeQuery
};