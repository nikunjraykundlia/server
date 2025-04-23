import express from 'express';
import { Animal } from '../models/Animal'; // Adjust path if needed

const router = express.Router();

// POST /api/animals - Add a new animal
router.post('/', async (req, res) => {
  try {
    const animal = new Animal(req.body);
    await animal.save();
    res.status(201).json(animal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// (Optional) GET /api/animals - List all animals
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.find();
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
