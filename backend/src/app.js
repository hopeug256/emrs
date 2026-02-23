const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"]
  })
);
app.use(express.json());

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
    detail: err.message
  });
});

module.exports = app;

