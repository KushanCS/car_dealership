const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect('mongodb+srv://autopulse_dev:devpass1234@cluster0.ctksskp.mongodb.net/car_dealer?retryWrites=true&w=majority&appName=Cluster0');
    console.log('SUCCESS: default');
  } catch (err) {
    console.log('FAILED: default', err.message);
  }

  try {
    await mongoose.connect('mongodb+srv://autopulse_dev:devpass1234@cluster0.ctksskp.mongodb.net/car_dealer?retryWrites=true&w=majority&appName=Cluster0', { family: 4 });
    console.log('SUCCESS: family 4');
  } catch (err) {
    console.log('FAILED: family 4', err.message);
  }

  process.exit(0);
}
test();
