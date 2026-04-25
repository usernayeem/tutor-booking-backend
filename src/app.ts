import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import qs from "qs";
import { envVars } from "./app/config/env.js";
import { auth } from "./app/lib/auth.js";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler.js";
import { notFound } from "./app/middleware/notFound.js";
import { IndexRoutes } from "./app/routes/index.js";

const app: Application = express();

// Use qs for advanced query string parsing (supports nested objects, arrays etc.)
app.set("query parser", (str: string) => qs.parse(str));

// Configure EJS as the view engine for rendering email templates
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));

// Stripe webhook must receive the raw body before any JSON parsing
// (This route will be wired up in a later feature when we add Payment)

app.use(
    cors({
        origin: [
            envVars.FRONTEND_URL,
            envVars.BETTER_AUTH_URL,
            "http://localhost:3000",
            "http://localhost:5000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Mount better-auth at /api/auth — handles signup, signin, OTP, etc.
app.use("/api/auth", toNodeHandler(auth));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", IndexRoutes);

app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Tutor Booking API is running",
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
