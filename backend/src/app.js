const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5000,http://localhost:5173,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
    detail: err.message
  });
});

module.exports = app;
