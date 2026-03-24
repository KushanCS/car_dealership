const mongoose = require('mongoose');

async function test() {
  const uri = 'mongodb://autopulse_dev:devpass1234@ac-fr4r8jb-shard-00-00.ctksskp.mongodb.net:27017,ac-fr4r8jb-shard-00-01.ctksskp.mongodb.net:27017,ac-fr4r8jb-shard-00-02.ctksskp.mongodb.net:27017/car_dealer?ssl=true&replicaSet=atlas-fr4r8jb-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
  try {
    await mongoose.connect(uri);
    console.log('SUCCESS: legacy connection string');
  } catch (err) {
    console.log('FAILED: legacy connection string', err.message);
  }
  process.exit(0);
}
test();
