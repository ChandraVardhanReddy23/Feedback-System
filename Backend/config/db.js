const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Lohithnaidu#4",
  database: "feedback_system"
});
db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});
module.exports = db;
