import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import { PaymentController } from "./app/modules/payment/payment.controller";
  
const app: Application = express();
app.use(cookieParser());

app.post("/webhook", express.raw({
  type: "application/json"
}),
PaymentController.stripeWebhook
)

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router)

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
