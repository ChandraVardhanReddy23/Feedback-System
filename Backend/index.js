const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/feedback", feedbackRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);
