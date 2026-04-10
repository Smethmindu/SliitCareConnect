import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Feedback from './models/Feedback.js';
import Counselor from './models/counselorModel.js';

async function cleanOrphanFeedbacks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const allFeedbacks = await Feedback.find({});
    console.log(`Found ${allFeedbacks.length} feedback record(s) in database.`);

    // Get all valid counselor IDs (as strings)
    const allCounselors = await Counselor.find({}, '_id name');
    const validCounselorIds = new Set(allCounselors.map(c => c._id.toString()));
    console.log(`Valid counselor IDs: ${[...validCounselorIds].join(', ')}`);

    let deletedCount = 0;
    for (const fb of allFeedbacks) {
      const cId = fb.counselorId?.toString();
      if (!cId || !validCounselorIds.has(cId)) {
        await Feedback.findByIdAndDelete(fb._id);
        console.log(`🗑️  Deleted orphan feedback (ID: ${fb._id}, counselorId: ${cId})`);
        deletedCount++;
      } else {
        const counselor = allCounselors.find(c => c._id.toString() === cId);
        console.log(`✅ Feedback ${fb._id} links to valid counselor "${counselor?.name}"`);
      }
    }

    console.log(`\nDone! Removed ${deletedCount} orphan feedback record(s).`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

cleanOrphanFeedbacks();
