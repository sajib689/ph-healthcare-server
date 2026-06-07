import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "server is running...",
    environment: process.env.NODE_ENV,
    uptime: process.uptime().toFixed(2) + " seconds",
    timestamp: new Date().toISOString(),
  });
});

// Global error handling and 404 not found middleware should be registered after all routes

app.use(globalErrorHandler);
app.use(notFound);

export default app;
