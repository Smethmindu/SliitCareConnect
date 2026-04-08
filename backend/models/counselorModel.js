import mongoose from "mongoose";

const availabilitySlotSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    start: { type: String, default: "09:00" },
    end: { type: String, default: "17:00" },
  },
  { _id: false }
);

const counselorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Counselor name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    dob: {
      type: Date,
    },
    avatar: {
      type: String,
      default: "",
    },
    speciality: {
      type: String,
      required: [true, "Primary speciality is required"],
      trim: true,
    },
    specialities: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    education: {
      type: String,
      default: "",
    },
    credentials: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    online: {
      type: Boolean,
      default: false,
    },
    nextAvailable: {
      type: String,
      default: "",
    },
    availability: {
      monday: { type: availabilitySlotSchema, default: () => ({ enabled: true, start: "09:00", end: "17:00" }) },
      tuesday: { type: availabilitySlotSchema, default: () => ({ enabled: true, start: "09:00", end: "17:00" }) },
      wednesday: { type: availabilitySlotSchema, default: () => ({ enabled: true, start: "09:00", end: "17:00" }) },
      thursday: { type: availabilitySlotSchema, default: () => ({ enabled: true, start: "09:00", end: "17:00" }) },
      friday: { type: availabilitySlotSchema, default: () => ({ enabled: true, start: "09:00", end: "17:00" }) },
      saturday: { type: availabilitySlotSchema, default: () => ({ enabled: false, start: "10:00", end: "14:00" }) },
      sunday: { type: availabilitySlotSchema, default: () => ({ enabled: false, start: "10:00", end: "14:00" }) },
    },
  },
  { timestamps: true }
);

const Counselor = mongoose.model("Counselor", counselorSchema);
export default Counselor;
