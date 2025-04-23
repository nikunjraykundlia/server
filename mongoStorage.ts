import { User, Animal, AdoptionRequest, RescueReport, TreatmentRecord } from './models';
import session from "express-session";
import createMemoryStore from "memorystore";
import mongoose from 'mongoose';

const MemoryStore = createMemoryStore(session);

export class MongoStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // DEMO ANIMALS REMOVED: No longer auto-initializing demo animals
    // this.initializeDemoAnimals();
  }

  // Demo animal initializer disabled
  // private async initializeDemoAnimals() {
  //   try {
  //     const count = await Animal.countDocuments();
  //     if (count === 0) {
  //       await this.addDemoAnimals();
  //     }
  //   } catch (error) {
  //     console.error('Failed to initialize demo animals:', error);
  //   }
  // }

  // Demo animal adder disabled
  // private async addDemoAnimals() {
  //   // const demoAnimals = [
  //   //   {
  //   //     name: "Luna",
  //   //     species: "cat",
  //   //     breed: "Persian",
  //   //     age: 2,
  //   //     description: "Luna is a gentle Persian cat with beautiful white fur. She loves to cuddle and play with yarn.",
  //   //     status: "available",
  //   //     location: "Main Shelter",
  //   //     photoUrl: "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a"
  //   //   },
  //   //   {
  //   //     name: "Max",
  //   //     species: "dog",
  //   //     breed: "Golden Retriever",
  //   //     age: 3,
  //   //     description: "Max is a friendly Golden Retriever who loves to play fetch and swim.",
  //   //     status: "available",
  //   //     location: "Main Shelter",
  //   //     photoUrl: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24"
  //   //   },
  //   //   {
  //   //     name: "Bella",
  //   //     species: "cat",
  //   //     breed: "Siamese",
  //   //     age: 1,
  //   //     description: "Bella is a playful Siamese cat with striking blue eyes. She's very vocal and loves attention.",
  //   //     status: "adopted",
  //   //     location: "Downtown Shelter",
  //   //     photoUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987"
  //   //   },
  //   //   {
  //   //     name: "Rocky",
  //   //     species: "dog",
  //   //     breed: "German Shepherd",
  //   //     age: 4,
  //   //     description: "Rocky is a loyal German Shepherd who is great with kids and very protective of his family.",
  //   //     status: "treatment",
  //   //     location: "Main Shelter",
  //   //     photoUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e"
  //   //   },
  //   //   {
  //   //     name: "Milo",
  //   //     species: "cat",
  //   //     breed: "Maine Coon",
  //   //     age: 2,
  //   //     description: "Milo is a majestic Maine Coon with a gentle personality. He's great with other pets.",
  //   //     status: "available",
  //   //     location: "Downtown Shelter",
  //   //     photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
  //   //   },
  //   //   {
  //   //     name: "Daisy",
  //   //     species: "dog",
  //   //     breed: "Beagle",
  //   //     age: 1,
  //   //     description: "Daisy is an energetic Beagle who loves to explore and follow scents. She's very friendly.",
  //   //     status: "pending",
  //   //     location: "Main Shelter",
  //   //     photoUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1"
  //   //   }
  //   // ];
  //   // for (const animal of demoAnimals) {
  //   //   try {
  //   //     // Check if animal with same name already exists
  //   //     const existingAnimal = await Animal.findOne({ name: animal.name });
  //   //     if (!existingAnimal) {
  //   //       await this.createAnimal(animal);
  //   //     }
  //   //   } catch (error) {
  //   //     console.error(`Failed to add demo animal ${animal.name}:`, error);
  //   //   }
  //   // }
  // }


  // User methods
  async getUser(id: string) {
    return await User.findById(id);
  }
  
  async getUserByUsername(username: string) {
    return await User.findOne({ username });
  }
  
  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }
  
  async createUser(userData: any) {
    const user = new User(userData);
    return await user.save();
  }
  
  // Animal methods
  async getAllAnimals() {
    return await Animal.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
  
  async getAnimalsBySpecies(species: string) {
    return await Animal.find({ species })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
  
  async getAnimalsByStatus(status: string) {
    return await Animal.find({ status })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
  
  async getAnimalById(id: mongoose.Types.ObjectId) {
    return await Animal.findById(id)
      .lean()
      .exec();
  }
  
  async createAnimal(animalData: any) {
    // Check for existing animal with same name
    const existingAnimal = await Animal.findOne({ name: animalData.name });
    if (existingAnimal) {
      throw new Error(`Animal with name ${animalData.name} already exists`);
    }
    
    const animal = new Animal(animalData);
    return await animal.save();
  }
  
  async updateAnimal(id: mongoose.Types.ObjectId, animalData: any) {
    // Check for existing animal with same name, excluding current animal
    if (animalData.name) {
      const existingAnimal = await Animal.findOne({
        _id: { $ne: id },
        name: animalData.name
      });
      if (existingAnimal) {
        throw new Error(`Animal with name ${animalData.name} already exists`);
      }
    }
    
    return await Animal.findByIdAndUpdate(id, animalData, { 
      new: true,
      lean: true
    });
  }
  
  async deleteAnimal(id: mongoose.Types.ObjectId) {
    return await Animal.findByIdAndDelete(id);
  }
  
  async updateAnimalStatus(id: mongoose.Types.ObjectId, status: string) {
    return await Animal.findByIdAndUpdate(id, { status }, { new: true });
  }
  
  async searchAnimals(query: string) {
    const regex = new RegExp(query, 'i');
    return await Animal.find({
      $or: [
        { name: regex },
        { breed: regex },
        { description: regex }
      ]
    })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  }
  
  // Adoption methods
  async createAdoptionRequest(requestData: any) {
    const request = new AdoptionRequest(requestData);
    return await request.save();
  }
  
  async getUserAdoptionRequests(userId: mongoose.Types.ObjectId) {
    return await AdoptionRequest.find({ userId })
      .populate('animalId')
      .sort({ createdAt: -1 });
  }
  
  async updateAdoptionStatus(id: mongoose.Types.ObjectId, status: string) {
    return await AdoptionRequest.findByIdAndUpdate(id, { status }, { new: true });
  }
  
  // Rescue report methods
  async createRescueReport(reportData: any) {
    const report = new RescueReport(reportData);
    return await report.save();
  }
  
  async getAnimalRescueReports(animalId: mongoose.Types.ObjectId) {
    return await RescueReport.find({ animalId })
      .populate('reporterId')
      .sort({ createdAt: -1 });
  }
  
  // Treatment methods
  async createTreatmentRecord(recordData: any) {
    const record = new TreatmentRecord({
      ...recordData,
      date: new Date(),
    });
    return await record.save();
  }
  
  async getAnimalTreatmentRecords(animalId: string) {
    return await TreatmentRecord.find({ animalId })
      .sort({ date: -1 })
      .populate('vetId', 'name')
      .exec();
  }
}

export const storage = new MongoStorage(); 