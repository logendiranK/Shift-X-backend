const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Application = mongoose.connection.collection('applications');
  
  // Find applications for the Server job "69fb36e54c4c462fbd6f76d1"
  const apps = await Application.find({}).toArray();
  console.log("ALL APPLICATIONS:");
  console.log(JSON.stringify(apps, null, 2));

  mongoose.disconnect();
}

run();
