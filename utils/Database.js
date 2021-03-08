const mysql = require('mysql');

// create Database class
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    };

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    };
};

const db = new Database({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Dav1234',
    database: 'employee_db'
});

module.exports = db;