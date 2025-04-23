import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'vet'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Animal Schema
const animalSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  photoUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Adoption Request Schema
const adoptionRequestSchema = new mongoose.Schema({
  animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Rescue Report Schema
const rescueReportSchema = new mongoose.Schema({
  animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Treatment Record Schema
const treatmentRecordSchema = new mongoose.Schema({
  animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  vetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Animal = mongoose.model('Animal', animalSchema);
export const AdoptionRequest = mongoose.model('AdoptionRequest', adoptionRequestSchema);
export const RescueReport = mongoose.model('RescueReport', rescueReportSchema);
export const TreatmentRecord = mongoose.model('TreatmentRecord', treatmentRecordSchema); 