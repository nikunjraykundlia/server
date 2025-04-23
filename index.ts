import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectDB } from './db';
import { storage } from './mongoStorage';

import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // adjust if your frontend runs elsewhere
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Connect to MongoDB
  connectDB().then(() => {
    console.log('MongoDB connected');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

  const port = process.env.PORT || 3000;
  
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`Server is running on port ${port}`);
  }).on('error', (err) => {
    log(`Server error: ${err.message}`);
    // Try alternate port if 5000 is busy
    if (err.code === 'EADDRINUSE' && port === 5000) {
      const altPort = 3000;
      server.listen({
        port: altPort,
        host: "0.0.0.0",
        reusePort: true,
      }, () => {
        log(`Retrying on alternate port ${altPort}`);
      });
    }
  });

  // Handle process termination gracefully
  process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      log('Server closed');
      process.exit(0);
    });
  });
})();
