import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
// Dynamically resolve the models path to work both from scripts/ and dist/
const modelsPath = __dirname.endsWith('scripts')
  ? path.resolve(__dirname, '../models')
  : path.resolve(__dirname, '../../models');
import AnimalModule from modelsPath;
const { Animal } = AnimalModule;

const newAnimals = [
  // Dogs
  {
    name: "Buddy",
    species: "dog",
    breed: "Labrador Retriever",
    age: 3,
    description: "Friendly and energetic, loves to play fetch.",
    status: "available",
    location: "Mumbai Shelter",
    photoUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Rocky",
    species: "dog",
    breed: "German Shepherd",
    age: 4,
    description: "Loyal and protective, great with families.",
    status: "available",
    location: "Pune Shelter",
    photoUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Simba",
    species: "dog",
    breed: "Golden Retriever",
    age: 2,
    description: "Gentle and affectionate, loves children.",
    status: "available",
    location: "Delhi Shelter",
    photoUrl: "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bruno",
    species: "dog",
    breed: "Beagle",
    age: 5,
    description: "Curious and merry, loves to sniff around.",
    status: "available",
    location: "Bangalore Shelter",
    photoUrl: "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Max",
    species: "dog",
    breed: "Boxer",
    age: 3,
    description: "Playful and loving, enjoys long walks.",
    status: "available",
    location: "Hyderabad Shelter",
    photoUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b6?auto=format&fit=crop&w=600&q=80"
  },
  // Cats
  {
    name: "Misty",
    species: "cat",
    breed: "Persian",
    age: 2,
    description: "Calm and affectionate, loves to be pampered.",
    status: "available",
    location: "Mumbai Shelter",
    photoUrl: "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Shadow",
    species: "cat",
    breed: "Siamese",
    age: 4,
    description: "Vocal and social, enjoys company.",
    status: "available",
    location: "Pune Shelter",
    photoUrl: "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Luna",
    species: "cat",
    breed: "Maine Coon",
    age: 3,
    description: "Gentle giant, playful and sweet.",
    status: "available",
    location: "Delhi Shelter",
    photoUrl: "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Cleo",
    species: "cat",
    breed: "Bengal",
    age: 1,
    description: "Active and intelligent, loves to climb.",
    status: "available",
    location: "Bangalore Shelter",
    photoUrl: "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Oreo",
    species: "cat",
    breed: "British Shorthair",
    age: 2,
    description: "Chill and cuddly, enjoys sunbathing.",
    status: "available",
    location: "Hyderabad Shelter",
    photoUrl: "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=600&q=80"
  }
];

async function updateAnimals() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.// In server/routes/animals.ts or similar
    import express from 'express';
    import { Animal } from '../models/Animal'; // adjust path as needed
    
    const router = express.Router();
    
    router.post('/', async (req, res) => {
      try {
        const animal = new Animal(req.body);
        await animal.save();
        res.status(201).json(animal);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
    
    export default router;// In server/routes/animals.ts or similar
    import express from 'express';
    import { Animal } from '../models/Animal'; // adjust path as needed
    
    const router = express.Router();
    
    router.post('/', async (req, res) => {
      try {
        const animal = new Animal(req.body);
        await animal.save();
        res.status(201).json(animal);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
    
    export default router;// In server/routes/animals.ts or similar
    import express from 'express';
    import { Animal } from '../models/Animal'; // adjust path as needed
    
    const router = express.Router();
    
    router.post('/', async (req, res) => {
      try {
        const animal = new Animal(req.body);
        await animal.save();
        res.status(201).json(animal);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
    
    export default router;import animalsRouter from './routes/animals'; // adjust path as needed
    app.use('/api/animals', animalsRouter);async function handleSubmit(e) {
      e.preventDefault();
      const data = { /* collect data from form fields */ };
      const res = await fetch('/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      // handle response, show success/error
    }MONGODB_URI);
    console.log('Connected to 
      MongoDB');

    // Delete all existing animals
    await Animal.deleteMany({});
    console.log('All existing animals deleted');

    // Add new animals
    for (const animal of newAnimals) {
      await Animal.create(animal);
    }
    console.log('New animals added successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating animals:', error);
    process.exit(1);
  }
}

updateAnimals();

// For Node ESM environments, run as: node dist/updateAnimals.cjs