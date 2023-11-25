const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mkp123:GateAIR2987@cluster0.smlxq3a.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
