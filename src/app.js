import express from "express";

//routes
import userRouter from "./routes/user.route.js";
import urlRouter from "./routes/url.route.js";
import redirectRouter from "./routes/redirect.route.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/url", urlRouter);
app.use("/", redirectRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: null,
  });
});

export { app };
