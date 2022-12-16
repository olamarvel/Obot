const Mongoose = require('mongoose');
const userSchema = require('./Schemes/User');

async function connectToMongoose() {
  try {
    await Mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Get the default connection
    const db = Mongoose.connection;

    // Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    return Mongoose.model('bot', userSchema);
  } catch (e) {
    console.log('handshaking failed');
    console.error(e);
  }
}
exports.connectToMongoose = connectToMongoose;
