import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Counselor from './models/counselorModel.js';
import { User } from './models/User.js';

async function cleanOrphanCounselors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const allCounselors = await Counselor.find({});
    console.log(`Found ${allCounselors.length} counselor profile(s) in database.`);

    let deletedCount = 0;
    for (const counselor of allCounselors) {
      // Check if a matching User still exists
      const userExists = counselor.userId
        ? await User.findById(counselor.userId)
        : null;

      if (!userExists) {
        await Counselor.findByIdAndDelete(counselor._id);
        console.log(`🗑️  Deleted orphan counselor: "${counselor.name}" (ID: ${counselor._id})`);
        deletedCount++;
      } else {
        console.log(`✅ Counselor "${counselor.name}" has a valid user link.`);
      }
    }

    console.log(`\nDone! Removed ${deletedCount} orphan counselor record(s).`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

cleanOrphanCounselors();
