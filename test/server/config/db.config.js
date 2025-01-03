const mongoose = require('mongoose');

// Ignorer l'avertissement de dépréciation
mongoose.set('strictQuery', false);

// URL de connexion MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://yusufdurmus324:pAVEmI7QNfWg3EMc@cluster0.v0evl.mongodb.net/marine_equipment?retryWrites=true&w=majority&appName=Cluster0';

// Configuration de la connexion
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Événements de connexion
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB Atlas successfully');
});

module.exports = db;