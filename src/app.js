import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

//security packages
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

const app = express();

// "MIDDLEWARES"

app.use(helmet());
app.use(ExpressMongoSanitize());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

// "ROUTES"
import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/job.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);

export { app };
