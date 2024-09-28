import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

//  API documentation
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

//security packages
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

// "swagger api config"
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal description",
      version: "1.0.0",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      {
        url: "https://job-portal-a4px.onrender.com",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const spec = swaggerJSDoc(options);

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

// doc route
app.use("/api/v1/doc", swaggerUi.serve, swaggerUi.setup(spec));

export { app };
