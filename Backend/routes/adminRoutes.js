const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admin WHERE username=? AND password=?";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

module.exports = router;
