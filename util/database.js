const mongoose = require('mongoose');

<<<<<<< HEAD

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
=======
mongoose.connect('', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
