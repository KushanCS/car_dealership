const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function test() {
  const uri = 'mongodb+srv://autopulse_dev:devpass1234@cluster0.ctksskp.mongodb.net/car_dealer?retryWrites=true&w=majority&appName=Cluster0';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS: connected to MongoDB Atlas!');
  } catch (err) {
    console.log('FAILED:', err.message);
  }
  process.exit(0);
}
test();
