import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from './mongoStorage';
import { setupAuth, isAuthenticated, isAdminOrVet } from "./auth";
import { z } from "zod";
import { 
  insertAnimalSchema, 
  insertRescueReportSchema, 
  insertAdoptionRequestSchema
} from "@shared/schema";
import { TreatmentRecord } from "./models";
import mongoose from 'mongoose';

// Middleware for checking authentication
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth check:', { 
    isAuthenticated: req.isAuthenticated(),
    user: req.user 
  });
  
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware for checking admin or vet roles
const isAdminOrVet = (req: Request, res: Response, next: NextFunction) => {
  console.log('Role check:', { 
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    role: req.user?.role 
  });

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user?.role !== 'admin' && req.user?.role !== 'vet') {
    return res.status(403).json({ message: "Forbidden - Requires admin or vet role" });
  }

  next();
};

// Helper function to validate ObjectId
const validateObjectId = (id: string) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    return null;
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // User profile route
  app.get("/api/user/profile", isAuthenticated, async (req, res, next) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

// Animals routes
  app.get("/api/animals", async (req, res, next) => {
    try {
      let animals;
      const { species, status, search } = req.query;
      
      if (search) {
        animals = await storage.searchAnimals(search as string);
      } else if (species) {
        animals = await storage.getAnimalsBySpecies(species as string);
      } else if (status) {
        animals = await storage.getAnimalsByStatus(status as string);
      } else {
        animals = await storage.getAllAnimals();
      }
      
      res.json(animals);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/animals/:id", async (req, res, next) => {
    try {
      const animalId = validateObjectId(req.params.id);
      if (!animalId) {
        return res.status(400).json({ message: "Invalid animal ID format" });
      }
      
      const animal = await storage.getAnimalById(animalId);
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.json(animal);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/animals", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertAnimalSchema.parse(req.body);
      const animal = await storage.createAnimal(validatedData);
      res.status(201).json(animal);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/animals/:id", isAuthenticated, async (req, res, next) => {
    try {
      const animalId = validateObjectId(req.params.id);
      if (!animalId) {
        return res.status(400).json({ message: "Invalid animal ID format" });
      }

      const validatedData = insertAnimalSchema.parse(req.body);
      const animal = await storage.updateAnimal(animalId, validatedData);
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.json(animal);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/animals/:id", isAdminOrVet, async (req, res, next) => {
    try {
      const animalId = validateObjectId(req.params.id);
      if (!animalId) {
        return res.status(400).json({ message: "Invalid animal ID format" });
      }

      const deleted = await storage.deleteAnimal(animalId);
      if (!deleted) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.json({ success: true, message: "Animal deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/animals/:id/status", isAdminOrVet, async (req, res, next) => {
    try {
      const animalId = validateObjectId(req.params.id);
      if (!animalId) {
        return res.status(400).json({ message: "Invalid animal ID format" });
      }

      const { status } = req.body;
      const animal = await storage.updateAnimalStatus(animalId, status);
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.json(animal);
    } catch (error) {
      next(error);
    }
  });

  // Rescue reports routes
  app.post("/api/reports", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertRescueReportSchema.parse({
        ...req.body,
        reporterId: req.user.id
      });
      const report = await storage.createRescueReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/animals/:id/reports", async (req, res, next) => {
    try {
      const animalId = validateObjectId(req.params.id);
      if (!animalId) {
        return res.status(400).json({ message: "Invalid animal ID format" });
      }

      const reports = await storage.getAnimalRescueReports(animalId);
      res.json(reports);
    } catch (error) {
      next(error);
    }
  });

  // Adoption requests routes
  app.post("/api/adoptions", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertAdoptionRequestSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const request = await storage.createAdoptionRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/user/adoptions", isAuthenticated, async (req, res, next) => {
    try {
      const requests = await storage.getUserAdoptionRequests(req.user.id);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/adoptions/:id/status", isAdminOrVet, async (req, res, next) => {
    try {
      const { status } = req.body;
      const request = await storage.updateAdoptionStatus(parseInt(req.params.id), status);
      if (!request) {
        return res.status(404).json({ message: "Adoption request not found" });
      }
      
      // Update animal status if adoption is approved
      if (status === 'approved') {
        await storage.updateAnimalStatus(request.animalId, 'adopted');
      }
      
      res.json(request);
    } catch (error) {
      next(error);
    }
  });

  // Treatment records routes
  app.post("/api/treatments", isAdminOrVet, async (req, res, next) => {
    try {
      const validatedData = treatmentRecordSchema.parse(req.body);
      const record = await storage.createTreatmentRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/animals/:id/treatments", async (req, res, next) => {
    try {
      const animalId = validateObjectId(req.params.id);
      if (!animalId) {
        return res.status(400).json({ message: "Invalid animal ID format" });
      }

      const records = await storage.getAnimalTreatmentRecords(animalId);
      res.json(records);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
