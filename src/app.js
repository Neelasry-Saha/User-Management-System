const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Security & utility middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "User Management API is running" });
});

// API routes
app.use("/api", routes);

// 404 + centralized error handler (must stay last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
