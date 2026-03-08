const express = require("express");
const cors = require("cors");
const path = require("path");
const { sendSuccess, sendError } = require("./utils/apiResponse");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/admin/index"));
app.use("/api/public", require("./routes/public/index"));

app.get("/", (req, res) => {
  return sendSuccess(res, "API is running...");
});

app.use((req, res) => {
  return sendError(res, "Route not found", null, 404);
});

app.use(errorHandler);

module.exports = app;
